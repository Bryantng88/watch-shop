import { getAuthUserId } from "@/server/auth/auth-user-id";
import { updatePersonalWorkItem, finalizePersonalWorkChecklist } from "./personal-work.service";
import { prisma } from "@/server/db/client";
import { syncPersonalTaskToGoogleIfLinked, deletePersonalTaskFromGoogle } from "./google-calendar.service";
import type { CalendarSaveResult } from "../shared/calendar-save-result";

export async function cleanupCancelledPersonalCalendar(taskItemId:string):Promise<CalendarSaveResult>{
  const links=await prisma.personalTaskCalendarLink.findMany({where:{taskItemId,taskItem:{status:"CANCELLED"}},select:{userId:true}});
  let failed=false;
  for(const link of links){try{await deletePersonalTaskFromGoogle(link.userId,taskItemId);}catch{failed=true;await prisma.personalTaskCalendarLink.updateMany({where:{taskItemId,userId:link.userId},data:{syncHash:"CANCELLED_PENDING_DELETE"}});}}
  return {ok:true,calendarSync:failed?"FAILED":links.length?"SYNCED":"NOT_LINKED"};
}

// Only the optional external step is recoverable. Validation/access/database
// failures must still reject, and must never be described as a successful save.
async function syncAfterSave(auth: unknown, taskItemId: string): Promise<CalendarSaveResult> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  try {
    const linked = await syncPersonalTaskToGoogleIfLinked(userId, taskItemId);
    return { ok: true, calendarSync: linked ? "SYNCED" : "NOT_LINKED" };
  } catch {
    return { ok: true, calendarSync: "FAILED" };
  }
}

export async function updatePersonalWorkWithCalendar(input: Parameters<typeof updatePersonalWorkItem>[0], auth: unknown) {
  await updatePersonalWorkItem(input, auth);
  return input.status==="CANCELLED"?cleanupCancelledPersonalCalendar(input.id):syncAfterSave(auth, input.id);
}

export async function finalizePersonalWorkWithCalendar(taskItemId: string, auth: unknown) {
  await finalizePersonalWorkChecklist(taskItemId, auth);
  return syncAfterSave(auth, taskItemId);
}
