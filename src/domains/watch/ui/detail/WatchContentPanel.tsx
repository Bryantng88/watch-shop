"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard, SectionEmpty } from "./shared";
import { buildPostText } from "@/domains/watch/shared/watch-content.helpers";

export default function WatchContentPanel({ detail }: { detail: any }) {
  const [copied, setCopied] = useState(false);

  const content = detail?.content ?? {};
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
        hashtags: content?.hashtags,
      }),
    [content, detail?.title, bulletSpecs]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPost);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (!fullPost) {
    return (
      <SectionCard
        title="Content"
        subtitle="Nội dung hoàn chỉnh để sale copy đăng mạng xã hội."
        icon={<FileText className="h-5 w-5" />}
        defaultOpen
      >
        <SectionEmpty text="Chưa có nội dung cho watch này." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Content"
      subtitle="Nội dung hoàn chỉnh để sale copy đăng mạng xã hội."
      icon={<FileText className="h-5 w-5" />}
      defaultOpen
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Bản đăng hoàn chỉnh
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Title → Body → Spec → Hook → Hashtag.
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleCopy}>
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

        <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-inset ring-slate-200">
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-900">
            {fullPost}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}