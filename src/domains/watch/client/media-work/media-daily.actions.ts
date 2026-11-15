"use server";
import { after } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { dailyMediaWorkForProducts } from "@/domains/personal-work/server/media-daily-read.service";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { addDailyMediaWork, mediaDailyAssignees } from "@/domains/personal-work/server/media-daily.service";
export async function mediaDailyAssigneesAction() {
  const user=await requirePermission('PRODUCT_UPDATE');
  return mediaDailyAssignees(user.id);
}
export async function addDailyMediaWorkAction(input:unknown) {
  const user=await requirePermission('PRODUCT_UPDATE');
  const result=await addDailyMediaWork(user.id,input,{deferConsumers:work=>after(work)});
  revalidatePath('/admin/personal-work');
  return result;
}

export async function mediaDailyStateAction(productIds:string[]){
 const user=await requirePermission('TASK_VIEW');await requirePermission('PRODUCT_VIEW');
 const ids=z.array(z.string().regex(/^[\w-]{1,100}$/)).max(100).parse(productIds);
 return [...(await dailyMediaWorkForProducts(prisma,user.id,ids)).values()];
}
