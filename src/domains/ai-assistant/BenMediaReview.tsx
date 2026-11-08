"use client";

import {useState} from "react";
import {currentMediaEditor, type MediaDraft, type MediaEditor} from "./media-editor";

export default function BenMediaReview({editor}: {editor: MediaEditor}) {
  const [review, setReview] = useState<{editor: MediaEditor; draft: MediaDraft}>();
  const draft = review?.editor === editor ? review.draft : undefined;
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  async function research() {
    setPending(true);
    setReview(undefined);
    setNotice("");
    try {
      const result = await editor.draft();
      if (currentMediaEditor() === editor) setReview({editor, draft: result});
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ben chưa chuẩn bị được nội dung.");
    } finally {
      setPending(false);
    }
  }

  return <section aria-label="Xử lý media với Ben" className="max-h-[40dvh] shrink-0 space-y-2 overflow-y-auto rounded-xl border border-blue-100 p-3 text-sm">
    <p className="font-medium">Xử lý media · {editor.title}</p>
    <p className="text-xs text-slate-500">{editor.sku} · {editor.section}</p>
    {draft ? <>
      <p className="font-medium">{draft.title}</p>
      <p className="whitespace-pre-wrap break-words">{draft.body}</p>
      {!!draft.notes.length && <p className="text-xs text-amber-800">Cần kiểm tra. {draft.notes.join(" ")}</p>}
      <ul className="text-xs text-indigo-700">{draft.sources.map(source =>
        <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="underline">{source.title}</a></li>
      )}</ul>
      <div className="flex gap-2">
        <button type="button" className="rounded-lg bg-indigo-700 px-3 py-2 text-white" onClick={() => {
          const applied = currentMediaEditor() === editor && draft.apply();
          setReview(undefined);
          setNotice(applied ? "Đã điền vào tab Content. Bạn có thể lưu bản nháp trong form." : "Form đã thay đổi. Hãy tạo bản nháp mới.");
        }}>Duyệt và điền vào Content</button>
        <button type="button" onClick={() => setReview(undefined)}>Bỏ bản nháp</button>
      </div>
    </> : <button type="button" disabled={pending} onClick={() => void research()} className="rounded-lg border px-3 py-2 text-indigo-700 disabled:opacity-50">
      {pending ? "Ben đang tra cứu…" : "Tra cứu và viết nội dung"}
    </button>}
    {notice && <p role="status" className="text-xs">{notice}</p>}
  </section>;
}
