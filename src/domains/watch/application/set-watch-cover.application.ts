import {
  ImageRole,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";
import { randomUUID } from "node:crypto";

import { bindMedia } from "@/domains/media/application/media-binding.service";
import { ingestSelectedMedia } from "@/domains/media/application/media-ingest.service";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { emitWatchCoverUpdatedEvent } from "@/domains/watch/server/events";
import { buildWatchStorefrontSlug } from "@/domains/watch/shared/storefront-slug";

export async function setWatchCoverApplication(input: {
  productId: string;
  storageKey: string;
  entryPoint?: "WATCH_LIST_QUICK" | null;
  actorUserId?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  const productId = String(input.productId ?? "").trim();
  const sourceKey = String(input.storageKey ?? "").trim();
  if (!productId || !sourceKey) throw new Error("Thiếu Watch hoặc ảnh Cover.");

  // NAS ingestion is intentionally completed before the domain transaction.
  // A failed transaction may leave an unbound canonical object, which the media
  // reconciliation job can safely recover; it must never leave DB truth pointing
  // to a NAS key that was not ingested.
  const mediaObject = await ingestSelectedMedia({ storageKey: sourceKey });
  const actionId = randomUUID();

  return runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`watch-cover:${productId}`}, 0))`;
    const watch = await tx.watch.findUnique({
      where: { productId },
      select: {
        id: true,
        productId: true,
        audienceSegment: true,
        mediaPipelineKey: true,
        product: { select: { storefrontImageKey: true, slug: true, title: true } },
      },
    });
    if (!watch) throw new Error("Không tìm thấy Watch.");

    await tx.mediaBinding.updateMany({
      where: {
        ownerType: MediaOwnerType.WATCH,
        ownerId: watch.id,
        role: MediaRole.COVER,
        lifecycle: { not: MediaBindingLifecycle.REMOVED },
      },
      data: { lifecycle: MediaBindingLifecycle.REMOVED },
    });
    await bindMedia({
      mediaObjectId: mediaObject.id,
      ownerType: MediaOwnerType.WATCH,
      ownerId: watch.id,
      role: MediaRole.COVER,
      sortOrder: 0,
      audienceSegment: watch.audienceSegment,
      pipelineKey: watch.mediaPipelineKey,
      lifecycle: MediaBindingLifecycle.ATTACHED,
    }, tx);

    await tx.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
    await tx.productImage.deleteMany({
      where: { productId, role: ImageRole.COVER },
    });
    const cover = await tx.productImage.create({
      data: {
        productId,
        fileKey: mediaObject.storageKey,
        role: ImageRole.COVER,
        isPrimary: true,
        isForAdmin: true,
        isForStorefront: true,
        sortOrder: 0,
      },
    });
    const storefrontSlug = watch.product.slug || buildWatchStorefrontSlug(watch.product.title, productId);
    await tx.product.update({
      where: { id: productId },
      data: {
        storefrontImageKey: mediaObject.storageKey,
        primaryImageUrl: mediaObject.storageKey,
        ...(watch.product.slug ? {} : { slug: storefrontSlug }),
      },
    });

    const event = await emitWatchCoverUpdatedEvent(tx, {
      watch,
      storageKey: mediaObject.storageKey,
      previousStorageKey: watch.product.storefrontImageKey,
      actorUserId: input.actorUserId ?? null,
      actionId,
      entryPoint: input.entryPoint ?? null,
    });
    delivery.track(event);

    return {
      cover,
      storageKey: mediaObject.storageKey,
      storefrontSlug,
      projectionDeliveryKey: event.projectionDeliveryKey,
      reconciliationMode: "ASYNC_DELIVERY" as const,
    };
  }, { deferConsumers: input.deferConsumers });
}
