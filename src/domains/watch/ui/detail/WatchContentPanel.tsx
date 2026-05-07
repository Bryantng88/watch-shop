"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileText, Lock } from "lucide-react";
import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard, SectionEmpty } from "./shared";
import { buildPostText } from "@/domains/watch/shared/watch-content.helpers";
import ReviewStatusBadge from "../review/ReviewStatusBadge";

export default function WatchContentPanel({ detail }: { detail: any }) {
  const [copied, setCopied] = useState(false);

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
  const handleCopy = async () => {
    if (!canCopy) return;

    await navigator.clipboard.writeText(fullPost);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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
                    Copy nội dung
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