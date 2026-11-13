"use client";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { AcquisitionWatchLine } from "./acquisition-form.types";
import { applyQuickName, quickNameSource, type QuickNameLine } from "../../shared/quick-name";

type Result = { id:string;line:QuickNameLine;status:string;title:string|null;notes:string[];error:string|null };
function pause(signal:AbortSignal) {
  return new Promise<void>((resolve,reject)=>{
    const abort=()=>{clearTimeout(timer);reject(new DOMException("Aborted","AbortError"));};
    const timer=setTimeout(()=>{signal.removeEventListener("abort",abort);resolve();},2000);
    signal.addEventListener("abort",abort,{once:true});
    if(signal.aborted)abort();
  });
}
export function useAcquisitionQuickNames(lines:AcquisitionWatchLine[],setLines:Dispatch<SetStateAction<AcquisitionWatchLine[]>>) {
  const [busy,setBusy]=useState(false),[statuses,setStatuses]=useState<Record<string,string>>({}),[error,setError]=useState("");
  const controller=useRef<AbortController|null>(null),mounted=useRef(true),current=useRef(lines);
  const completed=useRef(new Map<string,string>()),retry=useRef<{signature:string;requestKey:string}|undefined>(undefined);
  useEffect(()=>{current.current=lines;},[lines]);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;controller.current?.abort();};},[]);
  const candidates=lines.filter(line=>line.imageKey && line.tradeInSource==="EXTERNAL" && completed.current.get(line.id)!==quickNameSource({...line,imageKey:line.imageKey!}));
  async function generate() {
    if(controller.current || !candidates.length)return;
    const source:QuickNameLine[]=candidates.slice(0,12).map(({id,imageKey,audienceSegment,quickInput,aiHint})=>({id,imageKey:imageKey!,audienceSegment,quickInput,aiHint}));
    const signature=JSON.stringify(source);
    if(retry.current?.signature!==signature)retry.current={signature,requestKey:crypto.randomUUID()};
    const control=new AbortController();controller.current=control;setBusy(true);setError("");
    setStatuses(previous=>({...previous,...Object.fromEntries(source.map(line=>[line.id,"Đang chờ Codex đọc ảnh…"]))}));
    try {
      const response=await fetch('/api/admin/acquisitions/quick-names',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestKey:retry.current.requestKey,lines:source}),signal:control.signal});
      const data=await response.json();if(!response.ok)throw Error(data.error||'Chưa gửi được ảnh cho Codex.');
      const ids:string[]=data.ids;
      const query=new URLSearchParams(ids.map(id=>['id',id]));
      const deadline=Date.now()+15*60000;const seen=new Set<string>();
      while(Date.now()<deadline) {
        const res=await fetch('/api/admin/acquisitions/quick-names?'+query,{cache:'no-store',signal:control.signal});
        const result=await res.json();if(!res.ok)throw Error(result.error||'Chưa lấy được kết quả Codex.');
        if(!mounted.current || control.signal.aborted)return;
        const items:Result[]=result.items;
        for(const item of items) {
          if(seen.has(item.id))continue;
          if(['APPLIED','FAILED','CANCELLED'].includes(item.status)) {
            seen.add(item.id);
            const original=source.find(line=>line.id===item.line.id);
            if(!original || quickNameSource(original)!==quickNameSource(item.line))throw Error('Kết quả không khớp dòng đã gửi.');
            const now=current.current.find(line=>line.id===item.line.id);
            const updated=now&&applyQuickName(now,original,item.title);
            const applied=!!now&&updated!==now;
            if(applied && updated) {
              completed.current.set(now.id,quickNameSource({...updated,imageKey:updated.imageKey!}));
              setLines(previous=>previous.map(line=>applyQuickName(line,original,item.title)));
            }
            setStatuses(previous=>({...previous,[item.line.id]:item.error || (applied?'Tên Codex đề xuất · Bạn có thể sửa lại.':item.title?'Giữ nội dung bạn vừa sửa; gợi ý cũ không ghi đè.':'Chưa đủ dữ kiện để đặt tên.')+(item.notes.length?' '+item.notes.join(' '):'')}));
          }
        }
        if(items.every(item=>['APPLIED','FAILED','CANCELLED'].includes(item.status))) {retry.current=undefined;return;}
        await pause(control.signal);
      }
      throw Error('Codex chưa trả kết quả. Bấm lại để kiểm tra cùng lượt, hoặc tự nhập tên.');
    } catch(failure) {
      if(mounted.current && !control.signal.aborted) {
        const message=failure instanceof Error?failure.message:'Chưa nhận diện được ảnh.';setError(message);
        setStatuses(previous=>({...previous,...Object.fromEntries(source.filter(line=>!completed.current.has(line.id)).map(line=>[line.id,message]))}));
      }
    } finally {if(controller.current===control){controller.current=null;if(mounted.current)setBusy(false);}}
  }
  return {busy,statuses,error,generate,stop:()=>{controller.current?.abort();setError("Đã dừng chờ Codex. Bạn có thể tự nhập tên; lượt nhận diện không lưu phiếu hay đăng sản phẩm.");},count:candidates.length};
}
