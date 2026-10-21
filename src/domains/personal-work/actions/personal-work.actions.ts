"use server";

import { revalidatePath } from "next/cache";
import { TaskStatus, type TaskPriority } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAuthUserId } from "@/domains/task/server/core/task.service";
import { createPersonalWorkItem, updatePersonalWorkItem } from "../server/personal-work.service";
import { googleCalendarAuthorizationUrl, syncPersonalTaskToGoogle } from "../server/google-calendar.service";
import type { PersonalWorkDomain } from "../shared/personal-work.types";

async function auth() { return requirePermission(PERMISSIONS.TASK_VIEW); }
function refresh() { revalidatePath("/admin/personal-work"); revalidatePath("/admin/dashboard"); }

export async function createPersonalWorkAction(input: { title: string; note?: string | null; dueAt?: string | null; priority?: TaskPriority; domain?: PersonalWorkDomain; tags?: string[] }) {
  await createPersonalWorkItem(input, await auth());
  refresh();
  return { ok: true };
}

export async function updatePersonalWorkAction(input: { id: string; title?: string; note?: string | null; dueAt?: string | null; priority?: TaskPriority; status?: TaskStatus; domain?: PersonalWorkDomain; tags?: string[] }) {
  await updatePersonalWorkItem(input, await auth());
  refresh();
  return { ok: true };
}

export async function getGoogleCalendarConnectUrlAction() {
  const user = await auth();
  const userId = getAuthUserId(user);
  if (!userId) throw new Error("Không xác định được người dùng");
  return { ok: true, url: googleCalendarAuthorizationUrl(userId) };
}

export async function syncPersonalWorkCalendarAction(taskItemId: string) {
  const user = await auth();
  const userId = getAuthUserId(user);
  if (!userId) throw new Error("Không xác định được người dùng");
  await syncPersonalTaskToGoogle(userId, taskItemId);
  refresh();
  return { ok: true };
}
