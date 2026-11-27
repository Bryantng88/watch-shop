"use client";
/* eslint-disable @next/next/no-img-element -- Private owner-checked images must bypass optimizer caches. */
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X, RefreshCw } from "lucide-react";
import { WorkAttachmentIcon } from "@/domains/shared/ui/icons/MediaIcons";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useAppDialog } from "@/domains/shared/feedback";
import { readUiResponse, uiFeedbackMessage } from "@/domains/shared/feedback/read-ui-response";
import { AdminImagePreviewDialog } from "@/domains/shared/ui/media/AdminImagePreviewDialog";
import { WORK_IMAGE_MAX_BYTES, workImagesUrl, type WorkImages, type WorkMediaTarget } from "../shared/work-media";

type Upload={id:string;file:File};
const LOAD_ERROR="Không tải được ảnh công việc. Vui lòng thử lại.";
function responseMessage(response:Response,fallback:string){
 if(response.status===401||response.redirected)return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi mở công việc.";
 if(response.status===403)return "Không có quyền truy cập ảnh công việc này.";
 if(response.status===413)return "Ảnh vượt giới hạn tải lên của máy chủ. Hãy chọn ảnh nhỏ hơn.";
 return response.ok?fallback:`${fallback} (HTTP ${response.status})`;
}
async function readWorkImages(response:Response):Promise<WorkImages>{
 const result=await readUiResponse(response,responseMessage(response,LOAD_ERROR));
 if(!Array.isArray(result.items)||typeof result.canEdit!=="boolean"||!Number.isInteger(result.limit)||Number(result.limit)<1||result.items.some(item=>!item||typeof item.id!=="string"||typeof item.name!=="string"||!["READY","PENDING","FAILED"].includes(item.state)||(item.url!==null&&typeof item.url!=="string")))throw Error(LOAD_ERROR);
 return result as unknown as WorkImages;
}
/** URLs point only at the owner-authorized endpoint, never at NAS/sign links. */
export function WorkImageAttachments({workId,entryId,compact=false,inline=false,label="Ảnh công việc",triggerLabel}:WorkMediaTarget&{compact?:boolean;inline?:boolean;label?:string;triggerLabel?:string}){
 const dialog=useAppDialog(),input=useRef<HTMLInputElement>(null),version=useRef(0);
 const [open,setOpen]=useState(!compact),[data,setData]=useState<WorkImages|null>(null),[loading,setLoading]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState(""),[retry,setRetry]=useState<Upload[]|null>(null);
 const [previewId,setPreviewId]=useState<string|null>(null);
 const preview=data?.items.find(item=>item.id===previewId&&item.url);
 const endpoint=workImagesUrl({workId,entryId});
 const activeEndpoint=useRef(endpoint);
 const invalidate=useCallback(()=>{version.current++;activeEndpoint.current="";},[]);
 const load=useCallback(async()=>{
  if(activeEndpoint.current!==endpoint)return;
  const request=++version.current;setLoading(true);
  try{const response=await fetch(endpoint,{cache:"no-store"});const result=await readWorkImages(response);if(request===version.current){setData(result);setError("");}}
  catch(failure){if(request===version.current){setError(uiFeedbackMessage(failure,LOAD_ERROR));setData(null);}}
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
    const response=await fetch(endpoint,{method:"POST",body:form});await readUiResponse(response,responseMessage(response,"Không tải ảnh lên được. Vui lòng thử lại."));if(activeEndpoint.current!==endpoint)return;
   }catch(failure){if(activeEndpoint.current!==endpoint)return;setRetry(batch.slice(i));await load();setError(uiFeedbackMessage(failure,"Không tải ảnh lên được. Vui lòng thử lại."));setPending(false);return;}
  }
  if(activeEndpoint.current===endpoint){await load();setPending(false);}
 }
 async function remove(id:string){
  if(!await dialog.confirm({title:"Gỡ ảnh khỏi công việc?",message:"Ảnh được gỡ khỏi công việc này và giữ trong thời gian lưu trữ trước khi dọn file.",confirmText:"Gỡ ảnh",cancelText:"Giữ lại",tone:"danger"}))return;
  setPending(true);try{const response=await fetch(`/api/admin/personal-work/images/${id}`,{method:"DELETE"});await readUiResponse(response,responseMessage(response,"Không gỡ được ảnh. Vui lòng thử lại."));await load();}catch(failure){setError(uiFeedbackMessage(failure,"Không gỡ được ảnh. Vui lòng thử lại."));}finally{setPending(false);}
 }
 return <section aria-label={label} className={inline?"contents":compact?"basis-full w-full min-w-0":"mt-4 min-w-0 border-t border-slate-100 pt-4"}>
  <div className={inline?"contents":"flex flex-wrap items-center justify-between gap-2"}>
   {compact?<AdminButton variant="quiet" density="compact" iconOnly={inline} type="button" title={label} className="min-w-0 max-w-full text-left" aria-label={`${label}${data?` (${data.items.length})`:""}`} aria-expanded={open} disabled={pending} onClick={()=>setOpen(value=>!value)}><WorkAttachmentIcon className="h-4 w-4 shrink-0"/>{!inline&&<span className="min-w-0 break-words">{triggerLabel || label}</span>}{data&&<span className="shrink-0">({data.items.length})</span>}</AdminButton>:<h3 className="text-sm font-semibold">{label}{data?` · ${data.items.length}/${data.limit}`:""}</h3>}
   {!inline&&open&&data?.canEdit&&<AdminButton variant="quiet" density="compact" type="button" disabled={pending||data.items.length>=data.limit} onClick={()=>input.current?.click()}>{pending?<Loader2 className="h-4 w-4 animate-spin"/>:<WorkAttachmentIcon className="h-4 w-4"/>}Thêm ảnh</AdminButton>}
  </div>
  {open&&<div className={inline?"col-start-2 -col-end-1 min-w-0 space-y-2 py-2":"mt-2 space-y-2"}>
   {inline&&data?.canEdit&&<AdminButton variant="quiet" density="compact" type="button" disabled={pending||data.items.length>=data.limit} onClick={()=>input.current?.click()}><WorkAttachmentIcon className="h-4 w-4"/>Thêm ảnh</AdminButton>}
   <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" aria-label={`Thêm ${label}`} disabled={pending||!data?.canEdit} onChange={event=>{
    const files=Array.from(event.target.files||[]);event.target.value="";
    if(!files.length)return;
    if(files.some(file=>file.size>WORK_IMAGE_MAX_BYTES||!["image/jpeg","image/png","image/webp"].includes(file.type))){setError("Chọn ảnh JPEG, PNG hoặc WebP tối đa 10 MB mỗi ảnh.");return;}
    if(!data||files.length+data.items.length>data.limit){setError(`Tối đa ${data?.limit||20} ảnh cho công việc/đầu việc này.`);return;}
    void upload(files.map(file=>({file,id:crypto.randomUUID()})));
   }}/>
   {loading&&!data&&<p role="status" className="text-xs text-slate-500">Đang tải ảnh…</p>}
   {error&&<div role="alert" className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-rose-700"><span className="min-w-0 break-words">{error}</span><AdminButton variant="quiet" density="compact" type="button" disabled={pending} onClick={()=>retry?void upload(retry):void load()}><RefreshCw className="h-3.5 w-3.5"/>Thử lại</AdminButton></div>}
   {data?.items.length===0&&<p className="text-xs text-slate-500">Chưa có ảnh đính kèm.</p>}
   {data&&<ul className="flex flex-wrap gap-3">{data.items.map(item=><li key={item.id} className="w-24 min-w-0">
    <div className="relative h-24 w-24">
    {item.url?<AdminButton variant="contextual" type="button" aria-label={`Xem ${item.name}`} title={`Xem ${item.name}`} className="block h-24 w-24 overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400" onClick={()=>setPreviewId(item.id)}><img src={`${item.url}?size=thumb`} alt={item.name} className="h-24 w-24 rounded-lg bg-slate-50 object-cover" loading="lazy" onError={event=>{event.currentTarget.alt="Ảnh không còn khả dụng; tải lại danh sách.";}}/></AdminButton>:<div className="grid h-24 place-items-center rounded-lg bg-slate-50 p-2 text-center text-xs text-slate-500">{item.state==="FAILED"?"Tải ảnh chưa hoàn tất":"Đang tải ảnh…"}</div>}
    {data.canEdit&&<AdminButton variant="secondary" density="compact" iconOnly type="button" className="absolute right-1 top-1" title={`Gỡ ${item.name}`} aria-label={`Gỡ ${item.name}`} disabled={pending} onClick={()=>void remove(item.id)}><X className="h-4 w-4"/></AdminButton>}
    </div>
    <p className="mt-1 truncate text-xs text-slate-500" title={item.name}>{item.name}</p>
   </li>)}</ul>}
   {data?.canEdit&&<p className="text-xs text-slate-400">Bấm Thêm ảnh để chọn ảnh trên điện thoại hoặc máy tính. Ảnh được lưu ngay, không cần bấm Lưu thay đổi. JPEG/PNG/WebP, tối đa 10 MB/ảnh.</p>}
  </div>}
  {preview?.url&&<AdminImagePreviewDialog key={`${endpoint}:${preview.id}`} src={preview.url} name={preview.name} onClose={()=>setPreviewId(null)}/> }
 </section>;
}
