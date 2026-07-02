import {
  Prisma,
  TaskKind,
  TaskPriority,
  TaskStatus,
  TimelineContainerType,
  TimelineSourceType,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskItemListFilters, TaskListFilters, TaskViewKey } from "../task.types";
import {
  TASK_INCLUDE,
  USER_SELECT,
  applyTaskRowAccess,
  buildAccessWhere,
  buildFilterWhere,
  buildViewWhere,
  endOfThisWeek,
  startOfToday,
  startOfTomorrow,
} from "./task.repo.shared";
import { hydrateTaskBusinessLinks } from "./task-business-hydrate.repo";
import { hydrateTasksWithTaskItemTagsRepo } from "../tag/task-tag.repo";
import { getTaskItemWorkflowProgress } from "@/domains/workflow/server/workflow.repo";
import { listTaskItemBusinessBindings } from "../business-binding.service";

const TASK_LIST_INCLUDE = {
  ...TASK_INCLUDE,
  taskItems: false,
  executions: false,
  _count: { select: { taskItems: true } },
} satisfies Prisma.TaskInclude;

type TimelineStatsHydratableTaskItem = {
  id: string;
  [key: string]: unknown;
};

function bindingHref(
  binding: { targetType: string; targetId: string },
  watchProductIds: Map<string, string>,
) {
  if (binding.targetType === "WATCH") {
    const productId = watchProductIds.get(binding.targetId);
    return productId ? `/admin/watches/${productId}` : null;
  }

  if (binding.targetType === "SERVICE_REQUEST") return `/admin/services/${binding.targetId}`;
  if (binding.targetType === "TECHNICAL_ISSUE") {
    return `/admin/services/issues-board?issueId=${binding.targetId}`;
  }
  if (binding.targetType === "ORDER") return `/admin/orders/${binding.targetId}`;
  if (binding.targetType === "SHIPMENT") return `/admin/shipments/${binding.targetId}`;
  if (binding.targetType === "PAYMENT") return "/admin/payments";
  if (binding.targetType === "WORK_CASE") return `/admin/work-cases/${binding.targetId}`;
  if (binding.targetType === "ACQUISITION") return `/admin/acquisitions/${binding.targetId}`;

  return null;
}

async function resolveWatchProductIds(
  db: DB,
  bindings: Array<{ targetType: string; targetId: string }>,
) {
  const watchIds = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === "WATCH")
        .map((binding) => binding.targetId)
        .filter(Boolean),
    ),
  );

  if (!watchIds.length) return new Map<string, string>();

  const rows = await dbOrTx(db).watch.findMany({
    where: { id: { in: watchIds } },
    select: { id: true, productId: true },
  });

  return new Map(
    rows
      .filter((row) => row.productId)
      .map((row) => [row.id, row.productId as string]),
  );
}

async function getTaskItemTimelineStatsMap(db: DB, taskItemIds: string[]) {
  const ids = Array.from(new Set(taskItemIds.filter(Boolean)));
  const empty = new Map<
    string,
    { activityCount: number; feedbackCount: number; commentCount: number }
  >();

  if (!ids.length) return empty;

  const rows = await dbOrTx(db).timelineEntry.groupBy({
    by: ["containerId", "sourceType"],
    where: {
      containerType: TimelineContainerType.TASK_ITEM,
      containerId: { in: ids },
    },
    _count: { _all: true },
  });

  for (const row of rows) {
    const current =
      empty.get(row.containerId) ??
      { activityCount: 0, feedbackCount: 0, commentCount: 0 };
    const count = row._count._all;

    current.activityCount += count;
    if (row.sourceType === TimelineSourceType.BUSINESS_FEEDBACK) {
      current.feedbackCount += count;
    }
    if (row.sourceType === TimelineSourceType.USER_COMMENT) {
      current.commentCount += count;
    }

    empty.set(row.containerId, current);
  }

  return empty;
}

async function getTaskProgressSummaryMap(db: DB, taskIds: string[]) {
  const ids = Array.from(new Set(taskIds.filter(Boolean)));
  const map = new Map<string, { total: number; done: number; percent: number }>();

  if (!ids.length) return map;

  const [totalRows, doneRows] = await Promise.all([
    dbOrTx(db).taskItem.groupBy({
      by: ["taskId"],
      where: { taskId: { in: ids } },
      _count: { _all: true },
    }),
    dbOrTx(db).taskItem.groupBy({
      by: ["taskId"],
      where: {
        taskId: { in: ids },
        OR: [{ isDone: true }, { status: TaskStatus.DONE }],
      },
      _count: { _all: true },
    }),
  ]);

  for (const row of totalRows) {
    map.set(row.taskId, {
      total: row._count._all,
      done: 0,
      percent: 0,
    });
  }

  for (const row of doneRows) {
    const current = map.get(row.taskId) ?? { total: 0, done: 0, percent: 0 };
    current.done = row._count._all;
    map.set(row.taskId, current);
  }

  for (const [taskId, current] of map.entries()) {
    current.percent =
      current.total > 0 ? Math.round((current.done / current.total) * 100) : 0;
    map.set(taskId, current);
  }

  return map;
}

function hydrateTaskItemsWithTimelineStats<
  T extends { taskItems?: TimelineStatsHydratableTaskItem[] | null },
>(
  task: T,
  statsMap: Map<
    string,
    { activityCount: number; feedbackCount: number; commentCount: number }
  >,
) {
  const taskItems = task.taskItems ?? [];

  return {
    ...task,
    taskItems: taskItems.map((item) => ({
      ...item,
      timelineStats:
        statsMap.get(item.id) ??
        { activityCount: 0, feedbackCount: 0, commentCount: 0 },
    })),
  };
}

export async function listTasksRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; filters: TaskListFilters },
) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.filters.pageSize || 25)));

  // Quan trọng: default phải là all, không phải mine
  const view = input.filters.view || "all";

  const canViewAll = Boolean(input.canViewAll);

  const where: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(view, input.userId),
      buildFilterWhere(input.filters),
    ],
  };

  const [items, total] = await Promise.all([
    client.task.findMany({
      where,
      include: TASK_LIST_INCLUDE,
      orderBy: [
        { status: "asc" },
        { priority: "desc" },
        { dueAt: "asc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    client.task.count({ where }),
  ]);

  const accessItems = items.map((item) =>
    applyTaskRowAccess(item, input.userId, canViewAll),
  );

  const progressSummaryMap = await getTaskProgressSummaryMap(
    db,
    accessItems.map((task) => task.id),
  );

  const finalItems = accessItems.map((task) =>
    ({
      ...task,
      taskProgressSummary:
        progressSummaryMap.get(task.id) ??
        { total: task._count?.taskItems ?? 0, done: 0, percent: 0 },
      taskItems: [],
      executions: [],
      _detailLoaded: false,
    }),
  );

  return {
    items: finalItems,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

function buildTaskItemAccessWhere(
  userId: string,
  canViewAll: boolean,
  shareGroups: string[] = [],
): Prisma.TaskItemWhereInput {
  if (canViewAll) return {};

  const systemShareWhere: Prisma.TaskItemWhereInput[] = [];
  const normalizedShareGroups = new Set(
    shareGroups.map((group) => String(group).trim().toLowerCase()).filter(Boolean),
  );

  for (const group of normalizedShareGroups) {
    systemShareWhere.push({
      note: { contains: `shareGroupKey: ${group}`, mode: "insensitive" },
    });

    if (group === "operation") {
      systemShareWhere.push({
        userId: null,
        note: { contains: "workTypeKey:", mode: "insensitive" },
        task: { kind: TaskKind.OPERATION },
      });
    }

    if (group === "technical") {
      systemShareWhere.push({
        userId: null,
        note: { contains: "workTypeKey:", mode: "insensitive" },
        task: { kind: TaskKind.SERVICE },
      });
    }

    if (group === "sales") {
      systemShareWhere.push({
        userId: null,
        note: { contains: "workTypeKey:", mode: "insensitive" },
        task: { kind: TaskKind.BUSINESS },
      });
    }
  }

  return {
    OR: [
      { userId },
      { note: { contains: `sharedUserIds: ${userId}`, mode: "insensitive" } },
      { note: { contains: `,${userId}`, mode: "insensitive" } },
      { assignedToUserId: userId },
      {
        task: {
          OR: [
            { createdByUserId: userId },
            { assignedToUserId: userId },
          ],
        },
      },
      ...systemShareWhere,
    ],
  };
}

function buildTaskItemFilterWhere(
  filters: TaskItemListFilters,
): Prisma.TaskItemWhereInput {
  const AND: Prisma.TaskItemWhereInput[] = [];

  const q = String(filters.q || "").trim();
  if (q) {
    AND.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { note: { contains: q, mode: "insensitive" } },
        { task: { title: { contains: q, mode: "insensitive" } } },
      ],
    });
  }

  const status = String(filters.status || "OPEN").toUpperCase();
  if (status === "OPEN") {
    AND.push({
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    });
  } else if (status && status !== "ALL") {
    AND.push({ status: status as TaskStatus });
  }

  const priority = String(filters.priority || "ALL").toUpperCase();
  if (priority && priority !== "ALL") {
    AND.push({ priority: priority as TaskPriority });
  }

  const kind = String(filters.kind || "ALL").toUpperCase();
  if (kind && kind !== "ALL") {
    AND.push({ task: { kind: kind as TaskKind } });
  }

  const taskId = String(filters.taskId || "").trim();
  if (taskId) {
    AND.push({ taskId });
  }

  return AND.length ? { AND } : {};
}

export async function listTaskItemsRepo(
  db: DB,
  input: {
    userId: string;
    canViewAll?: boolean;
    shareGroups?: string[];
    filters: TaskItemListFilters;
  },
) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.filters.pageSize || 25)));

  const where: Prisma.TaskItemWhereInput = {
    AND: [
      buildTaskItemAccessWhere(
        input.userId,
        Boolean(input.canViewAll),
        input.shareGroups ?? [],
      ),
      buildTaskItemFilterWhere(input.filters),
    ],
  };

  const [items, total] = await Promise.all([
    client.taskItem.findMany({
      where,
      include: {
        assignedToUser: { select: USER_SELECT },
        task: {
          select: {
            id: true,
            title: true,
            kind: true,
            status: true,
            priority: true,
            dueAt: true,
            assignedToUser: { select: USER_SELECT },
          },
        },
        _count: {
          select: { checklists: true, executions: true },
        },
      },
      orderBy: [
        { status: "asc" },
        { priority: "desc" },
        { dueAt: "asc" },
        { updatedAt: "desc" },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    client.taskItem.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listTaskOptionsForTaskItemRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; limit?: number },
) {
  const client = dbOrTx(db);

  return client.task.findMany({
    where: {
      AND: [
        buildAccessWhere(input.userId, Boolean(input.canViewAll)),
        { status: { not: TaskStatus.CANCELLED } },
      ],
    },
    select: {
      id: true,
      title: true,
      kind: true,
      status: true,
      priority: true,
      dueAt: true,
      _count: { select: { taskItems: true } },
    },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { updatedAt: "desc" },
    ],
    take: Math.min(200, Math.max(20, Number(input.limit || 100))),
  });
}
export async function countTaskViewsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; kind?: TaskKind | "ALL" },
) {
  const client = dbOrTx(db);
  const userId = input.userId;

  const openWhere: Prisma.TaskWhereInput = {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  };

  const kindWhere: Prisma.TaskWhereInput =
    input.kind && input.kind !== "ALL" ? { kind: input.kind } : {};

  const [mine, assigned, delegated, all] = await Promise.all([
    client.task.count({
      where: { AND: [buildViewWhere("mine", userId), openWhere, kindWhere] },
    }),
    client.task.count({
      where: { AND: [buildViewWhere("assigned", userId), openWhere, kindWhere] },
    }),
    client.task.count({
      where: { AND: [buildViewWhere("delegated", userId), openWhere, kindWhere] },
    }),
    client.task.count({
      where: { AND: [buildViewWhere("all", userId), openWhere, kindWhere] },
    }),
  ]);

  return { mine, assigned, delegated, all };
}

export async function countTaskKindsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; view?: TaskViewKey },
) {
  const client = dbOrTx(db);
  const userId = input.userId;

  const baseWhere: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(input.view || "all", userId),
      { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } },
    ],
  };

  const rows = await client.task.groupBy({
    by: ["kind"],
    where: baseWhere,
    _count: { _all: true },
  });

  const countByKind = new Map(rows.map((row) => [row.kind, row._count._all]));
  const all = rows.reduce((sum, row) => sum + row._count._all, 0);

  return {
    kind_ALL: all,
    kind_OPERATION: countByKind.get(TaskKind.OPERATION) ?? 0,
    kind_BUSINESS: countByKind.get(TaskKind.BUSINESS) ?? 0,
    kind_SERVICE: countByKind.get(TaskKind.SERVICE) ?? 0,
    kind_PERSONAL: countByKind.get(TaskKind.PERSONAL) ?? 0,
    kind_FREE: countByKind.get(TaskKind.FREE) ?? 0,
  };
}

export async function countTaskDueBucketsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; view?: TaskViewKey },
) {
  const client = dbOrTx(db);
  const base: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(input.view || "all", input.userId),
      { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } },
    ],
  };
  const today = startOfToday();
  const tomorrow = startOfTomorrow();
  const weekEnd = endOfThisWeek();

  const [overdue, todayCount, thisWeek, noDue] = await Promise.all([
    client.task.count({ where: { AND: [base, { dueAt: { lt: today } }] } }),
    client.task.count({ where: { AND: [base, { dueAt: { gte: today, lt: tomorrow } }] } }),
    client.task.count({ where: { AND: [base, { dueAt: { gte: today, lt: weekEnd } }] } }),
    client.task.count({ where: { AND: [base, { dueAt: null }] } }),
  ]);

  return { overdue, today: todayCount, thisWeek, noDue };
}

export async function getTaskByIdRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  const task = await client.task.findUnique({ where: { id }, include: TASK_INCLUDE });
  if (!task) return null;
  const hydrated = await hydrateTaskBusinessLinks(db, task);
  const [withTags] =
    await hydrateTasksWithTaskItemTagsRepo(
      db,
      [hydrated],
    );

  const workflowMap =
    await getTaskItemWorkflowProgress(
      db,
      (withTags.taskItems ?? []).map((x) => x.id),
    );

  const withWorkflow = {
    ...withTags,
    taskItems: (withTags.taskItems ?? []).map((item) => ({
      ...item,
      workflowProgress:
        workflowMap.get(item.id) ?? null,
    })),
  };

  const timelineStatsMap = await getTaskItemTimelineStatsMap(
    db,
    (withWorkflow.taskItems ?? []).map((item) => item.id),
  );

  return hydrateTaskItemsWithTimelineStats(withWorkflow, timelineStatsMap);
}

export async function getTaskItemDetailRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  const item = await client.taskItem.findUnique({
    where: { id },
    include: {
      assignedToUser: { select: USER_SELECT },
      checklists: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      task: {
        select: {
          id: true,
          title: true,
          kind: true,
          status: true,
          priority: true,
          dueAt: true,
          periodKey: true,
          createdByUserId: true,
          assignedToUserId: true,
        },
      },
    },
  });

  if (!item) return null;

  const [timelineStatsMap, businessBindings] = await Promise.all([
    getTaskItemTimelineStatsMap(db, [item.id]),
    listTaskItemBusinessBindings(db, item.id),
  ]);
  const watchProductIds = await resolveWatchProductIds(db, businessBindings);

  return {
    ...item,
    timelineStats:
      timelineStatsMap.get(item.id) ??
      { activityCount: 0, feedbackCount: 0, commentCount: 0 },
    businessBindings: businessBindings.map((binding) => ({
      ...binding,
      href: bindingHref(binding, watchProductIds),
    })),
  };
}

export async function listAssignableUsersRepo(db: DB) {
  const client = dbOrTx(db);
  return client.user.findMany({
    where: { isActive: true },
    select: USER_SELECT,
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}
