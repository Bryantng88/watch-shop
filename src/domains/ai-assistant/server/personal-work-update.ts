import {z} from "zod";
import {personalWorkCode} from "@/domains/personal-work/shared/personal-work-code";
import type {DB} from "@/server/db/client";
import {personalWorkViewAccessWhere,personalWorkEditAccessWhere} from "@/domains/personal-work/server/personal-work-access";
import {validatePersonalSchedule} from "@/domains/personal-work/shared/personal-work-schedule";
import {isPersonalEvent} from "@/domains/personal-work/shared/personal-event";
import {personalWorkUpdateSchema,personalWorkUpdateInput} from "../personal-work-update";
import type {Evidence} from "../live-contract";
import {AssistantError} from "./access";
function numericCode(query:string) {
 const match = /^CV-(\d{1,10})$/i.exec(query.trim());
 const number = match ? Number(match[1]) : 0;
 return number > 0 && number <= 2147483647 ? number : null;
}
const select={id:true,personalWorkNumber:true,title:true,status:true,dueAt:true,scheduledEndAt:true,updatedAt:true,workTypeId:true,progressMode:true,checklistLockedAt:true,assignedToUserId:true} as const;
export async function lookupPersonalWork(db:DB,userId:string,tool:"personalWork.search"|"personalWork.detail",query:string){
  const number = numericCode(query);
  if(tool==="personalWork.detail"){
    const item=await db.taskItem.findFirst({where:{...(number !== null ? {personalWorkNumber:number} : {id:query}),...personalWorkViewAccessWhere(userId)},select});
    return {item:item?{...item,code:personalWorkCode(item.id,item.personalWorkNumber),updatedAt:item.updatedAt.toISOString(),dueAt:item.dueAt?.toISOString()??null,scheduledEndAt:item.scheduledEndAt?.toISOString()??null,kind:isPersonalEvent(item.workTypeId)?"EVENT":"TASK"}:null};
  }
  const search = query.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(/[?!.]+$/,"");
  if (/^(?:@latest|(?:(?:cv|viec|cong viec|task) )?moi nhat(?: hien tai)?(?: la gi)?)$/.test(search)) {
    const row = await db.taskItem.findFirst({
      where: {...personalWorkViewAccessWhere(userId), status:{not:"CANCELLED"}},
      select: {id:true,personalWorkNumber:true,title:true,status:true},
      orderBy: [{createdAt:"desc"},{id:"desc"}],
    });
    return {matches:row?[{...row,code:personalWorkCode(row.id,row.personalWorkNumber)}]:[],truncated:false};
  }
  const codePrefix=/^CV-([a-z0-9]{8}-[a-z0-9]{4})$/i.exec(query)?.[1];
  const words=query.trim().split(/\s+/).slice(0,8);
  const rows=await db.taskItem.findMany({where:{AND:[personalWorkViewAccessWhere(userId),{status:{not:"CANCELLED"}},...(number !== null?[{personalWorkNumber:number}]:codePrefix?[{id:{startsWith:codePrefix,mode:"insensitive" as const}}]:words.map(word=>({title:{contains:word,mode:"insensitive" as const}})))]},select:{id:true,personalWorkNumber:true,title:true,status:true},orderBy:[{updatedAt:"desc"},{id:"asc"}],take:7});
  return {matches:rows.slice(0,6).map(row=>({...row,code:personalWorkCode(row.id,row.personalWorkNumber)})),truncated:rows.length>6};
}
export async function preparePersonalWorkUpdate(db:DB,userId:string,raw:unknown,revision:number,evidence:Evidence[]){
 const plan=personalWorkUpdateSchema.parse(raw);
 const detail=[...evidence].reverse().find(e=>e.request.tool==="personalWork.detail"&&(e.result.item as {id?:string}|null)?.id===plan.itemId)?.result.item as {id:string;updatedAt:string}|null|undefined;
 if(!detail||detail.id!==plan.itemId||new Date(detail.updatedAt).toISOString()!==new Date(plan.expectedUpdatedAt).toISOString())throw new AssistantError("Cần đọc lại đúng công việc trước khi cập nhật.",409);
 const item=await db.taskItem.findFirst({where:{id:plan.itemId,...personalWorkEditAccessWhere(userId)},select});
 if(!item)throw new AssistantError("Bạn không có quyền sửa công việc này.",403);
 if(item.updatedAt.toISOString()!==new Date(plan.expectedUpdatedAt).toISOString())throw new AssistantError("Công việc đã thay đổi. Hãy đọc lại và chuẩn bị bản cập nhật mới.",409);
 const event=isPersonalEvent(item.workTypeId),c=personalWorkUpdateInput(plan);
 if(event&&c.status&&c.status!=="CANCELLED")throw new AssistantError("Sự kiện không cần hoàn thành.");
 if(c.status==="DONE"&&item.progressMode==="CHECKLIST"&&!item.checklistLockedAt)throw new AssistantError("Công việc còn checklist cần xác nhận trong Quản lý công việc.",409);
 const start=c.dueAt===undefined?item.dueAt:c.dueAt,end=c.scheduledEndAt===undefined?item.scheduledEndAt:c.scheduledEndAt;
 validatePersonalSchedule(start,end);
 if(event&&!start)throw new AssistantError("Sự kiện cần thời điểm diễn ra.");
 return {plan,revision,title:item.title,code:personalWorkCode(item.id,item.personalWorkNumber),kind:event?"EVENT" as const:"TASK" as const,requiredPermissions:["TASK_VIEW"],requiredTaskIds:[item.id]};
}

export async function preparePersonalWorkUpdates(db:DB,userId:string,raw:unknown,revision:number,evidence:Evidence[]){
 const plans=z.array(personalWorkUpdateSchema).min(1).max(8).parse(Array.isArray(raw)?raw:[raw]);
 if(new Set(plans.map(plan=>plan.itemId)).size!==plans.length)throw new AssistantError("Mỗi mã việc chỉ xuất hiện một lần trong bản cập nhật.",409);
 const [first,...additional]=await Promise.all(plans.map(plan=>preparePersonalWorkUpdate(db,userId,plan,revision,evidence)));
 return {...first,additional,requiredTaskIds:plans.map(plan=>plan.itemId)};
}
