"use client";

import { FileText } from "lucide-react";
import { DetailField, SectionCard, SectionEmpty } from "./shared";

export default function WatchContentPanel({ detail }: { detail: any }) {
  const content = detail?.content ?? {};
  const bulletSpecs = Array.isArray(content?.bulletSpecs)
    ? content.bulletSpecs.filter(Boolean)
    : [];

  const hasContent =
    Boolean(content?.hookText) ||
    Boolean(content?.body) ||
    bulletSpecs.length > 0 ||
    Boolean(content?.titleOverride) ||
    Boolean(content?.seoTitle);

  return (
    <SectionCard
      title="Content"
      subtitle="Nội dung bài đăng và mô tả bán hàng."
      icon={<FileText className="h-5 w-5" />}
      defaultOpen
    >
      {!hasContent ? (
        <SectionEmpty text="Chưa có nội dung cho watch này." />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <DetailField
              label="Title override"
              value={content?.titleOverride || "-"}
            />
            <DetailField
              label="SEO title"
              value={content?.seoTitle || "-"}
            />
          </div>

          {content?.hookText ? (
            <div className="rounded-2xl bg-indigo-50/60 p-4 ring-1 ring-inset ring-indigo-100">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-indigo-700/80">
                Hook
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-800">
                {content.hookText}
              </div>
            </div>
          ) : null}

          {content?.body ? (
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
              <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
                Body
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-800">
                {content.body}
              </div>
            </div>
          ) : null}

          {bulletSpecs.length > 0 ? (
            <div>
              <div className="mb-3 text-sm font-semibold text-slate-900">
                Bullet specs
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {bulletSpecs.map((item: string, index: number) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-inset ring-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}