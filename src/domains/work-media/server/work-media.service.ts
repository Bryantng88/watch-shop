import { createHash, randomUUID } from "node:crypto";
import { Prisma, type MediaOwnerType } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { mediaStorage, type MediaStorage } from "@/domains/media/storage";
import { mediaPathPolicy } from "@/domains/media/core/media-path.policy";
import { isWorkMediaKey } from "@/domains/media/core/work-media-privacy";
import { S3_BUCKET } from "@/server/s3";
import { authorizeWorkMedia, WorkMediaError } from "./work-media-access";
import { prepareWorkImage } from "./work-image-processing";
import { WORK_IMAGE_LIMIT, type WorkImages, type WorkImage, type WorkMediaTarget } from "../shared/work-media";

type Ports = { db: typeof prisma; storage: MediaStorage; authorize: typeof authorizeWorkMedia; prepare: typeof prepareWorkImage; bucket: string };
const defaults: Ports = { db:prisma, storage:mediaStorage, authorize:authorizeWorkMedia, prepare:prepareWorkImage, bucket:S3_BUCKET };
const image = (id:string,name:string|null,state:WorkImage["state"]):WorkImage => ({id,name:name||"Ảnh công việc",state,url:state==="READY"?`/api/admin/personal-work/images/${id}`:null});
const ownerType = (value:"TASK_ITEM"|"TASK_CHECKLIST") => value as MediaOwnerType;
async function lock(db:DB,key:string) { await db.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${`work-media:${key}`}))`); }

export function createWorkMediaService(ports: Partial<Ports> = {}) {
 const {db,storage,authorize,prepare,bucket}={...defaults,...ports};
 async function targetForBinding(id:string) {
  const binding=await db.mediaBinding.findUnique({where:{id},include:{mediaObject:true}});
  if(!binding || !["TASK_ITEM","TASK_CHECKLIST"].includes(binding.ownerType) || !isWorkMediaKey(binding.mediaObject.storageKey))throw new WorkMediaError("Không tìm thấy ảnh.",404);
  const entry=String(binding.ownerType)==="TASK_CHECKLIST"?await db.taskItemChecklist.findUnique({where:{id:binding.ownerId},select:{taskItemId:true}}):null;
  if(String(binding.ownerType)==="TASK_CHECKLIST"&&!entry)throw new WorkMediaError("Không tìm thấy đầu việc.",404);
  return {binding,target:{workId:entry?.taskItemId||binding.ownerId,...(entry?{entryId:binding.ownerId}:{})}};
 }
 async function list(target:WorkMediaTarget,auth:unknown):Promise<WorkImages> {
  const access=await authorize(target,auth,false,db);
  const bindings=await db.mediaBinding.findMany({where:{ownerType:ownerType(access.ownerType),ownerId:access.ownerId,lifecycle:{in:["DRAFT","ATTACHED"]}},include:{mediaObject:{include:{operations:{where:{type:"INGEST"},orderBy:{createdAt:"desc"},take:1,select:{status:true}}}}},orderBy:[{sortOrder:"asc"},{createdAt:"asc"},{id:"asc"}]});
  return {canEdit:access.canEdit,limit:WORK_IMAGE_LIMIT,items:bindings.map(binding=>image(binding.id,binding.mediaObject.originalFileName,binding.lifecycle==="ATTACHED"&&binding.mediaObject.availability==="AVAILABLE"?"READY":binding.mediaObject.operations[0]?.status==="FAILED"?"FAILED":"PENDING"))};
 }
 async function upload(target:WorkMediaTarget,auth:unknown,input:{uploadId:string;bytes:Uint8Array;mimeType:string;name:string}) {
  const access=await authorize(target,auth,true,db);
  if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.uploadId))throw new WorkMediaError("Mã lần tải không hợp lệ.");
  const bytes=await prepare(input.bytes,input.mimeType);
  const checksum=createHash("sha256").update(bytes).digest("hex");
  const receipt=`work-upload:${access.ownerType}:${access.ownerId}:${input.uploadId}`;
  const reservation=await db.$transaction(async tx=>{
   const current=await authorize(target,auth,true,tx);await lock(tx,`${current.ownerType}:${current.ownerId}`);
   const existing=await tx.mediaOperation.findUnique({where:{idempotencyKey:receipt},include:{mediaObject:{include:{bindings:{where:{ownerType:ownerType(current.ownerType),ownerId:current.ownerId}}}}}});
   if(existing){
    const object=existing.mediaObject,binding=object?.bindings[0];
    if(existing.requestedByUserId!==current.userId||object?.checksum!==checksum||!binding||binding.lifecycle==="REMOVED"||!isWorkMediaKey(object.storageKey))throw new WorkMediaError("Lần tải đã thay đổi hoặc đã bị gỡ; hãy chọn ảnh lại.",409);
    return {object,binding,operation:existing};
   }
   const count=await tx.mediaBinding.count({where:{ownerType:ownerType(current.ownerType),ownerId:current.ownerId,lifecycle:{in:["DRAFT","ATTACHED"]}}});
   if(count>=WORK_IMAGE_LIMIT)throw new WorkMediaError(`Mỗi công việc/đầu việc tối đa ${WORK_IMAGE_LIMIT} ảnh.`,409);
   const id=randomUUID(),key=mediaPathPolicy.workOriginal(id);
   const object=await tx.mediaObject.create({data:{id,bucket,storageKey:key,originalFileName:input.name.replace(/[\x00-\x1f\x7f]/g,"").slice(0,180)||"Ảnh công việc",mimeType:"image/webp",sizeBytes:BigInt(bytes.length),checksum,availability:"UNVERIFIED"}});
   const binding=await tx.mediaBinding.create({data:{mediaObjectId:id,ownerType:ownerType(current.ownerType),ownerId:current.ownerId,role:"GALLERY",audienceSegment:"UNISEX",pipelineKey:null,lifecycle:"DRAFT",sortOrder:count}});
   const operation=await tx.mediaOperation.create({data:{idempotencyKey:receipt,mediaObjectId:id,type:"INGEST",status:"PENDING",destinationKey:key,requestedByUserId:current.userId,attempts:0}});
   return {object,binding,operation};
  });
  if(reservation.binding.lifecycle==="ATTACHED"&&reservation.operation.status==="SUCCEEDED")return image(reservation.binding.id,reservation.object.originalFileName,"READY");
  try {
   await db.mediaOperation.updateMany({where:{id:reservation.operation.id,status:{not:"SUCCEEDED"}},data:{status:"RUNNING",attempts:{increment:1},startedAt:new Date(),lastError:null}});
   const stored=await storage.write({key:reservation.object.storageKey,bytes,contentType:"image/webp",cacheControl:"private, no-store"});
   const verified=await storage.stat(reservation.object.storageKey);
   if(!verified||verified.sizeBytes!==bytes.length||stored.etag&&verified.etag!==stored.etag)throw new Error("Storage verification failed");
   await db.$transaction(async tx=>{
    const current=await authorize(target,auth,true,tx);await lock(tx,`${current.ownerType}:${current.ownerId}`);
    const binding=await tx.mediaBinding.findUnique({where:{id:reservation.binding.id}});
    if(!binding||binding.lifecycle==="REMOVED")throw new WorkMediaError("Ảnh đã bị gỡ trong lúc tải.",409);
    await tx.mediaObject.update({where:{id:reservation.object.id},data:{availability:"AVAILABLE",verifiedAt:new Date(),etag:verified.etag}});
    await tx.mediaBinding.update({where:{id:binding.id},data:{lifecycle:"ATTACHED"}});
    await tx.mediaOperation.update({where:{id:reservation.operation.id},data:{status:"SUCCEEDED",completedAt:new Date(),lastError:null}});
    if(binding.lifecycle!=="ATTACHED")await tx.taskItemActivity.create({data:{taskItemId:target.workId,actorUserId:current.userId,sourceType:"DISCUSSION",title:"Đính kèm ảnh công việc",body:reservation.object.originalFileName}});
   });
   return image(reservation.binding.id,reservation.object.originalFileName,"READY");
  } catch(error) {
   await db.mediaOperation.updateMany({where:{id:reservation.operation.id,status:{not:"SUCCEEDED"}},data:{status:"FAILED",lastError:error instanceof Error?error.message.slice(0,1000):"Upload failed"}});
   if(error instanceof WorkMediaError)throw error;
   if(error&&typeof error==="object"&&"status" in error&&error.status===403)throw new WorkMediaError("Quyền truy cập ảnh đã thay đổi.",403);
   throw new WorkMediaError("Không tải được ảnh. Bạn có thể thử lại cùng lần tải.",503);
  }
 }
 async function read(id:string,auth:unknown) {
  const {binding,target}=await targetForBinding(id);await authorize(target,auth,false,db);
  if(binding.lifecycle!=="ATTACHED"||binding.mediaObject.availability!=="AVAILABLE")throw new WorkMediaError("Ảnh chưa sẵn sàng hoặc đã bị gỡ.",404);
  return storage.read(binding.mediaObject.storageKey);
 }
 async function remove(id:string,auth:unknown) {
  const {target}=await targetForBinding(id);await authorize(target,auth,true,db);
  await db.$transaction(async tx=>{
   const access=await authorize(target,auth,true,tx);await lock(tx,`${access.ownerType}:${access.ownerId}`);
   const binding=await tx.mediaBinding.findUnique({where:{id}});
   if(!binding||binding.lifecycle==="REMOVED")return;
   await tx.mediaBinding.update({where:{id},data:{lifecycle:"REMOVED"}});
   await tx.taskItemActivity.create({data:{taskItemId:target.workId,actorUserId:access.userId,sourceType:"DISCUSSION",title:"Gỡ ảnh công việc"}});
  });
 }
 return {list,upload,read,remove};
}
export const workMediaService=createWorkMediaService();
