import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {randomUUID} from "node:crypto";
import {prisma as p} from "../src/server/db/client";
import {sendAssistant,listAssistant,cancelAssistant} from "../src/domains/ai-assistant/server/service";
let userId="",pending="";
async function main(){
 const db=new URL(process.env.DATABASE_URL||"");assert.equal(db.hostname,"127.0.0.1");assert.equal(db.pathname,"/personal_codex_test");assert.equal(process.env.BEN_REAL_NAVIGATION_EVAL,"1");
 const cases=JSON.parse(readFileSync("tests/fixtures/ben-navigation-intents.json","utf8")) as {text:string;target:string|null}[];
 const role=await p.role.findUniqueOrThrow({where:{name:"ADMIN"}});const user=await p.user.create({data:{email:`nav-real-${randomUUID()}@example.invalid`,name:"Synthetic navigation acceptance",roles:{connect:{id:role.id}}}});userId=user.id;
 const before=[await p.order.count(),await p.taskItem.count()];
 for(const item of cases){
  const requestKey=randomUUID();let row=await sendAssistant(userId,{requestKey,text:item.text});pending=row.id;
  for(let i=0;i<90&&["QUEUED","RUNNING"].includes(row.runStatus||"");i++){await new Promise(r=>setTimeout(r,2000));row=(await listAssistant(userId,row.id)).conversations[0];}
  assert.ok(["NEEDS_INFO","APPLIED"].includes(row.runStatus||""),`Model failed: ${item.text}`);
  const reply=row.messages.at(-1)!;assert.equal(reply.navigation?.key||null,item.target,item.text);if(item.target){assert.equal(reply.navigationRequestKey,requestKey);assert.equal(reply.navigationResult?.code,"READY");}
  assert.equal(row.orderDraft,undefined);assert.equal(row.permissionRequest,undefined);assert.deepEqual([await p.order.count(),await p.taskItem.count()],before);
  pending="";console.log(JSON.stringify({text:item.text,target:reply.navigation?.key||null,status:"PASS"}));
 }
 console.log(`PASS real navigation semantic acceptance: ${cases.length} paraphrase/negation/quotation/hypothetical/ambiguous cases, no business writes.`);
}
main().catch(e=>{console.error(e instanceof Error?e.message:"Real navigation evaluation failed");process.exitCode=1}).finally(async()=>{if(pending&&userId)await cancelAssistant(userId,pending).catch(()=>{});if(userId)await p.user.update({where:{id:userId},data:{isActive:false}});await p.$disconnect();});
