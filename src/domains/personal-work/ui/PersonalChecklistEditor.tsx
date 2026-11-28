"use client";
import {useNotify} from "@/domains/shared/feedback/AppToastProvider";
import {useRef,useState} from "react";
import {AdminButton} from "@/domains/shared/ui/admin-design-contract/AdminButton";
import {editPersonalChecklistAction} from "../actions/personal-work.actions";
import {scheduleDate,scheduleTime} from "../shared/personal-work-schedule";
import type {PersonalWorkChecklistItem} from "../shared/personal-work.types";
const localValue=(value?:string|null)=>value?`${scheduleDate(value)}T${scheduleTime(value)}`:"";
const instant=(value:string)=>value?new Date(`${value}:00+07:00`).toISOString():null;
export function PersonalChecklistEditor({taskItemId,entry,readOnly,onSaved,onClose}:{taskItemId:string;entry:PersonalWorkChecklistItem;readOnly:boolean;onSaved:()=>Promise<void>;onClose:()=>void}) {
  const notify=useNotify(),saveLock=useRef(false);
  const [original]=useState(()=>({updatedAt:entry.updatedAt,startAt:entry.startAt,deadlineAt:entry.deadlineAt}));
  const [title,setTitle]=useState(entry.title),[start,setStart]=useState(localValue(entry.startAt)),[deadline,setDeadline]=useState(localValue(entry.deadlineAt)),[body,setBody]=useState("");
  const [saving,setSaving]=useState(false),[error,setError]=useState("");
  async function save(){if(saveLock.current)return;saveLock.current=true;setSaving(true);setError("");try{const result=await editPersonalChecklistAction({taskItemId,checklistItemId:entry.id,title,startAt:start===localValue(original.startAt)?original.startAt??null:instant(start),deadlineAt:deadline===localValue(original.deadlineAt)?original.deadlineAt??null:instant(deadline),updateBody:body,expectedUpdatedAt:original.updatedAt});if(result.calendarSync==="FAILED")notify.warning("Đã lưu đầu việc; chưa đồng bộ được Google Calendar. Hãy thử đồng bộ lại.");await onSaved();if(result.calendarSync!=="FAILED")notify.success(body.trim()?"Đã lưu cập nhật đầu việc":"Đã lưu đầu việc");onClose();}catch(e){setError(e instanceof Error?e.message:"Chưa lưu được đầu việc");}finally{saveLock.current=false;setSaving(false);}}
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
  </div>;
}
