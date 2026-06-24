import { Prisma, TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { TaskListFilters, TaskViewKey } from "../task.types";
import {
  TASK_INCLUDE,
  USER_SELECT,
  applyTaskRowAccess,
  buildFilterWhere,
  buildViewWhere,
  endOfThisWeek,
  startOfToday,
  startOfTomorrow,
} from "./task.repo.shared";
import { hydrateTaskBusinessLinks } from "./task-business-hydrate.repo";

export async function listTasksRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; filters: TaskListFilters },
) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.filters.pageSize || 25)));
  const view = input.filters.view || "mine";
  const canViewAll = Boolean(input.canViewAll);

  const where: Prisma.TaskWhereInput = {
    AND: [buildViewWhere(view, input.userId, canViewAll), buildFilterWhere(input.filters)],
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

  const hydratedItems = await Promise.all(items.map((item) => hydrateTaskBusinessLinks(db, item)));
  const finalItems = hydratedItems.map((item) => applyTaskRowAccess(item, input.userId, canViewAll));

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
  input: { userId: string; canViewAll?: boolean },
) {
  const client = dbOrTx(db);
  const canViewAll = Boolean(input.canViewAll);
  const userId = input.userId;

  const openWhere: Prisma.TaskWhereInput = {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  };

  const [mine, assigned, delegated, all] = await Promise.all([
    client.task.count({ where: { AND: [buildViewWhere("mine", userId, canViewAll), openWhere] } }),
    client.task.count({ where: { AND: [buildViewWhere("assigned", userId, canViewAll), openWhere] } }),
    client.task.count({ where: { AND: [buildViewWhere("delegated", userId, canViewAll), openWhere] } }),
    client.task.count({ where: { AND: [buildViewWhere("all", userId, canViewAll), openWhere] } }),
  ]);

  return { mine, assigned, delegated, all };
}

export async function countTaskDueBucketsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; view?: TaskViewKey },
) {
  const client = dbOrTx(db);
  const base: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(input.view || "mine", input.userId, Boolean(input.canViewAll)),
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
  return hydrateTaskBusinessLinks(db, task);
}

export async function listAssignableUsersRepo(db: DB) {
  const client = dbOrTx(db);
  return client.user.findMany({
    where: { isActive: true },
    select: USER_SELECT,
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}
