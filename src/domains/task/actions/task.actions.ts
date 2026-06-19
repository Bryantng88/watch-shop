"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import {
  changeTaskStatus,
  completeTasksByIds,
  createTask,
  findOpenRelatedTasks,
  getTaskQuickCreateData,
  getTaskDetail,
  updateTask,
} from "../server/task.service";
import type { CreateTaskInput, FindOpenRelatedTasksInput, UpdateTaskInput } from "../server/task.types";
import {
  createTaskChecklistItemRepo,
  setTaskChecklistItemDoneRepo,
  deleteTaskChecklistItemRepo,
} from "../server/task.repo";
async function getTaskAuth() {
  // Replace by a dedicated permission later if you add TASK_VIEW/TASK_MANAGE.
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
  return { ok: true, task };
}

export async function changeTaskStatusAction(id: string, status: TaskStatus) {
  const auth = await getTaskAuth();
  const task = await changeTaskStatus(prisma, id, status, auth);
  revalidatePath("/admin/tasks");
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

export async function createTaskChecklistItemAction(taskId: string, title: string) {
  await getTaskAuth();

  const cleanTaskId = String(taskId || "").trim();
  const cleanTitle = String(title || "").trim();

  if (!cleanTaskId) throw new Error("Missing taskId");
  if (!cleanTitle) throw new Error("Vui lòng nhập nội dung dòng xử lý.");

  const item = await createTaskChecklistItemRepo(prisma, {
    taskId: cleanTaskId,
    title: cleanTitle,
  });

  revalidatePath("/admin/tasks");

  return { ok: true, item };
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

  revalidatePath("/admin/tasks");

  return { ok: true, item };
}

export async function deleteTaskChecklistItemAction(itemId: string) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await deleteTaskChecklistItemRepo(prisma, cleanItemId);

  revalidatePath("/admin/tasks");

  return { ok: true, item };
}

export async function createWorkCaseFeedbackFromTaskAction(input: {
  taskId: string;
  note: string;
  requestNewTask?: boolean;
}) {
  const auth = await getTaskAuth();
  const cleanTaskId = String(input.taskId || "").trim();
  const cleanNote = String(input.note || "").trim();

  if (!cleanTaskId) throw new Error("Missing taskId");
  if (!cleanNote) throw new Error("Vui lòng nhập nội dung feedback.");

  const task = await getTaskDetail(prisma, cleanTaskId, auth);
  if (!task.workCaseId) {
    throw new Error("Task này không thuộc phiếu xử lý nào.");
  }

  const actorId = (auth as any)?.user?.id ?? (auth as any)?.id ?? (auth as any)?.userId ?? null;

  const activity = await prisma.workCaseActivity.create({
    data: {
      workCaseId: task.workCaseId,
      actorId,
      action: input.requestNewTask ? "TASK_REQUEST" : "TASK_FEEDBACK",
      note: cleanNote,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        requestNewTask: Boolean(input.requestNewTask),
      },
    },
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${task.id}`);
  revalidatePath("/admin/work-cases");
  revalidatePath(`/admin/work-cases/${task.workCaseId}`);

  return { ok: true, activity };
}
