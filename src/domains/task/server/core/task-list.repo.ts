import { Prisma, TaskKind, TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskListFilters, TaskViewKey } from "../task.types";
import {
  TASK_EXECUTION_INCLUDE,
  USER_SELECT,
  applyTaskRowAccess,
  buildAccessWhere,
  buildFilterWhere,
  buildViewWhere,
} from "./task.repo.shared";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";
import { hydrateTasksWithTaskItemTagsRepo } from "../tag/task-tag.repo";

const TASK_LIST_SELECT = {
  id: true,
  title: true,
  description: true,
  kind: true,
  source: true,
  status: true,
  priority: true,
  periodType: true,
  periodKey: true,
  dueAt: true,
  startedAt: true,
  completedAt: true,
  cancelledAt: true,
  createdByUserId: true,
  assignedToUserId: true,
  watchId: true,
  orderId: true,
  shipmentId: true,
  acquisitionId: true,
  serviceRequestId: true,
  technicalIssueId: true,
  paymentId: true,
  workCaseId: true,
  createdAt: true,
  updatedAt: true,
  createdByUser: { select: USER_SELECT },
  assignedToUser: { select: USER_SELECT },
  completedByUser: { select: USER_SELECT },
  cancelledByUser: { select: USER_SELECT },
  _count: { select: { taskItems: true } },
} satisfies Prisma.TaskSelect;

export async function listTaskRowsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; filters: TaskListFilters },
) {
  const totalStartedAt = perfNow();
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.filters.pageSize || 25)));
  const view = input.filters.view || "all";
  const canViewAll = Boolean(input.canViewAll);

  const where: Prisma.TaskWhereInput = {
    AND: [buildViewWhere(view, input.userId), buildFilterWhere(input.filters)],
  };

  const rows = await perfStep("task-list-repo", "taskFindMany", () =>
    client.task.findMany({
      where,
      select: TASK_LIST_SELECT,
      orderBy: [
        { status: "asc" },
        { priority: "desc" },
        { dueAt: "asc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize + 1,
    }),
  );

  const hasNextPage = rows.length > pageSize;
  const items = hasNextPage ? rows.slice(0, pageSize) : rows;
  const accessItems = items.map((item) =>
    applyTaskRowAccess(item, input.userId, canViewAll),
  );

  const finalItems = accessItems.map((task) => ({
    ...task,
    taskProgressSummary: { total: task._count?.taskItems ?? 0, done: 0, percent: 0 },
    taskItems: [],
    executions: [],
    _detailLoaded: false,
  }));
  const estimatedTotal = (page - 1) * pageSize + finalItems.length + (hasNextPage ? 1 : 0);

  const result = {
    items: finalItems,
    total: estimatedTotal,
    page,
    pageSize,
    totalPages: hasNextPage ? page + 1 : page,
  };
  perfLog("task-list-repo", "listRowsTotal", totalStartedAt);
  return result;
}

const TASK_EXPAND_INCLUDE = {
  createdByUser: { select: USER_SELECT },
  assignedToUser: { select: USER_SELECT },
  taskItems: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      assignedToUser: { select: USER_SELECT },
      executions: {
        orderBy: { createdAt: "desc" },
        include: TASK_EXECUTION_INCLUDE,
      },
      checklists: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  },
  executions: {
    orderBy: { createdAt: "desc" },
    include: TASK_EXECUTION_INCLUDE,
  },
} satisfies Prisma.TaskInclude;

export async function getTaskForWorkPanelRepo(
  db: DB,
  input: { id: string; userId: string; canViewAll?: boolean },
) {
  const task = await perfStep("task-list-repo", "taskExpandFindUnique", () =>
    dbOrTx(db).task.findFirst({
      where: {
        AND: [{ id: input.id }, buildAccessWhere(input.userId, Boolean(input.canViewAll))],
      },
      include: TASK_EXPAND_INCLUDE,
    }),
  );

  if (!task) return null;

  const [withTags] = await perfStep("task-list-repo", "taskExpandTags", () =>
    hydrateTasksWithTaskItemTagsRepo(db, [task]),
  );

  return applyTaskRowAccess(withTags, input.userId, Boolean(input.canViewAll));
}

export async function countTaskViewsForListRepo(
  db: DB,
  input: { userId: string; kind?: TaskKind | "ALL" },
) {
  const totalStartedAt = perfNow();
  const client = dbOrTx(db);
  const userId = input.userId;
  const openWhere: Prisma.TaskWhereInput = {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  };
  const kindWhere: Prisma.TaskWhereInput =
    input.kind && input.kind !== "ALL" ? { kind: input.kind } : {};

  const [mine, assigned, delegated, all] = await Promise.all([
    perfStep("task-list-repo", "countViewMine", () =>
      client.task.count({
        where: { AND: [buildViewWhere("mine", userId), openWhere, kindWhere] },
      }),
    ),
    perfStep("task-list-repo", "countViewAssigned", () =>
      client.task.count({
        where: { AND: [buildViewWhere("assigned", userId), openWhere, kindWhere] },
      }),
    ),
    perfStep("task-list-repo", "countViewDelegated", () =>
      client.task.count({
        where: { AND: [buildViewWhere("delegated", userId), openWhere, kindWhere] },
      }),
    ),
    perfStep("task-list-repo", "countViewAll", () =>
      client.task.count({
        where: { AND: [buildViewWhere("all", userId), openWhere, kindWhere] },
      }),
    ),
  ]);

  perfLog("task-list-repo", "viewCountsTotal", totalStartedAt);
  return { mine, assigned, delegated, all };
}

export async function countTaskKindsForListRepo(
  db: DB,
  input: { userId: string; view?: TaskViewKey },
) {
  const totalStartedAt = perfNow();
  const client = dbOrTx(db);
  const baseWhere: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(input.view || "all", input.userId),
      { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } },
    ],
  };

  const rows = await perfStep("task-list-repo", "kindGroupBy", () =>
    client.task.groupBy({
      by: ["kind"],
      where: baseWhere,
      _count: { _all: true },
    }),
  );

  const countByKind = new Map(rows.map((row) => [row.kind, row._count._all]));
  const all = rows.reduce((sum, row) => sum + row._count._all, 0);

  const result = {
    kind_ALL: all,
    kind_OPERATION: countByKind.get(TaskKind.OPERATION) ?? 0,
    kind_BUSINESS: countByKind.get(TaskKind.BUSINESS) ?? 0,
    kind_SERVICE: countByKind.get(TaskKind.SERVICE) ?? 0,
    kind_PERSONAL: countByKind.get(TaskKind.PERSONAL) ?? 0,
    kind_FREE: countByKind.get(TaskKind.FREE) ?? 0,
  };
  perfLog("task-list-repo", "kindCountsTotal", totalStartedAt);
  return result;
}

export async function listAssignableUsersForTaskListRepo(db: DB) {
  return perfStep("task-list-repo", "assignableUsersFindMany", () =>
    dbOrTx(db).user.findMany({
      where: { isActive: true },
      select: USER_SELECT,
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
  );
}
