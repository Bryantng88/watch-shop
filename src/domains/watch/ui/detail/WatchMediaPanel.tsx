"use client";

import { useState } from "react";
import { Download, ImageIcon, Loader2 } from "lucide-react";
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

function zipName(detail: any) {
  const raw = detail?.sku || detail?.title || "watch-gallery";
  return `${String(raw).replace(/[^\w.\-()[\] ]+/g, "_")}-gallery-jpeg.zip`;
}

export default function WatchMediaPanel({
  detail,
  galleryImages = [],
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const gallery = sortImages(galleryImages);

  const contentStatus = String(
    detail?.content?.contentStatus ?? "DRAFT"
  ).toUpperCase();

  const canDownloadAll =
    contentStatus === "APPROVED" || contentStatus === "PUBLISHED";

  async function handleDownloadAll() {
    if (!detail?.productId || downloading || !canDownloadAll) return;

    try {
      setDownloading(true);

      const res = await fetch(
        `/api/admin/watches/${detail.productId}/download-gallery`,
        { method: "GET", cache: "no-store" }
      );

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const json = contentType.includes("application/json")
          ? await res.json().catch(() => ({}))
          : {};
        throw new Error(json?.error || "Không thể tải gallery.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = zipName(detail);
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Không thể tải gallery."
      );
    } finally {
      setDownloading(false);
    }
  }

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
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={downloading || !canDownloadAll}
              title={
                canDownloadAll
                  ? "Tải toàn bộ ảnh JPEG"
                  : "Content cần được duyệt trước khi tải ảnh đăng bài"
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Tải tất cả JPEG
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((image, index) => {
              const jpegUrl = buildJpegDownloadUrl(image);
              const downloadName = buildDownloadName(
                image,
                index
              );

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
        </div>
      )}
    </SectionCard>
  );
}