import {
  PrismaClient,
  TaskExecutionTargetType,
  WatchSaleStage,
} from "@prisma/client";
import { ensureCoordinationCycle } from "@/domains/coordination/server/coordination-cycle.service";
import { requestWatchPhotoshoot } from "@/domains/watch/server/media-work/watch-media-work.service";

const prisma = new PrismaClient();

const apply = process.argv.includes("--apply");
const includePhotographyOnly = process.argv.includes("--include-photoshoot");
const includeGallery = process.argv.includes("--include-gallery");
const clearOnly = process.argv.includes("--clear-only");

const targetWorkTypes = includePhotographyOnly
  ? ["photography", "media-processing", "publish"]
  : ["media-processing", "publish"];
const resetWorkTypes = ["photography", "media-processing", "publish"];

function workTypeWhere(workTypes: string[]) {
  return {
    OR: workTypes.map((workType) => ({
      taskItem: {
        note: {
          contains: `workTypeKey: ${workType}`,
          mode: "insensitive" as const,
        },
      },
    })),
  };
}

async function main() {
  const targetBindings = await prisma.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      ...workTypeWhere(targetWorkTypes),
    },
    select: {
      targetId: true,
      taskItem: {
        select: {
          title: true,
          note: true,
        },
      },
    },
  });

  const watchIds = Array.from(
    new Set(targetBindings.map((item) => item.targetId).filter(Boolean)),
  );

  const watches = watchIds.length
    ? await prisma.watch.findMany({
      where: { id: { in: watchIds } },
      select: {
        id: true,
        productId: true,
        saleStage: true,
        product: {
          select: {
            title: true,
            sku: true,
            productImage: {
              where: { role: "GALLERY" },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })
    : [];
  const eligibleWatches = includeGallery
    ? watches
    : watches.filter((watch) => watch.product.productImage.length === 0);
  const eligibleWatchIds = eligibleWatches.map((watch) => watch.id);
  const productIds = eligibleWatches.map((watch) => watch.productId);
  const bindingsToDelete = eligibleWatchIds.length
    ? await prisma.taskExecution.findMany({
      where: {
        targetType: TaskExecutionTargetType.WATCH,
        targetId: { in: eligibleWatchIds },
        ...workTypeWhere(resetWorkTypes),
      },
      select: {
        id: true,
        targetId: true,
        taskItem: {
          select: {
            title: true,
            note: true,
          },
        },
      },
    })
    : [];

  console.log("[reset-watch-media-flow] mode:", apply ? "APPLY" : "DRY_RUN");
  console.log("[reset-watch-media-flow] clear only:", clearOnly);
  console.log("[reset-watch-media-flow] watches found:", watches.length);
  console.log("[reset-watch-media-flow] watches eligible:", eligibleWatches.length);
  if (!includeGallery) {
    console.log("[reset-watch-media-flow] watches with gallery are skipped by default.");
  }
  console.log("[reset-watch-media-flow] bindings to delete:", bindingsToDelete.length);
  console.table(
    watches.map((watch) => ({
      watchId: watch.id,
      productId: watch.productId,
      sku: watch.product?.sku ?? "",
      title: watch.product?.title ?? "",
      saleStage: String(watch.saleStage ?? ""),
      hasGallery: watch.product.productImage.length > 0,
      eligible: eligibleWatchIds.includes(watch.id),
    })),
  );

  if (!apply) {
    console.log("[reset-watch-media-flow] add --apply to write changes.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (bindingsToDelete.length) {
      await tx.taskExecution.deleteMany({
        where: { id: { in: bindingsToDelete.map((item) => item.id) } },
      });
    }

    if (productIds.length) {
      await tx.watchReviewState.updateMany({
        where: {
          productId: { in: productIds },
          targetType: { in: ["CONTENT", "IMAGE"] },
        },
        data: {
          status: "DRAFT",
          submittedAt: null,
          submittedById: null,
          reviewedAt: null,
          reviewedById: null,
          reviewNote: null,
        },
      });

      await tx.watch.updateMany({
        where: {
          productId: { in: productIds },
          saleStage: { in: [WatchSaleStage.PROCESSING, WatchSaleStage.READY] },
        },
        data: {
          saleStage: WatchSaleStage.DRAFT,
          isContentDownloaded: false,
          isImageDownloaded: false,
          updatedAt: new Date(),
        },
      });
    }
  });

  if (clearOnly) {
    console.log("[reset-watch-media-flow] cleared media bindings; photoshoot request skipped.");
    return;
  }

  await ensureCoordinationCycle(prisma, {
    context: "MEDIA",
    date: new Date(),
  });
  const result = await requestWatchPhotoshoot(
    {
      watchIds: eligibleWatchIds,
      actorUserId: null,
      note: "Reset media workflow back to Photoshoot for retesting.",
    },
    prisma,
  );

  console.log("[reset-watch-media-flow] photoshoot requested:", result.requested);
  console.log("[reset-watch-media-flow] skipped:", result.skipped);
  console.table(result.items);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
