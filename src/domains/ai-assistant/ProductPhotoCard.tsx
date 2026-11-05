"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductCard } from "./simulation";

export default function ProductPhotoCard({ product }: { product: ProductCard }) {
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const images = product.images.filter(image => !failedSources.includes(image.src));
  const active = images.find(image => image.src === selectedSrc) || images[0];
  const fail = (src: string) => setFailedSources(current => current.includes(src) ? current : [...current, src]);

  return (
    <section aria-label={`Ảnh ${product.title}`} className="mt-3 flex gap-3 rounded-xl border border-slate-200 bg-white p-3 whitespace-normal">
      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-50 sm:h-36 sm:w-28">
        {active ? (
          <a href={active.src} target="_blank" rel="noopener noreferrer" aria-label={`Mở ảnh lớn ${product.title}`} className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600">
            <Image unoptimized fill sizes="112px" src={active.src} alt={active.alt} loading="lazy" onError={() => fail(active.src)} className="object-contain" />
          </a>
        ) : <p className="flex h-full items-center p-2 text-center text-xs leading-5 text-slate-500">Ảnh hiện không khả dụng</p>}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{product.title}</h3>
        {product.sku && <p className="mt-1 break-all text-xs leading-4 text-slate-500">{product.sku}</p>}
        {images.length > 1 && <div aria-label={`Chọn ảnh ${product.title}`} className="mt-3 flex flex-wrap gap-1.5">
          {images.map((image, index) => (
            <button key={image.src} type="button" aria-label={`Ảnh ${index + 1} của ${product.title}`} aria-pressed={active?.src === image.src} onClick={() => setSelectedSrc(image.src)} className={`relative h-10 w-10 overflow-hidden rounded-md border bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 ${active?.src === image.src ? "border-indigo-600 ring-1 ring-indigo-600" : "border-slate-200 hover:border-indigo-300"}`}>
              <Image unoptimized fill sizes="40px" src={image.src} alt="" loading="lazy" onError={() => fail(image.src)} className="object-contain" />
            </button>
          ))}
        </div>}
        {active && <p className="mt-2 text-[11px] leading-4 text-slate-500">{images.length > 1 ? `${images.findIndex(image => image.src === active.src) + 1}/${images.length} · ` : ""}Bấm ảnh để xem lớn</p>}
      </div>
    </section>
  );
}
