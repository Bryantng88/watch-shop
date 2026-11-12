"use client";
import {useState} from "react";
import {Share2,X,Check,Loader2} from "lucide-react";
import type {PersonalWorkShare,PersonalWorkUser} from "../shared/personal-work.types";
export function PersonalChecklistShare({users,shares,onSave}:{users:PersonalWorkUser[];shares:PersonalWorkShare[];onSave:(shares:PersonalWorkShare[])=>Promise<void>}) {
  const [open,setOpen]=useState(false),[draft,setDraft]=useState(shares),[busy,setBusy]=useState(false),[error,setError]=useState("");
  async function save(){setBusy(true);setError("");try{await onSave(draft);setOpen(false);}catch(e){setError(e instanceof Error?e.message:"Chưa lưu được chia sẻ");}finally{setBusy(false);}}
  return <span className="relative shrink-0">
    <button type="button" aria-label="Chia sẻ đầu việc" title={shares.length?shares.map(s=>s.user.name||s.user.email).join(", "):"Chia sẻ đầu việc"} onClick={()=>{setDraft(shares);setError("");setOpen(v=>!v);}} className={`inline-flex items-center gap-0.5 rounded-md p-1 ${shares.length?"text-violet-600":"text-slate-400"} hover:bg-violet-50`}><Share2 className="h-3.5 w-3.5"/>{shares.length>0&&<span className="text-[10px]">{shares.length}</span>}</button>
    {open&&<span role="dialog" aria-label="Chia sẻ đầu việc" className="absolute right-0 top-full z-40 mt-1 block w-72 max-w-[75vw] rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
      <span className="mb-2 flex items-center justify-between"><strong className="text-xs text-slate-800">Chia sẻ đầu việc</strong><button type="button" disabled={busy} aria-label="Đóng chia sẻ đầu việc" onClick={()=>setOpen(false)}><X className="h-3.5 w-3.5 text-slate-400"/></button></span>
      <select aria-label="Thêm người xem đầu việc" value="" disabled={busy} onChange={e=>{const user=users.find(u=>u.id===e.target.value);if(user)setDraft([...draft,{user,accessLevel:"VIEWER"}]);}} className="h-8 w-full rounded border border-slate-200 px-2 text-xs"><option value="">+ Thêm người</option>{users.filter(u=>!draft.some(s=>s.user.id===u.id)).map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}</select>
      <span className="mt-2 block max-h-40 space-y-2 overflow-y-auto">{draft.map(s=><span key={s.user.id} className="flex items-center gap-1"><span className="min-w-0 flex-1 truncate text-xs">{s.user.name||s.user.email}</span><select aria-label={`Quyền đầu việc của ${s.user.name||s.user.email}`} disabled={busy} value={s.accessLevel} onChange={e=>setDraft(draft.map(x=>x.user.id===s.user.id?{...x,accessLevel:e.target.value as "VIEWER"|"EDITOR"}:x))} className="h-7 rounded border border-slate-200 text-[11px]"><option value="VIEWER">Chỉ xem</option><option value="EDITOR">Có thể cập nhật</option></select><button type="button" disabled={busy} aria-label={`Bỏ chia sẻ đầu việc với ${s.user.name||s.user.email}`} onClick={()=>setDraft(draft.filter(x=>x.user.id!==s.user.id))}><X className="h-3 w-3 text-slate-400"/></button></span>)}</span>
      <span className="mt-2 block text-[10px] leading-4 text-slate-500">Chỉ thấy công việc và đầu việc này.</span>
      {error&&<span role="alert" className="mt-1 block text-xs text-rose-700">{error}</span>}
      <button type="button" disabled={busy} onClick={()=>void save()} className="mt-2 inline-flex items-center gap-1 rounded bg-slate-950 px-2 py-1 text-xs text-white disabled:opacity-50">{busy?<Loader2 className="h-3 w-3 animate-spin"/>:<Check className="h-3 w-3"/>}Lưu chia sẻ</button>
    </span>}
  </span>;
}
