import {
  ImageRole,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";

import { ingestExistingMediaForWatch, attachIngestedWatchMedia } from "@/domains/media/application";
import { processBusinessEventOperation } from "@/domains/event/delivery";
import { prisma } from "@/server/db/client";
import { replaceWatchImagesRepo } from "@/domains/watch/server/media/watch-media.repo";
import { emitWatchMediaAssetAttachedEvent } from "@/domains/watch/server/events";

/**
 * Temporary maintenance entry point for repairing a missing Watch INLINE image.
 * It intentionally uses the normal Media ingest/binding/event pipeline; only
 * the UI entry point differs from Watch creation and the acquisition form.
 */
export async function repairWatchInlineMedia(input: {
  productId: string;
  storageKey: string;
  actorUserId: string;
}) {
  const selected = await ingestExistingMediaForWatch({
    storageKey: input.storageKey,
  });

  const event = await prisma.$transaction(async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: {
        id: true,
        productId: true,
        product: { select: { title: true, sku: true } },
      },
    });
    if (!watch) throw new Error("Không tìm thấy Watch cần sửa ảnh INLINE.");

    await replaceWatchImagesRepo(tx, {
      productId: input.productId,
      role: ImageRole.INLINE,
      images: [{
        fileKey: selected.fileKey,
        isForAdmin: true,
        isForStorefront: true,
        sortOrder: 0,
      }],
    });

    await tx.product.update({
      where: { id: input.productId },
      data: {
        primaryImageUrl: selected.fileKey,
        storefrontImageKey: selected.fileKey,
      },
    });

    await tx.mediaBinding.updateMany({
      where: {
        ownerType: MediaOwnerType.WATCH,
        ownerId: watch.id,
        role: MediaRole.INLINE,
        mediaObjectId: { not: selected.object.id },
        lifecycle: { not: MediaBindingLifecycle.REMOVED },
      },
      data: { lifecycle: MediaBindingLifecycle.REMOVED },
    });

    await attachIngestedWatchMedia({
      productId: input.productId,
      images: [{
        storageKey: selected.fileKey,
        role: MediaRole.INLINE,
        sortOrder: 0,
      }],
    }, tx);

    return emitWatchMediaAssetAttachedEvent(tx, {
      watch: {
        id: watch.id,
        productId: watch.productId,
        product: watch.product,
      },
      actorUserId: input.actorUserId,
      sourceId: `watch-inline-repair:${watch.id}:${Date.now()}`,
      note: "Temporary Watch List INLINE image repair.",
    });
  });

  await processBusinessEventOperation(event.projectionDeliveryKey);

  return {
    ok: true as const,
    fileKey: selected.fileKey,
    projectionDeliveryKey: event.projectionDeliveryKey,
  };
}
