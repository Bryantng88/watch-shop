import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma as p } from "../src/server/db/client";
import { sendAssistant, listAssistant, assistantWorker } from "../src/domains/ai-assistant/server/service";
async function main(){
 const url=new URL(process.env.DATABASE_URL||"");assert.equal(url.hostname,"127.0.0.1");assert.equal(url.pathname,"/personal_codex_test");
 const suffix=randomUUID(),role=await p.role.findUniqueOrThrow({where:{name:"ADMIN"}});
 const owner=await p.user.create({data:{name:"Navigation fixture",email:`nav-${suffix}@example.invalid`,roles:{connect:{id:role.id}}}});
 const limitedRole=await p.role.create({data:{name:`NAV_${suffix}`,permissions:{connect:{code:"PRODUCT_VIEW"}}}});
 const viewer=await p.user.create({data:{name:"Navigation viewer",email:`nav-view-${suffix}@example.invalid`,roles:{connect:{id:limitedRole.id}}}});
 const before=[await p.order.count(),await p.taskItem.count()];
 async function start(userId:string,text:string){const requestKey=randomUUID();const sent=await sendAssistant(userId,{requestKey,text});const claimed=await assistantWorker("claim",{}) as {run:{id:string;leaseToken:string;text:string}};assert.equal(claimed.run.id,sent.id);return {...claimed.run,requestKey};}
 const run=await start(owner.id,"Ben mở danh sách đơn hàng");assert.ok(JSON.parse(run.text).requester.navigationScreens.some((s:{key:string})=>s.key==="orders"));
 await assistantWorker("lookup",{...run,lookup:{tool:"navigation.open",query:"orders"}});await assistantWorker("finish",{...run,reply:"Mình mở danh sách đơn hàng nhé.",plan:null});
 const result=(await listAssistant(owner.id,run.id)).conversations[0].messages.at(-1)!;assert.equal(result.navigation?.href,"/admin/orders");assert.equal(result.navigationRequestKey,run.requestKey);await assert.rejects(listAssistant(viewer.id,run.id));
 const denied=await start(viewer.id,"Ben mở danh sách đơn hàng");const d=await assistantWorker("lookup",{...denied,lookup:{tool:"navigation.open",query:"orders"}}) as {evidence:{result:{allowed:boolean}}};assert.equal(d.evidence.result.allowed,false);await assistantWorker("finish",{...denied,reply:"Bạn chưa có quyền mở màn hình này.",plan:null});assert.equal((await listAssistant(viewer.id,denied.id)).conversations[0].messages.at(-1)?.navigation,undefined);
 const revoke=await start(viewer.id,"Ben mở danh sách đồng hồ");await assistantWorker("lookup",{...revoke,lookup:{tool:"navigation.open",query:"watches"}});await p.role.update({where:{id:limitedRole.id},data:{permissions:{set:[]}}});await assistantWorker("finish",{...revoke,reply:"Mở đồng hồ.",plan:null});assert.equal((await listAssistant(viewer.id,revoke.id)).conversations[0].messages.at(-1)?.navigation,undefined);
 assert.deepEqual([await p.order.count(),await p.taskItem.count()],before);console.log("PASS navigation: verified target, ownership, denied/revoked permissions, request-key binding, no orders/tasks. Model scripted.");
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>p.$disconnect());
