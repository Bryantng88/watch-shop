"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { createTaskType, updateTaskType } from "../server/task-type.service";
import type { UpsertTaskTypeInput } from "../server/task-type.types";

async function getTaskSettingsAuth() {
  // Nếu sau này bạn tách quyền, đổi thành TASK_SETTINGS_MANAGE.
  return requirePermission("TASK_VIEW");
}

export async function createTaskTypeAction(input: UpsertTaskTypeInput) {
  await getTaskSettingsAuth();
  const item = await createTaskType(prisma, input);
  revalidatePath("/admin/tasks/settings");
  revalidatePath("/admin/tasks");
  return { ok: true, item };
}

export async function updateTaskTypeAction(id: string, input: Partial<UpsertTaskTypeInput>) {
  await getTaskSettingsAuth();
  const item = await updateTaskType(prisma, id, input);
  revalidatePath("/admin/tasks/settings");
  revalidatePath("/admin/tasks");
  return { ok: true, item };
}
