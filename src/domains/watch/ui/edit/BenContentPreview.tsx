"use client";

import {useState} from "react";
import type {MediaDraft} from "@/domains/ai-assistant/media-editor";

export default function BenContentPreview({draft,onDismiss}: {draft:MediaDraft;onDismiss:()=>void}) {
  const [staleDraft,setStaleDraft]=useState<MediaDraft>();
  const stale=staleDraft===draft;
  return <section aria-label="Bản nháp của Ben" className="mb-4 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm">
    <p className="text-xs font-medium text-indigo-700">Bản nháp của Ben</p>
    <h3 className="font-semibold text-slate-900">{draft.title}</h3>
    <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{draft.body}</p>
    {(draft.sources.length>0||draft.notes.length>0)&&<details className="text-xs text-slate-600">
      <summary className="cursor-pointer">Nguồn và lưu ý</summary>
      {draft.notes.map((note,index)=><p key={index} className="mt-2">{note}</p>)}
      <ul className="mt-2 space-y-1">{draft.sources.map(source=>
        <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-700 underline">{source.title}</a></li>
      )}</ul>
    </details>}
    {stale&&<p role="status" className="text-xs text-amber-800">Form đã thay đổi. Hãy nhờ Ben tạo lại bản nháp.</p>}
    <div className="flex gap-3">
      <button type="button" disabled={stale} className="rounded-lg bg-indigo-700 px-3 py-2 text-white disabled:opacity-50" onClick={()=>draft.apply()?onDismiss():setStaleDraft(draft)}>Duyệt và điền</button>
      <button type="button" onClick={onDismiss} className="text-slate-600">Bỏ bản nháp</button>
    </div>
  </section>;
}
