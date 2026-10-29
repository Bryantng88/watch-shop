"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X, ZoomIn } from "lucide-react";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

function GalleryImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="flex h-full min-h-20 flex-col items-center justify-center gap-1 text-xs text-slate-400"><ImageIcon className="h-5 w-5" />Không tải được ảnh</span> :
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}

export function WatchPreviewGallery({ images, title }: { images: NonNullable<BusinessEntityPreview["images"]>; title: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const count = images.length;
  const current = selected === null ? null : images[selected];
  const viewerOpen = selected !== null;
  useEffect(() => {
    if (!viewerOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    viewer.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { previous?.focus(); };
  }, [viewerOpen]);
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "ArrowLeft", "ArrowRight"].includes(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); }
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") setSelected(i => i === null ? null : (i + count - 1) % count);
      if (e.key === "ArrowRight") setSelected(i => i === null ? null : (i + 1) % count);
      if (e.key === "Tab") {
        const buttons = Array.from(viewer.current?.querySelectorAll<HTMLButtonElement>("button") || []);
        if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons.at(-1)?.focus(); }
        if (!e.shiftKey && document.activeElement === buttons.at(-1)) { e.preventDefault(); buttons[0]?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [selected, count]);
  return <section aria-label="Ảnh hiện có" className="space-y-2">
    <div className="flex items-baseline justify-between gap-3"><h3 className="text-xs font-semibold text-slate-700">Ảnh hiện có <span className="ml-1 font-normal text-slate-400">{count}</span></h3><span className="text-[11px] text-slate-400">Bấm ảnh để xem lớn</span></div>
    {count ? <div className="flex gap-2 overflow-x-auto pb-1">{images.map((image, index) => <button key={image.id} type="button" aria-label={`Xem ảnh ${index + 1}: ${image.label}`} onClick={() => setSelected(index)} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
      <GalleryImage src={image.url} alt={image.alt} className="h-full w-full object-cover" />
      <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1 text-[9px] font-medium text-slate-600">{image.label === "Cover" ? "Cover" : index + 1}</span><ZoomIn className="absolute right-1 top-1 h-4 w-4 text-white opacity-0 drop-shadow group-hover:opacity-100" />
    </button>)}</div> : <p className="rounded-lg bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">Chưa có ảnh để đánh giá.</p>}
    {current && <div ref={viewer} role="dialog" aria-modal="true" aria-label={`Ảnh ${selected! + 1} / ${count}: ${title}`} className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-3 bg-slate-950/95 p-4 sm:p-8" onClick={e => { e.stopPropagation(); setSelected(null); }}>
      <button type="button" aria-label="Đóng ảnh" onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white"><X className="h-5 w-5" /></button>
      <div className="flex h-[70vh] w-full items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
        {count > 1 && <button type="button" aria-label="Ảnh trước" onClick={() => setSelected(i => (i! + count - 1) % count)} className="shrink-0 rounded-full bg-white/10 p-2 text-white"><ChevronLeft className="h-5 w-5" /></button>}
        <div className="h-full min-w-0 flex-1"><GalleryImage key={current.id} src={current.url} alt={current.alt} className="h-full w-full object-contain" /></div>
        {count > 1 && <button type="button" aria-label="Ảnh tiếp theo" onClick={() => setSelected(i => (i! + 1) % count)} className="shrink-0 rounded-full bg-white/10 p-2 text-white"><ChevronRight className="h-5 w-5" /></button>}
      </div>
      <p className="text-xs text-slate-300">{selected! + 1} / {count} · {current.label}</p>
    </div>}
  </section>;
}
