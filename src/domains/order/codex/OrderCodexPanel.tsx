"use client";
import {useEffect,useRef,useState} from 'react';
import {departments,departmentLabels,workflowPlanSchema,type WorkflowPlan} from './workflow-plan';
type Proposal={id:string;status:string;revision:number;planJson:unknown;errorCode:string|null;createdTaskIds:unknown};
type Person={id:string;name:string|null};
function localDateInput(value:string|null){if(!value)return '';const d=new Date(value);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);}
export default function OrderCodexPanel({orderId}:{orderId:string}){
 const [text,setText]=useState('');const [row,setRow]=useState<Proposal|null>(null);const [plan,setPlan]=useState<WorkflowPlan|null>(null);const [people,setPeople]=useState<Person[]>([]);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const current=useRef<Proposal|null>(null);const key=useRef<string|null>(null);
 async function load(){const r=await fetch(`/api/admin/orders/${orderId}/codex`,{cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error||'Không tải được đề xuất');const latest=d.proposals[0] as Proposal|undefined;setPeople(d.people);setRow(latest||null);if(latest&&(latest.id!==current.current?.id||latest.status!==current.current?.status)){const parsed=workflowPlanSchema.safeParse(latest.planJson);setPlan(parsed.success?parsed.data:null);}current.current=latest||null;}
 useEffect(()=>{let active=true;load().catch(e=>{if(active)setError(e.message)});const timer=setInterval(()=>{if(['QUEUED','RUNNING'].includes(current.current?.status||''))load().catch(e=>{if(active)setError(e.message)})},4000);return()=>{active=false;clearInterval(timer)};// eslint-disable-next-line react-hooks/exhaustive-deps
 },[orderId]);
 async function send(action:'request'|'approve'){
  setBusy(true);setError('');try{
   if(action==='approve'&&!window.confirm('Tạo các công việc đã duyệt? Không thay đổi tiền, giao hàng hoặc trạng thái đơn.'))return;
   if(action==='request'&&!key.current)key.current=crypto.randomUUID();
   const input=action==='request'?{requestKey:key.current,text}:{proposalId:row!.id,revision:row!.revision,plan};
   const r=await fetch(`/api/admin/orders/${orderId}/codex`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,input})});const d=await r.json();if(!r.ok)throw Error(d.error||'Không thể xử lý');if(action==='request'){key.current=null;setText('');}await load();
  }catch(e){setError(e instanceof Error?e.message:'Không thể xử lý')}finally{setBusy(false)}
 }
 function change(i:number,field:string,value:unknown){setPlan(p=>p?{...p,steps:p.steps.map((s,j)=>j===i?{...s,[field]:value}:s)}:p)}
 const pending=['QUEUED','RUNNING'].includes(row?.status||'');const editable=row?.status==='DRAFT'&&!busy;const tasks=Array.isArray(row?.createdTaskIds)?row.createdTaskIds as string[]:[];
 return <section className="rounded-xl border border-indigo-200 bg-white p-5 space-y-4" aria-label="Yêu cầu Codex cho đơn hàng">
 <div><h2 className="text-lg font-semibold">Yêu cầu Codex</h2><p className="text-sm text-slate-500">Đề xuất việc liên phòng ban. Chỉ tạo việc sau khi bạn duyệt; không tự thu tiền, giao hàng hay nhắn khách.</p></div>
 <textarea aria-label="Yêu cầu nghiệp vụ" className="w-full rounded-lg border p-3 text-sm" rows={3} maxLength={6000} value={text} onChange={e=>{setText(e.target.value);key.current=null}} placeholder="Ví dụ: Kiểm tra máy, sau đó chụp tình trạng và nhờ sales xác nhận lịch giao. Chưa xác nhận khách đã thanh toán."/>
 <p className="text-xs text-slate-500">Codex nhận nội dung bạn nhập, mã/trạng thái đơn và tên hàng. Không tự gửi số điện thoại, địa chỉ hay hồ sơ khách.</p>
 <button type="button" disabled={busy||pending||text.trim().length<5} onClick={()=>send('request')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50">{pending?'Codex đang đề xuất…':'Đề xuất luồng công việc'}</button>
 {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
 {pending&&<p role="status" className="text-sm text-indigo-600">{row?.status==='QUEUED'?'Đang chờ worker…':'Codex đang phân tích…'} Bạn có thể quay lại trang sau.</p>}
 {row?.status==='FAILED'&&<p role="alert" className="text-sm text-amber-700">Chưa tạo được đề xuất. Chưa có công việc nào được tạo. Bạn có thể gửi yêu cầu mới.</p>}
 {plan&&<div className="space-y-4"><p className="text-sm">{plan.summary}</p>
 {plan.questions.length>0&&<div className="rounded-lg bg-amber-50 p-3 text-sm"><strong>Cần bổ sung trước khi tạo việc:</strong><ul className="list-disc pl-5">{plan.questions.map((q,i)=><li key={i}>{q}</li>)}</ul><p>Bổ sung thông tin vào yêu cầu phía trên và tạo đề xuất mới.</p></div>}
 <p className="text-xs text-slate-500">Thứ tự phụ thuộc là hướng dẫn cho người thực hiện; bản thử chưa tự khóa hay chuyển bước.</p>
 {plan.steps.map((s,i)=><div key={s.key} className="rounded-lg border p-3 space-y-2"><div className="text-xs text-slate-500">Bước {i+1} · {s.key}</div>
 <input aria-label={`Tên việc bước ${i+1}`} disabled={!editable} className="w-full rounded border p-2 font-medium" value={s.title} onChange={e=>change(i,'title',e.target.value)}/>
 <div className="grid gap-2 md:grid-cols-3"><select aria-label={`Bộ phận bước ${i+1}`} disabled={!editable} className="rounded border p-2 text-sm" value={s.department} onChange={e=>change(i,'department',e.target.value)}>{departments.map(d=><option key={d} value={d}>{departmentLabels[d]}</option>)}</select>
 <select aria-label={`Phụ trách bước ${i+1}`} disabled={!editable} className="rounded border p-2 text-sm" value={s.assignedToUserId||''} onChange={e=>change(i,'assignedToUserId',e.target.value||null)}><option value="">Chưa giao — hàng đợi bộ phận</option>{people.map(p=><option key={p.id} value={p.id}>{p.name||'Nhân viên'}</option>)}</select>
 <input aria-label={`Hạn bước ${i+1}`} type="datetime-local" disabled={!editable} className="rounded border p-2 text-xs" value={localDateInput(s.dueAt)} onChange={e=>change(i,'dueAt',e.target.value?new Date(e.target.value).toISOString():null)}/></div>
 <textarea aria-label={`Chi tiết bước ${i+1}`} disabled={!editable} className="w-full rounded border p-2 text-sm" value={s.description} onChange={e=>change(i,'description',e.target.value)}/>
 <label className="block text-xs">Chờ các bước (mã cách nhau bằng dấu phẩy): <input disabled={!editable} className="rounded border p-1" value={s.dependsOn.join(', ')} onChange={e=>change(i,'dependsOn',e.target.value.split(',').map(v=>v.trim()).filter(Boolean))}/></label>
 </div>)}
 {row?.status==='DRAFT'&&<button type="button" onClick={()=>send('approve')} disabled={busy||plan.questions.length>0} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50">Duyệt và tạo {plan.steps.length} công việc</button>}
 </div>}
 {row?.status==='APPLIED'&&<div role="status" className="rounded-lg bg-emerald-50 p-3 text-sm">Đã tạo {tasks.length} công việc, không tạo lại khi tải trang.<p className="mt-2">Xem tại các bảng điều phối theo bộ phận:</p><div className="flex flex-wrap gap-3">{departments.map(d=><a key={d} href={`/admin/coordination/${['PAYMENT','OPERATION'].includes(d)?'operation?view=ad-hoc-work':d.toLowerCase()}`} className="underline">{departmentLabels[d]}</a>)}</div></div>}
 </section>
}
