"use client";
import { ImageIcon } from "lucide-react";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
/** Compact passive row image; failed/absent media keeps the same geometry. */
export function AdminListThumbnail({ src, label }: { src?: string | null; label: string }) {
  const url = resolveMediaPreviewSrc(src);
  return <span role="img" aria-label={`Ảnh ${label}`} className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-400">
    <ImageIcon size={16} aria-hidden="true" />
    {url && <img key={url} src={url} alt="" loading="lazy" ref={node => { if (node?.complete && !node.naturalWidth) node.hidden = true; }} onError={event => { event.currentTarget.hidden = true; }} className="absolute inset-0 h-full w-full object-cover" />}
  </span>;
}
