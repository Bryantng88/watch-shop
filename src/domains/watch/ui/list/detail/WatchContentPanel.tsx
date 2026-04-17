"use client";

import { FileText } from "lucide-react";
import { CollapsibleSection, Field, SectionEmpty } from "./shared";

export default function WatchContentPanel({ detail }: { detail: any }) {
  const bulletSpecs = Array.isArray(detail?.content?.bulletSpecs) ? detail.content.bulletSpecs.filter(Boolean) : [];

  return (
    <CollapsibleSection
      title="Nội dung bài đăng"
      desc="Phần content của watch để vận hành và đăng bài."
      icon={<FileText className="h-5 w-5" />}
      defaultOpen
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Title override" value={detail?.content?.titleOverride || "-"} />
          <Field label="SEO title" value={detail?.content?.seoTitle || "-"} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Summary</div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-900">{detail?.content?.summary || "-"}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Hook</div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-900">{detail?.content?.hookText || "-"}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Body</div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-900">{detail?.content?.body || "-"}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Bullet specs</div>
          {bulletSpecs.length ? (
            <div className="space-y-2">
              {bulletSpecs.map((item: string, idx: number) => (
                <div key={`${idx}-${item}`} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  ▪️ {item}
                </div>
              ))}
            </div>
          ) : (
            <SectionEmpty text="Chưa có bullet specs." />
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
