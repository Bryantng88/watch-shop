import { prisma } from "@/server/db/client";
import { emitWatchCreatedEvent } from "@/domains/watch/server/events";
import {
  attachInlineImageToAcquisitionWatchDraft,
  rescueInlineImageFromMediaAsset,
  syncInlineImageToProduct,
} from "@/domains/acquisition/server/acquisition-media.service";
import { getAiMetaFromDescription } from "@/domains/acquisition/shared/acquisition-item-metadata";
import { rebuildWatchListProjectionRows } from "@/domains/projection/server/watch-list/watch-list-projection.builder";

process.env.NODE_ENV = "production";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function shouldApply() {
  return process.argv.includes("--apply");
}

function shouldDirectUpsertEvents() {
  return process.argv.includes("--direct");
}

function shouldSyncImages() {
  return process.argv.includes("--sync-images");
}

function pickFirstInlineImage(images: unknown) {
  if (!Array.isArray(images)) return null;

  return (
    images.find((image) => clean((image as { key?: unknown }).key)) ??
    images.find((image) => clean((image as { url?: unknown }).url)) ??
    null
  ) as { key?: string | null; url?: string | null } | null;
}

async function main() {
  const apply = shouldApply();
  const direct = shouldDirectUpsertEvents();
  const syncImages = shouldSyncImages();

  const items = await prisma.acquisitionItem.findMany({
    where: {
      productId: { not: null },
      productType: "WATCH",
      acquisition: {
        accquisitionStt: "POSTED",
      },
    },
    select: {
      id: true,
      acquisitionId: true,
      productId: true,
      description: true,
      productTitle: true,
      product: {
        select: {
          id: true,
          primaryImageUrl: true,
          productImage: {
            where: { role: "INLINE" },
            select: {
              fileKey: true,
              role: true,
              sortOrder: true,
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });

  const productIds = Array.from(
    new Set(items.map((item) => clean(item.productId)).filter(Boolean)),
  );

  const watches = await prisma.watch.findMany({
    where: { productId: { in: productIds } },
    select: {
      id: true,
      productId: true,
      saleStage: true,
    },
  });
  const watchByProductId = new Map(watches.map((watch) => [watch.productId, watch]));

  const emittedWatchIds: string[] = [];
  const syncedImages: Array<{ productId: string; source: string }> = [];
  const skipped: Array<{ acquisitionItemId: string; reason: string }> = [];

  for (const item of items) {
    const productId = clean(item.productId);
    const watch = watchByProductId.get(productId);

    if (!productId || !watch) {
      skipped.push({ acquisitionItemId: item.id, reason: "NO_WATCH_FOR_PRODUCT" });
      continue;
    }

    const images = item.product?.productImage ?? [];
    const inlineImage = images.find((image) => image.role === "INLINE");
    const aiImage = pickFirstInlineImage(
      getAiMetaFromDescription(item.description)?.images,
    );

    if (apply && syncImages) {
      if (inlineImage?.fileKey) {
        await syncInlineImageToProduct({
          productId,
          key: inlineImage.fileKey,
          sortOrder: inlineImage.sortOrder ?? 0,
        });
        syncedImages.push({ productId, source: "productImage.inline" });
      } else {
        try {
          await rescueInlineImageFromMediaAsset({ productId });
          syncedImages.push({ productId, source: "mediaAsset.inline" });
        } catch {
          if (aiImage) {
            const attached = await attachInlineImageToAcquisitionWatchDraft({
              acquisitionId: item.acquisitionId,
              productId,
              image: aiImage,
              sortOrder: 0,
            });
            if (attached) {
              syncedImages.push({ productId, source: "acquisition.aiMeta" });
            }
          }
        }
      }
    }

    if (apply) {
      if (direct) {
        const acquisitionId = clean(item.acquisitionId) || null;
        const acquisitionItemId = clean(item.id) || null;
        const eventInstanceId = acquisitionItemId ?? acquisitionId;
        const targetAliasIds = [watch.id, watch.productId, acquisitionId, acquisitionItemId]
          .map(clean)
          .filter(Boolean);
        const metadataJson = {
          productId: watch.productId,
          watchId: watch.id,
          saleStage: watch.saleStage ?? null,
          acquisitionId,
          acquisitionItemId,
          sourceId: eventInstanceId,
          effect: "ASSERT",
          revokeEventKey: null,
          targetAliasIds,
          eventInstanceId,
          idempotencyKey: [
            "watch.created",
            "WATCH",
            watch.id,
            eventInstanceId,
          ].filter(Boolean).join(":"),
        };

        await prisma.businessEventLog.upsert({
          where: {
            eventKey_targetType_targetId: {
              eventKey: "watch.created",
              targetType: "WATCH",
              targetId: watch.id,
            },
          },
          update: {
            metadataJson,
          },
          create: {
            eventKey: "watch.created",
            targetType: "WATCH",
            targetId: watch.id,
            metadataJson,
          },
        });
      } else {
      await emitWatchCreatedEvent(prisma, {
        watch: {
          id: watch.id,
          productId: watch.productId,
          saleStage: watch.saleStage,
        },
        acquisitionId: item.acquisitionId,
        acquisitionItemId: item.id,
      });
      }
    }

    emittedWatchIds.push(watch.id);
  }

  const uniqueWatchIds = Array.from(new Set(emittedWatchIds));
  let projectionApplied = 0;

  if (apply && uniqueWatchIds.length) {
    for (let index = 0; index < uniqueWatchIds.length; index += 100) {
      const chunk = uniqueWatchIds.slice(index, index + 100);
      const result = await rebuildWatchListProjectionRows(prisma, {
        watchIds: chunk,
        limit: chunk.length,
      });
      projectionApplied += result.applied;
    }
  }

  console.log(JSON.stringify({
    mode: apply ? "apply" : "dry-run",
    direct,
    syncImages,
    acquisitionItems: items.length,
    watches: uniqueWatchIds.length,
    watchCreatedEvents: apply ? uniqueWatchIds.length : 0,
    syncedImages: syncedImages.length,
    projectionApplied,
    skipped: skipped.slice(0, 20),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
