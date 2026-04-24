"use client";

import { ImageIcon } from "lucide-react";
import InlineImage from "@/domains/shared/ui/image/InlineImage";
import { SectionCard, SectionEmpty } from "./shared";

type Props = {
  detail: any;
  galleryImages?: any[];
};

function sortImages(items: any[]) {
  return [...(items ?? [])].sort(
    (a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
  );
}

export default function WatchMediaPanel({
  detail,
  galleryImages = [],
}: Props) {
  const gallery = sortImages(galleryImages);

  return (
    <SectionCard
      title="Gallery"
      subtitle="Chỉ hiển thị ảnh product image có role GALLERY."
      icon={<ImageIcon className="h-5 w-5" />}
      defaultOpen
    >
      {gallery.length === 0 ? (
        <SectionEmpty text="Chưa có ảnh gallery cho watch này." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {gallery.map((image, index) => (
            <div
              key={image.id ?? image.fileKey ?? index}
              className="group rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-200 transition hover:bg-white hover:shadow-sm"
            >
              <InlineImage
                image={image}
                title={`${detail?.title || "Watch"} ${index + 1}`}
                size="xl"
                className="h-36 w-full rounded-xl"
              />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}