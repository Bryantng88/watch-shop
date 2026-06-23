"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import {
  executeTaskAction,
  previewTaskAction,
} from "../server/task-action-execution.service";

type ExecuteTaskActionActionInput = {
  taskId: string;
  taskItemId?: string | null;
  serviceMode?: "SR_ONLY" | "SR_WITH_TECHNICAL_ISSUE";
};

export async function previewTaskActionAction(taskId: string) {
  const auth = await requirePermission("TASK_UPDATE");
  const result = await previewTaskAction(prisma, { taskId }, auth);
  return serialize(result);
}

export async function executeTaskActionAction(
  inputOrTaskId: string | ExecuteTaskActionActionInput,
  serviceMode?: "SR_ONLY" | "SR_WITH_TECHNICAL_ISSUE",
) {
  const auth = await requirePermission("TASK_UPDATE");

  const input =
    typeof inputOrTaskId === "string"
      ? {
        taskId: inputOrTaskId,
        serviceMode,
        taskItemId: null,
      }
      : {
        taskId: inputOrTaskId.taskId,
        serviceMode: inputOrTaskId.serviceMode,
        taskItemId: inputOrTaskId.taskItemId ?? null,
      };

  const result = await executeTaskAction(
    prisma,
    input,
    auth,
  );

  revalidatePath(`/admin/tasks/${input.taskId}`);
  revalidatePath("/admin/tasks");

  if (result.serviceRequest?.id) {
    revalidatePath(`/admin/services/${result.serviceRequest.id}`);
  }

  revalidatePath("/admin/services");

  return serialize(result);
}

function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, item) => {
      if (item instanceof Date) return item.toISOString();
      if (typeof item === "object" && item?._isDecimal) return Number(item);
      return item;
    }),
  );
}

export async function deleteTaskExecutionAction(input: {
  executionId: string;
}) {
  await requirePermission("TASK_UPDATE");

  const executionId = String(input.executionId || "").trim();
  if (!executionId) throw new Error("Missing executionId");

  const execution = await prisma.taskExecution.findUnique({
    where: { id: executionId },
    select: {
      id: true,
      taskId: true,
      taskItemId: true,
    },
  });

  if (!execution) throw new Error("Không tìm thấy link nghiệp vụ.");

  await prisma.taskExecution.delete({
    where: { id: execution.id },
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${execution.taskId}`);

  return { ok: true };
}
export async function moveTaskExecutionAction(input: {
  executionId: string;
  toTaskItemId: string;
}) {
  await requirePermission("TASK_UPDATE");

  const executionId = String(input.executionId || "").trim();
  const toTaskItemId = String(input.toTaskItemId || "").trim();

  if (!executionId) throw new Error("Missing executionId");
  if (!toTaskItemId) throw new Error("Missing toTaskItemId");

  const execution = await prisma.taskExecution.findUnique({
    where: { id: executionId },
    select: {
      id: true,
      taskId: true,
      taskItemId: true,
      targetType: true,
    },
  });

  if (!execution) throw new Error("Không tìm thấy link nghiệp vụ.");

  const targetItem = await prisma.taskItem.findUnique({
    where: { id: toTaskItemId },
    select: {
      id: true,
      taskId: true,
      executions: {
        select: {
          id: true,
          targetType: true,
        },
      },
    },
  });

  if (!targetItem) throw new Error("Không tìm thấy subtask nhận link.");

  if (targetItem.taskId !== execution.taskId) {
    throw new Error("Chỉ được chuyển link trong cùng task mẹ.");
  }

  const existingType = targetItem.executions?.[0]?.targetType;

  if (existingType && existingType !== execution.targetType) {
    throw new Error("Subtask nhận đã có loại nghiệp vụ khác.");
  }

  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: {
      taskItemId: targetItem.id,
    },
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${execution.taskId}`);

  return { ok: true };
}