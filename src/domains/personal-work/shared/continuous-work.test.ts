import test from "node:test";
import assert from "node:assert/strict";
import { assertContinuousSchedule, assertContinuousUpdate, isContinuousWork } from "./continuous-work";
import { personalDayBucket } from "./personal-work-day";
import { buildPersonalCalendarEvents } from "./personal-calendar";
import type { PersonalWorkItem } from "./personal-work.types";
test("continuous is one indefinite item, separate from unscheduled/today/overdue and date events",()=>{
  assert.equal(isContinuousWork("continuous"),true);
  for(const dueAt of [null,new Date("2020-01-01"),new Date("2040-01-01")])assert.equal(personalDayBucket({workTypeId:"CONTINUOUS",dueAt,scheduledEndAt:null,estimatedDays:1},Date.now(),Date.now()+86400000),"CONTINUOUS");
  assert.deepEqual(buildPersonalCalendarEvents([{id:"c",title:"Maintain",workType:"CONTINUOUS",status:"IN_PROGRESS",dueAt:"2020-01-01"} as PersonalWorkItem],[]),[]);
});
test("no deadlines, duration, date reminders or Codex auto execution",()=>{
  assert.doesNotThrow(()=>assertContinuousSchedule({dueAt:null,scheduledEndAt:null,reminderMinutes:null,estimatedDays:1}));
  for(const input of [{dueAt:"2030-01-01"},{scheduledEndAt:"2030-01-01"},{reminderMinutes:0},{estimatedDays:2},{tags:["CoDeX"]}])assert.throws(()=>assertContinuousSchedule(input));
});
test("editors can update; only owners stop, and neither can complete/convert the parent",()=>{
  assert.doesNotThrow(()=>assertContinuousUpdate("CONTINUOUS",{workType:"CONTINUOUS"},false));
  assert.doesNotThrow(()=>assertContinuousUpdate("CONTINUOUS",{status:"CANCELLED"},true));
  for(const input of [{status:"DONE"},{status:"TODO"},{progressPercent:100},{progressMode:"MANUAL"},{workType:"GENERAL_TASK"}])assert.throws(()=>assertContinuousUpdate("CONTINUOUS",input,true));
  assert.throws(()=>assertContinuousUpdate("CONTINUOUS",{status:"CANCELLED"},false));
  assert.throws(()=>assertContinuousUpdate("GENERAL_TASK",{workType:"CONTINUOUS"},true));
});
