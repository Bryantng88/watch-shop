"use client";

import {useEffect, useRef, useState} from "react";
import {currentMediaEditor, type MediaEditor} from "./media-editor";

export default function BenMediaReview({editor, requestKey, awaitingInsight, status, onAsk, onSkip}: {
  editor: MediaEditor;
  requestKey?: string;
  awaitingInsight: boolean;
  status?: {text:string;pending:boolean};
  onAsk: () => void;
  onSkip: () => void;
}) {
  const [observation,setObservation]=useState("");
  const consumed=useRef<string | undefined>(undefined);
  useEffect(()=>{
    if(!requestKey||consumed.current===requestKey)return;
    consumed.current=requestKey;
    setObservation("Ben đang xem ảnh inline…");
    void editor.inspect().then(text=>{
      if(currentMediaEditor()?.session===editor.session)setObservation(text);
    }).catch(error=>{
      if(currentMediaEditor()?.session===editor.session)setObservation(error instanceof Error?error.message:"Ben chưa xem được ảnh inline.");
    });
  },[requestKey,editor]);

  return <section aria-label="Xử lý media với Ben" className="shrink-0 space-y-1 border-y border-blue-100 px-4 py-2 text-xs">
    <p className="font-medium">Xử lý media · {editor.title}</p>
    {awaitingInsight ? <div className="space-y-1">
      <p>Ở chiếc này, bạn ấn tượng nhất điểm gì? Trả lời trong ô chat để Ben bắt đầu viết.</p>
      <button type="button" disabled={status?.pending} onClick={onSkip} className="text-indigo-700 underline">Để Ben tự chọn</button>
    </div> : <button type="button" disabled={status?.pending} onClick={onAsk} className="text-indigo-700 underline disabled:opacity-50">
      {status?.pending?"Ben đang xử lý…":"Tra cứu và viết nội dung"}
    </button>}
    {(status?.text||observation)&&<p role="status">{status?.text||observation}</p>}
  </section>;
}
