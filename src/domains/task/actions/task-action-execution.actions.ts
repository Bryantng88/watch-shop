"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { executeTaskAction } from "../server/task-action-execution.service";

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, item) => {
    if (item instanceof Date) return item.toISOString();
    if (typeof item === "object" && item?._isDecimal) return Number(item);
    return item;
  }));
}

export async function executeTaskActionAction(taskId: string) {
  const auth = await requirePermission("TASK_UPDATE");
  const result = await executeTaskAction(prisma, { taskId }, auth);

  revalidatePath(`/admin/tasks/${taskId}`);
  revalidatePath("/admin/tasks");
  if (result.serviceRequest?.id) revalidatePath(`/admin/services/${result.serviceRequest.id}`);
  revalidatePath("/admin/services");

  return serialize(result);
}
