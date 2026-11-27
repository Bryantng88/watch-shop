import test from "node:test";
import assert from "node:assert/strict";
import {personalWorkTransition} from "./personal-work-lifecycle";
test("only the owner cancels with a reason; repeated cancellation is idempotent",()=>{
  const current={status:"IN_PROGRESS",workTypeId:null},input={id:"a",status:"CANCELLED",updateBody:"No longer needed"};
  assert.throws(()=>personalWorkTransition(current,input,false),/chủ sở hữu/);
  assert.throws(()=>personalWorkTransition(current,{...input,updateBody:""},true),/lý do/);
  assert.throws(()=>personalWorkTransition({...current,status:"DONE"},input,true),/hoàn thành/);
  assert.equal(personalWorkTransition(current,input,true).cancelling,true);
  assert.equal(personalWorkTransition({...current,status:"CANCELLED"},input,true).duplicate,true);
});
test("cancelled work is read only, restoration preserves the work kind",()=>{
  const item={status:"CANCELLED",workTypeId:null};
  assert.throws(()=>personalWorkTransition(item,{title:"stale"},true),/chỉ được xem/);
  assert.throws(()=>personalWorkTransition(item,{status:"DONE"},true),/chỉ được xem/);
  assert.throws(()=>personalWorkTransition(item,{status:"TODO",title:"also edit"},true),/Không chỉnh/);
  assert.equal(personalWorkTransition(item,{status:"IN_PROGRESS",dueAt:null},true).restoring,true);
  assert.throws(()=>personalWorkTransition({...item,workTypeId:"CONTINUOUS"},{status:"TODO"},true));
  assert.equal(personalWorkTransition({...item,workTypeId:"CONTINUOUS"},{status:"IN_PROGRESS"},true).restoring,true);
});

import {checklistOnlyWork} from "./checklist-share-projection";
import type {PersonalWorkItem} from "./personal-work.types";
test("entry-only recipients never receive private cancellation metadata or parent title",()=>{
  const parent={id:"parent",title:"Private parent",createdAt:"2026-11-27T00:00:00Z",note:"Private note",workType:null,cancellationReason:"Private reason",cancelledBy:{name:"Private actor"},activities:[{body:"Private history"}],tags:["Private tag"]} as unknown as PersonalWorkItem;
  const result=checklistOnlyWork(parent,[{id:"entry",title:"Allowed entry",isDone:false}]);
  assert.equal(result.title,"Đầu việc được chia sẻ");assert.equal(result.cancellationReason,null);assert.equal(result.cancelledBy,null);assert.ok(!JSON.stringify(result).includes("Private"));
});
