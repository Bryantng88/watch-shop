"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { addDailyMediaWork, mediaDailyAssignees } from "@/domains/personal-work/server/media-daily.service";
export async function mediaDailyAssigneesAction() {
  const user=await requirePermission('PRODUCT_UPDATE');
  return mediaDailyAssignees(user.id);
}
export async function addDailyMediaWorkAction(input:unknown) {
  const user=await requirePermission('PRODUCT_UPDATE');
  const result=await addDailyMediaWork(user.id,input);
  revalidatePath('/admin/personal-work');
  return result;
}
