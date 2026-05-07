"use client";

import { useState } from "react";
import { Download, ImageIcon, Loader2, Lock } from "lucide-react";
import InlineImage from "@/domains/shared/ui/image/InlineImage";
import { SectionCard, SectionEmpty } from "./shared";
import ReviewStatusBadge from "../review/ReviewStatusBadge";

type Props = {
  detail: any;
  galleryImages?: any[];
};

function sortImages(items: any[]) {
  return [...(items ?? [])].sort(
    (a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
  );
}

function zipName(detail: any) {
  const raw = detail?.sku || detail?.title || "watch-gallery";
  return `${String(raw).replace(/[^\w.\-()[\] ]+/g, "_")}-gallery-jpeg.zip`;
}

export default function WatchMediaPanel({ detail, galleryImages = [] }: Props) {
  const [downloading, setDownloading] = useState(false);
  const gallery = sortImages(galleryImages);

  const imageStatus = String(
    detail?.review?.image?.status ?? "DRAFT"
  ).toUpperCase();

  const canViewAndDownload = imageStatus === "APPROVED";

  async function handleDownloadAll() {
    if (!detail?.productId || downloading || !canViewAndDownload) return;

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
    } finally {
      setDownloading(false);
    }
  }

  return (
    <SectionCard
      title="Gallery"
      subtitle="Chỉ hiển thị ảnh product image có role GALLERY."
      icon={<ImageIcon className="h-5 w-5" />}
      defaultOpen={canViewAndDownload}
      actions={<ReviewStatusBadge status={imageStatus} />}
    >
      {gallery.length === 0 ? (
        <SectionEmpty text="Chưa có ảnh gallery cho watch này." />
      ) : !canViewAndDownload ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          <Lock className="mx-auto mb-2 h-5 w-5 text-slate-400" />
          Hình ảnh chưa được duyệt nên chưa mở gallery và chưa cho tải ảnh.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={downloading}
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
            {gallery.map((image, index) => (
              <div
                key={image.id ?? image.fileKey ?? index}
                className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-200"
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
        </div>
      )}
    </SectionCard>
  );
}