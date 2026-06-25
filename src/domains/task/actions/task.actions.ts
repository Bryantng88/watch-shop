"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus, TaskPriority, TaskKind } from "@prisma/client";
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
  quickCreateTaskItem
} from "../server/core/task.service";
import type {
  CreateTaskItemInput,
  CreateTaskInput,
  FindOpenRelatedTasksInput,
  UpdateTaskItemInput,
  UpdateTaskInput,
} from "../server/task.types";
import {
  createTaskItemRepo,
  deleteTaskItemRepo,
  setTaskItemDoneRepo,
  syncTaskStatusFromChecklistRepo,
  updateTaskItemRepo,
  createTaskItemChecklistRepo,
  updateTaskItemChecklistRepo,
  deleteTaskItemChecklistRepo,
  syncTaskItemStatusFromChecklistRepo,

} from "../server/core/task.repo";

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

  const result = await createTask(prisma, input, auth);

  revalidatePath("/admin/tasks");

  return {
    ok: true,
    task: result.task,
    wasExistingPeriodTask: result.wasExistingPeriodTask,
  };
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

export async function findOpenRelatedTasksAction(
  input: FindOpenRelatedTasksInput,
) {
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

export async function createTaskItemAction(input: {
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

  const item = await createTaskItemRepo(prisma, {
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
// Backward-compatible alias if old UI still calls createTaskItemAction(taskId, title).
export async function createTaskItemLegacyAction(
  taskId: string,
  title: string,
) {
  return createTaskItemAction({ taskId, title });
}

export async function updateTaskItemAction(
  itemId: string,
  input: UpdateTaskItemInput,
) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await updateTaskItemRepo(prisma, cleanItemId, input);
  await syncTaskStatusFromChecklistRepo(prisma, item.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${item.taskId}`);

  return { ok: true, item };
}

export async function changeTaskItemStatusAction(
  itemId: string,
  status: TaskStatus,
) {
  return updateTaskItemAction(itemId, { status });
}

export async function changeTaskItemDoneAction(
  itemId: string,
  isDone: boolean,
) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await setTaskItemDoneRepo(prisma, {
    itemId: cleanItemId,
    isDone,
  });

  await syncTaskStatusFromChecklistRepo(prisma, item.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${item.taskId}`);

  return { ok: true, item };
}

export async function deleteTaskItemAction(itemId: string) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const taskItem = await prisma.taskItem.findUnique({
    where: { id: cleanItemId },
    select: { taskId: true },
  });

  const item = await deleteTaskItemRepo(prisma, cleanItemId);

  if (taskItem?.taskId) {
    await syncTaskStatusFromChecklistRepo(prisma, taskItem.taskId);
    revalidatePath(`/admin/tasks/${taskItem.taskId}`);
  }

  revalidatePath("/admin/tasks");

  return { ok: true, item };
}

export async function createTaskItemChecklistAction(input: {
  taskItemId: string;
  title: string;
  note?: string | null;
}) {
  await getTaskAuth();

  const taskItemId = String(input.taskItemId || "").trim();
  const title = String(input.title || "").trim();

  if (!taskItemId) throw new Error("Missing taskItemId");
  if (!title) throw new Error("Vui lòng nhập checklist.");

  const checklist = await createTaskItemChecklistRepo(prisma, {
    taskItemId,
    title,
    note: input.note || null,
  });

  return { ok: true, checklist };
}

export async function changeTaskItemChecklistDoneAction(
  checklistId: string,
  isDone: boolean,
) {
  const auth = await getTaskAuth();

  const cleanId = String(checklistId || "").trim();
  if (!cleanId) throw new Error("Missing checklist id");

  const row = await prisma.taskItemChecklist.findUnique({
    where: { id: cleanId },
    select: { taskItemId: true, taskItem: { select: { taskId: true } } },
  });

  if (!row) throw new Error("Checklist không tồn tại.");

  const checklist = await updateTaskItemChecklistRepo(prisma, cleanId, {
    isDone,
    actorUserId: auth.userId,
  });

  await syncTaskItemStatusFromChecklistRepo(
    prisma,
    row.taskItemId,
    auth.userId,
  );
  await syncTaskStatusFromChecklistRepo(prisma, row.taskItem.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${row.taskItem.taskId}`);

  return { ok: true, checklist };
}

export async function deleteTaskItemChecklistAction(checklistId: string) {
  await getTaskAuth();

  const cleanId = String(checklistId || "").trim();
  if (!cleanId) throw new Error("Missing checklist id");

  const existing = await prisma.taskItemChecklist.findUnique({
    where: { id: cleanId },
    select: { id: true },
  });

  if (!existing) {
    return { ok: true, checklist: null, alreadyDeleted: true };
  }

  const checklist = await deleteTaskItemChecklistRepo(prisma, cleanId);

  return { ok: true, checklist, alreadyDeleted: false };
}
export async function quickCreateTaskItemAction(
  input: {
    kind: TaskKind;
    title: string;

    assignedToUserId?: string | null;
    priority?: TaskPriority;
    dueAt?: string | null;
  },
) {
  const auth = await getTaskAuth();

  const result = await quickCreateTaskItem(
    prisma,
    input,
    auth,
  );

  revalidatePath("/admin/tasks");

  return {
    ok: true,
    ...result,
  };
}
export async function updateTaskItemChecklistTitleAction(
  checklistId: string,
  title: string,
) {
  await getTaskAuth();

  const cleanId = String(checklistId || "").trim();
  const cleanTitle = String(title || "").trim();

  if (!cleanId) throw new Error("Missing checklist id");
  if (!cleanTitle) throw new Error("Vui lòng nhập nội dung checklist.");

  const checklist = await updateTaskItemChecklistRepo(prisma, cleanId, {
    title: cleanTitle,
  });

  return {
    ok: true,
    checklist,
  };
}