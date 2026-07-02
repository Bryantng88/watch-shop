import { TaskKind, TaskPeriod, TaskStatus, type TaskPriority } from "@prisma/client";
import type { DB } from "@/server/db/client";
import {
  completeRelatedTasksRepo,
  countTaskKindsRepo,
  countTaskViewsRepo,
  createTaskRepo,
  ensureSystemTaskRepo,
  findActivePeriodTaskRepo,
  findOpenRelatedTasksRepo,
  getTaskByIdRepo,
  isSharedTaskKind,
  listAssignableUsersRepo,
  listTasksRepo,
  createTaskItemRepo,
  setTaskStatusRepo,
  updateTaskRepo,
} from "./task.repo";
import {
  getTaskItemDetailRepo,
  listTaskItemsRepo,
  listTaskOptionsForTaskItemRepo,
} from "./task-query.repo";
import type {
  CompleteRelatedTasksInput,
  CreateTaskInput,
  EnsureSystemTaskInput,
  FindOpenRelatedTasksInput,
  TaskItemListFilters,
  TaskListFilters,
  UpdateTaskInput,
} from "../task.types";

type TaskItemAccessShape = {
  assignedToUserId?: string | null;
  task?: {
    kind?: TaskKind | null;
    createdByUserId?: string | null;
    assignedToUserId?: string | null;
  } | null;
};

function omitTaskAccessFields<T extends TaskItemAccessShape>(item: T) {
  if (!item.task) return item;

  const task = { ...item.task };
  delete task.createdByUserId;
  delete task.assignedToUserId;

  return {
    ...item,
    task,
  };
}

export function getAuthUserId(auth: any): string | null {
  return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export function authCanViewAllTasks(auth: any): boolean {
  const roleName = String(
    auth?.user?.role ??
    auth?.role ??
    auth?.user?.role?.name ??
    auth?.role?.name ??
    auth?.roleName ??
    "",
  ).toUpperCase();

  const permissions =
    auth?.permissions ?? auth?.user?.permissions ?? auth?.role?.permissions ?? [];

  return (
    roleName === "ADMIN" ||
    (Array.isArray(permissions) && permissions.includes("TASK_VIEW_ALL"))
  );
}

function authShareGroups(auth: unknown) {
  const authRecord = auth && typeof auth === "object" ? auth as Record<string, unknown> : {};
  const user = authRecord.user && typeof authRecord.user === "object"
    ? authRecord.user as Record<string, unknown>
    : {};
  const roles = authRecord.roles ?? user.roles ?? [];
  if (!Array.isArray(roles)) return [];

  const groups = new Set<string>();
  for (const role of roles) {
    const normalized = String(role ?? "").trim().toUpperCase();
    if (normalized === "OPERATION") groups.add("operation");
    if (normalized === "TECHNICAL") groups.add("technical");
    if (normalized === "SALES" || normalized === "SALE") groups.add("sales");
  }

  return Array.from(groups);
}

function assertUser(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("Không xác định được user hiện tại");
}

function getIsoWeekInfo(date = new Date()) {
  const current = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = current.getUTCDay() || 7;

  const monday = new Date(current);
  monday.setUTCDate(current.getUTCDate() - day + 1);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const weekDate = new Date(monday);
  weekDate.setUTCDate(monday.getUTCDate() + 3);

  const yearStart = new Date(Date.UTC(weekDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((weekDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const year = weekDate.getUTCFullYear();

  return {
    year,
    week,
    periodKey: `${year}-W${String(week).padStart(2, "0")}`,
    start: monday,
    end: sunday,
  };
}

function formatDateVN(date: Date) {
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

function normalizeTaskPeriod(
  kind: TaskKind,
  input: { periodType?: TaskPeriod | null; periodKey?: string | null },
) {
  if (kind === TaskKind.FREE) {
    return { periodType: null, periodKey: null };
  }

  return {
    periodType: input.periodType ?? TaskPeriod.WEEKLY,
    periodKey: input.periodKey?.trim() || getIsoWeekInfo().periodKey,
  };
}

function taskKindLabel(kind: TaskKind) {
  switch (kind) {
    case TaskKind.OPERATION:
      return "Vận hành";
    case TaskKind.BUSINESS:
      return "Kinh doanh";
    case TaskKind.SERVICE:
      return "Kỹ thuật";
    case TaskKind.PERSONAL:
      return "Cá nhân";
    case TaskKind.FREE:
      return "Tự do";
    default:
      return String(kind);
  }
}

function buildPeriodTaskTitle(kind: TaskKind, periodKey: string) {
  const match = periodKey.match(/^(\d{4})-W(\d{2})$/);

  if (!match) {
    return `Task ${taskKindLabel(kind)} ${periodKey}`;
  }

  const year = Number(match[1]);
  const week = Number(match[2]);

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;

  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Day + 1);

  const start = new Date(week1Monday);
  start.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return `${taskKindLabel(kind)} tuần ${week}`;
}

async function assertCanAccessTask(db: DB, id: string, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const task = await getTaskByIdRepo(db, id);
  if (!task) throw new Error("Không tìm thấy task");

  if (authCanViewAllTasks(auth)) return task;

  if (task.createdByUserId !== userId && task.assignedToUserId !== userId) {
    throw new Error("Bạn không có quyền thao tác task này");
  }

  return task;
}

function assertCanAccessTaskItemDetail(item: TaskItemAccessShape, auth: unknown) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  if (authCanViewAllTasks(auth)) return;

  const task = item?.task;

  if (
    isSharedTaskKind(task?.kind) ||
    task?.createdByUserId === userId ||
    task?.assignedToUserId === userId ||
    item?.assignedToUserId === userId
  ) {
    return;
  }

  throw new Error("Bạn không có quyền thao tác task item này");
}

export async function getTaskListPageData(
  db: DB,
  input: { auth: any; filters: TaskListFilters },
) {
  const userId = getAuthUserId(input.auth);
  assertUser(userId);

  const canViewAll = authCanViewAllTasks(input.auth);
  const view = input.filters.view || "all";
  const kind = input.filters.kind || "ALL";

  const [list, viewCounts, kindCounts, users] = await Promise.all([
    listTasksRepo(db, { userId, canViewAll, filters: input.filters }),
    countTaskViewsRepo(db, { userId, canViewAll, kind }),
    countTaskKindsRepo(db, { userId, canViewAll, view }),
    listAssignableUsersRepo(db),
  ]);

  return {
    ...list,
    counts: {
      ...viewCounts,
      ...kindCounts,
    },
    users,
    currentUserId: userId,
    canViewAll,
  };
}

export async function getTaskItemListPageData(
  db: DB,
  input: { auth: unknown; filters: TaskItemListFilters },
) {
  const userId = getAuthUserId(input.auth);
  assertUser(userId);

  const canViewAll = authCanViewAllTasks(input.auth);

  const [list, taskOptions, users] = await Promise.all([
    listTaskItemsRepo(db, {
      userId,
      canViewAll,
      shareGroups: authShareGroups(input.auth),
      filters: input.filters,
    }),
    listTaskOptionsForTaskItemRepo(db, { userId, canViewAll }),
    listAssignableUsersRepo(db),
  ]);

  return {
    ...list,
    taskOptions,
    users,
    currentUserId: userId,
    canViewAll,
  };
}

export async function getTaskDetail(db: DB, id: string, auth: any) {
  return assertCanAccessTask(db, id, auth);
}

export async function getTaskItemDetail(
  db: DB,
  id: string,
  auth: Parameters<typeof getTaskDetail>[2],
) {
  const item = await getTaskItemDetailRepo(db, id);
  if (!item) return null;

  assertCanAccessTaskItemDetail(item, auth);

  return omitTaskAccessFields(item);
}

export async function createTask(db: DB, input: CreateTaskInput, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const kind = input.kind ?? TaskKind.BUSINESS;

  if (kind === TaskKind.FREE) {
    if (!input.title?.trim()) {
      throw new Error("Vui lòng nhập tiêu đề task tự do");
    }

    const task = await createTaskRepo(db, {
      ...input,
      kind,
      periodType: null,
      periodKey: null,
      source: input.source ?? "MANUAL",
      createdByUserId: userId,
      assignedToUserId: input.assignedToUserId ?? userId,
    });

    return {
      task,
      wasExistingPeriodTask: false,
    };
  }

  const period = normalizeTaskPeriod(kind, input);

  const existing = await findActivePeriodTaskRepo(db, {
    kind,
    periodType: period.periodType!,
    periodKey: period.periodKey!,
  });

  if (existing) {
    return {
      task: existing,
      wasExistingPeriodTask: true,
    };
  }

  const task = await createTaskRepo(db, {
    ...input,
    title: buildPeriodTaskTitle(kind, period.periodKey!),
    description: input.description?.trim() || null,
    kind,
    ...period,
    source: input.source ?? "MANUAL",
    createdByUserId: userId,
    assignedToUserId:
      kind === TaskKind.PERSONAL ? userId : input.assignedToUserId ?? userId,
    priority: "MEDIUM",
    dueAt: null,
  });

  return {
    task,
    wasExistingPeriodTask: false,
  };
}
export async function quickCreateTaskItem(
  db: DB,
  input: {
    kind: TaskKind;
    title: string;
    assignedToUserId?: string | null;
    priority?: TaskPriority;
    dueAt?: Date | string | null;
  },
  auth: unknown,
) {
  const title = String(input.title ?? "").trim();
  if (!title) throw new Error("Vui long nhap tieu de task item");

  const taskResult = await createTask(
    db,
    {
      kind: input.kind,
      title,
      assignedToUserId: input.assignedToUserId ?? null,
    },
    auth,
  );

  const item = await createTaskItemRepo(db, {
    taskId: taskResult.task.id,
    title,
    assignedToUserId: input.assignedToUserId ?? null,
    priority: input.priority,
    dueAt: input.dueAt ?? null,
  });

  return {
    task: taskResult.task,
    item,
    wasExistingPeriodTask: taskResult.wasExistingPeriodTask,
  };
}

export async function ensureSystemTask(db: DB, input: EnsureSystemTaskInput) {
  if (!input.title?.trim()) throw new Error("System task thiếu tiêu đề");
  return ensureSystemTaskRepo(db, input);
}

export async function updateTask(db: DB, id: string, input: UpdateTaskInput, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  await assertCanAccessTask(db, id, auth);

  if (input.title !== undefined && !input.title.trim()) {
    throw new Error("Vui lòng nhập tiêu đề task");
  }

  const nextInput = { ...input };

  if (nextInput.kind) {
    Object.assign(nextInput, normalizeTaskPeriod(nextInput.kind, nextInput));
  }

  if (nextInput.kind === TaskKind.PERSONAL) {
    nextInput.assignedToUserId = userId;
  }

  return updateTaskRepo(db, id, nextInput);
}

export async function changeTaskStatus(
  db: DB,
  id: string,
  status: TaskStatus,
  auth: any,
) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  await assertCanAccessTask(db, id, auth);

  return setTaskStatusRepo(db, {
    id,
    status,
    actorUserId: userId,
  });
}

export async function completeRelatedTasks(db: DB, input: CompleteRelatedTasksInput) {
  return completeRelatedTasksRepo(db, input);
}

export async function safeCompleteRelatedTasks(db: DB, input: CompleteRelatedTasksInput) {
  try {
    return await completeRelatedTasksRepo(db, input);
  } catch (error) {
    console.error("[task] safeCompleteRelatedTasks failed", error);
    return { count: 0 };
  }
}

export async function safeEnsureSystemTask(db: DB, input: EnsureSystemTaskInput) {
  try {
    return await ensureSystemTaskRepo(db, input);
  } catch (error) {
    console.error("[task] safeEnsureSystemTask failed", error);
    return null;
  }
}

export async function completeTaskForPaymentIfSettled(
  db: DB,
  input: { paymentId: string; completedByUserId?: string | null },
) {
  return completeRelatedTasksRepo(db, {
    paymentId: input.paymentId,
    completedByUserId: input.completedByUserId,
  });
}

export async function findOpenRelatedTasks(db: DB, input: FindOpenRelatedTasksInput) {
  return findOpenRelatedTasksRepo(db, input);
}

export async function completeTasksByIds(db: DB, ids: string[], auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const uniqueIds = Array.from(
    new Set(ids.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );

  if (!uniqueIds.length) return { count: 0 };

  for (const id of uniqueIds) {
    await assertCanAccessTask(db, id, auth);
  }

  return db.task.updateMany({
    where: {
      id: { in: uniqueIds },
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    },
    data: {
      status: TaskStatus.DONE,
      completedAt: new Date(),
      completedByUserId: userId,
      cancelledAt: null,
      cancelledByUserId: null,
    },
  });
}

export async function getTaskQuickCreateData(db: DB, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const users = await listAssignableUsersRepo(db);

  return {
    users,
    currentUserId: userId,
  };
}
