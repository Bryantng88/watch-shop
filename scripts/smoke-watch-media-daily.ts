import {setWatchCoverApplication} from "../src/domains/watch/application/set-watch-cover.application";
import {mediaStorage} from "../src/domains/media/storage";
import {dailyMediaWorkForProducts} from "../src/domains/personal-work/server/media-daily-read.service";
import {createPersonalWorkItem,addPersonalWorkChecklistItem} from "../src/domains/personal-work/server/personal-work.service";
import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {prisma} from '../src/server/db/client';
import {addDailyMediaWork} from '../src/domains/personal-work/server/media-daily.service';
import {getPersonalWorkPageData,updatePersonalWorkItem} from '../src/domains/personal-work/server/personal-work.service';
import {saveWatchMediaWorkDraftFromQueueItem,getWatchMediaWorkProgressFromQueueItem,getWatchMediaWorkspaceContext} from '../src/domains/watch/server/media-work/watch-media-work.service';
import {submitWatchFormApplication} from '../src/domains/watch/application/submit-watch-form/submit-watch-form.application';
import {getWatchEditDetail} from '../src/domains/watch/server/detail/watch-detail.service';
import {mapWatchDetailToFormValues} from '../src/domains/watch/client/form/watch-form.mapper';
async function main(){
 const url=new URL(process.env.DATABASE_URL||'');assert.equal(url.hostname,'127.0.0.1');assert.equal(url.pathname,'/personal_codex_test');
 const suffix=randomUUID(),codes=['TASK_VIEW','TASK_MANAGE','PRODUCT_UPDATE'];
 for(const code of codes)await prisma.permission.upsert({where:{code},create:{code},update:{}});
 const manager=await prisma.role.create({data:{name:'media-manager-'+suffix,permissions:{connect:codes.map(code=>({code}))}}});
 const staffRole=await prisma.role.create({data:{name:'media-staff-'+suffix,permissions:{connect:[{code:'TASK_VIEW'},{code:'PRODUCT_UPDATE'}]}}});
 const user=await prisma.user.create({data:{email:'media-manager-'+suffix+'@example.invalid',roles:{connect:{id:manager.id}}}});
 const staff=await prisma.user.create({data:{email:'media-staff-'+suffix+'@example.invalid',roles:{connect:{id:staffRole.id}}}});
 const other=await prisma.user.create({data:{email:'media-other-'+suffix+'@example.invalid',roles:{connect:{id:staffRole.id}}}});
 const oldStat=mediaStorage.stat;
 const oldFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('External request in media fixture');};
 const product=await prisma.product.create({data:{type:'WATCH',title:'Synthetic Bulova Oceanographer',sku:'MEDIA-'+suffix,slug:'media-'+suffix,status:'AVAILABLE'}});
 const watch=await prisma.watch.create({data:{productId:product.id,movementType:'AUTOMATIC',watchSpecV2:{create:{model:'Oceanographer',dialColor:'Blue'}},watchContent:{create:{body:'Saved initial content',contentStatus:'DRAFT'}}}});
 const space=await prisma.task.create({data:{title:'Synthetic media workspace',kind:'OPERATION'}});
 const queue=await prisma.taskItem.create({data:{taskId:space.id,title:'Media processing',note:'workTypeKey: media-processing'}});
 const at=new Date().toISOString();
 const binding=await prisma.taskExecution.create({data:{taskId:space.id,taskItemId:queue.id,targetType:'WATCH',targetId:watch.id,metadataJson:{workflowRuntime:{workflowKey:'synthetic-media',currentState:'NEW',startedAt:at,updatedAt:at},mediaWorkProgress:{parts:{profile:false,content:false,image:false,cover:false},updatedAt:at}}}});
 try{
 const progress=async()=>{const value=await getWatchMediaWorkProgressFromQueueItem(binding.id);assert.ok(value);return value;};
 assert.equal((await progress()).content,false);
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{content:false}});assert.equal((await progress()).content,false);
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{content:true}});assert.equal((await progress()).content,true);
 await assert.rejects(saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{image:true}}));
 await assert.rejects(saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{cover:true}}));
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{profile:true}});
 const detail=await getWatchEditDetail(product.id);assert.ok(detail);const values=mapWatchDetailToFormValues(detail);values.basic.title='Synthetic Bulova edited profile';values.content.body='WIP saved for later';values.saveIntent='MEDIA_WORKSPACE';
 await submitWatchFormApplication(values,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.equal((await prisma.watchContent.findUniqueOrThrow({where:{watchId:watch.id}})).body,'WIP saved for later');assert.equal((await progress()).content,false);assert.equal((await progress()).profile,false);
 assert.equal((await getWatchMediaWorkspaceContext(product.id))?.parts.content,false);
 // Completing another tab resubmits the original form values. Canonical
 // defaults and decimal formatting must not invalidate an already saved part.
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{profile:true}});
 await submitWatchFormApplication(values,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.equal((await progress()).profile,true,'unchanged original form must retain profile completion');
 const galleryKey='media/objects/'+suffix+'/original/gallery.jpg';
 await prisma.mediaObject.create({data:{bucket:'synthetic-text-review-media',storageKey:galleryKey,availability:'AVAILABLE',bindings:{create:{ownerType:'WATCH',ownerId:watch.id,role:'GALLERY',audienceSegment:'MEN',lifecycle:'ATTACHED'}}}});
 await prisma.productImage.create({data:{productId:product.id,fileKey:galleryKey,role:'GALLERY',isForAdmin:true}});
 const withImage=mapWatchDetailToFormValues(await getWatchEditDetail(product.id));withImage.saveIntent='MEDIA_WORKSPACE';
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{image:true}});
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{profile:true}});
 assert.equal((await progress()).image,true,'completing profile must retain unchanged gallery completion');
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{image:true}});
 assert.equal((await progress()).profile,true,'completing gallery must retain unchanged profile completion');
 withImage.spec.caseSizeMM='39';await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.equal((await progress()).profile,false,'actual spec changes still invalidate profile');assert.equal((await progress()).image,true);
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{profile:true}});
 withImage.spec.caseSizeMM='039.00';await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.equal((await progress()).profile,true,'equivalent decimal formatting is not an edit');
 const coverKey='media/objects/'+suffix+'/original/cover.jpg';
 await prisma.mediaObject.create({data:{bucket:'synthetic-text-review-media',storageKey:coverKey,availability:'AVAILABLE',bindings:{create:{ownerType:'WATCH',ownerId:watch.id,role:'COVER',audienceSegment:'MEN',lifecycle:'ATTACHED'}}}});
 await prisma.productImage.create({data:{productId:product.id,fileKey:coverKey,role:'COVER',isForAdmin:true}});
 await prisma.product.update({where:{id:product.id},data:{storefrontImageKey:coverKey}});
 mediaStorage.stat=async key=>{assert.ok([coverKey,galleryKey].includes(key),'only synthetic fixture objects may be read');return {key,sizeBytes:1,etag:'synthetic',contentType:'image/jpeg'};};
 withImage.media.coverImage={key:coverKey};withImage.content.hookText='Link https://vinticwatches.vn/products/old';
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{profile:true,content:true,image:true,cover:true}});
 await setWatchCoverApplication({productId:product.id,storageKey:coverKey,actorUserId:user.id,deferConsumers:()=>{}});
 const allDone={profile:true,content:true,image:true,cover:true};assert.deepEqual((await progress()),allDone,'same Cover must retain every completion');
 // Production-like regression: final Gallery exists, legacy pool has no binding.
 // A new Cover followed by its completion must not rewrite or re-ingest Gallery.
 const galleryBefore=await prisma.productImage.findMany({where:{productId:product.id,role:'GALLERY'},select:{id:true,fileKey:true,sortOrder:true},orderBy:{sortOrder:'asc'}});
 const galleryObject=await prisma.mediaObject.findUniqueOrThrow({where:{storageKey:galleryKey}});
 await prisma.mediaBinding.deleteMany({where:{ownerType:'WATCH',ownerId:watch.id,role:'GALLERY'}});
 await prisma.mediaBinding.create({data:{mediaObjectId:(await prisma.mediaObject.findUniqueOrThrow({where:{storageKey:coverKey}})).id,ownerType:'WATCH',ownerId:watch.id,role:'THUMBNAIL',audienceSegment:'MEN',lifecycle:'ATTACHED'}});
 const newCoverKey='media/objects/'+suffix+'/original/new-cover.jpg';
 await prisma.mediaObject.create({data:{bucket:'synthetic-text-review-media',storageKey:newCoverKey,availability:'AVAILABLE'}});
 const storageReads:string[]=[];
 mediaStorage.stat=async key=>{storageReads.push(key);assert.ok([coverKey,newCoverKey].includes(key),'Cover/pool-only save must not read Gallery assets');return {key,sizeBytes:1,etag:'synthetic',contentType:'image/jpeg'};};
 await setWatchCoverApplication({productId:product.id,storageKey:newCoverKey,actorUserId:user.id,deferConsumers:()=>{}});
 assert.deepEqual(await progress(),{...allDone,cover:false});
 withImage.media.coverImage={key:newCoverKey};withImage.media.poolImages=[];
 const coverSave=await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.equal(coverSave.imagesChanged,false);assert.equal((await progress()).image,true,'new Cover completion must not clear Gallery when legacy pool differs');
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{cover:true}});
 assert.deepEqual((await getWatchMediaWorkspaceContext(product.id,prisma,binding.id))?.parts,allDone);
 assert.deepEqual(await prisma.productImage.findMany({where:{productId:product.id,role:'GALLERY'},select:{id:true,fileKey:true,sortOrder:true},orderBy:{sortOrder:'asc'}}),galleryBefore,'pool repair must preserve Gallery rows and order');
 assert.ok(!storageReads.includes(galleryKey));
 await prisma.mediaBinding.create({data:{mediaObjectId:galleryObject.id,ownerType:'WATCH',ownerId:watch.id,role:'GALLERY',audienceSegment:'MEN',lifecycle:'ATTACHED'}});
 mediaStorage.stat=async key=>{assert.ok([coverKey,newCoverKey,galleryKey].includes(key));return {key,sizeBytes:1,etag:'synthetic',contentType:'image/jpeg'};};

 for(const part of ['profile','content','image','cover'] as const){
  await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
  await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{[part]:true}});
  assert.deepEqual((await getWatchMediaWorkspaceContext(product.id,prisma,binding.id))?.parts,allDone,'completing '+part+' must retain siblings after reread');
 }
 withImage.basic.title='Synthetic Bulova new title';
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.deepEqual((await progress()),{...allDone,profile:false},'title and generated storefront URL invalidate profile only');
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{profile:true}});
 withImage.content.body='Actual new body';
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.deepEqual((await progress()),{...allDone,content:false},'a content edit invalidates content only');
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{content:true}});
 const secondGalleryKey='media/objects/'+suffix+'/original/second-gallery.jpg';
 await prisma.mediaObject.create({data:{bucket:'synthetic-text-review-media',storageKey:secondGalleryKey,availability:'AVAILABLE'}});
 mediaStorage.stat=async key=>{assert.ok([coverKey,newCoverKey,galleryKey,secondGalleryKey].includes(key));return {key,sizeBytes:1,etag:'synthetic',contentType:'image/jpeg'};};
 withImage.media.galleryImages=[{key:galleryKey},{key:secondGalleryKey}];withImage.media.poolImages=[...withImage.media.galleryImages];
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.deepEqual(await progress(),{...allDone,image:false},'a real Gallery addition must still invalidate only images');
 await saveWatchMediaWorkDraftFromQueueItem({bindingId:binding.id,actorUserId:user.id,parts:{image:true}});
 withImage.media.galleryImages.reverse();
 await submitWatchFormApplication(withImage,{userId:user.id,canReviewContent:true,canEditPrice:false,deferConsumers:()=>{}});
 assert.deepEqual(await progress(),{...allDone,image:false},'real Gallery reordering must still invalidate only images');
 mediaStorage.stat=oldStat;


 await assert.rejects(getWatchMediaWorkspaceContext(product.id,undefined,randomUUID()));
 assert.equal((await prisma.taskExecution.findUniqueOrThrow({where:{id:binding.id}})).metadataJson && JSON.stringify((await prisma.taskExecution.findUniqueOrThrow({where:{id:binding.id}})).metadataJson).includes('"currentState":"DONE"'),false);
 await prisma.product.update({where:{id:product.id},data:{primaryImageUrl:'synthetic-cover.jpg'}});
 // Gallery mutation tests generate a real INLINE projection; isolate the later thumbnail fixture.
 await prisma.productImage.deleteMany({where:{productId:product.id,role:'INLINE'}});
 await prisma.productImage.create({data:{productId:product.id,fileKey:'synthetic-inline.jpg',role:'INLINE',isForAdmin:true}});
 const input={requestKey:randomUUID(),productId:product.id,assigneeUserId:staff.id,day:'2026-11-13',part:'image',request:'Chỉnh sáng gallery cho Watch này'};
 const pair=await Promise.all([addDailyMediaWork(user.id,input),addDailyMediaWork(user.id,input)]);
 assert.equal(pair[0].taskItemId,pair[1].taskItemId);assert.equal(pair[0].checklistItemId,pair[1].checklistItemId);
 const second=await addDailyMediaWork(staff.id,{...input,requestKey:randomUUID(),part:'content',request:'Viết content cho Watch'});
 assert.equal(second.taskItemId,pair[0].taskItemId);assert.notEqual(second.checklistItemId,pair[0].checklistItemId);
 assert.equal(await prisma.taskItem.count({where:{id:{startsWith:'media-daily-'},personalOwnerUserId:staff.id}}),1);
 assert.equal(await prisma.taskItemChecklist.count({where:{taskItemId:second.taskItemId}}),2);
 const createdEvent=await prisma.businessEventLog.findFirstOrThrow({where:{eventKey:'task.item.created',targetId:second.taskItemId}});
 assert.equal(createdEvent.actorUserId,user.id);assert.equal((createdEvent.metadataJson as Record<string,unknown>).personalOwnerUserId,staff.id);assert.equal((createdEvent.metadataJson as Record<string,unknown>).assignedToUserId,staff.id);
 assert.equal(await prisma.businessEventLog.count({where:{eventKey:'task.item.created',targetId:second.taskItemId}}),1);
 const entryDeliveries=await prisma.projectionEventDelivery.findMany({where:{eventKey:'task.item.checklist.created',targetId:second.taskItemId}});assert.equal(entryDeliveries.length,2);assert.equal(new Set(entryDeliveries.map(row=>row.eventInstanceId)).size,2);
 assert.equal((await dailyMediaWorkForProducts(prisma,user.id,[product.id])).get(product.id)?.count,1);assert.equal((await dailyMediaWorkForProducts(prisma,staff.id,[product.id])).get(product.id)?.count,2);assert.equal((await dailyMediaWorkForProducts(prisma,other.id,[product.id])).get(product.id)?.count,0);
 const parent=await createPersonalWorkItem({title:'Linked watch '+suffix,domain:'MEDIA',targets:[{type:'WATCH',id:watch.id,label:'untrusted',secondary:null,href:'https://untrusted.invalid'}]},{userId:staff.id});
 const step=await addPersonalWorkChecklistItem(parent.id,'Generic entry',{userId:staff.id});assert.ok(await prisma.businessEventLog.findFirst({where:{eventKey:'task.item.checklist.created',targetId:parent.id}}));assert.ok(step.id);
 const linked=(await getPersonalWorkPageData({userId:staff.id})).items.find(item=>item.id===parent.id);assert.equal(linked?.targets[0].imageUrl,'synthetic-inline.jpg');assert.equal(linked?.targets[0].href,`/admin/watches/${product.id}`);
 let rolledBackId='';await assert.rejects(prisma.$transaction(async tx=>{const task=await createPersonalWorkItem({title:'Rollback '+suffix},{userId:staff.id},tx);rolledBackId=task.id;throw Error('intentional rollback');}));assert.equal(await prisma.taskItem.count({where:{id:rolledBackId}}),0);assert.equal(await prisma.businessEventLog.count({where:{targetId:rolledBackId}}),0);assert.equal(await prisma.projectionEventDelivery.count({where:{targetId:rolledBackId}}),0);

 const otherDay=await addDailyMediaWork(user.id,{...input,requestKey:randomUUID(),day:'2026-11-14'});assert.notEqual(otherDay.taskItemId,second.taskItemId);
 const otherUser=await addDailyMediaWork(user.id,{...input,requestKey:randomUUID(),assigneeUserId:other.id});assert.notEqual(otherUser.taskItemId,second.taskItemId);
 await assert.rejects(addDailyMediaWork(staff.id,{...input,requestKey:randomUUID(),assigneeUserId:other.id}));
 await assert.rejects(addDailyMediaWork(user.id,{...input,request:'Reused key, changed text'}));
 await assert.rejects(updatePersonalWorkItem({id:second.taskItemId,dueAt:'2026-11-14T10:00:00+07:00'},{userId:staff.id}));
 const managerView=(await getPersonalWorkPageData({userId:user.id})).items.find(item=>item.id===second.taskItemId);assert.ok(managerView?.checklistOnly);assert.equal(managerView.checklist.length,1);assert.equal(managerView.checklist[0].mediaContext?.href,`/admin/watches/${product.id}/edit?mode=media&focus=image`);assert.equal(managerView.activities.length,0);assert.equal(managerView.targets.length,0);assert.equal(managerView.checklist[0].object?.imageUrl,'synthetic-inline.jpg');assert.equal(managerView.checklist[0].object?.id,watch.id);
 await prisma.taskItemChecklist.updateMany({where:{taskItemId:second.taskItemId},data:{isDone:true,doneAt:new Date()}});
 await prisma.taskItem.update({where:{id:second.taskItemId},data:{status:'DONE',isDone:true,completedAt:new Date(),checklistLockedAt:new Date()}});
 const reopened=await addDailyMediaWork(staff.id,{...input,requestKey:randomUUID(),part:'profile',request:'Kiểm tra lại spec'});assert.equal(reopened.taskItemId,second.taskItemId);assert.equal(reopened.reopened,true);
 const updated=await prisma.taskItem.findUniqueOrThrow({where:{id:second.taskItemId}});assert.equal(updated.status,'IN_PROGRESS');assert.equal(updated.checklistLockedAt,null);assert.equal(updated.progressPercent,67);assert.equal((await dailyMediaWorkForProducts(prisma,staff.id,[product.id])).get(product.id)?.count,2);await prisma.taskItemChecklist.delete({where:{id:reopened.checklistItemId}});assert.equal((await dailyMediaWorkForProducts(prisma,staff.id,[product.id])).get(product.id)?.count,1);
 await prisma.role.update({where:{id:staffRole.id},data:{permissions:{set:[]}}});const count=await prisma.taskItemChecklist.count({where:{taskItemId:second.taskItemId}});
 await assert.rejects(addDailyMediaWork(user.id,{...input,requestKey:randomUUID()}));assert.equal(await prisma.taskItemChecklist.count({where:{taskItemId:second.taskItemId}}),count);
 console.log('PASS media drafts/daily work DB: draft persists without completion; changed saved content invalidates completed part; empty gallery/cover and foreign binding reject; same user/day aggregates under concurrency and replay; other day/person separates; self/assignment rights, receipt mismatch, fixed-day identity, checklist-only context scope, reopen-on-new-head and revoked recipient enforce. INLINE hydration and scoped photo access; active/done/deleted daily state; created/checklist events and per-entry outbox identities; rollback removes task/event/outbox. No real provider calls.');
 }finally{mediaStorage.stat=oldStat;globalThis.fetch=oldFetch;await prisma.user.updateMany({where:{id:{in:[user.id,staff.id,other.id]}},data:{isActive:false}});}
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>prisma.$disconnect());
