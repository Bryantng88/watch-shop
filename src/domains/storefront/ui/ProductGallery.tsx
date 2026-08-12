"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { url: string; alt: string };

export default function ProductGallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const [selected, setSelected] = useState(0);
  const active = images[selected] ?? images[0];
  if (!active) return null;

  return (
    <section aria-label={label}>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efede8]">
        <Image key={active.url} src={active.url} alt={active.alt} fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover transition-opacity duration-300" />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.slice(0, 6).map((image, index) => (
            <button key={image.url} type="button" onClick={() => setSelected(index)} aria-label={`${label} ${index + 1}`} aria-current={selected === index ? "true" : undefined} className={`storefront-focus relative aspect-square overflow-hidden bg-[#efede8] transition ${selected === index ? "ring-1 ring-[#46545e] ring-offset-2 ring-offset-[#fbfaf7]" : "opacity-65 hover:opacity-100"}`}>
              <Image src={image.url} alt="" fill sizes="(max-width: 640px) 20vw, 10vw" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
