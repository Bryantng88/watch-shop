"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import {
  changeTaskStatus,
  completeTasksByIds,
  createTask,
  findOpenRelatedTasks,
  getTaskDetail,
  getTaskQuickCreateData,
  updateTask,
} from "../server/task.service";
import type {
  CreateTaskChecklistItemInput,
  CreateTaskInput,
  FindOpenRelatedTasksInput,
  UpdateTaskChecklistItemInput,
  UpdateTaskInput,
} from "../server/task.types";
import {
  createTaskChecklistItemRepo,
  deleteTaskChecklistItemRepo,
  setTaskChecklistItemDoneRepo,
  syncTaskStatusFromChecklistRepo,
  updateTaskChecklistItemRepo,
} from "../server/task.repo";

async function getTaskAuth() {
  return requirePermission("TASK_VIEW");
}

export async function getTaskQuickCreateDataAction() {
  const auth = await getTaskAuth();
  return getTaskQuickCreateData(prisma, auth);
}

export async function getTaskDetailAction(id: string) {
  const auth = await getTaskAuth();
  const task = await getTaskDetail(prisma, id, auth);
  return { ok: true, task };
}

export async function createTaskAction(input: CreateTaskInput) {
  const auth = await getTaskAuth();
  const task = await createTask(prisma, input, auth);
  revalidatePath("/admin/tasks");
  return { ok: true, task };
}

export async function updateTaskAction(id: string, input: UpdateTaskInput) {
  const auth = await getTaskAuth();
  const task = await updateTask(prisma, id, input, auth);
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${id}`);
  return { ok: true, task };
}

export async function changeTaskStatusAction(id: string, status: TaskStatus) {
  const auth = await getTaskAuth();
  const task = await changeTaskStatus(prisma, id, status, auth);
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${id}`);
  return { ok: true, task };
}

export async function findOpenRelatedTasksAction(input: FindOpenRelatedTasksInput) {
  await getTaskAuth();
  const items = await findOpenRelatedTasks(prisma, input);
  return { ok: true, items };
}

export async function completeTasksByIdsAction(ids: string[]) {
  const auth = await getTaskAuth();
  const result = await completeTasksByIds(prisma, ids, auth);
  revalidatePath("/admin/tasks");
  return { ok: true, count: result.count };
}

export async function createTaskChecklistItemAction(input: {
  taskId: string;
  title: string;
  assignedToUserId?: string | null;
  priority?: TaskPriority | null;
  dueAt?: string | null;
}) {
  await getTaskAuth();

  const cleanTaskId = String(input?.taskId || "").trim();
  const cleanTitle = String(input?.title || "").trim();

  if (!cleanTaskId) throw new Error("Missing taskId");
  if (!cleanTitle) throw new Error("Vui lòng nhập nội dung subtask.");

  const item = await createTaskChecklistItemRepo(prisma, {
    taskId: cleanTaskId,
    title: cleanTitle,
    assignedToUserId: input.assignedToUserId || null,
    priority: input.priority || "MEDIUM",
    dueAt: input.dueAt || null,
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${cleanTaskId}`);

  return { ok: true, item };
}
// Backward-compatible alias if old UI still calls createTaskChecklistItemAction(taskId, title).
export async function createTaskChecklistItemLegacyAction(taskId: string, title: string) {
  return createTaskChecklistItemAction({ taskId, title });
}

export async function updateTaskChecklistItemAction(
  itemId: string,
  input: UpdateTaskChecklistItemInput,
) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await updateTaskChecklistItemRepo(prisma, cleanItemId, input);
  await syncTaskStatusFromChecklistRepo(prisma, item.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${item.taskId}`);

  return { ok: true, item };
}

export async function changeTaskChecklistItemStatusAction(
  itemId: string,
  status: TaskStatus,
) {
  return updateTaskChecklistItemAction(itemId, { status });
}

export async function changeTaskChecklistItemDoneAction(
  itemId: string,
  isDone: boolean,
) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await setTaskChecklistItemDoneRepo(prisma, {
    itemId: cleanItemId,
    isDone,
  });

  await syncTaskStatusFromChecklistRepo(prisma, item.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${item.taskId}`);

  return { ok: true, item };
}

export async function deleteTaskChecklistItemAction(itemId: string) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const taskItem = await prisma.taskChecklistItem.findUnique({
    where: { id: cleanItemId },
    select: { taskId: true },
  });

  const item = await deleteTaskChecklistItemRepo(prisma, cleanItemId);

  if (taskItem?.taskId) {
    await syncTaskStatusFromChecklistRepo(prisma, taskItem.taskId);
    revalidatePath(`/admin/tasks/${taskItem.taskId}`);
  }

  revalidatePath("/admin/tasks");

  return { ok: true, item };
}
