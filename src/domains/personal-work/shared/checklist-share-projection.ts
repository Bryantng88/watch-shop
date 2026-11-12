import type {PersonalWorkItem,PersonalWorkChecklistItem} from "./personal-work.types";
// Apply on the server before serializing a partial recipient's response.
export function checklistOnlyWork(item:PersonalWorkItem,entries:PersonalWorkChecklistItem[],updatedAt?:string):PersonalWorkItem {
  const done=entries.filter(e=>e.isDone).length;
  return {...item,checklistOnly:true,access:"VIEWER",assignedToMe:false,assignee:null,
    note:null,tags:[],targets:[],activities:[],sharedWith:[],codexRun:null,codexRuns:[],
    category:{key:"GENERAL",label:"Đầu việc",color:"#7c3aed",domain:"GENERAL",isDefault:true},domain:"GENERAL",workType:"REMINDER",
    updatedAt:updatedAt??item.createdAt,progressMode:"CHECKLIST",progressPercent:entries.length?Math.round(done/entries.length*100):0,
    checklist:entries.map(entry=>({...entry,sharedWith:[]})),
    calendar:{synced:false,htmlLink:null,lastSyncedAt:null},reminderMinutes:null};
}
