import {
  MediaBindingLifecycle,
  MediaObjectAvailability,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";
import { getProfileRoot } from "@/server/lib/product-image-storage";
import { normalizeKey } from "@/server/lib/storage-key";
import { executeMediaDelete, executeMediaMove } from "./media-operation.service";

export type WatchPoolDisposition = "RETURN_TO_NAS" | "RECYCLE" | "DELETE";

export function watchPoolDispositionBlockReason(input: {
  productReferenceCount: number;
  otherActiveBindingCount: number;
  derivativeCount: number;
}) {
  if (input.productReferenceCount > 0) return "Ảnh đang được dùng trong sản phẩm.";
  if (input.otherActiveBindingCount > 0) return "Ảnh đang được dùng ở vị trí khác.";
  if (input.derivativeCount > 0) return "Ảnh còn bản xử lý liên quan.";
  return null;
}

function fileNameFromKey(storageKey: string) {
  return storageKey.split("/").pop() || "image";
}

function withReturnSuffix(storageKey: string, mediaObjectId: string) {
  const dot = storageKey.lastIndexOf(".");
  const suffix = `-returned-${mediaObjectId.slice(0, 8)}`;
  return dot > storageKey.lastIndexOf("/")
    ? `${storageKey.slice(0, dot)}${suffix}${storageKey.slice(dot)}`
    : `${storageKey}${suffix}`;
}

export function watchPoolReturnCandidate(input: {
  editRoot: string;
  originalSourceKey?: string | null;
  currentStorageKey: string;
}) {
  const root = normalizeKey(input.editRoot);
  const original = normalizeKey(input.originalSourceKey ?? "");
  if (
    original.startsWith(`${root}/`) &&
    original !== `${root}/recycle` &&
    !original.startsWith(`${root}/recycle/`)
  ) {
    return original;
  }
  return normalizeKey(`${root}/returned/${fileNameFromKey(input.currentStorageKey)}`);
}

export async function disposeWatchPoolMedia(input: {
  productId: string;
  storageKeys: string[];
  disposition: WatchPoolDisposition;
  commandId: string;
  requestedByUserId?: string | null;
}) {
  const keys = [...new Set(input.storageKeys.map(normalizeKey).filter(Boolean))];
  if (!keys.length) throw new Error("Chưa chọn ảnh trong kho tạm.");
  if (keys.length > 100) throw new Error("Chỉ xử lý tối đa 100 ảnh mỗi lần.");
  if (!input.commandId.trim()) throw new Error("Thiếu commandId.");

  const watch = await prisma.watch.findUnique({
    where: { productId: input.productId },
    select: { id: true, audienceSegment: true },
  });
  if (!watch) throw new Error("Không tìm thấy Watch.");

  const bindings = await prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      ownerId: watch.id,
      role: MediaRole.GALLERY,
      lifecycle: { not: MediaBindingLifecycle.REMOVED },
      mediaObject: { storageKey: { in: keys } },
    },
    include: { mediaObject: true },
  });
  const bindingByKey = new Map(
    bindings.map((binding) => [binding.mediaObject.storageKey, binding]),
  );

  const results = [];
  for (const storageKey of keys) {
    const binding = bindingByKey.get(storageKey);
    if (!binding) {
      results.push({ storageKey, ok: false as const, error: "Ảnh không còn trong kho tạm của Watch." });
      continue;
    }

    try {
      const [productReferenceCount, otherActiveBindingCount, derivativeCount] =
        await Promise.all([
        prisma.productImage.count({ where: { fileKey: storageKey } }),
        prisma.mediaBinding.count({
          where: {
            mediaObjectId: binding.mediaObjectId,
            id: { not: binding.id },
            lifecycle: { not: MediaBindingLifecycle.REMOVED },
          },
        }),
        prisma.mediaObject.count({
          where: {
            sourceMediaObjectId: binding.mediaObjectId,
            availability: { not: MediaObjectAvailability.DELETED },
          },
        }),
        ]);

      const blockedReason = watchPoolDispositionBlockReason({
        productReferenceCount,
        otherActiveBindingCount,
        derivativeCount,
      });
      if (blockedReason) {
        results.push({
          storageKey,
          ok: false as const,
          error: `${blockedReason} Hãy bỏ khỏi nơi đang dùng trước.`,
        });
        continue;
      }

      if (input.disposition === "DELETE") {
        await executeMediaDelete({
        idempotencyKey: `watch-pool-delete:${input.commandId}:${binding.mediaObjectId}`,
        mediaObjectId: binding.mediaObjectId,
        storageKey,
        requestedByUserId: input.requestedByUserId ?? null,
        });
      } else if (input.disposition === "RECYCLE") {
        const editRoot = normalizeKey(getProfileRoot("edit", watch.audienceSegment));
        const destinationKey = normalizeKey(
          `${editRoot}/recycle/${binding.mediaObjectId}-${fileNameFromKey(storageKey)}`,
        );
        await executeMediaMove({
        idempotencyKey: `watch-pool-recycle:${input.commandId}:${binding.mediaObjectId}`,
        mediaObjectId: binding.mediaObjectId,
        sourceKey: storageKey,
        destinationKey,
        deleteSource: true,
        requestedByUserId: input.requestedByUserId ?? null,
        });
      } else {
        const editRoot = normalizeKey(getProfileRoot("edit", watch.audienceSegment));
        const ingestOperation = await prisma.mediaOperation.findFirst({
        where: {
          OR: [
            { mediaObjectId: binding.mediaObjectId },
            { destinationKey: storageKey },
          ],
          idempotencyKey: { startsWith: "media-ingest:" },
          status: "SUCCEEDED",
          sourceKey: { not: null },
        },
        orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
        select: { sourceKey: true },
        });
        const preferredKey = watchPoolReturnCandidate({
          editRoot,
          originalSourceKey: ingestOperation?.sourceKey,
          currentStorageKey: storageKey,
        });
        const destinationKey = await mediaStorage.stat(preferredKey)
          ? withReturnSuffix(preferredKey, binding.mediaObjectId)
          : preferredKey;
        if (await mediaStorage.stat(destinationKey)) {
          throw new Error(`NAS đã có file tại vị trí trả về: ${destinationKey}`);
        }
        await executeMediaMove({
        idempotencyKey: `watch-pool-return:${input.commandId}:${binding.mediaObjectId}`,
        mediaObjectId: binding.mediaObjectId,
        sourceKey: storageKey,
        destinationKey,
        deleteSource: true,
        requestedByUserId: input.requestedByUserId ?? null,
        });
      }

      await prisma.$transaction([
        prisma.mediaBinding.update({
        where: { id: binding.id },
        data: { lifecycle: MediaBindingLifecycle.REMOVED },
        }),
        prisma.mediaObject.update({
        where: { id: binding.mediaObjectId },
        data: input.disposition === "DELETE"
          ? { availability: MediaObjectAvailability.DELETED, missingAt: new Date() }
          : input.disposition === "RECYCLE"
            ? { availability: MediaObjectAvailability.QUARANTINED, missingAt: null }
            : { availability: MediaObjectAvailability.AVAILABLE, missingAt: null },
        }),
      ]);
      results.push({ storageKey, ok: true as const });
    } catch (error) {
      results.push({
        storageKey,
        ok: false as const,
        error: error instanceof Error ? error.message : "Không thể xử lý ảnh kho tạm.",
      });
    }
  }

  return {
    results,
    succeededKeys: results.filter((item) => item.ok).map((item) => item.storageKey),
    failed: results.filter((item) => !item.ok).length,
  };
}
