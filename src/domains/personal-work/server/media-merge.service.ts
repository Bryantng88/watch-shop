import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { getAuthUserId } from "@/server/auth/auth-user-id";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { createPersonalWorkItem } from "./personal-work.service";
import { mediaChecklistContext } from "../shared/media-daily";
import { MediaMergeError, mediaMergeCommand, mediaMergeSelection, validateMediaMerge, type MediaMergePreview } from "../shared/media-merge";
const hash=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const include = {personalShares:{orderBy:{id:"asc" as const}},checklists:{orderBy:{id:"asc" as const},include:{personalShares:{orderBy:{id:"asc" as const}}}},calendarLinks:true,codexRuns:{where:{status:{in:["QUEUED","RUNNING"] as ("QUEUED"|"RUNNING")[]}}},activities:{orderBy:{id:"asc" as const},select:{id:true,updatedAt:true}},executions:{orderBy:{id:"asc" as const}}} satisfies Prisma.TaskItemInclude;
async function load(db:DB,ids:string[],userId:string){
  const rows=await db.taskItem.findMany({where:{id:{in:ids},personalOwnerUserId:userId},include,orderBy:{id:"asc"}});
  if(rows.length!==ids.length)throw new MediaMergeError("Không tìm thấy đủ công việc do bạn sở hữu. Hãy tải lại danh sách.");
  validateMediaMerge(rows.map(row=>({id:row.id,title:row.title,ownerId:row.personalOwnerUserId,assigneeId:row.assignedToUserId,status:row.status,locked:!!row.checklistLockedAt,categoryId:row.personalCategoryId,workType:row.workTypeId,shares:row.personalShares.map(s=>s.userId+":"+s.accessLevel),entries:row.checklists.map(e=>({id:e.id,isDone:e.isDone,media:!!mediaChecklistContext(e.note)})),calendar:!!row.calendarLinks.length,running:!!row.codexRuns.length,merged:!!row.mergedIntoTaskItemId})),userId);
  const images=await db.mediaBinding.findMany({where:{ownerType:"TASK_ITEM",ownerId:{in:ids},lifecycle:{in:["DRAFT","ATTACHED"]}},orderBy:{id:"asc"}});
  if(images.some(i=>i.lifecycle==="DRAFT"))throw new MediaMergeError("Có ảnh đang tải. Chờ tải xong rồi gộp.");
  if(images.length>20)throw new MediaMergeError("Tổng ảnh công việc vượt giới hạn 20 ảnh; cần sắp xếp lại trước khi gộp.");
  if(new Set(images.map(i=>i.mediaObjectId+":"+i.role)).size!==images.length)throw new MediaMergeError("Các việc có ảnh đính kèm trùng nhau; cần xử lý ảnh trùng trước khi gộp.");
  const revision=hash({rows,images});
  const total=rows.reduce((n,r)=>n+r.checklists.length,0),done=rows.reduce((n,r)=>n+r.checklists.filter(e=>e.isDone).length,0);
  const products=new Set(rows.flatMap(r=>r.checklists.map(e=>mediaChecklistContext(e.note)!.productId)));
  const preview:MediaMergePreview={revision,suggestedTitle:`Xử lý media · ${products.size} đồng hồ`,sources:rows.map(r=>({id:r.id,title:r.title,total:r.checklists.length,done:r.checklists.filter(e=>e.isDone).length})),total,done,warnings:["Việc nguồn sẽ ẩn khỏi mọi danh sách và lịch; chỉ việc chung được tính trong báo cáo công việc.","Giữ toàn bộ đầu việc đã xong/chưa xong, người được chia sẻ, lịch sử và ảnh; không loại các đầu việc trùng tên hoặc cùng Watch.","Không thể tự tách lại sau khi gộp. Liên kết cũ sẽ mở việc chung.",...(new Set(rows.map(r=>r.dueAt?.toISOString()||"")).size>1?["Các hạn khác nhau: việc chung dùng hạn sớm nhất. Hạn cũ được giữ trong dấu vết gộp."]:[])]};
  return {rows,images,preview};
}
export async function previewMediaMerge(raw:unknown,auth:unknown){
  const {ids}=mediaMergeSelection.parse(raw),userId=getAuthUserId(auth);
  if(!userId)throw new MediaMergeError("Không xác định được người dùng.");
  return (await load(prisma,ids,userId)).preview;
}
export async function mergeMediaWork(raw:unknown,auth:unknown){
  const input=mediaMergeCommand.parse(raw),userId=getAuthUserId(auth);
  mediaMergeSelection.parse({ids:input.ids});
  if(!userId)throw new MediaMergeError("Không xác định được người dùng.");
  const id="media-merged-"+hash([userId,input.requestKey]).slice(0,40),commandHash=hash({...input,ids:[...input.ids].sort()});
  return runBusinessEventTransaction(async(tx,delivery)=>{
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${id},0))`;
    const existing=await tx.taskItem.findUnique({where:{id}});
    if(existing){if(existing.personalOwnerUserId!==userId||(existing.mergeReceipt as Prisma.JsonObject)?.commandHash!==commandHash)throw new MediaMergeError("Mã lần gộp đã được dùng cho yêu cầu khác.");return {id,created:false};}
    await tx.$queryRaw(Prisma.sql`SELECT id FROM "TaskItem" WHERE id IN (${Prisma.join([...input.ids].sort())}) ORDER BY id FOR UPDATE`);
    const {rows,images,preview}=await load(tx,input.ids,userId);
    if(input.revision!==preview.revision)throw new MediaMergeError("Dữ liệu hoặc quyền đã thay đổi sau khi xem trước. Hãy tải lại bản xem trước và xác nhận lại.");
    const dates=rows.flatMap(r=>r.dueAt?[r.dueAt]:[]).sort((a,b)=>a.getTime()-b.getTime());
    const first=rows[0];
    const rank=["LOW","MEDIUM","HIGH","URGENT"];
    const priority=rows.reduce((value,row)=>rank.indexOf(row.priority)>rank.indexOf(value)?row.priority:value,first.priority);
    const target=await createPersonalWorkItem({title:input.title,domain:"WATCHSHOP",priority,workType:first.workTypeId||"GENERAL_TASK",dueAt:dates[0]?.toISOString(),reminderMinutes:null,tags:["Media"]},auth,tx,{systemId:id,onEvent:event=>delivery.track(event)});
    await tx.taskItem.update({where:{id},data:{personalCategoryId:first.personalCategoryId,workTypeId:first.workTypeId,assignedToUserId:userId,progressMode:"CHECKLIST",progressPercent:Math.round(preview.done/preview.total*100),status:rows.some(r=>r.status==="IN_PROGRESS")?"IN_PROGRESS":"TODO",mergeReceipt:{commandHash,actorUserId:userId,mergedAt:new Date().toISOString(),sources:rows.map(r=>({id:r.id,title:r.title,number:r.personalWorkNumber,dueAt:r.dueAt?.toISOString()??null,priority:r.priority,checklistIds:r.checklists.map(e=>e.id)}))}}});
    let sortOrder=0;
    for(const source of rows){
      for(const entry of [...source.checklists].sort((a,b)=>a.sortOrder-b.sortOrder||a.id.localeCompare(b.id)))await tx.taskItemChecklist.update({where:{id:entry.id},data:{taskItemId:id,mergedFromTaskItemId:entry.mergedFromTaskItemId||source.id,sortOrder:sortOrder++}});
      await tx.taskItemActivity.updateMany({where:{taskItemId:source.id},data:{taskItemId:id}});
      await tx.taskExecution.updateMany({where:{taskItemId:source.id},data:{taskItemId:id}});
      await tx.taskItem.update({where:{id:source.id},data:{mergedIntoTaskItemId:id}});
      await tx.taskItemActivity.create({data:{taskItemId:source.id,sourceType:"SYSTEM",title:"Đã gộp công việc",actorUserId:userId,metadataJson:{mergedIntoTaskItemId:id}}});
    }
    if(first.personalShares.length)await tx.personalTaskShare.createMany({data:first.personalShares.map(s=>({taskItemId:id,userId:s.userId,accessLevel:s.accessLevel,sharedByUserId:s.sharedByUserId}))});
    for(const image of images)await tx.mediaBinding.update({where:{id:image.id},data:{ownerId:id}});
    await tx.taskItemActivity.create({data:{taskItemId:id,sourceType:"SYSTEM",title:`Gộp ${rows.length} công việc media`,body:`Giữ ${preview.total} đầu việc, ${preview.done} đã hoàn thành. Báo cáo công việc tính một việc chung.`,actorUserId:userId,metadataJson:{source:"PERSONAL_MEDIA_MERGE",sourceIds:rows.map(r=>r.id),total:preview.total,done:preview.done}}});
    return {id:target.id,created:true};
  },{isolationLevel:"Serializable",timeout:30000,allowNoEvents:true});
}
