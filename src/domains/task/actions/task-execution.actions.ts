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
  metadataJson?: any;
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
      metadataJson: input.metadataJson ?? null,
      createdByUserId: auth?.user?.id ?? auth?.id ?? auth?.userId ?? null,
    } as any,
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${taskId}`);

  return { ok: true, execution };
}
export async function linkTaskExecutionsAction(input: {
  taskId: string;
  checklistItemId?: string | null;
  targetType: TaskExecutionTargetType;
  targetIds: string[];
  note?: string | null;
  metadataJson?: any;
}) {
  const auth = await requirePermission("TASK_VIEW");

  const taskId = String(input.taskId || "").trim();
  const targetIds = Array.from(
    new Set(
      (input.targetIds ?? [])
        .map((id) => String(id || "").trim())
        .filter(Boolean),
    ),
  );

  if (!taskId) throw new Error("Missing taskId");
  if (!targetIds.length) throw new Error("Missing targetIds");

  const checklistItemId = input.checklistItemId || null;
  const createdByUserId = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;

  const existing = await prisma.taskExecution.findMany({
    where: {
      taskId,
      checklistItemId,
      targetType: input.targetType,
      targetId: { in: targetIds },
      actionType: TaskExecutionActionType.LINKED,
    },
    select: {
      targetId: true,
    },
  });

  const existingIds = new Set(existing.map((item) => item.targetId));
  const nextTargetIds = targetIds.filter((id) => !existingIds.has(id));

  if (!nextTargetIds.length) {
    return {
      ok: true,
      count: 0,
      skipped: targetIds.length,
    };
  }

  const executions = await prisma.$transaction(
    nextTargetIds.map((targetId) =>
      prisma.taskExecution.create({
        data: {
          taskId,
          checklistItemId,
          targetType: input.targetType,
          targetId,
          actionType: TaskExecutionActionType.LINKED,
          note: input.note || null,
          metadataJson: input.metadataJson ?? null,
          createdByUserId,
        } as any,
      }),
    ),
  );

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${taskId}`);

  return {
    ok: true,
    count: executions.length,
    skipped: targetIds.length - executions.length,
    executions,
  };
}