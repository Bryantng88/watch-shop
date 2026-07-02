import { ActivitySourceType, TaskStatus } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import {
  ensureCoordinationCycle,
  getWeekRange,
} from "./coordination-cycle.service";
import type {
  CoordinationDashboardDTO,
  CoordinationWorkTicketSummaryDTO,
} from "./coordination-dashboard.types";

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value?: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function parseDateInput(value?: string | null) {
  if (!value) return new Date();
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "-";
}

function buildWeekOptions(selectedDate: Date) {
  const options: CoordinationDashboardDTO["filters"]["weekOptions"] = [];

  for (let offset = -4; offset <= 4; offset += 1) {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + offset * 7);
    const week = getWeekRange(date);

    options.push({
      label: `${week.weekLabel}/${week.year}`,
      value: week.periodKey,
      date: formatDateInput(week.startDate),
    });
  }

  return options;
}

async function loadLastActivityMap(db: DB, taskItemIds: string[]) {
  if (!taskItemIds.length) return new Map<string, { title: string; occurredAt: Date }>();

  const rows = await db.taskItemActivity.findMany({
    where: {
      taskItemId: { in: taskItemIds },
    },
    select: {
      taskItemId: true,
      title: true,
      occurredAt: true,
    },
    orderBy: [
      { occurredAt: "desc" },
      { id: "desc" },
    ],
  });

  const map = new Map<string, { title: string; occurredAt: Date }>();

  for (const row of rows) {
    if (!map.has(row.taskItemId)) {
      map.set(row.taskItemId, {
        title: row.title,
        occurredAt: row.occurredAt,
      });
    }
  }

  return map;
}

export async function getOperationCoordinationDashboard(input?: {
  db?: DB;
  date?: string | null;
}): Promise<CoordinationDashboardDTO> {
  const db = input?.db ?? prisma;
  const selectedDate = parseDateInput(input?.date);
  const cycle = await ensureCoordinationCycle(db, {
    context: "OPERATION",
    date: selectedDate,
  });

  const taskItems = await db.taskItem.findMany({
    where: {
      taskId: cycle.task.id,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      id: true,
      title: true,
      status: true,
      dueAt: true,
      updatedAt: true,
      assignedToUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });
  const taskItemIds = taskItems.map((item) => item.id);

  const [queueRows, feedbackRows, activityRows, lastActivityMap] = await Promise.all([
    db.taskExecution.groupBy({
      by: ["taskItemId"],
      where: {
        taskId: cycle.task.id,
        taskItemId: { in: taskItemIds },
      },
      _count: { _all: true },
    }),
    db.taskItemActivity.groupBy({
      by: ["taskItemId"],
      where: {
        taskItemId: { in: taskItemIds },
        sourceType: ActivitySourceType.BUSINESS_EVENT,
      },
      _count: { _all: true },
    }),
    db.taskItemActivity.groupBy({
      by: ["taskItemId"],
      where: {
        taskItemId: { in: taskItemIds },
      },
      _max: { occurredAt: true },
    }),
    loadLastActivityMap(db, taskItemIds),
  ]);

  const queueCountByTaskItem = new Map(
    queueRows
      .filter((row) => row.taskItemId)
      .map((row) => [row.taskItemId as string, row._count._all]),
  );
  const feedbackCountByTaskItem = new Map(
    feedbackRows.map((row) => [row.taskItemId, row._count._all]),
  );
  const lastActivityAtByTaskItem = new Map(
    activityRows.map((row) => [row.taskItemId, row._max.occurredAt ?? null]),
  );
  const now = new Date();

  const workTickets: CoordinationWorkTicketSummaryDTO[] = taskItems.map((item) => {
    const queueCount = queueCountByTaskItem.get(item.id) ?? 0;
    const feedbackCount = feedbackCountByTaskItem.get(item.id) ?? 0;
    const isDone = item.status === TaskStatus.DONE;
    const overdue = Boolean(
      item.dueAt && item.dueAt < now && item.status !== TaskStatus.DONE,
    );
    const lastActivity = lastActivityMap.get(item.id);
    const lastActivityAt = lastActivity?.occurredAt ??
      lastActivityAtByTaskItem.get(item.id) ??
      null;

    return {
      id: item.id,
      title: item.title,
      ownerLabel: userLabel(item.assignedToUser),
      queueCount,
      needAttention: feedbackCount > 0 || overdue,
      feedbackCount,
      lastActivity: lastActivity?.title ?? null,
      lastActivityAt: formatDateTime(lastActivityAt),
      updatedAt: formatDateTime(item.updatedAt),
      progress: {
        queue: queueCount,
        waiting: isDone ? 0 : queueCount,
        feedback: feedbackCount,
        done: isDone ? queueCount : 0,
      },
    };
  });

  const reportValues = {
    workTickets: workTickets.length,
    queue: workTickets.reduce((sum, item) => sum + item.queueCount, 0),
    inProgress: taskItems.filter((item) => item.status === TaskStatus.IN_PROGRESS).length,
    feedback: workTickets.reduce((sum, item) => sum + item.feedbackCount, 0),
    done: taskItems.filter((item) => item.status === TaskStatus.DONE).length,
    overdue: taskItems.filter((item) =>
      Boolean(item.dueAt && item.dueAt < now && item.status !== TaskStatus.DONE),
    ).length,
  };

  return {
    context: "OPERATION",
    title: "Điều phối Vận hành",
    week: {
      label: cycle.week.weekLabel,
      periodKey: cycle.week.periodKey,
      startDate: formatDateInput(cycle.week.startDate),
      endDate: formatDateInput(cycle.week.endDate),
      weekNumber: cycle.week.weekNumber,
      year: cycle.week.year,
    },
    cycle: {
      id: cycle.task.id,
      title: cycle.task.title,
      created: cycle.created,
    },
    filters: {
      selectedDate: formatDateInput(cycle.week.startDate),
      weekOptions: buildWeekOptions(selectedDate),
    },
    report: [
      { key: "workTickets", label: "Phiếu xử lý", value: reportValues.workTickets },
      { key: "queue", label: "Queue", value: reportValues.queue },
      { key: "inProgress", label: "Đang xử lý", value: reportValues.inProgress },
      { key: "feedback", label: "Feedback", value: reportValues.feedback },
      { key: "done", label: "Hoàn thành", value: reportValues.done },
      { key: "overdue", label: "Quá hạn", value: reportValues.overdue },
    ],
    workTickets,
  };
}
