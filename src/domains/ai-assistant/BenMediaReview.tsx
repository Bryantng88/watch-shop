"use client";

import {useCallback, useEffect, useRef, useState, type RefObject} from "react";
import {currentMediaEditor, type MediaEditor} from "./media-editor";

export default function BenMediaReview({editor, requestKey, mode, insightReply}: {
  editor: MediaEditor;
  requestKey?: string;
  mode?: "draft" | "inspect";
  insightReply: RefObject<((text:string)=>void)|null>;
}) {
  const [asking,setAsking]=useState(false);
  const [pending,setPending]=useState(false);
  const [notice,setNotice]=useState("");
  const consumed=useRef<string | undefined>(undefined);
  const inFlight=useRef(false);

  const research=useCallback(async (inspect:boolean, insight?:string) => {
    if(inFlight.current||currentMediaEditor()?.session!==editor.session)return;
    inFlight.current=true;
    setPending(true);
    setNotice("");
    try {
      if(inspect){
        const observation=await editor.inspect();
        if(currentMediaEditor()?.session===editor.session)setNotice(observation);
      }else{
        const draft=await editor.draft(insight);
        if(currentMediaEditor()?.session===editor.session){
          setNotice("Bản nháp đã sẵn sàng trong tab Content.");
          editor.showDraft(draft);
        }
      }
    }catch(error){
      setNotice(error instanceof Error?error.message:"Ben chưa chuẩn bị được nội dung.");
    }finally{
      inFlight.current=false;
      setPending(false);
    }
  },[editor]);

  const answer=useCallback((text:string)=>{
    insightReply.current=null;
    setAsking(false);
    void research(false,text);
  },[insightReply,research]);

  useEffect(()=>{
    if(!asking)return;
    insightReply.current=answer;
    return ()=>{if(insightReply.current===answer)insightReply.current=null;};
  },[asking,answer,insightReply]);

  const askForInsight=useCallback(()=>{
    editor.showDraft();
    setNotice("");
    setAsking(true);
  },[editor]);

  useEffect(()=>{
    if(!requestKey||consumed.current===requestKey)return;
    consumed.current=requestKey;
    if(mode==="inspect")void research(true);
    else askForInsight();
  },[requestKey,research,mode,askForInsight]);

  return <section aria-label="Xử lý media với Ben" className="shrink-0 space-y-1 border-y border-blue-100 px-4 py-2 text-xs">
    <p className="font-medium">Xử lý media · {editor.title}</p>
    {asking ? <div className="space-y-1">
      <p>Ở chiếc này, bạn ấn tượng nhất điểm gì? Nhắn Ben một câu để mình chọn góc viết.</p>
      <button type="button" onClick={()=>answer("")} className="text-indigo-700 underline">Để Ben tự chọn</button>
    </div> : <button type="button" disabled={pending} onClick={askForInsight} className="text-indigo-700 underline disabled:opacity-50">
      {pending?"Ben đang xử lý…":"Tra cứu và viết nội dung"}
    </button>}
    {notice&&<p role="status">{notice}</p>}
  </section>;
}
