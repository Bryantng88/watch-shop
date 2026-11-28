import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {prisma} from "../src/server/db/client";
import {editPersonalChecklist,personalChecklistHistory,getPersonalWorkPageData,deletePersonalWorkChecklistItem,updatePersonalWorkItem} from "../src/domains/personal-work/server/personal-work.service";
const url=new URL(process.env.DATABASE_URL||"http://invalid");
if(!["localhost","127.0.0.1"].includes(url.hostname)||!/test/.test(url.pathname))throw Error("Isolated test database required");
const prefix="checklist-schedule-"+randomUUID(),owner=prefix+"-owner",editor=prefix+"-editor",viewer=prefix+"-viewer",id=prefix+"-task",a=prefix+"-a",b=prefix+"-b";
const auth=(userId:string)=>({userId});
async function main(){
 await prisma.user.createMany({data:[owner,editor,viewer].map(id=>({id,email:id+"@example.invalid",isActive:false}))});
 await prisma.taskItem.create({data:{id,title:"Private parent",personalOwnerUserId:owner,checklists:{create:[{id:a,title:"Shared entry"},{id:b,title:"Private sibling",isDone:true,startAt:new Date("2026-11-20"),deadlineAt:new Date("2026-12-05")}]}}});
 await prisma.personalChecklistShare.createMany({data:[{checklistItemId:a,userId:editor,sharedByUserId:owner,accessLevel:"EDITOR"},{checklistItemId:a,userId:viewer,sharedByUserId:owner,accessLevel:"VIEWER"}]});
 const command={taskItemId:id,checklistItemId:a,title:"Shared entry",startAt:"2026-11-28T09:00:00+07:00",deadlineAt:"2026-11-29T18:00:00+07:00",updateBody:"First separate update"};
 await editPersonalChecklist(command,auth(editor));
 let task=await prisma.taskItem.findUniqueOrThrow({where:{id}});assert.equal(task.dueAt?.toISOString(),"2026-11-20T00:00:00.000Z");assert.equal(task.scheduledEndAt?.toISOString(),"2026-12-05T00:00:00.000Z");
 await assert.rejects(()=>editPersonalChecklist({...command,checklistItemId:b},auth(editor)));
 await assert.rejects(()=>editPersonalChecklist(command,auth(viewer)));
 await assert.rejects(()=>editPersonalChecklist({...command,expectedUpdatedAt:"2000-01-01T00:00:00.000Z"},auth(editor)));
 await assert.rejects(()=>editPersonalChecklist({...command,deadlineAt:"2026-11-01"},auth(owner)));
 assert.equal((await personalChecklistHistory(id,a,auth(editor))).filter(row=>row.body==="First separate update").length,1);
 await assert.rejects(()=>personalChecklistHistory(id,b,auth(editor)));
 const partial=(await getPersonalWorkPageData(auth(editor),{ids:[id]})).items[0];assert.equal(partial.title,"Đầu việc được chia sẻ");assert.equal(partial.checklist.length,1);assert.equal(partial.dueAt,"2026-11-28T02:00:00.000Z");assert.equal(partial.scheduledEndAt,"2026-11-29T11:00:00.000Z");assert.deepEqual(partial.activities,[]);
 await updatePersonalWorkItem({id,title:"Changed parent",dueAt:"2030-01-01"},auth(owner));task=await prisma.taskItem.findUniqueOrThrow({where:{id}});assert.equal(task.dueAt?.toISOString(),"2026-11-20T00:00:00.000Z");
 await deletePersonalWorkChecklistItem(id,b,auth(owner));task=await prisma.taskItem.findUniqueOrThrow({where:{id}});assert.equal(task.scheduledEndAt?.toISOString(),"2026-11-29T11:00:00.000Z");
 await prisma.taskItem.update({where:{id},data:{status:"CANCELLED"}});await assert.rejects(()=>editPersonalChecklist(command,auth(owner)));
 console.log("PASS: range, completed entries, edit/view/partial access, stale update, parent schedule guard, deletion and cancellation");
}
main().finally(async()=>{await prisma.taskItem.deleteMany({where:{id}});await prisma.personalWorkCategory.deleteMany({where:{userId:{in:[owner,editor,viewer]}}});await prisma.user.deleteMany({where:{id:{in:[owner,editor,viewer]}}});await prisma.$disconnect();}).catch(e=>{console.error(e.message);process.exitCode=1;});
