"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileText, Lock } from "lucide-react";
import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard, SectionEmpty } from "./shared";
import { buildPostText } from "@/domains/watch/shared/watch-content.helpers";
import ReviewStatusBadge from "../review/ReviewStatusBadge";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

async function markContentCopied(productId: string) {
  const res = await fetch(`/api/admin/watches/${productId}/post-usage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "CONTENT_COPIED" }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) {
    throw new Error(json?.error || "Không thể đánh dấu đã copy content.");
  }

  return json as {
    isContentDownloaded: boolean;
    isImageDownloaded: boolean;
    isPosted: boolean;
  };
}

type Props = {
  detail: any;
  canReviewContent?: boolean;
};

export default function WatchContentPanel({ detail }: Props) {
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState({
    isContentDownloaded: Boolean(
      detail?.review?.isContentDownloaded ?? detail?.watch?.isContentDownloaded
    ),
    isImageDownloaded: Boolean(
      detail?.review?.isImageDownloaded ?? detail?.watch?.isImageDownloaded
    ),
    isPosted: Boolean(detail?.review?.isPosted ?? detail?.watch?.isPosted),
  });

  const content = detail?.content ?? {};
  const contentStatus = String(
    detail?.review?.content?.status ?? "DRAFT"
  ).toUpperCase();

  const canCopy = contentStatus === "APPROVED";

  const bulletSpecs = Array.isArray(content?.bulletSpecs)
    ? content.bulletSpecs.filter(Boolean)
    : [];

  const fullPost = useMemo(
    () =>
      buildPostText({
        title: content?.titleOverride || detail?.title || "Vintage Watch",
        body: content?.body,
        bulletSpecs,
        hookText: content?.hookText,
        hashTags: content?.hashTags,
      }),
    [content, detail?.title, bulletSpecs]
  );
  const [postTitle, ...postRest] = fullPost.split("\n\n");
  const notify = useNotify();
  const handleCopy = async () => {
    if (!canCopy || !detail?.productId) return;

    try {
      await navigator.clipboard.writeText(fullPost);
      setCopied(true);

      const next = await markContentCopied(detail.productId);
      setUsage(next);

      notify.success({
        title: "Đã copy content",
        message: next.isPosted
          ? "Content đã được copy và gallery đã được tải. Watch sẽ được ghi nhận là Đã đăng."
          : "Content đã được copy và hệ thống đã ghi nhận.",
      });
    } catch (error: any) {
      notify.error({
        title: "Không thể copy content",
        message: error?.message || "Có lỗi xảy ra khi copy content.",
      });
    } finally {
      window.setTimeout(() => setCopied(false), 1600);
    }
  };
  return (
    <SectionCard
      title="Content"
      subtitle="Nội dung hoàn chỉnh để sale copy đăng mạng xã hội."
      icon={<FileText className="h-5 w-5" />}
      defaultOpen
      actions={<ReviewStatusBadge status={contentStatus} />}
    >
      <div className="space-y-4">
        {!fullPost ? (
          <SectionEmpty text="Chưa có nội dung cho watch này." />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Bản đăng hoàn chỉnh
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Title → Body → Spec → Hook → Hashtag.
                </div>
                <div className="text-xs font-semibold">
                  {usage.isContentDownloaded ? (
                    <span className="text-emerald-600">Đã copy content</span>
                  ) : (
                    <span className="text-slate-500">Chưa copy content</span>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                disabled={!canCopy}
                title={
                  canCopy
                    ? "Copy nội dung đăng bài"
                    : "Content cần được duyệt trước khi copy đăng bài"
                }
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Đã copy
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {usage.isContentDownloaded ? "Copy lại" : "Copy nội dung"}
                  </>
                )}
              </Button>
            </div>

            {!canCopy ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <Lock className="mr-2 inline h-4 w-4" />
                Content chưa được duyệt nên chưa cho copy.
              </div>
            ) : null}

            <div
              onCopy={(e) => {
                if (!canCopy) e.preventDefault();
              }}
              onCut={(e) => {
                if (!canCopy) e.preventDefault();
              }}
              onContextMenu={(e) => {
                if (!canCopy) e.preventDefault();
              }}
              onSelect={(e) => {
                if (!canCopy) e.preventDefault();
              }}
              className={[
                "rounded-2xl bg-slate-50 p-5 ring-1 ring-inset ring-slate-200",
                !canCopy ? "select-none cursor-not-allowed" : "select-text",
              ].join(" ")}
            >
              <div className="space-y-5 text-sm leading-7 text-slate-900">
                <div className="font-bold uppercase">{postTitle}</div>
                <div className="whitespace-pre-wrap">{postRest.join("\n\n")}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
}
