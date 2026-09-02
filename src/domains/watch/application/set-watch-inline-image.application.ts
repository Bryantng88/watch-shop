import {
  ImageRole,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";
import { randomUUID } from "node:crypto";

import { bindMedia } from "@/domains/media/application/media-binding.service";
import { ingestSelectedMedia } from "@/domains/media/application/media-ingest.service";
import { cleanupRemovedWatchMedia } from "@/domains/media/application/watch-media-processing.service";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { emitWatchInlineImageUpdatedEvent } from "@/domains/watch/server/events";

export async function setWatchInlineImageApplication(input: {
  productId: string;
  storageKey: string;
  actorUserId?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh INLINE.");

  const mediaObject = await ingestSelectedMedia({ storageKey: sourceKey });
  const actionId = randomUUID();

  const result = await runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`watch-inline:${productId}`}, 0))`;
    const watch = await tx.watch.findUnique({
      where: { productId },
      select: {
        id: true,
        productId: true,
        audienceSegment: true,
        mediaPipelineKey: true,
        product: {
          select: {
            productImage: {
              where: { role: ImageRole.COVER },
              take: 1,
              select: { id: true },
            },
          },
        },
      },
    });
    if (!watch) throw new Error("Không tìm thấy Watch.");

    await tx.mediaBinding.updateMany({
      where: {
        ownerType: MediaOwnerType.WATCH,
        ownerId: watch.id,
        role: MediaRole.INLINE,
        lifecycle: { not: MediaBindingLifecycle.REMOVED },
      },
      data: { lifecycle: MediaBindingLifecycle.REMOVED },
    });
    await bindMedia({
      mediaObjectId: mediaObject.id,
      ownerType: MediaOwnerType.WATCH,
      ownerId: watch.id,
      role: MediaRole.INLINE,
      sortOrder: 0,
      audienceSegment: watch.audienceSegment,
      pipelineKey: watch.mediaPipelineKey,
      lifecycle: MediaBindingLifecycle.ATTACHED,
    }, tx);

    const hasCover = watch.product.productImage.length > 0;
    if (!hasCover) {
      await tx.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }
    await tx.productImage.deleteMany({ where: { productId, role: ImageRole.INLINE } });
    const inlineImage = await tx.productImage.create({
      data: {
        productId,
        fileKey: mediaObject.storageKey,
        role: ImageRole.INLINE,
        isPrimary: !hasCover,
        isForAdmin: true,
        isForStorefront: true,
        sortOrder: 0,
      },
    });
    await tx.product.update({
      where: { id: productId },
      data: hasCover ? {} : {
        primaryImageUrl: mediaObject.storageKey,
        storefrontImageKey: mediaObject.storageKey,
      },
    });

    const event = await emitWatchInlineImageUpdatedEvent(tx, {
      watch,
      storageKey: mediaObject.storageKey,
      actorUserId: input.actorUserId ?? null,
      sourceId: actionId,
    }, { deferConsumers: input.deferConsumers });
    delivery.track(event);

    return { inlineImage, storageKey: mediaObject.storageKey, watchId: watch.id };
  }, { deferConsumers: input.deferConsumers });

  try {
    await cleanupRemovedWatchMedia({
      watchId: result.watchId,
      roles: [MediaRole.INLINE],
    });
  } catch (error) {
    console.error("[media-core] deferred INLINE cleanup failed", { productId, error });
  }
  return result;
}
