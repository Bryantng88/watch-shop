"use client";
import { useState } from "react";
import { Plus, Trash2, ClipboardCheck, ChevronDown } from "lucide-react";
import { approveCustomerRequest, condition, requestSummary, validateCustomerRequest, type CustomerRequest, type Condition } from "./customer-request";
const field="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-600";
const recipients=["Minh · Kỹ thuật (mẫu)","An · Vận hành (mẫu)","Linh · Sales (mẫu)","Hà · Media (mẫu)"];
export default function CustomerRequestDemo({request:r,onChange,canManage,busy=false}:{request:CustomerRequest;onChange:(r:CustomerRequest)=>void;canManage:boolean;busy?:boolean}) {
  const [error,setError]=useState("");const tracking=r.status==="TRACKING";
  function patch(change:Partial<CustomerRequest>){setError("");onChange({...r,...change});}
  function edit(id:string,change:Partial<Condition>){patch({conditions:r.conditions.map(c=>c.id===id?{...c,...change}:c)});}
  function approve(){if(!canManage){setError("Không đủ quyền duyệt trong kịch bản này. Chưa tạo phiếu/task mẫu.");return;}const error=validateCustomerRequest(r);if(error){setError(error);return;}onChange(approveCustomerRequest(r));}
  return <section aria-label="Yêu cầu khách hàng mẫu" className="mt-5 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm">
    <fieldset disabled={busy} className="space-y-4">
      <header className="flex items-center gap-2"><ClipboardCheck size={20} className="text-indigo-700"/><h3 className="font-semibold">{tracking?"Yêu cầu đã duyệt":"Mình sẽ giao các việc sau"}</h3><span className="ml-auto rounded bg-indigo-50 px-2 py-1 text-[10px] text-indigo-700">GIẢ LẬP</span></header>
      <div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-semibold">{r.customer} · {r.watch}</p><p className="mt-1 text-xs text-slate-500">Phụ trách: {r.owner}{tracking?` · ${r.reference}`:""}</p></div>
      <ol className="space-y-3">{r.conditions.map((c,i)=><li key={c.id} className="flex gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">{i+1}</span><div><p className="font-medium">{c.requirement}</p><p className="mt-1 text-xs leading-5 text-slate-500">{c.kind==="TECHNICAL"?"Phiếu kỹ thuật":"Task phối hợp"} → {c.assignee||"Chưa chọn người nhận"}</p>{tracking&&<><p className="text-xs text-indigo-700">{c.linkedRef} · {c.progress}</p><p className="mt-1 text-xs">Điều kiện mua: <strong>{c.outcome}</strong></p>{c.result&&<p className="mt-1 whitespace-pre-wrap text-xs text-slate-600">{c.result}</p>}</>}</div></li>)}</ol>
      {tracking&&<div className="rounded-lg bg-emerald-50 p-3 text-sm"><p className="font-medium">{requestSummary(r)}</p><p className="mt-1 text-xs text-slate-600">{r.conditions.filter(c=>c.progress==="Hoàn tất").length}/{r.conditions.length} việc hoàn tất · {r.conditions.filter(c=>c.outcome==="Đạt").length}/{r.conditions.length} điều kiện đạt. Không tự tạo đơn hàng.</p><p className="mt-1 text-xs">Sales: {r.decision}</p></div>}
      <details className="rounded-xl border border-slate-200 p-3">
        <summary className="cursor-pointer text-sm font-medium text-indigo-700"><ChevronDown size={14} className="mr-1 inline"/>{tracking?"Cập nhật kết quả / xem chi tiết":"Chỉnh sửa chi tiết"}</summary>
        <div className="mt-4 space-y-4">
          <label className="block text-xs">Khách hàng<input aria-label="Khách hàng của yêu cầu" disabled={tracking} className={field} maxLength={160} value={r.customer} onChange={e=>patch({customer:e.target.value})}/></label>
          <label className="block text-xs">Watch<input aria-label="Watch của yêu cầu" disabled={tracking} className={field} maxLength={160} value={r.watch} onChange={e=>patch({watch:e.target.value})}/></label>
          <label className="block text-xs">Người phụ trách bán hàng<input disabled={tracking} className={field} maxLength={120} value={r.owner} onChange={e=>patch({owner:e.target.value})}/></label>
          {r.conditions.map((c,i)=><div key={c.id} className="space-y-3 rounded-lg border p-3">
            <div className="flex justify-between text-xs font-semibold"><span>ĐIỀU KIỆN {i+1}</span>{!tracking&&<button aria-label={`Bỏ điều kiện ${i+1}`} onClick={()=>patch({conditions:r.conditions.filter(row=>row.id!==c.id)})}><Trash2 size={15}/></button>}</div>
            {!tracking?<>
              <label className="block text-xs">Điều kiện<textarea aria-label={`Nội dung điều kiện ${i+1}`} maxLength={1000} className={field} value={c.requirement} onChange={e=>edit(c.id,{requirement:e.target.value})}/></label>
              <label className="block text-xs">Kết quả cần trả về<textarea maxLength={1000} className={field} value={c.expected} onChange={e=>edit(c.id,{expected:e.target.value})}/></label>
              <label className="block text-xs">Nghiệp vụ<select aria-label={`Nghiệp vụ điều kiện ${i+1}`} className={field} value={c.kind} onChange={e=>edit(c.id,{kind:e.target.value as Condition["kind"]})}><option value="TECHNICAL">Phiếu yêu cầu kỹ thuật</option><option value="TASK">Task phối hợp</option></select></label>
              <label className="block text-xs">Người nhận<select aria-label={`Người nhận điều kiện ${i+1}`} className={field} value={c.assignee} onChange={e=>edit(c.id,{assignee:e.target.value})}><option value="">Chọn người nhận</option>{recipients.map(name=><option key={name}>{name}</option>)}</select></label>
            </>:<>
              <p className="text-xs">{c.requirement} · {c.linkedRef}</p><p className="text-xs text-slate-500">Kết quả cần trả về: {c.expected}</p>
              <label className="block text-xs">Tiến độ<select aria-label={`Tiến độ điều kiện ${i+1}`} className={field} value={c.progress} onChange={e=>edit(c.id,{progress:e.target.value})}>{["Chờ tiếp nhận","Đang xử lý","Hoàn tất"].map(value=><option key={value}>{value}</option>)}</select></label>
              <label className="block text-xs">Kết quả điều kiện mua<select aria-label={`Kết quả điều kiện ${i+1}`} className={field} value={c.outcome} onChange={e=>edit(c.id,{outcome:e.target.value})}>{["Chưa xác minh","Đạt","Không đạt","Cần khách xác nhận"].map(value=><option key={value}>{value}</option>)}</select></label>
              <label className="block text-xs">Ghi nhận kết quả<textarea aria-label={`Ghi nhận điều kiện ${i+1}`} maxLength={1500} className={field} value={c.result} onChange={e=>edit(c.id,{result:e.target.value})}/></label>
            </>}
          </div>)}
          {!tracking?<button disabled={r.conditions.length>=8} onClick={()=>patch({conditions:[...r.conditions,condition()]})} className="flex items-center gap-2 text-sm font-medium text-indigo-700"><Plus size={16}/>Thêm điều kiện</button>:<label className="block text-xs">Quyết định của Sales<select aria-label="Quyết định tiếp theo của Sales" className={field} value={r.decision} onChange={e=>patch({decision:e.target.value})}>{["Chưa quyết định","Chờ thêm kết quả","Trao đổi lại với khách","Đề nghị bước tạo đơn (chỉ ghi chú)","Khách không tiếp tục"].map(value=><option key={value}>{value}</option>)}</select></label>}
          <details className="text-xs text-slate-500"><summary>Nội dung trao đổi gốc</summary><p className="mt-2 whitespace-pre-wrap">{r.original}</p></details>
        </div>
      </details>
      {!tracking&&<><p className="text-xs text-slate-500">Xác nhận một lần: lưu 1 yêu cầu và {r.conditions.length} phiếu/task mẫu theo phân công trên. Không tạo đơn hoặc gửi thông báo thật.</p><button onClick={approve} className="w-full rounded-xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white">Xác nhận giao {r.conditions.length} việc mẫu</button></>}
      {error&&<p role="alert" className="text-sm text-rose-700">{error}</p>}
    </fieldset>
  </section>;
}
