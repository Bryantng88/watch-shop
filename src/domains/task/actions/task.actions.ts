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
  updateTask,
} from "../server/task.service";
import type { CreateTaskInput, FindOpenRelatedTasksInput, UpdateTaskInput } from "../server/task.types";

async function getTaskAuth() {
  // Replace by a dedicated permission later if you add TASK_VIEW/TASK_MANAGE.
  return requirePermission("TASK_VIEW");
}

export async function getTaskQuickCreateDataAction() {
  const auth = await getTaskAuth();
  return getTaskQuickCreateData(prisma, auth);
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
