"use server";

import { revalidatePath } from "next/cache";
import { PersonalTaskShareAccess, TaskStatus, type TaskPriority } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAuthUserId } from "@/domains/task/server/core/task.service";
import {
  addPersonalWorkChecklistItem,
  assertPersonalWorkAccess,
  createPersonalWorkItem,
  deletePersonalWorkChecklistItem,
  finalizePersonalWorkChecklist,
  replacePersonalWorkShares,
  searchPersonalWorkTargets,
  setPersonalWorkChecklistItemDone,
  updatePersonalWorkItem,
} from "../server/personal-work.service";
import {
  deletePersonalTaskFromGoogle,
  googleCalendarAuthorizationUrl,
  syncPersonalTaskToGoogle,
  syncPersonalTaskToGoogleIfLinked,
} from "../server/google-calendar.service";
import type { PersonalWorkDomain, PersonalWorkTarget, PersonalWorkTargetType } from "../shared/personal-work.types";
import { savePersonalCategory, deletePersonalCategory } from "../server/personal-work-categories.service";

export async function savePersonalWorkCategoryAction(input: {key?:string;label:string;color:string}) {
  await savePersonalCategory(input, await auth());
  refresh();
  return {ok:true};
}

export async function deletePersonalWorkCategoryAction(input: {key:string;replacementKey:string}) {
  await deletePersonalCategory(input, await auth());
  refresh();
  return {ok:true};
}

async function auth() {
  return requirePermission(PERMISSIONS.TASK_VIEW);
}
function refresh() {
  revalidatePath("/admin/personal-work");
  revalidatePath("/admin/dashboard");
}

export async function createPersonalWorkAction(input: {
  title: string;
  note?: string | null;
  dueAt?: string | null;
  estimatedDays?: number;
  priority?: TaskPriority;
  domain?: PersonalWorkDomain;
  categoryKey?: string;
  workType?: string | null;
  targets?: PersonalWorkTarget[];
  tags?: string[];
}) {
  const user = await auth();
  for (const target of input.targets || []) await requirePermission(targetPermission[target.type]);
  const item = await createPersonalWorkItem(input, user);
  refresh();
  return { ok: true, id: item.id };
}

const targetPermission: Record<PersonalWorkTargetType, string> = {
  WATCH: PERMISSIONS.PRODUCT_VIEW,
  ORDER: PERMISSIONS.ORDER_VIEW,
  PURCHASE_REQUEST: PERMISSIONS.ORDER_VIEW,
  ACQUISITION: PERMISSIONS.WATCH_ACQUISITION_VIEW,
  SERVICE_REQUEST: PERMISSIONS.SERVICE_VIEW,
};

export async function searchPersonalWorkTargetsAction(input: { type: PersonalWorkTargetType; query?: string | null }) {
  await auth();
  await requirePermission(targetPermission[input.type]);
  return { ok: true, items: await searchPersonalWorkTargets(input) };
}

export async function updatePersonalWorkAction(input: {
  id: string;
  title?: string;
  note?: string | null;
  dueAt?: string | null;
  estimatedDays?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  domain?: PersonalWorkDomain;
  categoryKey?: string;
  tags?: string[];
  targets?: PersonalWorkTarget[];
  updateBody?: string | null;
}) {
  const user = await auth();
  for (const target of input.targets || []) await requirePermission(targetPermission[target.type]);
  await updatePersonalWorkItem(input, user);
  const userId = getAuthUserId(user);
  if (userId) await syncPersonalTaskToGoogleIfLinked(userId, input.id);
  refresh();
  return { ok: true };
}

export async function addPersonalWorkChecklistItemAction(input: { taskItemId: string; title: string }) {
  const user = await auth();
  const item = await addPersonalWorkChecklistItem(input.taskItemId, input.title, user);
  refresh();
  return { ok: true, item: { id: item.id, title: item.title, isDone: item.isDone } };
}

export async function togglePersonalWorkChecklistItemAction(input: {
  taskItemId: string;
  checklistItemId: string;
  isDone: boolean;
}) {
  const user = await auth();
  await setPersonalWorkChecklistItemDone(input.taskItemId, input.checklistItemId, input.isDone, user);
  refresh();
  return { ok: true };
}

export async function deletePersonalWorkChecklistItemAction(input: {
  taskItemId: string;
  checklistItemId: string;
}) {
  const user = await auth();
  await deletePersonalWorkChecklistItem(input.taskItemId, input.checklistItemId, user);
  refresh();
  return { ok: true };
}

export async function finalizePersonalWorkChecklistAction(taskItemId: string) {
  const user = await auth();
  await finalizePersonalWorkChecklist(taskItemId, user);
  const userId = getAuthUserId(user);
  if (userId) await syncPersonalTaskToGoogleIfLinked(userId, taskItemId);
  refresh();
  return { ok: true };
}

export async function deletePersonalWorkAction(id: string) {
  const user = await auth();
  await assertPersonalWorkAccess(id, user, "OWNER");
  const userId = getAuthUserId(user);
  if (!userId) throw new Error("Không xác định được người dùng");
  await deletePersonalTaskFromGoogle(userId, id);
  await updatePersonalWorkItem({ id, status: TaskStatus.CANCELLED }, user);
  refresh();
  return { ok: true };
}

export async function replacePersonalWorkSharesAction(input: {
  taskItemId: string;
  shares: { userId: string; accessLevel: PersonalTaskShareAccess }[];
}) {
  const user = await auth();
  await replacePersonalWorkShares(input.taskItemId, input.shares, user);
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
  // Calendar is two-way: subsequent page loads can import date changes from
  // Google, so read-only shares must never be allowed to create a link.
  await assertPersonalWorkAccess(taskItemId, user, "EDIT");
  const userId = getAuthUserId(user);
  if (!userId) throw new Error("Không xác định được người dùng");
  await syncPersonalTaskToGoogle(userId, taskItemId);
  refresh();
  return { ok: true };
}
