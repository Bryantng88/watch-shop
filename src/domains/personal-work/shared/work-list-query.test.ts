import assert from "node:assert/strict";
import test from "node:test";
import {matchesWorkList,compareWorkList,workViewCounts,type WorkListQuery} from "./work-list-query";
import type {PersonalWorkItem} from "./personal-work.types";
function item(overrides:Partial<PersonalWorkItem>={}):PersonalWorkItem{return {id:"work",title:"Work",note:null,status:"TODO",priority:"MEDIUM",dueAt:"2026-11-27T09:00:00+07:00",scheduledEndAt:null,estimatedDays:1,completedAt:null,domain:"GENERAL",category:{key:"GENERAL",label:"Cá nhân",domain:"GENERAL",color:"#64748b",isDefault:true},workType:null,targets:[],progressPercent:0,progressMode:"MANUAL",checklistLockedAt:null,activities:[],checklist:[],tags:[],calendar:{synced:false,htmlLink:null,lastSyncedAt:null},access:"OWNER",owner:{id:"u",name:"User",email:"fixture@example.invalid",avatarUrl:null},sharedWith:[],...overrides};}
const query:WorkListQuery={view:"ALL",scope:"ALL",domain:"ALL",day:"2026-11-27"};
test("counts use the same predicates over every authorized item, not a loaded page",()=>{
 const rows=[...Array.from({length:65},(_,i)=>item({id:String(i)})),item({status:"DONE"}),item({status:"CANCELLED"}),item({dueAt:null}),item({dueAt:"2026-11-26T10:00:00+07:00"}),item({dueAt:"2026-11-28T10:00:00+07:00"}),item({workType:"EVENT"}),item({workType:"CONTINUOUS",dueAt:null,status:"IN_PROGRESS"})];
 const counts=workViewCounts(rows,query);assert.equal(counts.ALL,70);assert.equal(counts.TODAY,67);assert.equal(counts.OVERDUE,1);assert.equal(counts.UPCOMING,1);assert.equal(counts.DONE,1);assert.equal(counts.CANCELLED,1);assert.equal(counts.EVENTS,1);
});
test("scope and custom category apply to every view; entry-only recipients retain their projected scope",()=>{
 const shared=item({access:"VIEWER"});assert.equal(matchesWorkList(shared,{...query,scope:"MINE"}),false);assert.equal(matchesWorkList(shared,{...query,scope:"SHARED"}),true);assert.equal(matchesWorkList({...shared,checklistOnly:true},{...query,scope:"MINE"}),true);assert.equal(matchesWorkList(shared,{...query,domain:"MEDIA"}),false);
});
test("Vietnam midnight and stable ties do not skip or duplicate rows",()=>{
 assert.equal(matchesWorkList(item({dueAt:"2026-11-27T17:00:00Z"}),{...query,view:"UPCOMING"}),true);
 const rows=Array.from({length:75},(_,i)=>item({id:String(i).padStart(3,"0"),createdAt:"2026-11-27T00:00:00Z"})).reverse().sort(compareWorkList);assert.equal(new Set(rows.map(x=>x.id)).size,75);assert.deepEqual(rows.map(x=>x.id),[...rows].reverse().sort(compareWorkList).map(x=>x.id));
});
