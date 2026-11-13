import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { expandPermissions } from "@/server/auth/permission-implications";
import { createPersonalWorkItem } from "./personal-work.service";
import { queueWorkNotification } from "@/domains/notification/server/work-push.service";
import { MEDIA_DAILY_PARTS, mediaDailyRequestSchema } from "../shared/media-daily";
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
async function actor(db:DB,id:string) {
  const user=await db.user.findFirst({where:{id,isActive:true},select:{id:true,name:true,roles:{select:{name:true,permissions:{select:{code:true}}}}}});
  const permissions=new Set(expandPermissions(user?.roles.flatMap(role=>role.permissions.map(p=>p.code))||[]));
  const admin=user?.roles.some(role=>role.name==='ADMIN');
  if(!user || (!admin && (!permissions.has('TASK_VIEW') || !permissions.has('PRODUCT_UPDATE'))))throw Error('Cần quyền công việc và cập nhật Watch để tạo đầu việc media.');
  return {...user,canAssign:!!admin||permissions.has('TASK_MANAGE')};
}
export async function mediaDailyAssignees(userId:string) {
  const current=await actor(prisma,userId);
  const users=await prisma.user.findMany({where:{isActive:true,...(!current.canAssign?{id:userId}:{})},select:{id:true,name:true,email:true,roles:{select:{name:true,permissions:{select:{code:true}}}}},orderBy:{name:'asc'}});
  return {currentUserId:userId,users:users.filter(user=>{const p=new Set(expandPermissions(user.roles.flatMap(role=>role.permissions.map(v=>v.code))));return user.roles.some(role=>role.name==='ADMIN')||p.has('TASK_VIEW')&&p.has('PRODUCT_UPDATE');}).map(({id,name,email})=>({id,name,email}))};
}
export async function addDailyMediaWork(userId:string,raw:unknown) {
  const input=mediaDailyRequestSchema.parse(raw);
  const parentId='media-daily-'+digest(input.assigneeUserId+':'+input.day);
  const entryId='media-entry-'+digest(userId+':'+input.requestKey);
  const requestHash=digest(JSON.stringify(input));
  for(let attempt=0;;attempt++) {
    try{return await prisma.$transaction(async tx=>{
      const user=await actor(tx,userId);
      if(input.assigneeUserId!==userId && !user.canAssign)throw Error('Bạn không có quyền giao việc cho người khác.');
      await actor(tx,input.assigneeUserId);
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${parentId},0))`;
      const previous=await tx.taskItemChecklist.findUnique({where:{id:entryId}});
      const receipt=await tx.taskItemActivity.findUnique({where:{id:entryId}});
      if(receipt && !previous)throw Error('Đầu việc của yêu cầu này đã được xóa; hãy tạo yêu cầu mới nếu cần.');
      if(previous){if(previous.taskItemId!==parentId || (receipt?.metadataJson as Prisma.JsonObject)?.requestHash!==requestHash)throw Error('Mã yêu cầu đã được dùng cho đầu việc khác.');return {taskItemId:parentId,checklistItemId:entryId,created:false,reopened:false};}
      const watch=await tx.watch.findUnique({where:{productId:input.productId},select:{id:true,product:{select:{title:true,sku:true}}}});
      if(!watch)throw Error('Không tìm thấy Watch cần làm media.');
      let item=await tx.taskItem.findUnique({where:{id:parentId}});let created=false;
      if(!item){
        item=await createPersonalWorkItem({title:'Media · '+input.day.split('-').reverse().join('/'),note:'Tổng hợp công việc media trong ngày. Mỗi yêu cầu là một đầu việc; mở Media từ đầu việc để xử lý đúng Watch.',domain:'WATCHSHOP',workType:'GENERAL_TASK',dueAt:input.day+'T23:59:00+07:00',reminderMinutes:null,tags:['Media']},{userId:input.assigneeUserId},tx,{systemId:parentId});created=true;
      }
      if(item.personalOwnerUserId!==input.assigneeUserId)throw Error('Việc media của ngày này không còn thuộc người phụ trách đã chọn.');
      if(item.status==='CANCELLED')throw Error('Việc media ngày này đã bị hủy. Hãy khôi phục việc đó để bổ sung đầu việc.');
      const reopened=item.status==='DONE'||!!item.checklistLockedAt;
      const last=await tx.taskItemChecklist.findFirst({where:{taskItemId:parentId},orderBy:{sortOrder:'desc'},select:{sortOrder:true}});
      const context={source:'WATCH_MEDIA_DAILY',productId:input.productId,watchTitle:watch.product.title.slice(0,500),sku:watch.product.sku?.slice(0,150)||null,part:input.part,request:input.request};
      await tx.taskItemChecklist.create({data:{id:entryId,taskItemId:parentId,title:`${(watch.product.sku||watch.product.title).slice(0,150)} · ${MEDIA_DAILY_PARTS[input.part]}: ${input.request}`.slice(0,500),note:JSON.stringify(context),sortOrder:(last?.sortOrder??-1)+1}});
      if(userId!==input.assigneeUserId)await tx.personalChecklistShare.create({data:{checklistItemId:entryId,userId,accessLevel:'EDITOR',sharedByUserId:userId}});
      const [total,done]=await Promise.all([tx.taskItemChecklist.count({where:{taskItemId:parentId}}),tx.taskItemChecklist.count({where:{taskItemId:parentId,isDone:true}})]);
      await tx.taskItem.update({where:{id:parentId},data:{progressMode:'CHECKLIST',progressPercent:Math.round(done/total*100),...(reopened?{status:'IN_PROGRESS',isDone:false,completedAt:null,checklistLockedAt:null}:{}),assignedToUserId:input.assigneeUserId}});
      await tx.taskItemActivity.create({data:{id:entryId,taskItemId:parentId,sourceType:'SYSTEM',sourceId:entryId,actorUserId:userId,title:created?'Tạo việc media trong ngày':'Thêm đầu việc media',body:`${watch.product.title} · ${MEDIA_DAILY_PARTS[input.part]}: ${input.request}`,metadataJson:{...context,requestHash,day:input.day,checklistItemId:entryId}}});
      await queueWorkNotification(tx,{key:entryId+':'+input.assigneeUserId,userId:input.assigneeUserId,actorId:userId,taskItemId:parentId,checklistItemId:entryId,kind:created?'ASSIGNED':'CHANGED',title:`${watch.product.title} · ${input.request}`,route:'/admin/personal-work?item='+parentId});
      return {taskItemId:parentId,checklistItemId:entryId,created,reopened};
    },{isolationLevel:'Serializable',timeout:20000});}
    catch(error){if(attempt<3 && error instanceof Prisma.PrismaClientKnownRequestError && ['P2034','P2002'].includes(error.code))continue;throw error;}
  }
}
