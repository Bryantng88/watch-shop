import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import webpush from 'web-push';
import {prisma} from '../src/server/db/client';
import {queueWorkNotification,runWorkPush} from '../src/domains/notification/server/work-push.service';
import {workRoute} from '../src/domains/notification/server/work-push-policy';
async function main(){
 const url=new URL(process.env.DATABASE_URL||'');assert.equal(url.hostname,'127.0.0.1');assert.equal(url.pathname,'/work_push_test');
 const suffix=randomUUID();const now=new Date();
 const [owner,recipient]=await Promise.all(['owner','recipient'].map(name=>prisma.user.create({data:{email:`push-${name}-${suffix}@example.invalid`}})));
 const item=await prisma.taskItem.create({data:{title:'Synthetic work',personalOwnerUserId:owner.id,assignedToUserId:owner.id,dueAt:new Date(now.getTime()+60*60000),reminderMinutes:0}});
 await prisma.personalTaskShare.create({data:{taskItemId:item.id,userId:recipient.id,accessLevel:'VIEWER',sharedByUserId:owner.id}});
 const endpoint=`https://fcm.googleapis.com/fcm/send/${suffix}`;
 await prisma.benPushSubscription.create({data:{userId:recipient.id,endpoint,p256dh:'x'.repeat(87),auth:'x'.repeat(22)}});
 process.env.BEN_PUSH_PUBLIC_KEY='synthetic';process.env.BEN_PUSH_PRIVATE_KEY='synthetic';process.env.BEN_PUSH_SUBJECT='mailto:fixture@example.invalid';
 const original=webpush.sendNotification;let calls=0;let failure:number|undefined;
 webpush.sendNotification=(async (_subscription,payload)=>{calls++;assert.ok(!String(payload).includes('Synthetic work'));if(failure)throw Object.assign(new Error('synthetic'),{statusCode:failure});return {statusCode:201,body:'',headers:{}};}) as typeof original;
 const queue=(key:string)=>({key,userId:recipient.id,actorId:owner.id,taskItemId:item.id,kind:'SHARED' as const,title:item.title,route:workRoute(item.id,true)});
 try{
  await assert.rejects(prisma.$transaction(async tx=>{await queueWorkNotification(tx,queue('rollback-'+suffix));throw Error('rollback');}));
  assert.equal(await prisma.notification.count({where:{dedupeKey:'rollback-'+suffix}}),0);assert.equal(await prisma.workPushDelivery.count(),0);
  await prisma.$transaction(async tx=>{await queueWorkNotification(tx,queue('dedupe-'+suffix));await queueWorkNotification(tx,queue('dedupe-'+suffix));});
  assert.equal(await prisma.notification.count({where:{dedupeKey:'dedupe-'+suffix}}),1);assert.equal(await prisma.workPushDelivery.count(),1);
  await Promise.all([runWorkPush(now),runWorkPush(now)]);assert.equal(calls,1);
  await queueWorkNotification(prisma,{...queue('self-'+suffix),userId:owner.id});assert.equal(await prisma.notification.count({where:{dedupeKey:'self-'+suffix}}),0);
  await prisma.taskItem.update({where:{id:item.id},data:{dueAt:new Date(Date.now()-1000)}});
  await Promise.all([runWorkPush(),runWorkPush()]);
  assert.equal(await prisma.notification.count({where:{userId:recipient.id,type:'WORK_REMINDER'}}),1);
  // A cancelled item must never get a new reminder.
  await prisma.taskItem.update({where:{id:item.id},data:{status:'CANCELLED',dueAt:new Date(Date.now()-500)}});await runWorkPush();
  assert.equal(await prisma.notification.count({where:{userId:recipient.id,type:'WORK_REMINDER'}}),1);
  // Pending deliveries must recheck sharing before sending.
  await queueWorkNotification(prisma,queue('revoked-'+suffix));await prisma.personalTaskShare.deleteMany({where:{taskItemId:item.id}});
  const before=calls;await runWorkPush();assert.equal(calls,before);
  await prisma.personalTaskShare.create({data:{taskItemId:item.id,userId:recipient.id,sharedByUserId:owner.id}});
  await queueWorkNotification(prisma,queue('retry-'+suffix));failure=503;await runWorkPush();
  assert.equal(await prisma.workPushDelivery.count({where:{notificationKey:'retry-'+suffix,deliveredAt:null,attempts:1}}),1);
  failure=undefined;await prisma.workPushDelivery.updateMany({where:{notificationKey:'retry-'+suffix},data:{availableAt:new Date(0)}});await runWorkPush();
  assert.equal(await prisma.workPushDelivery.count({where:{notificationKey:'retry-'+suffix,deliveredAt:{not:null}}}),1);
  await queueWorkNotification(prisma,queue('expired-'+suffix));failure=410;await runWorkPush();assert.equal(await prisma.benPushSubscription.count({where:{endpoint}}),0);
  console.log('Work notification transaction, dedupe, concurrent lease, reminder, cancellation, access revocation, retry and expiry checks passed');
 }finally{
  webpush.sendNotification=original;
  await prisma.workPushDelivery.deleteMany();await prisma.taskItem.delete({where:{id:item.id}});await prisma.user.deleteMany({where:{id:{in:[owner.id,recipient.id]}}});await prisma.$disconnect();
 }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
