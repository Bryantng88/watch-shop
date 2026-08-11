import {
  ImageRole,
  MediaBindingLifecycle,
  MediaOperationStatus,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";
import { randomUUID } from "node:crypto";

import { executeMediaMove } from "@/domains/media/application/media-operation.service";
import { mediaStorage } from "@/domains/media/storage";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { emitWatchCoverUpdatedEvent } from "@/domains/watch/server/events";
import { prisma } from "@/server/db/client";

export async function returnWatchCoverApplication(input: {
  productId: string;
  actorUserId?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  const productId = String(input.productId ?? "").trim();
  if (!productId) throw new Error("Thiếu Watch cần trả ảnh Cover.");

  const current = await prisma.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      productId: true,
      product: { select: { storefrontImageKey: true } },
    },
  });
  if (!current) throw new Error("Không tìm thấy Watch.");

  const storageKey = String(current.product.storefrontImageKey ?? "").trim();
  if (!storageKey) throw new Error("Watch chưa có ảnh Cover để trả về.");

  const mediaObject = await prisma.mediaObject.findUnique({
    where: { storageKey },
    include: {
      bindings: {
        where: { lifecycle: { not: MediaBindingLifecycle.REMOVED } },
        select: { ownerType: true, ownerId: true, role: true },
      },
    },
  });
  if (!mediaObject) throw new Error("Không tìm thấy MediaObject của ảnh Cover.");

  const foreignBinding = mediaObject.bindings.find((binding) =>
    binding.ownerType !== MediaOwnerType.WATCH ||
    binding.ownerId !== current.id ||
    binding.role !== MediaRole.COVER
  );
  if (foreignBinding) {
    throw new Error("Ảnh đang được nghiệp vụ khác sử dụng nên chưa thể trả về kho Cover.");
  }
  const [foreignProductImage, foreignProductReference] = await Promise.all([
    prisma.productImage.findFirst({
      where: {
        fileKey: storageKey,
        NOT: { productId, role: ImageRole.COVER },
      },
      select: { id: true },
    }),
    prisma.product.findFirst({
      where: {
        id: { not: productId },
        OR: [{ storefrontImageKey: storageKey }, { primaryImageUrl: storageKey }],
      },
      select: { id: true },
    }),
  ]);
  if (foreignProductImage || foreignProductReference) {
    throw new Error("Ảnh đang được sản phẩm khác sử dụng nên chưa thể trả về kho Cover.");
  }

  const alreadyInCoverSource = /^media\/(men|women|unisex)\/cover\/.+/.test(storageKey);
  const sourceOperation = alreadyInCoverSource
    ? null
    : await prisma.mediaOperation.findFirst({
        where: {
          destinationKey: storageKey,
          status: MediaOperationStatus.SUCCEEDED,
          sourceKey: { not: null },
        },
        orderBy: { completedAt: "desc" },
        select: { sourceKey: true },
      });
  const returnKey = alreadyInCoverSource
    ? storageKey
    : String(sourceOperation?.sourceKey ?? "").trim();
  if (!/^media\/(men|women|unisex)\/cover\/.+/.test(returnKey)) {
    throw new Error("Không xác định được thư mục Cover ban đầu của ảnh này.");
  }
  if (!alreadyInCoverSource && await mediaStorage.stat(returnKey)) {
    throw new Error("Vị trí Cover ban đầu đã có file khác. Hãy xử lý trùng file trước khi trả ảnh.");
  }

  if (!alreadyInCoverSource) {
    await executeMediaMove({
      idempotencyKey: `watch-cover-return:${mediaObject.id}:${returnKey}`,
      mediaObjectId: mediaObject.id,
      sourceKey: storageKey,
      destinationKey: returnKey,
      requestedByUserId: input.actorUserId ?? null,
    });
  }

  const actionId = randomUUID();
  return runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`watch-cover:${productId}`}, 0))`;

    await tx.productImage.deleteMany({ where: { productId, role: ImageRole.COVER } });
    const fallbackImage = await tx.productImage.findFirst({
      where: { productId },
      orderBy: [{ isForAdmin: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, fileKey: true },
    });
    if (fallbackImage) {
      await tx.productImage.update({
        where: { id: fallbackImage.id },
        data: { isPrimary: true },
      });
    }
    await tx.product.update({
      where: { id: productId },
      data: {
        storefrontImageKey: null,
        primaryImageUrl: fallbackImage?.fileKey ?? null,
      },
    });
    await tx.mediaBinding.deleteMany({ where: { mediaObjectId: mediaObject.id } });
    await tx.mediaObject.delete({ where: { id: mediaObject.id } });

    const event = await emitWatchCoverUpdatedEvent(tx, {
      watch: current,
      storageKey: null,
      previousStorageKey: storageKey,
      actorUserId: input.actorUserId ?? null,
      actionId,
    });
    delivery.track(event);

    return {
      returnedToKey: returnKey,
      projectionDeliveryKey: event.projectionDeliveryKey,
      reconciliationMode: "ASYNC_DELIVERY" as const,
    };
  }, { deferConsumers: input.deferConsumers });
}
