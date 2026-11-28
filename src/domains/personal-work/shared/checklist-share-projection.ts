import {checklistScheduleRange} from "./checklist-schedule";
import type {PersonalWorkItem,PersonalWorkChecklistItem} from "./personal-work.types";
import {isContinuousWork} from "./continuous-work";
// Apply on the server before serializing a partial recipient's response.
export function checklistOnlyWork(item:PersonalWorkItem,entries:PersonalWorkChecklistItem[],updatedAt?:string):PersonalWorkItem {
  const done=entries.filter(e=>e.isDone).length;
  const range=isContinuousWork(item.workType)?{dueAt:null,scheduledEndAt:null}:checklistScheduleRange(entries);
  const estimatedDays=range.dueAt&&range.scheduledEndAt?Math.max(1,Math.ceil((Date.parse(range.scheduledEndAt)-Date.parse(range.dueAt))/86400000)):1;
  return {...item,...range,estimatedDays,title:"Đầu việc được chia sẻ",checklistOnly:true,access:"VIEWER",assignedToMe:false,assignee:null,
    note:null,cancelledBy:null,cancellationReason:null,tags:[],targets:[],activities:[],sharedWith:[],codexRun:null,codexRuns:[],mergeSources:[],
    category:{key:"GENERAL",label:"Đầu việc",color:"#7c3aed",domain:"GENERAL",isDefault:true},domain:"GENERAL",workType:isContinuousWork(item.workType)?"CONTINUOUS":"REMINDER",
    updatedAt:updatedAt??item.createdAt,progressMode:"CHECKLIST",progressPercent:entries.length?Math.round(done/entries.length*100):0,
    checklist:entries.map(entry=>({...entry,sharedWith:[]})),
    calendar:{synced:false,htmlLink:null,lastSyncedAt:null},reminderMinutes:null};
}
