import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma as p } from "../src/server/db/client";
import { sendAssistant, listAssistant, assistantWorker, cancelAssistant } from "../src/domains/ai-assistant/server/service";
async function main(){
 const url=new URL(process.env.DATABASE_URL||"");assert.equal(url.hostname,"127.0.0.1");assert.equal(url.pathname,"/personal_codex_test");
 const suffix=randomUUID(),role=await p.role.findUniqueOrThrow({where:{name:"ADMIN"}});
 const owner=await p.user.create({data:{name:"Navigation fixture",email:`nav-${suffix}@example.invalid`,roles:{connect:{id:role.id}}}});
 const limitedRole=await p.role.create({data:{name:`NAV_${suffix}`,permissions:{connect:{code:"PRODUCT_VIEW"}}}});
 const viewer=await p.user.create({data:{name:"Navigation viewer",email:`nav-view-${suffix}@example.invalid`,roles:{connect:{id:limitedRole.id}}}});
 const before=[await p.order.count(),await p.taskItem.count()];
 async function start(userId:string,text:string){const requestKey=randomUUID();const sent=await sendAssistant(userId,{requestKey,text});const claimed=await assistantWorker("claim",{}) as {run:{id:string;leaseToken:string;text:string}};assert.equal(claimed.run.id,sent.id);return {...claimed.run,requestKey};}
 const run=await start(owner.id,"đưa mình đến màn hình đơn hàng nhé");assert.ok(JSON.parse(run.text).requester.navigationScreens.some((s:{key:string})=>s.key==="orders"));
 await assistantWorker("lookup",{...run,lookup:{tool:"navigation.open",query:"orders",intent:{type:"OPEN_SCREEN",sourceMessageId:run.requestKey}}});await assistantWorker("finish",{...run,reply:"Mình mở danh sách đơn hàng nhé.",plan:null});
 const result=(await listAssistant(owner.id,run.id)).conversations[0].messages.at(-1)!;assert.equal(result.navigation?.href,"/admin/orders");assert.equal(result.navigationRequestKey,run.requestKey);await assert.rejects(listAssistant(viewer.id,run.id));
 const denied=await start(viewer.id,"Ben mở danh sách đơn hàng");const d=await assistantWorker("lookup",{...denied,lookup:{tool:"navigation.open",query:"orders",intent:{type:"OPEN_SCREEN",sourceMessageId:denied.requestKey}}}) as {evidence:{result:{allowed:boolean}}};assert.equal(d.evidence.result.allowed,false);await assistantWorker("finish",{...denied,reply:"Bạn chưa có quyền mở màn hình này.",plan:null});assert.equal((await listAssistant(viewer.id,denied.id)).conversations[0].messages.at(-1)?.navigation,undefined);
 const revoke=await start(viewer.id,"ok, đưa mình tới màn hình sản phẩm nhé");await assistantWorker("lookup",{...revoke,lookup:{tool:"navigation.open",query:"watches",intent:{type:"OPEN_SCREEN",sourceMessageId:revoke.requestKey}}});await p.role.update({where:{id:limitedRole.id},data:{permissions:{set:[]}}});await assistantWorker("finish",{...revoke,reply:"Mở đồng hồ.",plan:null});assert.equal((await listAssistant(viewer.id,revoke.id)).conversations[0].messages.at(-1)?.navigation,undefined);
 const stale=await start(owner.id,"cho tui qua chỗ quản lý đồng hồ với");
 await assert.rejects(assistantWorker("lookup",{...stale,lookup:{tool:"navigation.open",query:"watches"}}));
 const bad=await assistantWorker("lookup",{...stale,lookup:{tool:"navigation.open",query:"watches",intent:{type:"OPEN_SCREEN",sourceMessageId:run.requestKey}}}) as {evidence:{result:{code:string}}};assert.equal(bad.evidence.result.code,"STALE_INTENT");
 await assistantWorker("finish",{...stale,reply:"Mình đã mở rồi",plan:null});const staleReply=(await listAssistant(owner.id,stale.id)).conversations[0].messages.at(-1)!;assert.equal(staleReply.navigation,undefined);assert.equal(staleReply.navigationResult?.code,"STALE_INTENT");assert.ok(!staleReply.text.includes("đã mở"));
 const unsupported=await start(owner.id,"mở trang ngoài");await assistantWorker("lookup",{...unsupported,lookup:{tool:"navigation.open",query:"https://evil.test",intent:{type:"OPEN_SCREEN",sourceMessageId:unsupported.requestKey}}});await assistantWorker("finish",{...unsupported,reply:"Mở rồi",plan:null});assert.equal((await listAssistant(owner.id,unsupported.id)).conversations[0].messages.at(-1)?.navigationResult?.code,"UNSUPPORTED_TARGET");
 const mixed=await start(owner.id,"đi qua chỗ đồng hồ");await assistantWorker("lookup",{...mixed,lookup:{tool:"navigation.open",query:"watches",intent:{type:"OPEN_SCREEN",sourceMessageId:mixed.requestKey}}});await assert.rejects(assistantWorker("finish",{...mixed,reply:"Mixed",plan:{}}));await cancelAssistant(owner.id,mixed.id);await assert.rejects(assistantWorker("finish",{...mixed,reply:"Late",plan:null}));
 assert.deepEqual([await p.order.count(),await p.taskItem.count()],before);console.log("PASS navigation: structured intent/current-message binding, precise outcomes, canonical replies, ownership, denied/revoked permissions, unsupported URL, mixed-review rejection, cancel/late finish and zero orders/tasks. Model scripted.");
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>p.$disconnect());
