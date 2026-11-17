"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, ChevronDown } from "lucide-react";
import { AdminUserAvatar, ADMIN_DOMAIN_TONE, ADMIN_UI } from "@/domains/shared/ui/admin-design-contract";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import type { OperationsDashboardAttentionItem } from "../shared";
import styles from "./OperationsDashboard.module.css";
import { cn } from "@/lib/utils";

function ItemImage({ item }: { item: OperationsDashboardAttentionItem }) {
  const [failed, setFailed] = useState(false);
  const src = resolveMediaPreviewSrc(item.imageUrl);
  if (src && !failed) return <img src={src} alt={item.title} className="h-9 w-9 shrink-0 rounded-md object-cover" onError={() => setFailed(true)} />; // eslint-disable-line @next/next/no-img-element
  if (item.domain === "PURCHASE_REQUEST") return <AdminUserAvatar user={item.avatarUser ?? { name: item.title }} size="md" className="mx-0.5" />;
  const visual = operationalDomainPresentation(item.domain.toLowerCase().replaceAll("_", "-"));
  const Icon = visual.icon;
  const tone = item.domain === "TECHNICAL" ? ADMIN_DOMAIN_TONE.TECHNICAL : item.domain === "MEDIA" ? ADMIN_DOMAIN_TONE.MEDIA : ADMIN_DOMAIN_TONE.GENERAL;
  return <span aria-hidden="true" className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", tone.soft)}><Icon className="h-4 w-4" /></span>;
}

export function OperationsAttentionList({ items }: { items: OperationsDashboardAttentionItem[] }) {
  return <section className={styles.attentionSection} aria-labelledby="intervention-title">
    <div className={styles.attentionHeading}><div><h2 id="intervention-title" className={ADMIN_UI.sectionTitle}>Việc cần can thiệp</h2><p className="mt-1 text-xs text-slate-500">Cần kiểm tra, quá hạn hoặc chưa có người nhận</p></div><span className="text-xs tabular-nums text-slate-500">{items.length} mục</span></div>
    {!items.length ? <p className="py-6 text-xs text-slate-500">Chưa có mục cần can thiệp theo tiêu chí hiện tại.</p> : <>
      <div aria-hidden="true" className={styles.attentionColumns}><span>Mục cần xử lý</span><span>Lý do cần chú ý</span><span className="text-right">Không cập nhật</span><span /></div>
      <div className="divide-y divide-slate-100">{items.map(item => <details key={item.id} className={styles.attentionItem} data-attention-item={item.id}>
        <summary className={styles.attentionSummary}>
          <span className={styles.attentionObject}><ItemImage key={item.imageUrl ?? item.id} item={item} /><span className="min-w-0"><span className="block text-sm font-semibold leading-5 text-slate-900">{item.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{[item.reference, operationalDomainPresentation(item.domain.toLowerCase().replaceAll("_", "-")).label].filter(Boolean).join(" · ")}</span></span></span>
          <span className={styles.attentionReason}><AlertCircle aria-hidden="true" className={cn("h-3.5 w-3.5 shrink-0", item.severity === "risk" ? "text-rose-500" : "text-amber-600")} />{item.reason}</span>
          <span className={styles.attentionAge}>{item.ageLabel}</span><ChevronDown className={styles.attentionArrow} aria-hidden="true" />
        </summary>
        <div className={styles.attentionDetail}><p className="text-xs leading-5 text-slate-600">{item.ownerLabel}</p><Link href={item.href} className="mt-2 inline-flex min-h-8 items-center gap-1 rounded text-xs font-semibold text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{item.actionLabel}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div>
      </details>)}</div>
    </>}
  </section>;
}
