"use client";
/* eslint-disable @next/next/no-img-element -- Private owner-checked images must bypass optimizer caches. */
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Trash2, RefreshCw } from "lucide-react";
import { WorkAttachmentIcon } from "@/domains/shared/ui/icons/MediaIcons";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useAppDialog } from "@/domains/shared/feedback";
import { WORK_IMAGE_MAX_BYTES, workImagesUrl, type WorkImages, type WorkMediaTarget } from "../shared/work-media";

type Upload={id:string;file:File};
/** URLs point only at the owner-authorized endpoint, never at NAS/sign links. */
export function WorkImageAttachments({workId,entryId,compact=false,label="Ảnh công việc"}:WorkMediaTarget&{compact?:boolean;label?:string}){
 const dialog=useAppDialog(),input=useRef<HTMLInputElement>(null),version=useRef(0);
 const [open,setOpen]=useState(!compact),[data,setData]=useState<WorkImages|null>(null),[loading,setLoading]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState(""),[retry,setRetry]=useState<Upload[]|null>(null);
 const endpoint=workImagesUrl({workId,entryId});
 const activeEndpoint=useRef(endpoint);
 const invalidate=useCallback(()=>{version.current++;activeEndpoint.current="";},[]);
 const load=useCallback(async()=>{
  if(activeEndpoint.current!==endpoint)return;
  const request=++version.current;setLoading(true);
  try{const response=await fetch(endpoint,{cache:"no-store"});const result=await response.json();if(!response.ok)throw Error(result.error||"Không thể tải ảnh.");if(request===version.current){setData(result);setError("");}}
  catch(failure){if(request===version.current){setError(failure instanceof Error?failure.message:"Không thể tải ảnh.");setData(null);}}
  finally{if(request===version.current)setLoading(false);}
 },[endpoint]);
 useEffect(()=>{activeEndpoint.current=endpoint;setData(null);setRetry(null);setError("");setPending(false);if(open)void load();return invalidate;},[endpoint,invalidate,load,open]);
 useEffect(()=>{if(!open)return;const refresh=()=>{if(document.visibilityState!=="hidden")void load();};window.addEventListener("focus",refresh);document.addEventListener("visibilitychange",refresh);return()=>{window.removeEventListener("focus",refresh);document.removeEventListener("visibilitychange",refresh);};},[open,load]);
 useEffect(()=>{if(!open||!data?.items.some(item=>item.state==="PENDING"))return;const timer=setTimeout(()=>void load(),3000);return()=>clearTimeout(timer);},[data,load,open]);
 async function upload(batch:Upload[]){
  if(pending)return;setPending(true);setRetry(null);setError("");
  for(let i=0;i<batch.length;i++){
   const item=batch[i];try{
    const form=new FormData();form.set("file",item.file);form.set("uploadId",item.id);
    const response=await fetch(endpoint,{method:"POST",body:form});const result=await response.json();if(!response.ok)throw Error(result.error||"Không thể tải ảnh.");if(activeEndpoint.current!==endpoint)return;
   }catch(failure){if(activeEndpoint.current!==endpoint)return;setRetry(batch.slice(i));await load();setError(failure instanceof Error?failure.message:"Không thể tải ảnh.");setPending(false);return;}
  }
  if(activeEndpoint.current===endpoint){await load();setPending(false);}
 }
 async function remove(id:string){
  if(!await dialog.confirm({title:"Gỡ ảnh khỏi công việc?",message:"Ảnh được gỡ khỏi công việc này và giữ trong thời gian lưu trữ trước khi dọn file.",confirmText:"Gỡ ảnh",cancelText:"Giữ lại",tone:"danger"}))return;
  setPending(true);try{const response=await fetch(`/api/admin/personal-work/images/${id}`,{method:"DELETE"});const result=await response.json();if(!response.ok)throw Error(result.error||"Không gỡ được ảnh.");await load();}catch(failure){setError(failure instanceof Error?failure.message:"Không gỡ được ảnh.");}finally{setPending(false);}
 }
 return <section aria-label={label} className={compact?"basis-full min-w-0":"mt-4 min-w-0 border-t border-slate-100 pt-4"}>
  <div className="flex flex-wrap items-center justify-between gap-2">
   {compact?<AdminButton variant="quiet" density="compact" type="button" aria-expanded={open} disabled={pending} onClick={()=>setOpen(value=>!value)}><WorkAttachmentIcon className="h-4 w-4"/>{label}{data?` (${data.items.length})`:""}</AdminButton>:<h3 className="text-sm font-semibold">{label}{data?` · ${data.items.length}/${data.limit}`:""}</h3>}
   {open&&data?.canEdit&&<AdminButton variant="quiet" density="compact" type="button" disabled={pending||data.items.length>=data.limit} onClick={()=>input.current?.click()}>{pending?<Loader2 className="h-4 w-4 animate-spin"/>:<WorkAttachmentIcon className="h-4 w-4"/>}Thêm ảnh</AdminButton>}
  </div>
  {open&&<div className="mt-2 space-y-2">
   <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" aria-label={`Thêm ${label}`} disabled={pending||!data?.canEdit} onChange={event=>{
    const files=Array.from(event.target.files||[]);event.target.value="";
    if(!files.length)return;
    if(files.some(file=>file.size>WORK_IMAGE_MAX_BYTES||!["image/jpeg","image/png","image/webp"].includes(file.type))){setError("Chọn ảnh JPEG, PNG hoặc WebP tối đa 10 MB mỗi ảnh.");return;}
    if(!data||files.length+data.items.length>data.limit){setError(`Tối đa ${data?.limit||20} ảnh cho công việc/đầu việc này.`);return;}
    void upload(files.map(file=>({file,id:crypto.randomUUID()})));
   }}/>
   {loading&&!data&&<p role="status" className="text-xs text-slate-500">Đang tải ảnh…</p>}
   {error&&<div role="alert" className="flex flex-wrap items-center gap-2 text-xs text-rose-700"><span>{error}</span><AdminButton variant="quiet" density="compact" type="button" disabled={pending} onClick={()=>retry?void upload(retry):void load()}><RefreshCw className="h-3.5 w-3.5"/>Thử lại</AdminButton></div>}
   {data?.items.length===0&&<p className="text-xs text-slate-500">Chưa có ảnh đính kèm.</p>}
   {data&&<ul className="flex flex-wrap gap-3">{data.items.map(item=><li key={item.id} className="w-24 min-w-0">
    {item.url?<a href={item.url} target="_blank" rel="noreferrer" title={`Mở ${item.name}`}><img src={`${item.url}?size=thumb`} alt={item.name} className="h-24 w-24 rounded-lg bg-slate-50 object-cover" loading="lazy" onError={event=>{event.currentTarget.alt="Ảnh không còn khả dụng; tải lại danh sách.";}}/></a>:<div className="grid h-24 place-items-center rounded-lg bg-slate-50 p-2 text-center text-xs text-slate-500">{item.state==="FAILED"?"Tải ảnh chưa hoàn tất":"Đang tải ảnh…"}</div>}
    <div className="mt-1 flex items-start gap-1"><span className="min-w-0 flex-1 break-words text-xs text-slate-500">{item.name}</span>{data.canEdit&&<AdminButton variant="quiet" density="compact" iconOnly type="button" aria-label={`Gỡ ${item.name}`} disabled={pending} onClick={()=>void remove(item.id)}><Trash2 className="h-3.5 w-3.5"/></AdminButton>}</div>
   </li>)}</ul>}
   {data?.canEdit&&<p className="text-xs text-slate-400">Ảnh được lưu ngay vào công việc. JPEG/PNG/WebP, tối đa 10 MB/ảnh.</p>}
  </div>}
 </section>;
}
