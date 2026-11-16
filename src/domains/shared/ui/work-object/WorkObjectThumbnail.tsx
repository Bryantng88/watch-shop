"use client";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
export function WorkObjectThumbnail({
  object,
  size = 28,
}: {
  object: { label: string; imageUrl?: string | null };
  size?: 28 | 32 | 40;
}) {
  const src = resolveMediaPreviewSrc(object.imageUrl);
  return (
    <span
      role="img"
      aria-label={`Ảnh ${object.label}`}
      title={object.label}
      style={{ width: size, height: size }}
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-400"
    >
      <ImageIcon aria-hidden="true" className="h-3.5 w-3.5" />
      {src && (
        <Image
          key={src}
          src={src}
          alt=""
          width={size}
          height={size}
          unoptimized
          loading="lazy"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}
