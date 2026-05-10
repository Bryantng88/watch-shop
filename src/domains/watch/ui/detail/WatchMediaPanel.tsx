"use client";

import { useState } from "react";
import { Download, ImageIcon, Loader2, Lock } from "lucide-react";

import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

import ReviewStatusBadge from "../review/ReviewStatusBadge";
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

function getImageSrc(image: any) {
  return image?.src ?? image?.url ?? image?.imageUrl ?? null;
}

export default function WatchMediaPanel({ detail, galleryImages = [] }: Props) {
  const progress = useAppProgress();
  const notify = useNotify();

  const [downloading, setDownloading] = useState(false);
  const [usage, setUsage] = useState({
    isContentDownloaded: Boolean(
      detail?.isContentDownloaded ??
      detail?.review?.isContentDownloaded ??
      detail?.watch?.isContentDownloaded
    ),
    isImageDownloaded: Boolean(
      detail?.isImageDownloaded ??
      detail?.review?.isImageDownloaded ??
      detail?.watch?.isImageDownloaded
    ),
  });

  const gallery = sortImages(galleryImages);
  const imageStatus = String(
    detail?.review?.image?.status ?? "DRAFT"
  ).toUpperCase();

  const canViewAndDownload = imageStatus === "APPROVED";

  function handleDownloadAll() {
    const productId = String(detail?.productId ?? detail?.id ?? "").trim();

    if (!productId || downloading || !canViewAndDownload) return;

    setDownloading(true);

    progress.show({
      title: "Đang tải gallery",
      message: "Hệ thống đang đóng gói ảnh GALLERY thành file zip.",
    });

    window.location.href = `/api/admin/watches/${productId}/download-gallery`;

    setUsage((prev) => ({
      ...prev,
      isImageDownloaded: true,
    }));

    notify.success({
      title: "Đang tải gallery",
      message: usage.isContentDownloaded
        ? "Ảnh đã được tải, watch đã đủ điều kiện Đã đăng."
        : "Ảnh đã được tải và hệ thống đã ghi nhận.",
    });

    window.setTimeout(() => {
      progress.hide();
      setDownloading(false);
    }, 1200);
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-semibold">
              {usage.isImageDownloaded ? (
                <span className="text-emerald-600">Đã tải ảnh</span>
              ) : (
                <span className="text-slate-500">Chưa tải ảnh</span>
              )}
            </div>

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
                  {usage.isImageDownloaded ? "Tải lại gallery" : "Tải gallery"}
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((image, index) => {
              const src = getImageSrc(image);
              const title = `${detail?.title || "Watch"} ${index + 1}`;

              return (
                <div
                  key={image.id ?? image.fileKey ?? image.key ?? index}
                  className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-200"
                >
                  <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {src ? (
                      <img
                        src={src}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
}