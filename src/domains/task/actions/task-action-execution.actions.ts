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
  checklistItemId?: string | null;
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
        checklistItemId: null,
      }
      : {
        taskId: inputOrTaskId.taskId,
        serviceMode: inputOrTaskId.serviceMode,
        checklistItemId: inputOrTaskId.checklistItemId ?? null,
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