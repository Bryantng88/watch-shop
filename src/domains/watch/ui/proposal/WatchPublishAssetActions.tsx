"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";

import { buildPostText } from "@/domains/watch/application/generate-watch-content";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

// Detail is the serialized aggregate returned by the existing Watch detail contract.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Detail = Record<string, any>;

function filenameFromDisposition(value: string | null) {
  if (!value) return "watch-gallery.zip";
  const utf8 = value.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utf8) return decodeURIComponent(utf8);
  return value.match(/filename="?([^"]+)"?/i)?.[1] || "watch-gallery.zip";
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function WatchPublishAssetActions({ detail }: { detail: Detail }) {
  const notify = useNotify();
  const progress = useAppProgress();
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const content = useMemo(() => detail.content ?? {}, [detail.content]);
  const contentStatus = String(detail.review?.content?.status ?? "DRAFT").toUpperCase();
  const imageStatus = String(detail.review?.image?.status ?? "DRAFT").toUpperCase();
  const canCopy = contentStatus === "APPROVED";
  const canDownload = imageStatus === "APPROVED" && (detail.images?.length ?? 0) > 0;
  const postText = useMemo(() => buildPostText({
    title: content.titleOverride || detail.title || "Vintage Watch",
    body: content.body,
    bulletSpecs: Array.isArray(content.bulletSpecs) ? content.bulletSpecs : [],
    hookText: content.hookText,
    hashTags: content.hashTags,
  }), [content, detail.title]);

  async function copyContent() {
    if (!canCopy || !postText.trim() || copying) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(postText);
      const response = await fetch(`/api/admin/watches/${detail.productId}/post-usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONTENT_COPIED" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error || "Không thể ghi nhận đã copy nội dung.");
      setCopied(true);
      notify.success({ title: "Đã copy nội dung", message: result.isPosted ? "Content và gallery đã hoàn tất cho luồng đăng bài." : "Event sử dụng content đã được ghi nhận." });
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      notify.error({ title: "Không thể copy nội dung", message: error instanceof Error ? error.message : "Có lỗi xảy ra." });
    } finally {
      setCopying(false);
    }
  }

  async function downloadGallery() {
    if (!canDownload || downloading) return;
    setDownloading(true);
    progress.show({ title: "Đang tải gallery", message: "Hệ thống đang đóng gói ảnh và ghi nhận event sau khi tải thành công." });
    try {
      const response = await fetch(`/api/admin/watches/${detail.productId}/download-gallery`, { cache: "no-store" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Không thể tải gallery.");
      }
      saveBlob(await response.blob(), filenameFromDisposition(response.headers.get("content-disposition")));
      notify.success({ title: "Đã tải gallery", message: response.headers.get("x-watch-is-posted") === "true" ? "Content và gallery đã hoàn tất cho luồng đăng bài." : "Event sử dụng gallery đã được ghi nhận." });
    } catch (error) {
      notify.error({ title: "Không thể tải gallery", message: error instanceof Error ? error.message : "Có lỗi xảy ra." });
    } finally {
      progress.hide();
      setDownloading(false);
    }
  }

  const buttonClass = "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-45";
  return (
    <>
      <button type="button" onClick={copyContent} disabled={!canCopy || !postText.trim() || copying} title={canCopy ? "Copy nội dung và phát event sử dụng asset" : `Content cần APPROVED (hiện tại: ${contentStatus})`} className={`${buttonClass} border-slate-200 text-slate-700`}>
        {copying ? <Loader2 className="h-4 w-4 animate-spin" /> : copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Đã copy" : "Copy nội dung"}
      </button>
      <button type="button" onClick={downloadGallery} disabled={!canDownload || downloading} title={canDownload ? "Tải ZIP gallery và phát event sau khi thành công" : `Gallery cần APPROVED (hiện tại: ${imageStatus})`} className={`${buttonClass} border-slate-200 text-slate-700`}>
        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {downloading ? "Đang tải..." : "Tải hình"}
      </button>
    </>
  );
}
