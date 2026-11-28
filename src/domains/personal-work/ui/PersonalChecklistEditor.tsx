"use client";
import {useNotify} from "@/domains/shared/feedback/AppToastProvider";
import {useEffect,useRef,useState} from "react";
import {AdminButton} from "@/domains/shared/ui/admin-design-contract/AdminButton";
import {editPersonalChecklistAction,personalChecklistHistoryAction} from "../actions/personal-work.actions";
import {scheduleDate,scheduleTime} from "../shared/personal-work-schedule";
import type {PersonalWorkChecklistItem,PersonalWorkActivity} from "../shared/personal-work.types";
const localValue=(value?:string|null)=>value?`${scheduleDate(value)}T${scheduleTime(value)}`:"";
const instant=(value:string)=>value?new Date(`${value}:00+07:00`).toISOString():null;
export function PersonalChecklistEditor({taskItemId,entry,readOnly,onSaved,onClose}:{taskItemId:string;entry:PersonalWorkChecklistItem;readOnly:boolean;onSaved:()=>Promise<void>;onClose:()=>void}) {
  const notify=useNotify(),saveLock=useRef(false);
  const [original]=useState(()=>({updatedAt:entry.updatedAt,startAt:entry.startAt,deadlineAt:entry.deadlineAt}));
  const [title,setTitle]=useState(entry.title),[start,setStart]=useState(localValue(entry.startAt)),[deadline,setDeadline]=useState(localValue(entry.deadlineAt)),[body,setBody]=useState("");
  const [saving,setSaving]=useState(false),[error,setError]=useState(""),[history,setHistory]=useState<PersonalWorkActivity[]|null>(null),[historyError,setHistoryError]=useState("");
  useEffect(()=>{let active=true;personalChecklistHistoryAction({taskItemId,checklistItemId:entry.id}).then(rows=>{if(active)setHistory(rows);}).catch(()=>{if(active)setHistoryError("Chưa tải được lịch sử đầu việc. Đóng và mở lại để thử.");});return()=>{active=false;};},[taskItemId,entry.id]);
  async function save(){if(saveLock.current)return;saveLock.current=true;setSaving(true);setError("");try{const result=await editPersonalChecklistAction({taskItemId,checklistItemId:entry.id,title,startAt:start===localValue(original.startAt)?original.startAt??null:instant(start),deadlineAt:deadline===localValue(original.deadlineAt)?original.deadlineAt??null:instant(deadline),updateBody:body,expectedUpdatedAt:original.updatedAt});if(result.calendarSync==="FAILED")notify.warning("Đã lưu đầu việc; chưa đồng bộ được Google Calendar. Hãy thử đồng bộ lại.");await onSaved();onClose();}catch(e){setError(e instanceof Error?e.message:"Chưa lưu được đầu việc");}finally{saveLock.current=false;setSaving(false);}}
  return <div role="region" className="col-span-full space-y-3 border-b border-slate-100 py-3" aria-label={`Chi tiết ${entry.title}`}>
    <label className="block space-y-1.5 text-xs text-slate-600">Tên đầu việc<input autoFocus value={title} maxLength={500} disabled={readOnly||saving} onChange={e=>setTitle(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"/></label>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block space-y-1.5 text-xs text-slate-600">Bắt đầu<input type="datetime-local" value={start} disabled={readOnly||saving} onChange={e=>setStart(e.target.value)} className="h-10 w-full min-w-0 rounded-lg border border-slate-200 px-2 text-sm"/></label>
      <label className="block space-y-1.5 text-xs text-slate-600">Hạn chót<input type="datetime-local" value={deadline} disabled={readOnly||saving} onChange={e=>setDeadline(e.target.value)} className="h-10 w-full min-w-0 rounded-lg border border-slate-200 px-2 text-sm"/></label>
    </div>
    <p className="text-xs text-slate-500">Giờ Việt Nam (UTC+7). Có thể chỉ đặt hạn chót; để trống cả hai nếu chưa có lịch.</p>
    {!readOnly&&<label className="block space-y-1.5 text-xs text-slate-600">Nội dung cập nhật<textarea aria-label="Nội dung cập nhật" value={body} maxLength={10000} onChange={e=>setBody(e.target.value)} disabled={saving} rows={2} placeholder="Kết quả, vấn đề hoặc bước tiếp theo của đầu việc này…" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/></label>}
    {error&&<p role="alert" className="text-xs text-rose-700">{error}</p>}
    <div className="flex justify-end gap-2"><AdminButton type="button" variant="quiet" density="compact" disabled={saving} onClick={onClose}>{readOnly?"Đóng":"Bỏ qua"}</AdminButton>{!readOnly&&<AdminButton type="button" density="compact" disabled={saving||!title.trim()} onClick={()=>void save()}>{saving?"Đang lưu…":"Lưu đầu việc"}</AdminButton>}</div>
    <details><summary className="cursor-pointer text-xs text-slate-500">Lịch sử đầu việc{history?` · ${history.length}${history.length===30?" gần nhất":" mốc"}`:""}</summary>
      <div className="max-h-48 space-y-3 overflow-y-auto pt-3">{historyError?<p role="alert" className="text-xs text-rose-700">{historyError}</p>:history===null?<p role="status" className="text-xs text-slate-500">Đang tải…</p>:!history.length?<p className="text-xs text-slate-500">Chưa có cập nhật riêng.</p>:history.map(row=><div key={row.id} className="text-xs text-slate-600"><p className="font-medium">{row.title}</p>{row.body&&<p className="whitespace-pre-wrap">{row.body}</p>}<p className="text-slate-500">{row.actor?.name||"Hệ thống"} · {scheduleDate(row.occurredAt).split("-").reverse().join("/")} {scheduleTime(row.occurredAt)}</p></div>)}</div>
    </details>
  </div>;
}
