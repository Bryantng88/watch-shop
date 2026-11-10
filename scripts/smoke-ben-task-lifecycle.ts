import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {prisma as p} from "../src/server/db/client";
import {sendAssistant,assistantWorker,approveAssistantPersonalWork,approveAssistantPersonalWorkUpdate,listAssistant} from "../src/domains/ai-assistant/server/service";
import {createPersonalWorkItem,addPersonalWorkChecklistItem,getPersonalWorkPageData} from "../src/domains/personal-work/server/personal-work.service";
async function main(){
 const db=new URL(process.env.DATABASE_URL||"");assert.equal(db.hostname,"127.0.0.1");assert.equal(db.pathname,"/personal_codex_test");
 assert.equal(await p.customerAssistantConversation.count({where:{status:{in:["QUEUED","RUNNING"]}}}),0);
 const suffix=randomUUID(),users:string[]=[];
 for(const code of ["TASK_VIEW","TASK_MANAGE"])await p.permission.upsert({where:{code},create:{code},update:{}});
 const role=await p.role.create({data:{name:"task-ben-"+suffix,permissions:{connect:[{code:"TASK_VIEW"},{code:"TASK_MANAGE"}]}}});
 const viewer=await p.role.create({data:{name:"task-reader-"+suffix,permissions:{connect:{code:"TASK_VIEW"}}}});
 async function user(name:string,manage=false){const u=await p.user.create({data:{name,email:randomUUID()+"@example.invalid",roles:{connect:{id:manage?role.id:viewer.id}}}});users.push(u.id);return u;}
 const owner=await user("Task owner",true),vi=await user("Vi fixture"),outsider=await user("Outsider");
 async function start(userId:string,text:string,id?:string){const c=await sendAssistant(userId,{id,requestKey:randomUUID(),text});const r=(await assistantWorker("claim",{}) as {run:{id:string;leaseToken:string}}).run;assert.equal(r.id,c.id);return {c,r};}
 async function lookup(r:object,tool:string,query?:string){return (await assistantWorker("lookup",{...r,lookup:{tool,...(query?{query}:{})}})) as {evidence:{result:Record<string,unknown>}};}
 const changes={title:null,note:null,dueAt:null,scheduledEndAt:null,status:"DONE"};
 try{
  const count=await p.taskItem.count(),orders=await p.order.count(),issues=await p.technicalIssue.count();
  const {c,r}=await start(owner.id,"Tạo cho Vi việc cập nhật giá dịch vụ, bắt đầu hôm nay, hạn thứ năm.");
  await lookup(r,"personalWork.categories");await lookup(r,"personalWork.people",vi.id);
  const plan={assigneeUserId:vi.id,kind:"TASK",title:"Cập nhật giá dịch vụ vệ sinh sửa chữa",note:null,categoryKey:"GENERAL",workType:null,dueAt:"2026-11-10T00:00:00+07:00",scheduledEndAt:"2026-11-12T23:59:59.999+07:00",tags:[],shares:[],priority:"MEDIUM",checklist:[],syncGoogle:false};
  await assert.rejects(assistantWorker("finish",{...r,reply:"Review",personalWorkPlan:{...plan,shares:[{userId:vi.id,accessLevel:"VIEWER"}]}}));
  await assistantWorker("finish",{...r,reply:"Review",personalWorkPlan:plan});assert.equal(await p.taskItem.count(),count);
  const review=(await listAssistant(owner.id,c.id)).conversations[0];assert.equal(review.personalWorkDraft?.assignee?.id,vi.id);
  const approved=await Promise.all([approveAssistantPersonalWork(owner.id,c.id,review.revision!),approveAssistantPersonalWork(owner.id,c.id,review.revision!)]);
  const id=approved[0].createdPersonalWork![0].id;assert.equal(approved[1].createdPersonalWork![0].id,id);assert.equal(await p.taskItem.count(),count+1);
  const task=await p.taskItem.findUniqueOrThrow({where:{id}});assert.equal(task.personalOwnerUserId,owner.id);assert.equal(task.assignedToUserId,vi.id);assert.equal(task.startedAt,null);assert.equal(task.status,"TODO");assert.equal(task.scheduledEndAt?.toISOString(),"2026-11-12T16:59:59.999Z");assert.equal(await p.personalTaskShare.count({where:{taskItemId:id,userId:vi.id,accessLevel:"EDITOR"}}),1);
  const viPage=await getPersonalWorkPageData(vi);const assigned=viPage.items.find(t=>t.id===id);assert.equal(assigned?.assignedToMe,true);assert.equal(assigned?.assignee?.id,vi.id);assert.equal(assigned?.access,"EDITOR");
  const update=await start(vi.id,"Đã cập nhật giá xong rồi.");const search=await lookup(update.r,"personalWork.search","Cập nhật giá");assert.equal((search.evidence.result.matches as {id:string}[])[0].id,id);
  const detail=await lookup(update.r,"personalWork.detail",id),e=detail.evidence.result.item as {updatedAt:string};
  const updatePlan={itemId:id,expectedUpdatedAt:e.updatedAt,fields:["status"],changes};
  await assistantWorker("finish",{...update.r,reply:"Review",personalWorkUpdatePlan:updatePlan});assert.equal((await p.taskItem.findUniqueOrThrow({where:{id}})).status,"TODO");
  const ur=(await listAssistant(vi.id,update.c.id)).conversations[0];await assert.rejects(approveAssistantPersonalWorkUpdate(outsider.id,update.c.id,ur.revision!));
  await Promise.all([approveAssistantPersonalWorkUpdate(vi.id,update.c.id,ur.revision!),approveAssistantPersonalWorkUpdate(vi.id,update.c.id,ur.revision!)]);
  const done=await p.taskItem.findUniqueOrThrow({where:{id}});assert.equal(done.status,"DONE");assert.equal(done.isDone,true);assert.ok(done.completedAt);assert.equal(done.dueAt?.toISOString(),task.dueAt?.toISOString());assert.equal(done.scheduledEndAt?.toISOString(),task.scheduledEndAt?.toISOString());assert.equal(await p.taskItemActivity.count({where:{taskItemId:id,title:"Cập nhật tiến độ"}}),1);
  // Concurrent edit fences approval; no lost updates.
  const stale=await start(owner.id,"Đổi ghi chú công việc");const d=await lookup(stale.r,"personalWork.detail",id);await assistantWorker("finish",{...stale.r,reply:"Review",personalWorkUpdatePlan:{itemId:id,expectedUpdatedAt:(d.evidence.result.item as {updatedAt:string}).updatedAt,fields:["note"],changes:{...changes,status:null,note:"Ben edit"}}});const sr=(await listAssistant(owner.id,stale.c.id)).conversations[0];await p.taskItem.update({where:{id},data:{note:"New external edit"}});await assert.rejects(approveAssistantPersonalWorkUpdate(owner.id,stale.c.id,sr.revision!));assert.equal((await p.taskItem.findUniqueOrThrow({where:{id}})).note,"New external edit");
  // Fresh evidence cannot turn VIEWER into editor, even for completion.
  await p.personalTaskShare.create({data:{taskItemId:id,userId:outsider.id,sharedByUserId:owner.id,accessLevel:"VIEWER"}});
  const denied=await start(outsider.id,"Hoàn thành việc này");const dd=await lookup(denied.r,"personalWork.detail",id);await assert.rejects(assistantWorker("finish",{...denied.r,reply:"Review",personalWorkUpdatePlan:{...updatePlan,expectedUpdatedAt:(dd.evidence.result.item as {updatedAt:string}).updatedAt}}));await assistantWorker("finish",{...denied.r,reply:"Bạn chỉ có quyền xem."});
  const revoke=await start(vi.id,"Đổi tên việc");const rd=await lookup(revoke.r,"personalWork.detail",id);await assistantWorker("finish",{...revoke.r,reply:"Review",personalWorkUpdatePlan:{itemId:id,expectedUpdatedAt:(rd.evidence.result.item as {updatedAt:string}).updatedAt,fields:["title"],changes:{...changes,status:null,title:"Renamed"}}});const rr=(await listAssistant(vi.id,revoke.c.id)).conversations[0];await p.personalTaskShare.deleteMany({where:{taskItemId:id,userId:vi.id}});await assert.rejects(approveAssistantPersonalWorkUpdate(vi.id,revoke.c.id,rr.revision!));assert.equal((await listAssistant(vi.id,revoke.c.id)).conversations[0].personalWorkUpdateDraft,undefined);
  const noAssign=await start(outsider.id,"Giao việc cho Vi");await lookup(noAssign.r,"personalWork.categories");await lookup(noAssign.r,"personalWork.people",vi.id);await assert.rejects(assistantWorker("finish",{...noAssign.r,reply:"Review",personalWorkPlan:plan}));await assistantWorker("finish",{...noAssign.r,reply:"Chưa có quyền giao việc."});
  const checklist=await createPersonalWorkItem({title:"Checklist fixture"},owner);await addPersonalWorkChecklistItem(checklist.id,"Not done",owner);const cp=await start(owner.id,"Hoàn thành checklist");const cd=await lookup(cp.r,"personalWork.detail",checklist.id);await assert.rejects(assistantWorker("finish",{...cp.r,reply:"Review",personalWorkUpdatePlan:{...updatePlan,itemId:checklist.id,expectedUpdatedAt:(cd.evidence.result.item as {updatedAt:string}).updatedAt}}));await assistantWorker("finish",{...cp.r,reply:"Cần xác nhận checklist."});
  const revokedAssign=await start(owner.id,"Giao thêm một việc cho Vi");await lookup(revokedAssign.r,"personalWork.categories");await lookup(revokedAssign.r,"personalWork.people",vi.id);await assistantWorker("finish",{...revokedAssign.r,reply:"Review",personalWorkPlan:plan});const ar=(await listAssistant(owner.id,revokedAssign.c.id)).conversations[0];await p.role.update({where:{id:role.id},data:{permissions:{disconnect:{code:"TASK_MANAGE"}}}});await assert.rejects(approveAssistantPersonalWork(owner.id,revokedAssign.c.id,ar.revision!));assert.equal((await listAssistant(owner.id,revokedAssign.c.id)).conversations[0].personalWorkDraft,undefined);await p.role.update({where:{id:role.id},data:{permissions:{connect:{code:"TASK_MANAGE"}}}});
  const event=await createPersonalWorkItem({title:"Event fixture",workType:"EVENT",dueAt:"2026-11-12T19:00:00+07:00"},owner);const ep=await start(owner.id,"Hoàn thành sự kiện");const ed=await lookup(ep.r,"personalWork.detail",event.id);await assert.rejects(assistantWorker("finish",{...ep.r,reply:"Review",personalWorkUpdatePlan:{...updatePlan,itemId:event.id,expectedUpdatedAt:(ed.evidence.result.item as {updatedAt:string}).updatedAt}}));await assistantWorker("finish",{...ep.r,reply:"Sự kiện không cần hoàn thành."});
  assert.equal(await p.order.count(),orders);assert.equal(await p.technicalIssue.count(),issues);
  console.log("PASS: assignment and shared editing, real task/dates, no write before approval, concurrent replay, stale target, viewer/owner boundaries, revoked shares, missing assignment permission, checklist guard, no order/TI side effects. Scripted model; isolated DB.");
 }finally{await p.customerAssistantConversation.updateMany({where:{ownerId:{in:users},status:{in:["QUEUED","RUNNING"]}},data:{status:"FAILED",leaseToken:null,leaseExpiresAt:null}});await p.user.updateMany({where:{id:{in:users}},data:{isActive:false}});}
}
main().finally(()=>p.$disconnect()).catch(e=>{console.error(e);process.exitCode=1;});
