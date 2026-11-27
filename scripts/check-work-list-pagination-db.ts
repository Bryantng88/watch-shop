import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {prisma} from "../src/server/db/client";
import {getPersonalWorkPageData} from "../src/domains/personal-work/server/personal-work.service";
import {getWorkListPage} from "../src/domains/personal-work/server/work-list-page";
import {workViewCounts, type WorkListQuery} from "../src/domains/personal-work/shared/work-list-query";

const url=new URL(process.env.DATABASE_URL || "http://invalid");
if(!((url.hostname==="watch-shop-staging-db"&&url.pathname==="/watch_shop_storefront_staging"&&process.env.APP_URL==="https://admin-staging.vinticwatches.vn")||(["localhost","127.0.0.1"].includes(url.hostname)&&/test/.test(url.pathname))))throw new Error("Only isolated test or guarded staging DB allowed");
const batch="paging-check-"+randomUUID(),owner=batch+"-owner",recipient=batch+"-recipient";
async function main(){
 const day=new Date(Date.now()+7*3600000).toISOString().slice(0,10),query:WorkListQuery={view:"ALL",scope:"ALL",domain:"ALL",day};
 await prisma.$transaction(async tx=>{
  await tx.user.createMany({data:[owner,recipient].map(id=>({id,email:id+"@example.invalid",name:"Pagination test",isActive:false}))});
  await tx.taskItem.createMany({data:Array.from({length:85},(_,i)=>({id:batch+"-"+String(i).padStart(3,"0"),title:"Private parent "+i,note:"PRIVATE PARENT NOTE",personalOwnerUserId:owner,assignedToUserId:owner,status:i>=80?"CANCELLED":i>=75?"DONE":"TODO",isDone:i>=75&&i<80,progressPercent:i>=75&&i<80?100:0,dueAt:new Date(day+"T18:00:00+07:00"),reminderMinutes:null,createdAt:new Date(day+"T00:00:00+07:00")}))});
  await tx.taskItemChecklist.create({data:{id:batch+"-entry",taskItemId:batch+"-000",title:"Only this entry is shared"}});
  await tx.personalChecklistShare.create({data:{checklistItemId:batch+"-entry",userId:recipient,sharedByUserId:owner,accessLevel:"EDITOR"}});
  await tx.personalTaskShare.createMany({data:[{taskItemId:batch+"-001",userId:recipient,sharedByUserId:owner,accessLevel:"EDITOR"},{taskItemId:batch+"-002",userId:recipient,sharedByUserId:owner,accessLevel:"VIEWER"}]});
  await tx.taskItemActivity.create({data:{taskItemId:batch+"-000",sourceType:"SYSTEM",actorUserId:owner,title:"PRIVATE HISTORY",body:"Not visible to entry-only recipient"}});
 });
 const auth={id:owner,roles:[],permissions:["TASK_VIEW"]};
 const index=await getPersonalWorkPageData(auth,{summary:true});assert.equal(index.items.length,85);assert.ok(index.items.every(item=>item.detailsLoaded===false&&item.activities.length===0&&!item.note&&item.targets.length===0));
 const counts=workViewCounts(index.items,query);assert.equal(counts.ALL,75);assert.equal(counts.DONE,5);assert.equal(counts.CANCELLED,5);
 const first=await getWorkListPage(query,auth),second=await getWorkListPage({...query,cursor:first.nextCursor},auth),third=await getWorkListPage({...query,cursor:second.nextCursor},auth);
 assert.deepEqual([first.items.length,second.items.length,third.items.length],[30,30,15]);assert.equal(third.nextCursor,null);assert.equal(new Set([...first.items,...second.items,...third.items].map(item=>item.id)).size,75);assert.ok(first.items.every(item=>item.detailsLoaded===true));
 const other={id:recipient,roles:[],permissions:["TASK_VIEW"]};const shared=await getWorkListPage(query,other);assert.equal(shared.items.length,3);
 const partial=shared.items.find(item=>item.checklistOnly)!;assert.ok(partial);assert.equal(partial.title,"Đầu việc được chia sẻ");assert.equal(partial.note,null);assert.deepEqual(partial.activities,[]);assert.equal(partial.checklist[0].access,"EDITOR");assert.equal(shared.items.find(item=>item.id.endsWith("001"))!.access,"EDITOR");assert.equal(shared.items.find(item=>item.id.endsWith("002"))!.access,"VIEWER");
 const forbidden=await getPersonalWorkPageData(other,{ids:[batch+"-003"]});assert.equal(forbidden.items.length,0);
 await prisma.taskItem.update({where:{id:first.nextCursor!},data:{status:"CANCELLED"}});assert.equal((await getWorkListPage({...query,cursor:first.nextCursor},auth)).restart,true);
 await assert.rejects(()=>getWorkListPage({...query,cursor:"../invalid"},auth));
 console.log(JSON.stringify({ok:true,pages:[30,30,15],exactCounts:true,stableTies:true,partialSharePrivacy:true,viewerEditorPreserved:true,revokedCursorRestart:true}));
}
main().finally(async()=>{await prisma.taskItem.deleteMany({where:{personalOwnerUserId:owner,id:{startsWith:batch+"-"}}});await prisma.personalWorkCategory.deleteMany({where:{userId:{in:[owner,recipient]}}});await prisma.user.deleteMany({where:{id:{in:[owner,recipient]}}});await prisma.$disconnect();}).catch(error=>{console.error(error.message);process.exitCode=1;});
