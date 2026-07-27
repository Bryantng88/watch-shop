import {
  type AudienceSegment,
  TaskExecutionActionType,
  TaskExecutionTargetType,
} from "@prisma/client";

import { prisma, type DB } from "@/server/db/client";

type WatchPeriodFlow = {
  total: number;
  ready: number;
  service: number;
  missingImage: number;
  inventoryValue: number;
};

function noteValue(note: string | null, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(note ?? "")
    .match(new RegExp(`^${escaped}:\\s*([^\\r\\n]+)`, "im"))?.[1]
    ?.trim()
    .toLowerCase() ?? null;
}

async function readPeriod(
  db: DB,
  startAt: Date,
  endAt: Date,
  audienceSegment?: AudienceSegment,
): Promise<WatchPeriodFlow> {
  const rows = await db.taskExecution.findMany({
    where: {
      actionType: { not: TaskExecutionActionType.CANCELLED },
      createdAt: { gte: startAt, lt: endAt },
      targetType: {
        in: [
          TaskExecutionTargetType.WATCH,
          TaskExecutionTargetType.SERVICE_REQUEST,
        ],
      },
    },
    select: {
      targetType: true,
      targetId: true,
      taskItem: { select: { note: true } },
    },
  });

  const mediaWatchIds = new Set<string>();
  const publishWatchIds = new Set<string>();
  const photographyWatchIds = new Set<string>();
  const serviceRequestIds = new Set<string>();

  for (const row of rows) {
    if (row.targetType === TaskExecutionTargetType.WATCH) {
      mediaWatchIds.add(row.targetId);
      const workTypeKey = noteValue(row.taskItem?.note ?? null, "workTypeKey");
      if (workTypeKey === "publish") publishWatchIds.add(row.targetId);
      if (workTypeKey === "photography") photographyWatchIds.add(row.targetId);
    }

    if (row.targetType === TaskExecutionTargetType.SERVICE_REQUEST) {
      serviceRequestIds.add(row.targetId);
    }
  }

  if (audienceSegment && mediaWatchIds.size) {
    const matchingWatches = await db.watch.findMany({
      where: {
        id: { in: [...mediaWatchIds] },
        audienceSegment,
      },
      select: { id: true },
    });
    const allowed = new Set(matchingWatches.map((watch) => watch.id));
    for (const id of mediaWatchIds) if (!allowed.has(id)) mediaWatchIds.delete(id);
    for (const id of publishWatchIds) if (!allowed.has(id)) publishWatchIds.delete(id);
    for (const id of photographyWatchIds) {
      if (!allowed.has(id)) photographyWatchIds.delete(id);
    }
  }

  const serviceCount =
    audienceSegment && serviceRequestIds.size
      ? await db.serviceRequest.count({
          where: {
            id: { in: [...serviceRequestIds] },
            product: { watch: { is: { audienceSegment } } },
          },
        })
      : serviceRequestIds.size;

  const inventory = mediaWatchIds.size
    ? await db.watchPrice.aggregate({
        where: { watchId: { in: [...mediaWatchIds] } },
        _sum: { salePrice: true },
      })
    : null;

  return {
    total: mediaWatchIds.size,
    ready: publishWatchIds.size,
    service: serviceCount,
    missingImage: photographyWatchIds.size,
    inventoryValue: Number(inventory?._sum.salePrice ?? 0),
  };
}

/** Date-filtered comparison independent from Coordination Space identity. */
export async function getWatchPeriodComparison(input?: {
  db?: DB;
  date?: Date;
  audienceSegment?: AudienceSegment;
}) {
  const db = input?.db ?? prisma;
  const currentEnd = input?.date ?? new Date();
  const currentStart = new Date(currentEnd);
  currentStart.setUTCDate(currentStart.getUTCDate() - 7);
  const previousStart = new Date(currentStart);
  previousStart.setUTCDate(previousStart.getUTCDate() - 7);
  const [current, previous] = await Promise.all([
    readPeriod(db, currentStart, currentEnd, input?.audienceSegment),
    readPeriod(db, previousStart, currentStart, input?.audienceSegment),
  ]);

  return {
    current,
    previous,
    currentPeriodStart: currentStart.toISOString(),
    previousPeriodStart: previousStart.toISOString(),
  };
}
