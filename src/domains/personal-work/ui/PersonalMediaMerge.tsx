"use client";
import { useEffect, useRef, useState } from "react";
import { Layers2 } from "lucide-react";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract";
import { ADMIN_UI_FOUNDATION as F } from "@/domains/shared/ui/admin-design-contract/admin-ui.foundation";
import { previewPersonalMediaMergeAction, mergePersonalMediaWorkAction } from "../actions/personal-work.actions";
import type { PersonalWorkItem } from "../shared/personal-work.types";
import type { MediaMergePreview } from "../shared/media-merge";
export function PersonalMediaMerge({items,onMerged}:{items:PersonalWorkItem[];onMerged:(id:string)=>void}){
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false),[ids,setIds]=useState<string[]>([]),[preview,setPreview]=useState<MediaMergePreview|null>(null),[title,setTitle]=useState(""),[error,setError]=useState(""),[pending,setPending]=useState(false);
  const request=useRef("");
  const candidates=items.filter(item=>item.workType!=="CONTINUOUS"&&item.access==="OWNER"&&!item.checklistOnly&&["TODO","IN_PROGRESS"].includes(item.status));
  useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close();},[open]);
  const close=()=>{if(pending)return;setOpen(false);trigger.current?.focus();};
  return <>
    <AdminButton ref={trigger} variant="quiet" density="compact" type="button" onClick={()=>{setIds([]);setPreview(null);setError("");setOpen(true);request.current=crypto.randomUUID();}}><Layers2 className="h-4 w-4" />Gộp công việc</AdminButton>
    <dialog ref={dialog} aria-labelledby="media-merge-title" onCancel={event=>{event.preventDefault();close();}} onClose={()=>setOpen(false)} style={{zIndex:F.layers.dialog}} className="m-auto w-[calc(100%-24px)] max-w-xl rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-xl backdrop:bg-slate-950/30">
      <h2 id="media-merge-title" className="text-lg font-semibold text-slate-950">Gộp công việc</h2>
      <p className="my-2 text-xs text-slate-500">Chỉ gộp việc media Watch chưa hoàn tất, cùng chủ sở hữu và quyền chia sẻ. Cùng nhãn WatchShop chưa đủ điều kiện.</p>
      {error&&<p role="alert" className="my-3 rounded-md bg-rose-50 p-3 text-rose-800">{error}</p>}
      {!preview?<div className="my-3 max-h-[50dvh] overflow-y-auto divide-y divide-slate-100">
        {candidates.map(item=><label key={item.id} className="flex cursor-pointer items-start gap-2 py-3"><input type="checkbox" disabled={pending} checked={ids.includes(item.id)} onChange={event=>{setError("");setIds(current=>event.target.checked?[...current,item.id]:current.filter(id=>id!==item.id));}}/><span className="min-w-0"><span className="block break-words">{item.title}</span><span className="text-xs text-slate-500">{item.detailsLoaded===false ? "Xem đầu việc trong bản xem trước" : `${item.checklist.filter(e=>e.isDone).length}/${item.checklist.length} đầu việc hoàn thành`}</span></span></label>)}
        {!candidates.length&&<p className="py-4">Không có việc do bạn sở hữu đang mở.</p>}
      </div>:<div className="my-3 max-h-[55dvh] space-y-3 overflow-y-auto">
        <label className="block text-xs font-medium">Tên công việc chung<input disabled={pending} maxLength={300} value={title} onChange={event=>setTitle(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm"/></label>
        <p className="font-medium">{preview.sources.length} việc → 1 việc · {preview.total} đầu việc ({preview.done} đã xong, {preview.total-preview.done} đang mở)</p>
        <ul className="space-y-1 text-xs text-slate-500">{preview.sources.map(source=><li key={source.id}>{source.title} · {source.done}/{source.total}</li>)}</ul>
        <ul className="space-y-2 rounded-md bg-amber-50 p-3 text-xs text-amber-900">{preview.warnings.map(warning=><li key={warning}>{warning}</li>)}</ul>
      </div>}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
        <AdminButton variant="quiet" type="button" disabled={pending} onClick={close}>Hủy</AdminButton>
        {preview&&<AdminButton variant="quiet" type="button" disabled={pending} onClick={()=>{setPreview(null);setError("");request.current=crypto.randomUUID();}}>Chọn lại</AdminButton>}
        <AdminButton variant="primary" type="button" disabled={pending||(!preview&&ids.length<2)||(!!preview&&!title.trim())} onClick={async()=>{
          if(pending)return;setPending(true);setError("");
          try{
            if(!preview){const result=await previewPersonalMediaMergeAction({ids});if(!result.ok){setError(result.error);return;}setPreview(result.preview);setTitle(result.preview.suggestedTitle);}
            else{const result=await mergePersonalMediaWorkAction({ids,title,revision:preview.revision,requestKey:request.current});if(!result.ok){setError(result.error);return;}setOpen(false);onMerged(result.id);}
          }catch{setError("Không thể kết nối. Hãy thử lại; yêu cầu gộp được bảo vệ chống lặp.");}finally{setPending(false);}
        }}>{pending?"Đang xử lý…":preview?`Gộp ${preview.sources.length} việc thành 1`:"Xem trước"}</AdminButton>
      </div>
    </dialog>
  </>;
}
