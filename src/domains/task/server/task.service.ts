import { TaskStatus } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { getActiveTaskTypeOptions } from "./task-type.service";
import { getTaskTypeByIdRepo } from "./task-type.repo";
import {
  changeTaskStatusRepo,
  completeRelatedTasksRepo,
  completeTasksByIdsRepo,
  countTaskViewsRepo,
  createTaskRepo,
  findOpenRelatedTasksRepo,
  getTaskByIdRepo,
  listAssignableUsersRepo,
  listTasksRepo,
  setTaskStatusRepo,
  updateTaskRepo,
} from "./task.repo";
import type {
  CompleteRelatedTasksInput,
  CreateTaskInput,
  FindOpenRelatedTasksInput,
  TaskListFilters,
  UpdateTaskInput,
} from "./task.types";

export function getAuthUserId(auth: any): string | null {
  return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export function authCanViewAllTasks(auth: any): boolean {
  const roleName = String(auth?.user?.role?.name ?? auth?.role?.name ?? auth?.roleName ?? "").toUpperCase();
  const permissions = auth?.permissions ?? auth?.user?.permissions ?? auth?.role?.permissions ?? [];
  return roleName === "ADMIN" || (Array.isArray(permissions) && (permissions.includes("TASK_VIEW_ALL") || permissions.includes("task:view_all")));
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
  const [list, counts, users, taskTypes] = await Promise.all([
    listTasksRepo(db, { userId, canViewAll, filters: input.filters }),
    countTaskViewsRepo(db, { userId, canViewAll }),
    listAssignableUsersRepo(db),
    getActiveTaskTypeOptions(db),
  ]);

  return { ...list, counts, users, taskTypes, currentUserId: userId, canViewAll };
}

export async function getTaskQuickCreateData(db: DB, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const [users, taskTypes] = await Promise.all([
    listAssignableUsersRepo(db),
    getActiveTaskTypeOptions(db),
  ]);

  return { users, taskTypes, currentUserId: userId };
}

export async function createTask(db: DB, input: CreateTaskInput, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  if (!input.title?.trim()) throw new Error("Vui lòng nhập tiêu đề task");

  let nextInput = { ...input };

  if (input.taskTypeId) {
    const taskType = await getTaskTypeByIdRepo(db, input.taskTypeId);
    if (!taskType) throw new Error("Loại task không hợp lệ");
    if (!taskType.isActive) throw new Error("Loại task này đang tắt");
    nextInput = {
      ...nextInput,
      kind: input.kind ?? taskType.legacyKind,
      priority: input.priority ?? taskType.defaultPriority,
    };
  }

  return createTaskRepo(db, {
    ...nextInput,
    source: input.source ?? "MANUAL",
    createdByUserId: userId,
    assignedToUserId: input.assignedToUserId ?? userId,
  });
}

export async function updateTask(db: DB, id: string, input: UpdateTaskInput, auth: any) {
  await assertCanAccessTask(db, id, auth);
  if (input.title !== undefined && !input.title.trim()) throw new Error("Vui lòng nhập tiêu đề task");

  let nextInput = { ...input };

  if (input.taskTypeId) {
    const taskType = await getTaskTypeByIdRepo(db, input.taskTypeId);
    if (!taskType) throw new Error("Loại task không hợp lệ");
    nextInput = {
      ...nextInput,
      kind: input.kind ?? taskType.legacyKind,
      priority: input.priority ?? taskType.defaultPriority,
    };
  }

  return updateTaskRepo(db, id, nextInput);
}

export async function changeTaskStatus(db: DB, id: string, status: TaskStatus, auth: any) {
  const userId = getAuthUserId(auth);
  await assertCanAccessTask(db, id, auth);
  return setTaskStatusRepo(db, { id, status, actorUserId: userId });
}

export async function findOpenRelatedTasks(db: DB, input: FindOpenRelatedTasksInput) {
  return findOpenRelatedTasksRepo(db, input);
}

export async function completeTasksByIds(db: DB, ids: string[], auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  // Keep permission simple in phase 1: anyone with TASK_VIEW can complete selected related tasks.
  // Row-level access can be tightened later if needed.
  return completeTasksByIdsRepo(db, { ids, completedByUserId: userId });
}

export async function completeRelatedTasks(db: DB, input: CompleteRelatedTasksInput) {
  // Best-effort helper for business domains. If no task matches, count = 0.
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
