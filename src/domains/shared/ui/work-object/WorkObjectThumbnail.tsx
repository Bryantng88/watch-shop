"use client";

import { ADMIN_UI_FOUNDATION as F } from "@/domains/shared/ui/admin-design-contract/admin-ui.foundation";
import { WatchQuickPreviewTrigger } from "./WatchQuickPreviewTrigger";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
export function WorkObjectThumbnail({
  object,
  interactive = true,
  size = F.thumbnail.row,
}: {
  object: { label: string; imageUrl?: string | null; type?: string; id?: string; href?: string };
  interactive?: boolean;
  size?: 28 | 32 | 36 | 40 | 48;
}) {
  const src = resolveMediaPreviewSrc(object.imageUrl);
  const thumbnail = (
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
  return interactive && object.type === "WATCH" && object.id ? <WatchQuickPreviewTrigger watch={{productId:object.id,label:object.label,imageUrl:object.imageUrl}} className="inline-flex shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">{thumbnail}</WatchQuickPreviewTrigger> : thumbnail;
}
