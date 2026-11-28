"use client";
import {useCallback,useEffect,useId,useRef,useState} from "react";
import {X} from "lucide-react";
import {AdminButton} from "@/domains/shared/ui/admin-design-contract/AdminButton";
import {personalChecklistHistoryAction} from "../actions/personal-work.actions";
import {PersonalWorkFloatingPanel} from "./PersonalWorkFloatingPanel";
import {checklistMomentLabel} from "../shared/checklist-schedule";
import type {PersonalWorkActivity,PersonalWorkChecklistItem} from "../shared/personal-work.types";

export function PersonalChecklistUpdates({taskItemId,entry}:{taskItemId:string;entry:PersonalWorkChecklistItem}) {
  const [open,setOpen]=useState(false),[rows,setRows]=useState<PersonalWorkActivity[]|null>(null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
  const trigger=useRef<HTMLButtonElement>(null),id=useId();
  const close=useCallback(()=>setOpen(false),[]);
  useEffect(()=>{
    if(!open)return;
    let active=true;setRows(null);setError(false);
    personalChecklistHistoryAction({taskItemId,checklistItemId:entry.id,updatesOnly:true}).then(result=>{if(active)setRows(result);}).catch(()=>{if(active)setError(true);});
    return()=>{active=false;};
  },[open,taskItemId,entry.id,entry.updatedAt,attempt]);
  if(!entry.latestUpdate)return null;
  return <>
    <AdminButton ref={trigger} type="button" variant="contextual" density="compact" aria-label={`Xem cập nhật ${entry.title}`} aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>setOpen(value=>!value)} className="block max-w-full truncate text-left text-xs text-blue-700">Có cập nhật · {checklistMomentLabel(entry.latestUpdate.occurredAt)}</AdminButton>
    {open&&<PersonalWorkFloatingPanel anchor={trigger.current} onClose={close} id={id} label={`Cập nhật · ${entry.title}`} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-lg">
      <div className="mb-2 flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-sm font-semibold">Cập nhật đầu việc</p><p className="break-words text-xs text-slate-500">{entry.title}</p></div><AdminButton type="button" variant="quiet" iconOnly density="compact" aria-label="Đóng cập nhật đầu việc" onClick={()=>{close();trigger.current?.focus();}}><X className="h-4 w-4"/></AdminButton></div>
      <div className="max-h-64 space-y-3 overflow-y-auto overscroll-contain" tabIndex={0}>
        {error?<div role="alert" className="text-xs text-rose-700">Chưa tải được cập nhật.<AdminButton type="button" variant="quiet" density="compact" onClick={()=>setAttempt(value=>value+1)}>Thử lại</AdminButton></div>:rows===null?<p role="status" className="text-xs text-slate-500">Đang tải cập nhật…</p>:!rows.length?<p className="text-xs text-slate-500">Chưa có nội dung cập nhật.</p>:rows.map(row=><article key={row.id} className="space-y-1 border-t border-slate-100 pt-2 first:border-0 first:pt-0"><p className="whitespace-pre-wrap break-words text-sm">{row.body}</p><p className="text-xs text-slate-500">{row.actor?.name||"Hệ thống"} · {checklistMomentLabel(row.occurredAt)}</p></article>)}
      </div>
      {rows?.length===30&&<p className="mt-2 text-xs text-slate-500">30 cập nhật gần nhất</p>}
    </PersonalWorkFloatingPanel>}
  </>;
}
