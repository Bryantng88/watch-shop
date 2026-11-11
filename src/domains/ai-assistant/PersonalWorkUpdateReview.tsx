"use client";
import {personalWorkCode} from "@/domains/personal-work/shared/personal-work-code";
import {personalWorkUpdateInput,type PersonalWorkUpdateDraft} from "./personal-work-update";
const date=(v:string|null)=>v?new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",dateStyle:"short",timeStyle:"short"}).format(new Date(v)):"Bỏ lịch";
export default function PersonalWorkUpdateReview({draft,busy,onApprove}:{draft:PersonalWorkUpdateDraft;busy:boolean;onApprove:()=>void}){
 const items=[draft,...(draft.additional||[])];
 return <section aria-label="Duyệt cập nhật công việc" className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm">
  <h3 className="font-semibold">Cập nhật {items.length} công việc</h3>
  {items.map(item=>{
   const c=personalWorkUpdateInput(item.plan);
   return <div key={item.plan.itemId} className="mt-3 border-t pt-3">
  <p className="font-medium">{personalWorkCode(item.plan.itemId)} · {item.title}</p>
  {c.title!==undefined&&<p className="mt-2">Tên → {c.title}</p>}
  {c.status&&<p className="mt-2">Trạng thái → {{TODO:"Chưa làm",IN_PROGRESS:"Đang làm",DONE:"Hoàn thành",CANCELLED:"Đã hủy"}[c.status]}</p>}
  {c.dueAt!==undefined&&<p className="mt-2">Bắt đầu → {date(c.dueAt)}</p>}
  {c.scheduledEndAt!==undefined&&<p className="mt-2">{item.kind==="EVENT"?"Kết thúc":"Hạn hoàn thành"} → {date(c.scheduledEndAt)}</p>}
  {c.note!==undefined&&<p className="mt-2 whitespace-pre-wrap">Ghi chú → {c.note||"Xóa ghi chú"}</p>}
  </div>;
  })}
  <button type="button" disabled={busy} onClick={onApprove} className="mt-3 min-h-11 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50">Lưu cập nhật</button>
 </section>;
}
