import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskPeriod,
} from "@prisma/client";

import { prisma, type DB } from "@/server/db/client";
import { getWeekRange } from "./coordination-cycle.service";

type WeeklyWatchFlow = {
  total: number;
  ready: number;
  service: number;
  missingImage: number;
  inventoryValue: number;
};

function previousWeekDate(date: Date) {
  const previous = new Date(date);
  previous.setUTCDate(previous.getUTCDate() - 7);
  return previous;
}

function noteValue(note: string | null, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(note ?? "")
    .match(new RegExp(`^${escaped}:\\s*([^\\r\\n]+)`, "im"))?.[1]
    ?.trim()
    .toLowerCase() ?? null;
}

function isContext(description: string | null, context: "MEDIA" | "TECHNICAL") {
  return String(description ?? "").startsWith(`Coordination cycle ${context} `);
}

async function readWeek(db: DB, periodKey: string): Promise<WeeklyWatchFlow> {
  const rows = await db.taskExecution.findMany({
    where: {
      actionType: { not: TaskExecutionActionType.CANCELLED },
      task: { periodType: TaskPeriod.WEEKLY, periodKey },
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
      task: { select: { description: true } },
      taskItem: { select: { note: true } },
    },
  });

  const mediaWatchIds = new Set<string>();
  const publishWatchIds = new Set<string>();
  const photographyWatchIds = new Set<string>();
  const serviceRequestIds = new Set<string>();

  for (const row of rows) {
    if (
      row.targetType === TaskExecutionTargetType.WATCH &&
      isContext(row.task.description, "MEDIA")
    ) {
      mediaWatchIds.add(row.targetId);
      const workTypeKey = noteValue(row.taskItem?.note ?? null, "workTypeKey");
      if (workTypeKey === "publish") publishWatchIds.add(row.targetId);
      if (workTypeKey === "photography") photographyWatchIds.add(row.targetId);
    }

    if (
      row.targetType === TaskExecutionTargetType.SERVICE_REQUEST &&
      isContext(row.task.description, "TECHNICAL")
    ) {
      serviceRequestIds.add(row.targetId);
    }
  }

  const inventory = mediaWatchIds.size
    ? await db.watchPrice.aggregate({
        where: { watchId: { in: [...mediaWatchIds] } },
        _sum: { salePrice: true },
      })
    : null;

  return {
    total: mediaWatchIds.size,
    ready: publishWatchIds.size,
    service: serviceRequestIds.size,
    missingImage: photographyWatchIds.size,
    inventoryValue: Number(inventory?._sum.salePrice ?? 0),
  };
}

/** Read-only adapter over canonical weekly Coordination Spaces. */
export async function getWeeklyWatchSpaceComparison(input?: {
  db?: DB;
  date?: Date;
}) {
  const db = input?.db ?? prisma;
  const date = input?.date ?? new Date();
  const currentWeek = getWeekRange(date);
  const previousWeek = getWeekRange(previousWeekDate(currentWeek.startDate));
  const [current, previous] = await Promise.all([
    readWeek(db, currentWeek.periodKey),
    readWeek(db, previousWeek.periodKey),
  ]);

  return {
    current,
    previous,
    currentPeriodKey: currentWeek.periodKey,
    previousPeriodKey: previousWeek.periodKey,
  };
}
