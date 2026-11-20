"use client";
import { AdminAnchorAction, AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ClipboardPlus, ClipboardList, X } from "lucide-react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { MEDIA_DAILY_PARTS, mediaDayToday, type MediaDailyRequest, type DailyMediaWorkSummary } from "@/domains/personal-work/shared/media-daily";
import { addDailyMediaWorkAction, mediaDailyAssigneesAction, mediaDailyStateAction } from "../../client/media-work/media-daily.actions";
import { mediaDailyChanged } from "../../client/media-work/media-daily-state";
type Person={id:string;name:string|null;email:string|null};
export default function WatchMediaDailyWorkButton({productId,watchTitle,sku,part}:{productId:string;watchTitle:string;sku:string;part:MediaDailyRequest['part']}) {
  const [open,setOpen]=useState(false),[users,setUsers]=useState<Person[]>([]),[assignee,setAssignee]=useState(''),[day,setDay]=useState(mediaDayToday),[request,setRequest]=useState(''),[pending,setPending]=useState(false),[error,setError]=useState('');
  const [summary,setSummary]=useState<DailyMediaWorkSummary>(),[checking,setChecking]=useState(true),[statusError,setStatusError]=useState(false);
  const refreshStatus=useRef<()=>void>(()=>{});
  const trigger=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLDivElement>(null),text=useRef<HTMLTextAreaElement>(null),identity=useRef<{signature:string;key:string}|null>(null);
  const [openedPart,setOpenedPart]=useState(part);
  const notify=useNotify();
  useEffect(()=>{if(!open)return;let active=true;void mediaDailyAssigneesAction().then(data=>{if(active){setUsers(data.users);setAssignee(data.currentUserId);}}).catch(reason=>{if(active)setError(reason instanceof Error?reason.message:'Chưa tải được người phụ trách.');});text.current?.focus();return()=>{active=false;};},[open]);
  useEffect(()=>{
    let active=true;
    const load=async()=>{setChecking(true);try{const values=await mediaDailyStateAction([productId]);if(active){setSummary(values[0]);setStatusError(false);}}catch{if(active)setStatusError(true);}finally{if(active)setChecking(false);}};
    refreshStatus.current=()=>{void load();};void load();window.addEventListener('focus',refreshStatus.current);
    const listener=refreshStatus.current;
    return()=>{active=false;window.removeEventListener('focus',listener);};
  },[productId]);
  function close(){if(pending)return;setOpen(false);trigger.current?.focus();}
  async function submit(){
    if(pending||!request.trim()||!assignee)return;
    const values={productId,assigneeUserId:assignee,day,part:openedPart,request:request.trim()};
    const signature=JSON.stringify(values);if(identity.current?.signature!==signature)identity.current={signature,key:crypto.randomUUID()};
    setPending(true);setError('');
    try{const result=await addDailyMediaWorkAction({...values,requestKey:identity.current.key});setSummary(old=>({productId,count:Math.max(1,old?.count??0),taskItemId:result.taskItemId,checklistItemId:result.checklistItemId}));mediaDailyChanged(productId);refreshStatus.current();setOpen(false);trigger.current?.focus();notify.success({title:result.created?'Đã tạo việc media trong ngày':'Đã thêm đầu việc media',message:result.reopened?'Việc trong ngày đã được mở lại để xử lý đầu việc mới.':'Đầu việc đã được đưa vào Quản lý công việc của người phụ trách.'});}
    catch(reason){setError(reason instanceof Error?reason.message:'Chưa tạo được đầu việc.');}
    finally{setPending(false);}
  }
  return <>
    {summary?.count&&summary.taskItemId?<AdminAnchorAction variant="secondary" density="compact" href={'/admin/personal-work?view=list&item='+encodeURIComponent(summary.taskItemId)} target="_blank" rel="noreferrer" title="Mở các đầu việc media đang có" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-violet-50 px-3 text-xs font-medium text-violet-700"><ClipboardList size={15}/>{summary.count} việc media đang mở</AdminAnchorAction>:null}
    <AdminButton variant="secondary" density="compact" ref={trigger} type="button" disabled={checking} onClick={()=>{if(statusError){refreshStatus.current();return;}identity.current=null;setOpenedPart(part);setRequest('Xử lý '+MEDIA_DAILY_PARTS[part].toLowerCase());setDay(mediaDayToday());setError('');setOpen(true);}} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800"><ClipboardPlus size={16}/>{checking?"Kiểm tra việc…":statusError?"Thử kiểm tra việc":summary?.count?"Thêm yêu cầu khác":"Tạo việc WatchShop"}</AdminButton>

    {open&&typeof document!=='undefined'&&createPortal(<div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="media-work-title" className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();close();}if(event.key==='Tab'){const nodes=dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}}>
        <div className="flex items-start justify-between gap-3"><div><h2 id="media-work-title" className="text-lg font-semibold">Thêm đầu việc media</h2><p className="mt-1 text-xs leading-5 text-slate-500">Mỗi người phụ trách có một việc media/ngày. Yêu cầu mới sẽ thêm thành đầu việc trong việc đó. Nếu việc đã xong, yêu cầu mới sẽ mở lại việc của ngày.</p></div><AdminButton variant="secondary" type="button" aria-label="Đóng tạo đầu việc media" disabled={pending} onClick={close} className="p-2"><X size={18}/></AdminButton></div>
        <p className="my-4 rounded-lg bg-slate-50 p-3 text-sm"><strong>{watchTitle}</strong>{sku&&<span className="mt-1 block text-xs text-slate-500">{sku}</span>}</p>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium">Người phụ trách<select aria-label="Người phụ trách media" value={assignee} disabled={pending||!users.length} onChange={event=>setAssignee(event.target.value)} className="mt-1 h-10 w-full rounded-lg border bg-white px-2 text-sm"><option value="">Chọn người</option>{users.map(user=><option key={user.id} value={user.id}>{user.name||user.email}</option>)}</select></label><label className="text-xs font-medium">Ngày làm việc<input aria-label="Ngày làm việc media" type="date" value={day} disabled={pending} onChange={event=>setDay(event.target.value)} className="mt-1 h-10 w-full rounded-lg border px-2 text-sm"/></label></div>
        <label className="mt-4 block text-xs font-medium">Cần làm gì cho watch này?<textarea ref={text} aria-label="Yêu cầu media" value={request} disabled={pending} onChange={event=>setRequest(event.target.value)} maxLength={300} rows={3} className="mt-1 w-full rounded-lg border p-3 text-sm"/></label>
        {error&&<p role="alert" className="mt-3 text-xs text-rose-700">{error}</p>}
        <div className="mt-4 flex justify-end gap-2"><AdminButton variant="secondary" type="button" onClick={close} disabled={pending} className="min-h-10 px-3 text-sm text-slate-600">Hủy</AdminButton><AdminButton variant="primary" type="button" onClick={()=>void submit()} disabled={pending||!assignee||!request.trim()||!day} className="min-h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-40">{pending?'Đang thêm…':'Thêm đầu việc'}</AdminButton></div>
      </div>
    </div>,document.body)}
  </>;
}
