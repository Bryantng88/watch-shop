"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { createTaskAction, updateTaskAction } from "../server/action/task-action.service";
import type { UpsertTaskActionInput } from "../server/action/task-action.types";

export async function createTaskActionSettingAction(input: UpsertTaskActionInput) {
  await requirePermission("TASK_MANAGE");
  const item = await createTaskAction(prisma, input);
  revalidatePath("/admin/tasks/settings");
  return { ok: true, item };
}

export async function updateTaskActionSettingAction(id: string, input: Partial<UpsertTaskActionInput>) {
  await requirePermission("TASK_MANAGE");
  const item = await updateTaskAction(prisma, id, input);
  revalidatePath("/admin/tasks/settings");
  return { ok: true, item };
}
