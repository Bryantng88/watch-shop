import {
  ActivitySourceType,
  PrismaClient,
  TimelineContainerType,
} from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

const mediaEventKeys = [
  "watch.media.photoshoot.requested",
  "watch.media.photoshoot.completed",
  "watch.media.asset.attached",
  "watch.media.ready_for_publish",
  "watch.publish.assets.downloaded",
];

const mediaSourcePrefixes = [
  "photoshoot:",
  "photoshoot-completed:",
  "media-asset-review:",
  "media-asset-attached:",
  "media-ready-for-publish:",
  "publish-assets-downloaded:",
];

const targetWatchIds = [
  "ea865c64-81d7-4316-8b5e-c306ab8e2946",
  "dc7e5e59-ee6e-46ed-8d22-7984b1a86bde",
  "ca912548-45f8-4b68-bb51-e6d2e1d4de2a",
  "7f745e78-9f8c-414c-b645-80d2f3f9d6e8",
  "9b7b5d81-e525-4b66-a819-93e6a63c0c4d",
  "20273881-c6ab-4aee-9d55-9eff92ea5716",
  "e9da42aa-7e50-4263-b14d-6cd53b1e09e1",
  "dea7ae9a-fa80-46bf-801e-db9448c82a54",
  "d090a8f9-a56f-41c2-b08e-83fe3ebb0b4f",
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function isMediaSourceId(sourceId?: string | null) {
  const value = clean(sourceId);
  return mediaSourcePrefixes.some((prefix) => value.startsWith(prefix));
}

async function main() {
  const watches = await prisma.watch.findMany({
    where: { id: { in: targetWatchIds } },
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          title: true,
          sku: true,
        },
      },
    },
  });

  const targetIds = Array.from(
    new Set([
      ...watches.map((watch) => watch.id),
      ...watches.map((watch) => watch.productId),
    ]),
  );

  const businessEvents = await prisma.businessEventLog.findMany({
    where: {
      eventKey: { in: mediaEventKeys },
      OR: [
        { targetId: { in: targetIds } },
        ...targetIds.map((targetId) => ({
          metadataJson: {
            path: ["targetId"],
            equals: targetId,
          },
        })),
      ],
    },
    select: {
      id: true,
      eventKey: true,
      targetType: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
    },
  });

  const businessEventIds = businessEvents.map((event) => event.id);
  const businessActivities = businessEventIds.length
    ? await prisma.taskItemActivity.findMany({
      where: {
        sourceType: ActivitySourceType.BUSINESS_EVENT,
        sourceId: { in: businessEventIds },
      },
      select: {
        id: true,
        taskItemId: true,
        sourceType: true,
        sourceId: true,
        title: true,
        metadataJson: true,
        occurredAt: true,
        taskItem: {
          select: {
            title: true,
          },
        },
      },
    })
    : [];

  const systemCandidates = await prisma.taskItemActivity.findMany({
    where: {
      sourceType: ActivitySourceType.SYSTEM,
      OR: [
        { metadataJson: { path: ["targetId"], equals: targetWatchIds[0] } },
        ...targetWatchIds.slice(1).map((watchId) => ({
          metadataJson: { path: ["targetId"], equals: watchId },
        })),
      ],
    },
    select: {
      id: true,
      taskItemId: true,
      sourceType: true,
      sourceId: true,
      title: true,
      metadataJson: true,
      occurredAt: true,
      taskItem: {
        select: {
          title: true,
        },
      },
    },
  });

  const systemActivities = systemCandidates.filter((activity) => isMediaSourceId(activity.sourceId));
  const activities = Array.from(
    new Map([...businessActivities, ...systemActivities].map((activity) => [activity.id, activity])).values(),
  );
  const activityIds = activities.map((activity) => activity.id);
  const mediaBindings = await prisma.taskExecution.findMany({
    where: {
      targetType: "WATCH",
      targetId: { in: targetWatchIds },
      taskItemId: { not: null },
      taskItem: {
        note: {
          contains: "workTypeKey:",
          mode: "insensitive",
        },
      },
    },
    select: {
      taskItemId: true,
      targetId: true,
      taskItem: {
        select: {
          title: true,
          note: true,
        },
      },
    },
  });
  const mediaTaskItemIds = Array.from(
    new Set(mediaBindings.map((binding) => binding.taskItemId).filter(Boolean) as string[]),
  );
  const timelineEntries = mediaTaskItemIds.length
    ? await prisma.timelineEntry.findMany({
      where: {
        containerType: TimelineContainerType.TASK_ITEM,
        containerId: { in: mediaTaskItemIds },
      },
      select: {
        id: true,
        containerId: true,
        sourceType: true,
        sourceId: true,
        title: true,
        metadataJson: true,
      },
    })
    : [];
  const timelineEntryIds = timelineEntries.map((entry) => entry.id);

  console.log("[clear-watch-media-activities] mode:", apply ? "APPLY" : "DRY_RUN");
  console.log("[clear-watch-media-activities] watches:", watches.length);
  console.log("[clear-watch-media-activities] business events:", businessEvents.length);
  console.log("[clear-watch-media-activities] activities:", activities.length);
  console.log("[clear-watch-media-activities] media task items:", mediaTaskItemIds.length);
  console.log("[clear-watch-media-activities] timeline entries:", timelineEntries.length);
  console.table(
    watches.map((watch) => ({
      watchId: watch.id,
      productId: watch.productId,
      sku: watch.product.sku ?? "",
      title: watch.product.title ?? "",
    })),
  );
  console.table(
    activities.map((activity) => {
      const metadata = asRecord(activity.metadataJson);
      return {
        id: activity.id,
        taskItem: activity.taskItem.title,
        sourceType: activity.sourceType,
        sourceId: activity.sourceId ?? "",
        title: activity.title,
        eventKey: clean(metadata.eventKey),
        targetId: clean(metadata.targetId),
      };
    }),
  );
  console.table(
    mediaBindings.map((binding) => ({
      taskItemId: binding.taskItemId ?? "",
      taskItem: binding.taskItem?.title ?? "",
      targetId: binding.targetId,
    })),
  );
  console.table(
    timelineEntries.map((entry) => {
      const metadata = asRecord(entry.metadataJson);
      return {
        id: entry.id,
        containerId: entry.containerId,
        sourceType: entry.sourceType,
        sourceId: entry.sourceId,
        title: entry.title ?? "",
        eventKey: clean(metadata.eventKey),
        targetId: clean(metadata.targetId),
      };
    }),
  );

  if (!apply) {
    console.log("[clear-watch-media-activities] add --apply to delete these activities.");
    return;
  }

  await prisma.taskItemActivityReply.deleteMany({
    where: {
      activityId: { in: activityIds },
    },
  });
  await prisma.taskItemActivity.deleteMany({
    where: {
      id: { in: activityIds },
    },
  });
  await prisma.timelineEntry.deleteMany({
    where: {
      id: { in: timelineEntryIds },
    },
  });

  console.log("[clear-watch-media-activities] deleted activities:", activityIds.length);
  console.log("[clear-watch-media-activities] deleted timeline entries:", timelineEntryIds.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
