import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {prisma as p} from "../src/server/db/client";
import {createAuthToken} from "../src/server/auth/auth-token";
import {listAssistant,cancelAssistant} from "../src/domains/ai-assistant/server/service";
let userId="",pending="";
async function main(){
 const db=new URL(process.env.DATABASE_URL||"");assert.equal(db.hostname,"127.0.0.1");assert.equal(db.pathname,"/personal_codex_test");assert.equal(process.env.BEN_REAL_SEPARATE_EVAL,"1");
 const role=await p.role.findUniqueOrThrow({where:{name:"ADMIN"}});userId=(await p.user.create({data:{name:"Synthetic separate Ben",email:`separate-${randomUUID()}@example.invalid`,roles:{connect:{id:role.id}}}})).id;
 const before=[await p.order.count(),await p.taskItem.count()];
 const origin=new URL(process.env.APP_URL!).origin;
 // Deliberately omit screenPath like an older already-open PWA document.
 const response=await fetch("http://127.0.0.1:3000/api/admin/customer-assistant",{method:"POST",headers:{"content-type":"application/json",origin,referer:origin+"/admin/ben?private=not-forwarded",cookie:"auth_token="+createAuthToken(userId)},body:JSON.stringify({action:"send",requestKey:randomUUID(),text:"Bạn có biết mình đang ở màn hình nào không?"})});
 assert.equal(response.status,200);let row=await response.json();pending=row.id;
 for(let i=0;i<90&&["QUEUED","RUNNING"].includes(row.runStatus||"");i++){await new Promise(r=>setTimeout(r,2000));row=(await listAssistant(userId,row.id)).conversations[0];}
 assert.equal(row.runStatus,"NEEDS_INFO");const reply=row.messages.at(-1).text;assert.ok(/riêng/iu.test(reply));assert.ok(!reply.includes("not-forwarded"));assert.equal(row.orderDraft,undefined);assert.deepEqual([await p.order.count(),await p.taskItem.count()],before);
 pending="";console.log(JSON.stringify({legacyClientWithoutScreenPath:true,reply}));console.log("PASS real separate-Ben recognition through authenticated HTTP legacy payload; no business writes.");
}
main().catch(e=>{console.error(e instanceof Error?e.message:"Separate Ben acceptance failed");process.exitCode=1}).finally(async()=>{if(pending&&userId)await cancelAssistant(userId,pending).catch(()=>{});if(userId)await p.user.update({where:{id:userId},data:{isActive:false}});await p.$disconnect();});
