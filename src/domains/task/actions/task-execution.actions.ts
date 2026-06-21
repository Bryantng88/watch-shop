"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { linkTaskExecution, listTaskExecutions } from "../server/task-execution.service";
import type { LinkTaskExecutionInput } from "../server/task-execution.types";
import { TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";
async function getTaskAuth() {
  return requirePermission("TASK_VIEW");
}

export async function listTaskExecutionsAction(taskId: string) {
  const auth = await getTaskAuth();
  const items = await listTaskExecutions(prisma, taskId, auth);
  return { ok: true, items };
}

export async function linkTaskExecutionAction(input: {
  taskId: string;
  checklistItemId?: string | null;
  targetType: TaskExecutionTargetType;
  targetId: string;
  note?: string | null;
}) {
  const auth = await requirePermission("TASK_VIEW");

  const taskId = String(input.taskId || "").trim();
  const targetId = String(input.targetId || "").trim();

  if (!taskId) throw new Error("Missing taskId");
  if (!targetId) throw new Error("Missing targetId");

  const execution = await prisma.taskExecution.create({
    data: {
      taskId,
      checklistItemId: input.checklistItemId || null,
      targetType: input.targetType,
      targetId,
      actionType: TaskExecutionActionType.LINKED,
      note: input.note || null,
      createdByUserId: auth?.user?.id ?? auth?.id ?? auth?.userId ?? null,
    },
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${taskId}`);

  return { ok: true, execution };
}