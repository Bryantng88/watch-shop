import React, { type CSSProperties } from "react";
import type { EditorialImage } from "./contract";
export type DisplayImage = EditorialImage & { url: string };
export function EditorialPhoto({
  image,
  mobile,
  fallback,
  eager = false,
}: {
  image?: DisplayImage;
  mobile?: DisplayImage;
  fallback?: string;
  eager?: boolean;
}) {
  const url = image?.url || fallback;
  if (!url)
    return (
      <div className="vg-image-empty">
        Vintic<span>Vintage & pre-owned</span>
      </div>
    );
  return (
    <div
      className="vg-photo"
      style={
        {
          "--focus": `${image?.focalX ?? 50}% ${image?.focalY ?? 50}%`,
          "--photo-zoom": image?.zoom ?? 1,
          "--mobile-photo-zoom": mobile ? mobile.zoom ?? 1 : image?.zoom ?? 1,
          "--mobile-focus": `${mobile?.focalX ?? image?.focalX ?? 50}% ${mobile?.focalY ?? image?.focalY ?? 50}%`,
        } as CSSProperties
      }
    >
      {/* Editorial media is served by a publication-gated route; no optimizer cache for draft snapshots. */}
      <picture>
        {mobile?.url ? <source media="(max-width: 640px)" srcSet={mobile.url} /> : null}
        <img
          src={url}
          alt={image?.alt || "Đồng hồ tuyển chọn tại Vintic"}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
        />
      </picture>
    </div>
  );
}
