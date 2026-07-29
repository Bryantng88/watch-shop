import "dotenv/config";
import { ImageRole } from "@prisma/client";
import { mediaStorage } from "../src/domains/media/storage";
import { rebuildProjection } from "../src/domains/projection/server/projection.runner";
import { rebuildWatchListProjectionRows } from "../src/domains/projection/server/watch-list";
import { prisma } from "../src/server/db/client";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

async function statKeys(keys: string[]) {
  const result = new Map<string, boolean>();
  for (let index = 0; index < keys.length; index += 20) {
    const chunk = keys.slice(index, index + 20);
    const stats = await Promise.all(chunk.map(async (key) => [
      key,
      Boolean(await mediaStorage.stat(key)),
    ] as const));
    stats.forEach(([key, exists]) => result.set(key, exists));
  }
  return result;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const watches = await prisma.watch.findMany({
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          title: true,
          primaryImageUrl: true,
          storefrontImageKey: true,
          productImage: {
            select: { id: true, role: true, fileKey: true, sortOrder: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });
  const allKeys = Array.from(new Set(watches.flatMap((watch) => [
    clean(watch.product.primaryImageUrl),
    clean(watch.product.storefrontImageKey),
    ...watch.product.productImage.map((image) => clean(image.fileKey)),
  ]).filter(Boolean)));
  const existence = await statKeys(allKeys);
  const missingKeys = allKeys.filter((key) => !existence.get(key));
  const operations = missingKeys.length
    ? await prisma.mediaOperation.findMany({
        where: {
          sourceKey: { in: missingKeys },
          status: "SUCCEEDED",
          destinationKey: { not: null },
        },
        select: { sourceKey: true, destinationKey: true },
        orderBy: { completedAt: "desc" },
      })
    : [];
  const successorBySource = new Map<string, string>();
  operations.forEach((operation) => {
    const source = clean(operation.sourceKey);
    const destination = clean(operation.destinationKey);
    if (source && destination && !successorBySource.has(source)) {
      successorBySource.set(source, destination);
    }
  });
  const successorKeys = Array.from(new Set(successorBySource.values()));
  const successorExistence = await statKeys(successorKeys);
  const plans = [];

  for (const watch of watches) {
    const images = watch.product.productImage;
    const orderedKeys = [
      clean(watch.product.storefrontImageKey),
      clean(watch.product.primaryImageUrl),
      ...images
        .filter((image) => image.role === ImageRole.INLINE)
        .map((image) => clean(image.fileKey)),
      ...images
        .filter((image) => image.role !== ImageRole.INLINE)
        .map((image) => clean(image.fileKey)),
    ].filter(Boolean);
    const resolved = orderedKeys.find((key) => existence.get(key))
      ?? orderedKeys.map((key) => successorBySource.get(key))
        .find((key): key is string => Boolean(key && successorExistence.get(key)))
      ?? null;
    const currentPrimary = clean(watch.product.primaryImageUrl);
    const currentStorefront = clean(watch.product.storefrontImageKey);
    const imageRepairs = images.flatMap((image) => {
      const key = clean(image.fileKey);
      const successor = successorBySource.get(key);
      return !existence.get(key) && successor && successorExistence.get(successor)
        ? [{ imageId: image.id, sourceKey: key, destinationKey: successor }]
        : [];
    });
    const needsReferenceRepair = Boolean(
      resolved &&
      (currentPrimary !== resolved || currentStorefront !== resolved),
    );
    if (needsReferenceRepair || imageRepairs.length || !resolved) {
      plans.push({
        watchId: watch.id,
        productId: watch.productId,
        title: watch.product.title,
        resolvedKey: resolved,
        currentPrimary: currentPrimary || null,
        currentStorefront: currentStorefront || null,
        imageRepairs,
        recoverable: Boolean(resolved),
      });
    }
  }

  if (!apply) {
    console.log(JSON.stringify({
      dryRun: true,
      watches: watches.length,
      uniqueKeys: allKeys.length,
      missingKeys: missingKeys.length,
      recoverable: plans.filter((plan) => plan.recoverable).length,
      unrecoverable: plans.filter((plan) => !plan.recoverable).length,
      plans,
    }, null, 2));
    return;
  }

  const repairedWatchIds = [];
  for (const plan of plans) {
    if (!plan.resolvedKey) continue;
    await prisma.$transaction([
      prisma.product.update({
        where: { id: plan.productId },
        data: {
          primaryImageUrl: plan.resolvedKey,
          storefrontImageKey: plan.resolvedKey,
        },
      }),
      ...plan.imageRepairs.map((repair) =>
        prisma.productImage.update({
          where: { id: repair.imageId },
          data: { fileKey: repair.destinationKey },
        }),
      ),
      ...plan.imageRepairs.map((repair) =>
        prisma.serviceRequest.updateMany({
          where: { primaryImageUrlSnapshot: repair.sourceKey },
          data: { primaryImageUrlSnapshot: repair.destinationKey },
        }),
      ),
    ]);
    repairedWatchIds.push(plan.watchId);
  }

  for (let index = 0; index < repairedWatchIds.length; index += 250) {
    const watchIds = repairedWatchIds.slice(index, index + 250);
    await rebuildWatchListProjectionRows(prisma, {
      watchIds,
      limit: watchIds.length,
    });
  }
  const projectionKeys = [
    "watch-media-queue",
    "media-operation-board",
    "admin-dashboard-summary",
    "service-request-list",
    "technical-issue-board",
    "acquisition-list",
    "order-list",
    "shipment-operation-queue",
  ];
  const projectionResults = [];
  for (const projectionKey of projectionKeys) {
    projectionResults.push(await rebuildProjection(prisma, { projectionKey }));
  }
  console.log(JSON.stringify({
    dryRun: false,
    repaired: repairedWatchIds.length,
    unrecoverable: plans.filter((plan) => !plan.recoverable),
    projectionResults,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
