"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract";
import { useAppDialog } from "@/domains/shared/feedback";
import { cancelPersonalWorkAction, restorePersonalWorkAction } from "../actions/personal-work.actions";
import type { PersonalWorkItem } from "../shared/personal-work.types";
import { isContinuousWork } from "../shared/continuous-work";
import { scheduleDate } from "../shared/personal-work-schedule";

export function PersonalWorkLifecycleActions({item,onSaved,disabled=false}:{item:PersonalWorkItem;onSaved:(message:string)=>void;disabled?:boolean}){
  const [open,setOpen]=useState(false),[reason,setReason]=useState(""),[date,setDate]=useState(item.workType==="EVENT"&&item.dueAt?scheduleDate(item.dueAt):""),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [needsRunningConfirmation,setNeedsRunningConfirmation]=useState(false);
  const dialog=useAppDialog(),router=useRouter();
  if(item.access!=="OWNER"||item.checklistOnly||item.status==="DONE")return null;
  const cancelled=item.status==="CANCELLED",continuous=isContinuousWork(item.workType),daily=item.id.startsWith("media-daily-");
  const label=cancelled?(continuous?"Tiếp tục duy trì":"Mở lại công việc"):(continuous?"Kết thúc duy trì":"Hủy công việc");
  return <section className={`${open?"w-full":"min-w-0"} text-xs`} aria-label="Trạng thái công việc">
    {!open?<AdminButton variant="quiet" density="compact" type="button" disabled={disabled} onClick={()=>setOpen(true)} className={cancelled?"text-blue-700":"text-rose-700"}>{label}</AdminButton>:<div className="space-y-2">
      {cancelled?<>{!continuous&&!daily&&<label className="block text-slate-600">Lịch mới {item.workType!=="EVENT"&&"(không bắt buộc)"}<input type="date" value={date} onChange={e=>setDate(e.target.value)} disabled={busy} className="ml-2 h-9 rounded-md border border-slate-200 px-2"/></label>}<p className="text-slate-500">{daily?"Việc media theo ngày giữ nguyên lịch gốc.":continuous?"Tiếp tục giữ một việc duy trì, không tạo bản sao.":item.workType==="EVENT"?"Chọn ngày diễn ra sự kiện. Giữ nguyên lịch sử; không tự tạo lại sự kiện Google.":"Giữ đầu việc và lịch sử. Không chọn ngày: mở lại chưa đặt lịch; tác vụ tự động cũ không chạy lại."}</p></>:<label className="block text-slate-600">Lý do hủy<textarea autoFocus maxLength={2000} rows={2} value={reason} onChange={e=>setReason(e.target.value)} disabled={busy} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"/></label>}
      {error&&<p role="alert" className="text-rose-700">{error}</p>}
      <div className="flex justify-end gap-2"><AdminButton variant="quiet" density="compact" type="button" disabled={busy} onClick={()=>{setOpen(false);setError("");}}>Quay lại</AdminButton><AdminButton variant="secondary" density="compact" type="button" disabled={disabled||busy||(!cancelled&&!reason.trim())||(cancelled&&item.workType==="EVENT"&&!date)} onClick={async()=>{
        const running=needsRunningConfirmation||(item.codexRuns?.some(run=>run.status==="RUNNING")??false);
        const confirmed=await dialog.confirm({title:label+"?",message:cancelled?"Những người được chia sẻ sẽ được thông báo việc được mở lại.":`${running?"Có tác vụ Codex đang chạy; thao tác này sẽ thu hồi quyền ghi kết quả của tác vụ. ":""}Việc rời danh sách đang làm và lịch, giữ lịch sử và thông báo cho những người được chia sẻ.`,confirmText:label,tone:cancelled?"default":"danger"});
        if(!confirmed)return;setBusy(true);setError("");
        try{if(cancelled){await restorePersonalWorkAction({id:item.id,date:date||undefined});onSaved("Đã mở lại công việc");}else{const result=await cancelPersonalWorkAction({id:item.id,reason,confirmRunning:running});onSaved(result.calendarCleanupFailed?"Đã hủy công việc; Google Calendar cần kết nối lại để xóa lịch liên kết.":"Đã hủy công việc và thông báo người được chia sẻ");}router.refresh();}catch(e){const message=e instanceof Error?e.message:"Không thể cập nhật. Hãy thử lại.";if(message.includes("Codex đang chạy"))setNeedsRunningConfirmation(true);setError(message);}finally{setBusy(false);}
      }}>{busy?"Đang lưu…":label}</AdminButton></div>
    </div>}
  </section>;
}
