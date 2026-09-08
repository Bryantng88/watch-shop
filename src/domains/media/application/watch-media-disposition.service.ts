import {
  MediaBindingLifecycle,
  MediaObjectAvailability,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { getProfileRoot } from "@/server/lib/product-image-storage";
import { normalizeKey } from "@/server/lib/storage-key";
import { executeMediaDelete, executeMediaMove } from "./media-operation.service";

export type WatchPoolDisposition = "RECYCLE" | "DELETE";

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
    } else {
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
          : { availability: MediaObjectAvailability.QUARANTINED, missingAt: null },
      }),
    ]);
    results.push({ storageKey, ok: true as const });
  }

  return {
    results,
    succeededKeys: results.filter((item) => item.ok).map((item) => item.storageKey),
    failed: results.filter((item) => !item.ok).length,
  };
}
