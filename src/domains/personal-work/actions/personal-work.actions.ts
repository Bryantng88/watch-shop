"use server";

import { calendarScheduleInput } from "../shared/personal-work-schedule";
import { isContinuousWork } from "../shared/continuous-work";
import { prisma } from "@/server/db/client";
import { MediaMergeError } from "../shared/media-merge";
import { previewMediaMerge, mergeMediaWork } from "../server/media-merge.service";
import { hydrateTaskItemsWithTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import { codexExecutionReadiness } from "../server/codex/codex-config";
import { requestPersonalCodexRun, cancelPersonalCodexRun } from "../server/codex/personal-codex.service";
import { revalidatePath } from "next/cache";
import { PersonalTaskShareAccess, TaskStatus, type TaskPriority } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAuthUserId } from "@/server/auth/auth-user-id";
import {
  editPersonalChecklist,
  personalChecklistHistory,
  replacePersonalChecklistShares,
  renamePersonalWorkChecklistItem,
  addPersonalWorkChecklistItem,
  assertPersonalWorkAccess,
  createPersonalWorkItem,
  deletePersonalWorkChecklistItem,
  replacePersonalWorkShares,
  searchPersonalWorkTargets,
  setPersonalWorkChecklistItemDone,
  updatePersonalWorkItem,
} from "../server/personal-work.service";
import {
  updatePersonalGoogleCalendarEvent,
  googleCalendarAuthorizationUrl,
  syncPersonalTaskToGoogle,
} from "../server/google-calendar.service";
import type { PersonalWorkDomain, PersonalWorkTarget, PersonalWorkTargetType } from "../shared/personal-work.types";
import { savePersonalCategory, deletePersonalCategory } from "../server/personal-work-categories.service";
import { listPersonalPhotoshootPlans, schedulePersonalWatchPhotoshoot } from "../server/personal-photoshoot.service";
import type { PersonalPhotoshootInput } from "../shared/personal-photoshoot";
import { syncChecklistParentCalendar, updatePersonalWorkWithCalendar, finalizePersonalWorkWithCalendar, cleanupCancelledPersonalCalendar } from "../server/personal-work-calendar-mutations";

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
export async function previewPersonalMediaMergeAction(input:unknown) {
  const user=await auth();
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  try{return {ok:true as const,preview:await previewMediaMerge(input,user)};}catch(error){return {ok:false as const,error:error instanceof MediaMergeError?error.message:"Không thể xem trước. Hãy tải lại danh sách và chọn từ 2 đến 30 việc."};}
}
export async function mergePersonalMediaWorkAction(input:unknown) {
  const user=await auth();
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  try{const result=await mergeMediaWork(input,user);refresh();return {ok:true as const,...result};}
  catch(error){return {ok:false as const,error:error instanceof MediaMergeError?error.message:"Chưa thể xác nhận kết quả gộp. Hãy tải lại danh sách trước khi thử lại; không tạo yêu cầu gộp khác."};}
}
function refresh() {
  revalidatePath("/admin/personal-work");
  revalidatePath("/admin/dashboard");
}

export async function createPersonalWorkAction(input: {
  reminderMinutes?: number | null;
  title: string;
  note?: string | null;
  dueAt?: string | null;
  scheduledEndAt?: string | null;
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
  if (codexExecutionReadiness().ready && user.roles.includes("ADMIN") && input.tags?.some(tag => tag.trim().toLowerCase() === "codex")) await requestPersonalCodexRun(item.id, user);
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
  reminderMinutes?: number | null;
  id: string;
  title?: string;
  note?: string | null;
  dueAt?: string | null;
  scheduledEndAt?: string | null;
  workType?: string | null;
  estimatedDays?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  domain?: PersonalWorkDomain;
  categoryKey?: string;
  tags?: string[];
  targets?: PersonalWorkTarget[];
  updateBody?: string | null;
  updateChecklistItemId?: string | null;
}) {
  const user = await auth();
  for (const target of input.targets || []) await requirePermission(targetPermission[target.type]);
  const addingCodexTag = codexExecutionReadiness().ready && user.roles.includes("ADMIN") && input.tags?.some(tag => tag.trim().toLowerCase() === "codex");
  const tagOwner = addingCodexTag ? await assertPersonalWorkAccess(input.id, user, "EDIT") : null;
  const previousTags = addingCodexTag ? await hydrateTaskItemsWithTagsRepo(prisma, [{ id: input.id }]) : [];
  const result = await updatePersonalWorkWithCalendar(input, user);
  if (addingCodexTag && tagOwner?.access === "OWNER" && !previousTags[0]?.tags.some(tag => tag.name.trim().toLowerCase() === "codex")) await requestPersonalCodexRun(input.id, user);
  refresh();
  return result;
}

export async function addPersonalWorkChecklistItemAction(input: { taskItemId: string; title: string }) {
  const user = await auth();
  const item = await addPersonalWorkChecklistItem(input.taskItemId, input.title, user);
  refresh();
  return { ok: true, item: { id: item.id, title: item.title, isDone: item.isDone, startAt:item.startAt?.toISOString()??null,deadlineAt:item.deadlineAt?.toISOString()??null,updatedAt:item.updatedAt.toISOString() } };
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
  return syncChecklistParentCalendar(input.taskItemId);
}

export async function finalizePersonalWorkChecklistAction(taskItemId: string) {
  const user = await auth();
  const result = await finalizePersonalWorkWithCalendar(taskItemId, user);
  refresh();
  return result;
}

export async function cancelPersonalWorkAction(input:{id:string;reason:string;confirmRunning?:boolean}) {
  const user=await auth();
  if(typeof input.reason!=="string"||!input.reason.trim()||input.reason.length>2000)throw new Error("Nhập lý do hủy, tối đa 2000 ký tự.");
  await updatePersonalWorkItem({id:input.id,status:"CANCELLED",updateBody:input.reason,confirmRunning:input.confirmRunning},user);
  const cleanup=await cleanupCancelledPersonalCalendar(input.id);
  refresh();return {ok:true,calendarCleanupFailed:cleanup.calendarSync==="FAILED"};
}

export async function restorePersonalWorkAction(input:{id:string;date?:string}) {
  const user=await auth();
  const item=await assertPersonalWorkAccess(input.id,user,"OWNER",prisma,true);
  if(item.status==="DONE")throw new Error("Không mở lại việc hoàn thành qua thao tác khôi phục việc đã hủy.");
  if(item.status!=="CANCELLED")return {ok:true};
  let schedule:Partial<{dueAt:string|null;scheduledEndAt:string|null;estimatedDays:number}>={};
  if(!isContinuousWork(item.workTypeId)&&!item.id.startsWith("media-daily-")&&!await prisma.taskItemChecklist.count({where:{taskItemId:item.id}})){
    if(input.date){if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||new Date(input.date+"T00:00:00Z").toISOString().slice(0,10)!==input.date)throw new Error("Ngày không hợp lệ");schedule={...calendarScheduleInput(input.date,"","",1),estimatedDays:1};}
    else if(item.workTypeId==="EVENT")throw new Error("Chọn ngày diễn ra sự kiện khi mở lại.");
    else schedule={dueAt:null,scheduledEndAt:null,estimatedDays:1};
  }
  await updatePersonalWorkItem({id:input.id,restoreCancelled:true,status:isContinuousWork(item.workTypeId)||item.workTypeId!=="EVENT"&&item.startedAt?"IN_PROGRESS":"TODO",...schedule},user);
  refresh();return {ok:true};
}

// Compatibility for older clients; cancellation still preserves the audit trail.
export async function deletePersonalWorkAction(id:string){
  return cancelPersonalWorkAction({id,reason:"Hủy từ giao diện cũ"});
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

export async function updateGoogleCalendarEventAction(input: import("../shared/google-event-edit").GoogleEventEditInput) {
  const userId = getAuthUserId(await auth());
  if (!userId) throw new Error("Không xác định được người dùng");
  return updatePersonalGoogleCalendarEvent(userId, input);
}

export async function listPersonalPhotoshootPlansAction(date: string) {
  return listPersonalPhotoshootPlans(date, await auth());
}

export async function schedulePersonalWatchPhotoshootAction(input: PersonalPhotoshootInput) {
  const user = await auth();
  await requirePermission(PERMISSIONS.PRODUCT_VIEW);
  const result = await schedulePersonalWatchPhotoshoot(input, user);
  refresh();
  return result;
}

export async function requestPersonalCodexRunAction(input: { taskItemId: string; retry?: boolean }) {
  const run = await requestPersonalCodexRun(input.taskItemId, await auth(), Boolean(input.retry));
  refresh();
  return { ok: true, runId: run.id };
}

export async function cancelPersonalCodexRunAction(runId: string) {
  await cancelPersonalCodexRun(runId, await auth());
  refresh();
  return { ok: true };
}

export async function renamePersonalWorkChecklistItemAction(input: {taskItemId:string;checklistItemId:string;title:string}) {
  const user = await auth();
  const item = await renamePersonalWorkChecklistItem(input.taskItemId,input.checklistItemId,input.title,user);
  refresh();
  return {ok:true,item:{id:item.id,title:item.title,isDone:item.isDone}};
}

export async function replacePersonalChecklistSharesAction(input:{taskItemId:string;checklistItemId:string;shares:{userId:string;accessLevel:PersonalTaskShareAccess}[]}) {
  await replacePersonalChecklistShares(input.taskItemId,input.checklistItemId,input.shares,await auth());
  refresh();return {ok:true};
}

export async function loadPersonalWorkPageAction(input: import("../shared/work-list-query").WorkListQuery & {cursor?: string | null}) {
  const {getWorkListPage} = await import("../server/work-list-page");
  return getWorkListPage(input, await auth());
}

export async function loadPersonalWorkDetailAction(id: string) {
  if(typeof id!=="string" || !/^[\w:-]{1,160}$/.test(id)) throw new Error("Công việc không hợp lệ.");
  const {getPersonalWorkPageData} = await import("../server/personal-work.service");
  const data = await getPersonalWorkPageData(await auth(), {ids:[id]});
  if(!data.items[0]) throw new Error("Công việc không còn khả dụng hoặc quyền xem đã thay đổi.");
  return data.items[0];
}

export async function editPersonalChecklistAction(input:Parameters<typeof editPersonalChecklist>[0]) {
  const user=await auth();
  await editPersonalChecklist(input,user);
  refresh();
  return syncChecklistParentCalendar(input.taskItemId);
}
export async function personalChecklistHistoryAction(input:{taskItemId:string;checklistItemId:string;updatesOnly?:boolean}) {
  return personalChecklistHistory(input.taskItemId,input.checklistItemId,await auth(),input.updatesOnly===true);
}
