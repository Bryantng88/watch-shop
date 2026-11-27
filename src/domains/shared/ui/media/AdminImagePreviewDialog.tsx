"use client";
/* eslint-disable @next/next/no-img-element -- Preserve the authorized source for private images. */

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { AdminButton } from "../admin-design-contract/AdminButton";

/** Native modal keeps focus and background interaction within the top layer. */
export function AdminImagePreviewDialog({ src, name, onClose }: { src: string; name: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node?.showModal();
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} aria-labelledby={title}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => { event.stopPropagation(); if (event.key === "Tab") { event.preventDefault(); dialog.current?.querySelector<HTMLButtonElement>("button")?.focus(); } }}
    onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) onClose(); }}
    className="fixed inset-0 m-auto w-[calc(100%_-_32px)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-950 shadow-lg backdrop:bg-slate-950/40">
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2">
      <h2 id={title} className="min-w-0 break-words text-sm font-semibold">{name}</h2>
      <AdminButton variant="quiet" density="compact" iconOnly type="button" aria-label="Đóng ảnh" title="Đóng ảnh" className="shrink-0" onClick={onClose}><X className="h-4 w-4" /></AdminButton>
    </div>
    <div className="flex min-h-32 items-center justify-center p-3">
      {failed ? <p role="alert" className="p-4 text-sm text-slate-500">Không tải được ảnh. Đóng và mở lại để thử lại.</p> : <img src={src} alt={name} className="max-h-[70dvh] max-w-full object-contain" onError={() => setFailed(true)} />}
    </div>
  </dialog>;
}
