"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { changeTaskStatus, createTask, updateTask } from "../server/task.service";
import { syncPaymentTask, syncShipmentTask, syncTechnicalIssueTask, syncWatchContentAndImageTasks } from "../server/task.system";
import type { CreateTaskInput, UpdateTaskInput } from "../server/task.types";

async function getTaskAuth() {
  return requirePermission("TASK_VIEW");
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

export async function syncTaskForWatchAction(watchId: string) {
  const auth: any = await getTaskAuth();
  const actorUserId = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
  await syncWatchContentAndImageTasks(prisma, { watchId, actorUserId });
  revalidatePath("/admin/tasks");
  return { ok: true };
}

export async function syncTaskForPaymentAction(paymentId: string) {
  const auth: any = await getTaskAuth();
  const actorUserId = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
  await syncPaymentTask(prisma, { paymentId, actorUserId });
  revalidatePath("/admin/tasks");
  return { ok: true };
}

export async function syncTaskForShipmentAction(shipmentId: string) {
  const auth: any = await getTaskAuth();
  const actorUserId = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
  await syncShipmentTask(prisma, { shipmentId, actorUserId });
  revalidatePath("/admin/tasks");
  return { ok: true };
}

export async function syncTaskForTechnicalIssueAction(technicalIssueId: string) {
  const auth: any = await getTaskAuth();
  const actorUserId = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
  await syncTechnicalIssueTask(prisma, { technicalIssueId, actorUserId });
  revalidatePath("/admin/tasks");
  return { ok: true };
}
