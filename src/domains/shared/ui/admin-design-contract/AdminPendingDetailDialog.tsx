"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { AdminButton } from "./AdminButton";
import { AdminContentSkeleton } from "./AdminContentSkeleton";

/** A cancellable read request, never a mutation. Native dialog owns focus and Escape. */
export function AdminPendingDetailDialog({ title, error, onClose, onRetry }: { title: string; error?: string; onClose: () => void; onRetry: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      requestAnimationFrame(() => {
        const next = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
        if (next) { next.tabIndex = -1; next.focus(); }
        else if (previous?.isConnected) previous.focus();
      });
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} aria-modal="true" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="m-auto w-[calc(100%_-_32px)] max-w-2xl max-h-[calc(100dvh_-_32px)] overflow-y-auto rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-slate-950/25 backdrop:backdrop-blur-[1px]">
    <div className="p-5" onClick={event => event.stopPropagation()}>
      <header className="flex items-start justify-between gap-3"><h2 id={titleId} className="text-lg font-bold leading-7 text-slate-950">{title}</h2><AdminButton iconOnly variant="quiet" density="compact" aria-label="Đóng chi tiết công việc" onClick={onClose}><X className="h-4 w-4"/></AdminButton></header>
      {error ? <div className="mt-4 space-y-3"><p role="alert" className="text-sm text-rose-700">{error}</p><AdminButton variant="secondary" density="compact" onClick={onRetry}>Thử lại</AdminButton></div> : <AdminContentSkeleton label="Đang mở chi tiết công việc…"/>}
    </div>
  </dialog>;
}
