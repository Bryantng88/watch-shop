import assert from 'node:assert/strict';import {prisma} from '@/server/db/client';import {randomUUID} from 'node:crypto';import {requestOrderWorkflow,claimOrderWorkflow,finishOrderWorkflow,approveOrderWorkflow} from '@/domains/order/codex/workflow.service';
(async()=>{
 const u=new URL(process.env.DATABASE_URL!);if(!['127.0.0.1','localhost'].includes(u.hostname)||u.pathname!=='/personal_codex_test')throw Error('ISOLATED_TEST_DB_REQUIRED');
 Object.assign(process.env,{ORDER_CODEX_ENABLED:'1',PERSONAL_CODEX_ENABLED:'1',PERSONAL_CODEX_ENVIRONMENT:'staging',PERSONAL_CODEX_WORKER_TOKEN:'synthetic-worker-api-token-at-least-32-chars'});
 const owner=await prisma.user.create({data:{email:randomUUID()+'@example.invalid',roles:{connect:{name:'ADMIN'}}}});const other=await prisma.user.create({data:{email:randomUUID()+'@example.invalid',roles:{connect:{name:'ADMIN'}}}});const staff=await prisma.user.create({data:{email:randomUUID()+'@example.invalid'}});
 const order=await prisma.order.create({data:{shipPhone:'synthetic',shipAddress:'synthetic',shipCity:'synthetic',subtotal:0,hasShipment:false}});
 const before=await prisma.taskItem.count();
 await assert.rejects(requestOrderWorkflow(order.id,staff.id,{requestKey:randomUUID(),text:'Đề xuất kiểm tra rồi chụp ảnh'}));
 const requestKey=randomUUID();const row=await requestOrderWorkflow(order.id,owner.id,{requestKey,text:'Đề xuất kiểm tra rồi chụp ảnh'});assert.equal((await requestOrderWorkflow(order.id,owner.id,{requestKey,text:'Đề xuất kiểm tra rồi chụp ảnh'})).id,row.id);
 assert.equal(await prisma.taskItem.count(),before);
 const run=await claimOrderWorkflow('test-order-worker');assert.equal(run?.id,row.id);
 const plan={summary:'Kiểm tra rồi chụp',questions:[],steps:[{key:'s1',title:'Kiểm tra',department:'TECHNICAL',description:'Chỉ kiểm tra',dependsOn:[],dueAt:null,assignedToUserId:null},{key:'s2',title:'Chụp',department:'MEDIA',description:'Chụp tình trạng',dependsOn:['s1'],dueAt:null,assignedToUserId:null}]};
 assert.equal(await finishOrderWorkflow(row.id,randomUUID(),plan,false),false);assert.equal(await finishOrderWorkflow(row.id,run!.leaseToken,plan,false),true);assert.equal(await prisma.taskItem.count(),before);
 await assert.rejects(approveOrderWorkflow(order.id,other.id,{proposalId:row.id,revision:0,plan}));
 const results=await Promise.allSettled([approveOrderWorkflow(order.id,owner.id,{proposalId:row.id,revision:0,plan}),approveOrderWorkflow(order.id,owner.id,{proposalId:row.id,revision:0,plan})]);assert.ok(results.some(r=>r.status==='fulfilled'));assert.equal(await prisma.taskItem.count(),before+2);
 await approveOrderWorkflow(order.id,owner.id,{proposalId:row.id,revision:0,plan});assert.equal(await prisma.taskItem.count(),before+2);assert.equal((await prisma.order.findUniqueOrThrow({where:{id:order.id}})).paymentStatus,'UNPAID');
 const stale=await requestOrderWorkflow(order.id,owner.id,{requestKey:randomUUID(),text:'Thêm một đề xuất để test stale'});const sr=await claimOrderWorkflow('test-order-worker');assert.equal(sr?.id,stale.id);await finishOrderWorkflow(stale.id,sr!.leaseToken,plan,false);await prisma.order.update({where:{id:order.id},data:{notes:'synthetic update'}});await assert.rejects(approveOrderWorkflow(order.id,owner.id,{proposalId:stale.id,revision:0,plan}));
 console.log('PASS isolated DB: no work before approval, requester/admin boundary, idempotent dispatch/apply, concurrent approval, stale order and fenced completion; payment unchanged.');
})().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>prisma.$disconnect());
