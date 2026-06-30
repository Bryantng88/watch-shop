import { Prisma, TaskKind, TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskListFilters, TaskViewKey } from "../task.types";
import {
  TASK_INCLUDE,
  TASK_ITEM_INCLUDE,
  USER_SELECT,
  applyTaskRowAccess,
  buildFilterWhere,
  buildViewWhere,
  endOfThisWeek,
  startOfToday,
  startOfTomorrow,
} from "./task.repo.shared";
import { hydrateTaskBusinessLinks } from "./task-business-hydrate.repo";
import { hydrateTasksWithTaskItemTagsRepo } from "../tag/task-tag.repo";
import { getTaskItemWorkflowProgress } from "@/domains/workflow/server/workflow.repo";
import { getTaskItemTimelineViewModels } from "@/domains/shared/timeline/server";
import { listTaskItemBusinessBindings } from "../business-binding.service";

type TimelineHydratableTaskItem = {
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

async function hydrateTaskItemsWithTimeline<
  T extends { taskItems?: TimelineHydratableTaskItem[] | null },
>(
  task: T,
) {
  const taskItems = task.taskItems ?? [];

  if (!taskItems.length) {
    return {
      ...task,
      taskItems,
    };
  }

  const timelines = await Promise.all(
    taskItems.map((item) => getTaskItemTimelineViewModels(item.id)),
  );

  return {
    ...task,
    taskItems: taskItems.map((item, index) => ({
      ...item,
      timeline: timelines[index] ?? [],
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
      include: TASK_INCLUDE,
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

  const hydratedItems = await Promise.all(
    items.map((item) => hydrateTaskBusinessLinks(db, item)),
  );

  const accessItems = hydratedItems.map((item) =>
    applyTaskRowAccess(item, input.userId, canViewAll),
  );

  let finalItems = await hydrateTasksWithTaskItemTagsRepo(
    db,
    accessItems,
  );

  const workflowMap =
    await getTaskItemWorkflowProgress(
      db,
      finalItems
        .flatMap((task) => task.taskItems ?? [])
        .map((item) => item.id),
    );

  finalItems = finalItems.map((task) => ({
    ...task,
    taskItems: (task.taskItems ?? []).map((item) => ({
      ...item,
      workflowProgress:
        workflowMap.get(item.id) ?? null,
    })),
  }));

  finalItems = await Promise.all(
    finalItems.map((task) => hydrateTaskItemsWithTimeline(task)),
  );

  return {
    items: finalItems,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
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

  const [all, operation, business, service, personal, free] = await Promise.all([
    client.task.count({ where: baseWhere }),
    client.task.count({ where: { AND: [baseWhere, { kind: TaskKind.OPERATION }] } }),
    client.task.count({ where: { AND: [baseWhere, { kind: TaskKind.BUSINESS }] } }),
    client.task.count({ where: { AND: [baseWhere, { kind: TaskKind.SERVICE }] } }),
    client.task.count({ where: { AND: [baseWhere, { kind: TaskKind.PERSONAL }] } }),
    client.task.count({ where: { AND: [baseWhere, { kind: TaskKind.FREE }] } }),
  ]);

  return {
    kind_ALL: all,
    kind_OPERATION: operation,
    kind_BUSINESS: business,
    kind_SERVICE: service,
    kind_PERSONAL: personal,
    kind_FREE: free,
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

  return hydrateTaskItemsWithTimeline(withWorkflow);
}

export async function getTaskItemDetailRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  const item = await client.taskItem.findUnique({
    where: { id },
    include: {
      ...TASK_ITEM_INCLUDE,
      task: {
        select: {
          id: true,
          title: true,
          kind: true,
          status: true,
          priority: true,
          dueAt: true,
          periodKey: true,
        },
      },
    },
  });

  if (!item) return null;

  const [timeline, businessBindings] = await Promise.all([
    getTaskItemTimelineViewModels(item.id, 50),
    listTaskItemBusinessBindings(db, item.id),
  ]);
  const watchProductIds = await resolveWatchProductIds(db, businessBindings);

  return {
    ...item,
    timeline,
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
