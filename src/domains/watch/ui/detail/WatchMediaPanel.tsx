"use client";

import { Download, ImageIcon } from "lucide-react";
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

function getImageKey(image: any) {
  return (
    image?.fileKey ??
    image?.key ??
    image?.path ??
    image?.objectKey ??
    null
  );
}

function buildJpegDownloadUrl(image: any) {
  const key = getImageKey(image);

  if (!key) return null;

  return `/api/media/sign?key=${encodeURIComponent(
    key
  )}&download=1&format=jpeg`;
}

function buildDownloadName(image: any, index: number) {
  const key = getImageKey(image);
  const rawName =
    key?.split("/").pop() ??
    image?.name ??
    image?.fileName ??
    `watch-image-${index + 1}.jpg`;

  return String(rawName).replace(/\.[^.]+$/i, ".jpg");
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
          {gallery.map((image, index) => {
            const jpegUrl = buildJpegDownloadUrl(image);
            const downloadName = buildDownloadName(image, index);

            return (
              <div
                key={image.id ?? image.fileKey ?? index}
                className="group relative rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-200 transition hover:bg-white hover:shadow-sm"
              >
                <InlineImage
                  image={image}
                  title={`${detail?.title || "Watch"} ${index + 1
                    }`}
                  size="xl"
                  className="h-36 w-full rounded-xl"
                />

                {jpegUrl ? (
                  <a
                    href={jpegUrl}
                    download={downloadName}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-900 hover:text-white"
                    title="Tải ảnh JPEG"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}