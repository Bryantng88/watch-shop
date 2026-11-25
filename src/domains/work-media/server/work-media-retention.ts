import { prisma } from "@/server/db/client";
import { isWorkMediaKey } from "@/domains/media/core/work-media-privacy";
import { executeMediaDelete } from "@/domains/media/application/media-operation.service";
import type { MediaOwnerType } from "@prisma/client";
const DAY=86400000;
export function workMediaDeleteEligible(input:{key:string;now:Date;createdAt:Date;bindingDates:Date[];activeBindings:number;derivatives:number;productReferences:number;recentUploads:number}) {
 return isWorkMediaKey(input.key)&&input.activeBindings===0&&input.derivatives===0&&input.productReferences===0&&input.recentUploads===0&&Math.max(input.createdAt.getTime(),...input.bindingDates.map(date=>date.getTime()))<=input.now.getTime()-30*DAY;
}
/** Explicit maintenance command only. No scheduler or automatic production deletion. */
export async function retainWorkMedia(apply=false,now=new Date()) {
 const owners=["TASK_ITEM","TASK_CHECKLIST"].map(value=>value as MediaOwnerType);
 const bindings=await prisma.mediaBinding.findMany({where:{ownerType:{in:owners},lifecycle:{in:["DRAFT","ATTACHED"]}},include:{mediaObject:{select:{storageKey:true,operations:{where:{type:"INGEST",status:{in:["PENDING","RUNNING"]},OR:[{startedAt:{gte:new Date(now.getTime()-DAY)}},{createdAt:{gte:new Date(now.getTime()-DAY)}}]},select:{id:true}}}}}});
 const retire:string[]=[];
 for(const binding of bindings){
  if(!isWorkMediaKey(binding.mediaObject.storageKey))continue;
  const exists=String(binding.ownerType)==="TASK_ITEM"?await prisma.taskItem.findUnique({where:{id:binding.ownerId},select:{id:true}}):await prisma.taskItemChecklist.findUnique({where:{id:binding.ownerId},select:{id:true}});
  const stale=binding.lifecycle==="DRAFT"&&binding.updatedAt.getTime()<now.getTime()-DAY&&binding.mediaObject.operations.length===0;
  if(!exists||stale){retire.push(binding.id);if(apply)await prisma.mediaBinding.updateMany({where:{id:binding.id,lifecycle:{in:["DRAFT","ATTACHED"]}},data:{lifecycle:"REMOVED",updatedAt:now}});}
 }
 const objects=await prisma.mediaObject.findMany({where:{storageKey:{startsWith:"media/work/"},availability:{not:"DELETED"},createdAt:{lt:new Date(now.getTime()-30*DAY)}},include:{bindings:true,_count:{select:{derivatives:true}},operations:{where:{type:"INGEST",status:{in:["PENDING","RUNNING"]},OR:[{startedAt:{gte:new Date(now.getTime()-DAY)}},{createdAt:{gte:new Date(now.getTime()-DAY)}}]},select:{id:true}}}});
 const purge:string[]=[];
 for(const object of objects){
  const products=await prisma.productImage.count({where:{fileKey:object.storageKey}})+await prisma.product.count({where:{OR:[{storefrontImageKey:object.storageKey},{primaryImageUrl:{in:[object.storageKey,`/api/media/sign?key=${encodeURIComponent(object.storageKey)}`]}}]}});
  if(!workMediaDeleteEligible({key:object.storageKey,now,createdAt:object.createdAt,bindingDates:object.bindings.map(binding=>binding.updatedAt),activeBindings:object.bindings.filter(binding=>binding.lifecycle!=="REMOVED").length,derivatives:object._count.derivatives,productReferences:products,recentUploads:object.operations.length}))continue;
  purge.push(object.id);
  if(apply){
   // Feature commands never reattach a removed receipt or reuse a private object.
   const live=await prisma.mediaBinding.count({where:{mediaObjectId:object.id,lifecycle:{not:"REMOVED"}}});if(live)continue;
   await executeMediaDelete({idempotencyKey:`work-retention-delete:${object.id}`,mediaObjectId:object.id,storageKey:object.storageKey});
   await prisma.mediaObject.update({where:{id:object.id},data:{availability:"DELETED"}});
  }
 }
 return {mode:apply?"APPLY":"DRY_RUN",retireBindings:retire,purgeObjects:purge};
}
