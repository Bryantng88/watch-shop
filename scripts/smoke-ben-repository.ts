import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {prisma as p} from "../src/server/db/client";
import {sendAssistant,listAssistant,assistantWorker} from "../src/domains/ai-assistant/server/service";
async function main(){
 const db=new URL(process.env.DATABASE_URL||"");assert.equal(db.hostname,"127.0.0.1");assert.equal(db.pathname,"/personal_codex_test");
 const role=await p.role.findUniqueOrThrow({where:{name:"ADMIN"}}),suffix=randomUUID();
 const long=await p.user.create({data:{name:"Long",email:`repo-${suffix}@example.invalid`,roles:{connect:{id:role.id}}}}),other=await p.user.create({data:{name:"Long",email:`repo-other-${suffix}@example.invalid`,roles:{connect:{id:role.id}}}});
 const commit="a".repeat(40);process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID=long.id;process.env.BEN_REPOSITORY_READ_ENABLED="1";process.env.BEN_REPOSITORY_COMMIT=commit;process.env.BEN_GITHUB_READ_TOKEN="synthetic-token";
 let reads=0;const original=globalThis.fetch;globalThis.fetch=async(input,init)=>{assert.ok(String(input).startsWith("https://api.github.com/repos/Bryantng88/watch-shop/git/commits/"));assert.equal(init?.method,"GET");reads++;return Response.json({sha:commit,tree:{sha:"b".repeat(40)},message:"Synthetic source"});};
 try{
 const before=[await p.taskItem.count(),await p.order.count()];
 async function start(userId:string,id?:string){const row=await sendAssistant(userId,{...(id?{id}:{}),requestKey:randomUUID(),text:"Ben xem code và làm rõ yêu cầu sửa giao diện"});const claim=await assistantWorker("claim",{}) as {run:{id:string;leaseToken:string;text:string}};assert.equal(claim.run.id,row.id);return claim.run;}
 const denied=await start(other.id);assert.equal(JSON.parse(denied.text).requester.repositoryRead,null);await assistantWorker("lookup",{...denied,lookup:{tool:"repository.info"}});assert.equal(reads,0);await assistantWorker("finish",{...denied,reply:"Chưa được bật quyền đọc code.",plan:null});
 const run=await start(long.id);assert.equal(JSON.parse(run.text).requester.repositoryRead.commitSha,commit);await assistantWorker("lookup",{...run,lookup:{tool:"repository.info"}});await assistantWorker("finish",{...run,reply:"Phân tích mã nguồn riêng tư: cần làm rõ hành vi mong muốn.",plan:null});const message=(await listAssistant(long.id,run.id)).conversations[0].messages.at(-1)!;assert.equal(message.repositoryAccess,true);assert.equal(message.repositorySources?.[0].commitSha,commit);assert.equal((await listAssistant(long.id,run.id)).conversations[0].orderDraft,undefined);
 process.env.BEN_REPOSITORY_COMMIT="d".repeat(40);const continued=await start(long.id,run.id);assert.equal(JSON.parse(continued.text).requester.repositoryRead.commitSha,commit);await assistantWorker("lookup",{...continued,lookup:{tool:"repository.info"}});await assistantWorker("finish",{...continued,reply:"Must not execute",plan:{malicious:"business write"}});assert.equal((await listAssistant(long.id,run.id)).conversations[0].runStatus,"NEEDS_INFO");
 process.env.BEN_REPOSITORY_COMMIT=commit;const revoked=await start(long.id);await assistantWorker("lookup",{...revoked,lookup:{tool:"repository.info"}});process.env.BEN_REPOSITORY_READ_ENABLED="0";await assistantWorker("finish",{...revoked,reply:"Private source must not leak",plan:null});assert.ok(!(await listAssistant(long.id,revoked.id)).conversations[0].messages.at(-1)!.text.includes("Private source"));
 const history=(await listAssistant(long.id,run.id)).conversations[0];assert.ok(!JSON.stringify(history).includes("Phân tích mã nguồn riêng tư"));assert.equal(history.messages.some(m=>m.repositorySources),false);
 process.env.BEN_REPOSITORY_READ_ENABLED="1";globalThis.fetch=async()=>new Response("private error",{status:403});const unavailable=await start(long.id);await assistantWorker("lookup",{...unavailable,lookup:{tool:"repository.info"}});await assistantWorker("finish",{...unavailable,reply:"I read all source successfully",plan:null});assert.ok(!(await listAssistant(long.id,unavailable.id)).conversations[0].messages.at(-1)!.text.includes("read all source"));
 await assert.rejects(listAssistant(other.id,run.id));assert.deepEqual([await p.taskItem.count(),await p.order.count()],before);console.log("PASS repository: verified Long, no network for other admin, pinned revision, read provenance, history/finish revocation, no business writes or approvals. GitHub/model fixtures only.");
 }finally{globalThis.fetch=original;}
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>p.$disconnect());
