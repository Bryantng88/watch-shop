import assert from "node:assert/strict";
import {test} from "node:test";
import {personalWorkUpdateSchema,personalWorkUpdateInput} from "./personal-work-update";
import {personalWorkPlanSchema} from "./personal-work-contract";
import {assistantCapabilities} from "./capabilities";
const plan={itemId:"task",expectedUpdatedAt:"2026-11-10T10:00:00+07:00",fields:["status"],changes:{title:null,note:null,dueAt:null,scheduledEndAt:null,status:"DONE"}};
test("personal update only applies explicitly selected fields and cannot inject ownership or progress",()=>{
 assert.deepEqual(personalWorkUpdateInput(personalWorkUpdateSchema.parse(plan)),{status:"DONE"});
 for(const extra of [{fields:[]},{fields:["status","status"]},{ownerId:"another"},{changes:{...plan.changes,title:"Unselected overwrite"}},{changes:{...plan.changes,status:null}},{changes:{...plan.changes,progressPercent:100}}])assert.equal(personalWorkUpdateSchema.safeParse({...plan,...extra}).success,false);
 const clear=personalWorkUpdateSchema.parse({...plan,fields:["note"],changes:{...plan.changes,status:null}});assert.deepEqual(personalWorkUpdateInput(clear),{note:null});
});
test("assigning work is separate from personal creation rights; events do not gain assignees",()=>{
 const reader={admin:false,permissions:new Set(["TASK_VIEW"])};assert.equal(assistantCapabilities(reader).canCreatePersonalWork,true);assert.equal(assistantCapabilities(reader).canAssignPersonalWork,false);
 assert.equal(assistantCapabilities({...reader,permissions:new Set(["TASK_VIEW","TASK_MANAGE"])}).canAssignPersonalWork,true);
 const event={assigneeUserId:"Vi",kind:"EVENT",title:"Meeting",note:null,categoryKey:"GENERAL",workType:null,dueAt:"2026-11-10T10:00:00+07:00",scheduledEndAt:null,tags:[],shares:[],priority:"MEDIUM",checklist:[],syncGoogle:false};assert.equal(personalWorkPlanSchema.safeParse(event).success,false);
});
