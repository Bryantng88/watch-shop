"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { linkTaskExecution, listTaskExecutions } from "../server/task-execution.service";
import type { LinkTaskExecutionInput } from "../server/task-execution.types";

async function getTaskAuth() {
  return requirePermission("TASK_VIEW");
}

export async function listTaskExecutionsAction(taskId: string) {
  const auth = await getTaskAuth();
  const items = await listTaskExecutions(prisma, taskId, auth);
  return { ok: true, items };
}

export async function linkTaskExecutionAction(input: LinkTaskExecutionInput) {
  const auth = await getTaskAuth();
  const execution = await linkTaskExecution(prisma, input, auth);
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${input.taskId}`);
  return { ok: true, execution };
}
