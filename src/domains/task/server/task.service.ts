import { TaskDomain, TaskStatus } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { listActiveTaskTypesRepo } from "./task-type.repo";
import {
  completeRelatedTasksRepo,
  countTaskDueBucketsRepo,
  countTaskViewsRepo,
  createTaskRepo,
  ensureSystemTaskRepo,
  getTaskByIdRepo,
  listAssignableUsersRepo,
  listTasksRepo,
  setTaskStatusRepo,
  updateTaskRepo,
  findOpenRelatedTasksRepo,
} from "./task.repo";
import type { FindOpenRelatedTasksInput, CompleteRelatedTasksInput, CreateTaskInput, EnsureSystemTaskInput, TaskListFilters, UpdateTaskInput } from "./task.types";

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
    ""
  ).toUpperCase();

  const permissions =
    auth?.permissions ??
    auth?.user?.permissions ??
    auth?.role?.permissions ??
    [];

  return (
    roleName === "ADMIN" ||
    (
      Array.isArray(permissions) &&
      permissions.includes("TASK_VIEW_ALL")
    )
  );
}
function assertUser(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("Không xác định được user hiện tại");
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

export async function getTaskListPageData(db: DB, input: { auth: any; filters: TaskListFilters }) {
  const userId = getAuthUserId(input.auth);
  assertUser(userId);

  const canViewAll = authCanViewAllTasks(input.auth);
  const view = input.filters.view || "mine";
  const [list, counts, dueCounts, users, taskTypes] = await Promise.all([
    listTasksRepo(db, { userId, canViewAll, filters: input.filters }),
    countTaskViewsRepo(db, { userId, canViewAll }),
    countTaskDueBucketsRepo(db, { userId, canViewAll, view }),
    listAssignableUsersRepo(db),
    listActiveTaskTypesRepo(db),
  ]);

  return { ...list, counts, dueCounts, users, taskTypes, currentUserId: userId, canViewAll };
}


export async function getTaskDetail(db: DB, id: string, auth: any) {
  return assertCanAccessTask(db, id, auth);
}

export async function createTask(db: DB, input: CreateTaskInput, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);
  if (!input.title?.trim()) throw new Error("Vui lòng nhập tiêu đề task");

  return createTaskRepo(db, {
    ...input,
    source: input.source ?? "MANUAL",
    createdByUserId: userId,
    assignedToUserId: input.assignedToUserId ?? userId,
  });
}

export async function ensureSystemTask(db: DB, input: EnsureSystemTaskInput) {
  if (!input.title?.trim()) throw new Error("System task thiếu tiêu đề");
  return ensureSystemTaskRepo(db, input);
}

export async function updateTask(db: DB, id: string, input: UpdateTaskInput, auth: any) {
  await assertCanAccessTask(db, id, auth);
  if (input.title !== undefined && !input.title.trim()) throw new Error("Vui lòng nhập tiêu đề task");
  return updateTaskRepo(db, id, input);
}

export async function changeTaskStatus(db: DB, id: string, status: TaskStatus, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);
  await assertCanAccessTask(db, id, auth);
  const task = await setTaskStatusRepo(db, { id, status, actorUserId: userId });

  if (status === TaskStatus.DONE || status === TaskStatus.CANCELLED) {
    //await markTaskNotificationsAsRead({ taskId: id, userId });
  }

  return task;
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

export async function completeTaskForPaymentIfSettled(db: DB, input: { paymentId: string; completedByUserId?: string | null }) {
  return completeRelatedTasksRepo(db, { domain: TaskDomain.PAYMENT, paymentId: input.paymentId, completedByUserId: input.completedByUserId });
}
export async function findOpenRelatedTasks(
  db: DB,
  input: FindOpenRelatedTasksInput,
) {
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

  const [users, taskTypes] = await Promise.all([
    listAssignableUsersRepo(db),
    listActiveTaskTypesRepo(db),
  ]);

  return {
    users,
    taskTypes,
    currentUserId: userId,
  };
}