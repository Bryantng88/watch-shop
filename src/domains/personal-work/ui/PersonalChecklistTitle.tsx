"use client";
import {useState} from "react";
import {Check, Pencil, X, Loader2} from "lucide-react";
export function PersonalChecklistTitle({title,done,disabled,onSave}:{title:string;done:boolean;disabled:boolean;onSave:(title:string)=>Promise<void>}) {
  const [editing,setEditing]=useState(false),[draft,setDraft]=useState(title),[saving,setSaving]=useState(false),[error,setError]=useState("");
  async function save(){
    if (!draft.trim() || saving) return;
    if(draft.trim()===title){setEditing(false);return;}
    setSaving(true);setError("");
    try{await onSave(draft.trim());setEditing(false);}catch(e){setError(e instanceof Error?e.message:"Chưa lưu được đầu việc");}finally{setSaving(false);}
  }
  if(!editing)return <span className="flex min-w-0 flex-1 items-center gap-1.5">
    <span className={`min-w-0 flex-1 break-words text-sm ${done?"text-slate-400 line-through":"text-slate-700"}`}>{title}</span>
    {!disabled&&<button type="button" aria-label={`Sửa ${title}`} title="Sửa đầu việc" onClick={()=>{setDraft(title);setError("");setEditing(true);}} className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Pencil className="h-3.5 w-3.5"/></button>}
  </span>;
  return <span className="min-w-0 flex-1">
    <span className="flex items-center gap-1">
      <input autoFocus aria-label="Tên đầu việc" value={draft} maxLength={500} disabled={saving||disabled} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();void save();}if(e.key==="Escape"){e.preventDefault();e.stopPropagation();if(!saving)setEditing(false);}}} className="h-8 min-w-0 flex-1 rounded-md border border-blue-300 px-2 text-sm"/>
      <button type="button" aria-label="Lưu đầu việc" disabled={saving||disabled||!draft.trim()} onClick={()=>void save()} className="rounded-md p-1 text-blue-700 disabled:opacity-40">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:<Check className="h-4 w-4"/>}</button>
      <button type="button" aria-label="Hủy sửa đầu việc" disabled={saving} onClick={()=>setEditing(false)} className="rounded-md p-1 text-slate-500"><X className="h-4 w-4"/></button>
    </span>
    {error&&<span role="alert" className="block text-xs text-rose-700">{error}</span>}
  </span>;
}
