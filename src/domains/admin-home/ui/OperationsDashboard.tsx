import { quickAttention } from "../application/attention-selection";
import { OperationsAttentionList } from "./OperationsAttentionList";
import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { ADMIN_UI, ADMIN_DOMAIN_TONE, AdminPageCanvas, AdminPageHeader } from "@/domains/shared/ui/admin-design-contract";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals";
import type { OperationsDashboardData, OperationsDashboardQueue } from "../shared";
import { QueueStageSummary } from "./QueueStageSummary";
import { StageConcentrationInsights } from "./StageConcentrationInsights";
import { OperationsVolumeChart } from "./OperationsVolumeChart";
import { OperationsInsightPanel } from "./OperationsInsightPanel";
import styles from "./OperationsDashboard.module.css";
import { cn } from "@/lib/utils";

const tones = { orders: ADMIN_DOMAIN_TONE.ORDER, "purchase-requests": ADMIN_DOMAIN_TONE.ACQUISITION, media: ADMIN_DOMAIN_TONE.MEDIA, technical: ADMIN_DOMAIN_TONE.TECHNICAL, payments: ADMIN_DOMAIN_TONE.SALES, "personal-work": ADMIN_DOMAIN_TONE.GENERAL };
const number = (value: number) => value.toLocaleString("vi-VN");

function QueueRow({ queue }: { queue: OperationsDashboardQueue }) {
  const visual = operationalDomainPresentation(queue.key);
  const Icon = visual.icon;
  const rank = { risk: 0, attention: 1, neutral: 2 };
  const insight = queue.insights.filter(item => item.count > 0).sort((a, b) => rank[a.severity] - rank[b.severity])[0];
  return <li className={cn(styles.queueRow, "group transition-colors hover:bg-slate-50 focus-within:bg-slate-50")}>
    <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", tones[queue.key].soft)}><Icon className="h-4 w-4" aria-hidden="true" /></span>
    <div className="min-w-0">
      <div className={styles.queueHeadline}>
        <Link href={queue.href} title={queue.description} className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><h3 className={ADMIN_UI.rowTitle}>{visual.label}</h3></Link>
        {insight && <Link href={insight.href} className="inline-flex min-h-8 items-center gap-1.5 rounded text-xs text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          <AlertCircle aria-hidden="true" className={cn("h-3 w-3 shrink-0", insight.severity === "risk" ? "text-rose-500" : insight.severity === "attention" ? "text-amber-600" : "text-slate-400")} />
          <span><strong className="font-semibold tabular-nums">{number(insight.count)}</strong> {insight.label.toLocaleLowerCase("vi-VN")}</span>
        </Link>}
      </div>
      <QueueStageSummary stages={queue.stages} />
    </div>
    <Link href={queue.href} className={cn(styles.queueCount, "flex min-h-10 items-center justify-end gap-1 rounded text-xs tabular-nums text-slate-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400")} aria-label={`Mở ${visual.label}: ${number(queue.activeCount)} việc đang mở`}>
      {number(queue.activeCount)}<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
    </Link>
  </li>;
}

export default function OperationsDashboard({ data }: { data: OperationsDashboardData }) {
  const priorities = quickAttention(data.queues);
  return <AdminPageCanvas className="mx-auto w-full min-w-0 !max-w-none pb-8 sm:px-4 lg:px-5 xl:px-6">
    <AdminPageHeader title="Trung tâm điều hành" description="Việc đang mở và những điểm cần chú ý." meta={
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-slate-500"><span><strong className="text-lg font-semibold tabular-nums text-slate-950">{number(data.totalActive)}</strong> việc đang mở</span><span>Toàn shop</span></div>
    } />
    {priorities.length > 0 && <nav className={styles.quickAttention} aria-label="Cần chú ý trước">
      <span className="text-xs text-slate-500">Cần chú ý trước</span>
      {priorities.map(({ queue, insight }) => <Link key={queue.key} href={insight.href} className="inline-flex min-h-8 items-center gap-1.5 rounded text-xs text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><span className={cn("h-1 w-1 shrink-0 rounded-full", insight.severity === "risk" ? "bg-rose-500" : "bg-amber-500")} aria-hidden="true" />{operationalDomainPresentation(queue.key).label} <strong className="font-semibold tabular-nums">{number(insight.count)}</strong> {insight.label.toLocaleLowerCase("vi-VN")}</Link>)}
    </nav>}
    <div className={styles.mainLayout}>
      <div className={styles.workColumn}>
      <section className="min-w-0" aria-labelledby="operation-queues-title">
        <div className="flex items-baseline justify-between border-b border-slate-100 px-2 pb-3"><h2 id="operation-queues-title" className={ADMIN_UI.sectionTitle}>Khu vực xử lý</h2><span className="text-xs text-slate-500">Đang mở</span></div>
        {data.queues.length ? <ul className="divide-y divide-slate-100">{data.queues.map(queue => <QueueRow key={queue.key} queue={queue} />)}</ul> : <p className="py-8 text-sm text-slate-500">Chưa có khu vực xử lý trong phạm vi truy cập của bạn.</p>}
      </section>
      <OperationsAttentionList items={data.attention} />
      </div>
      <OperationsInsightPanel>
        <OperationsVolumeChart queues={data.queues} />
        <StageConcentrationInsights queues={data.queues} />
        <details className="border-t border-slate-100 pt-3">
          <summary className="cursor-pointer rounded py-2 text-xs font-semibold text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Nhịp hoàn tất đơn hàng · 7 ngày</summary>
          <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs tabular-nums">{data.completionTrend.map(item => <div key={item.date}><span className="block font-semibold text-slate-900">{number(item.count)}</span><span className="text-slate-500">{item.label}</span></div>)}</div>
        </details>
      </OperationsInsightPanel>
    </div>
    <p className="border-t border-slate-100 pt-4 text-right text-xs text-slate-500">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(data.generatedAt))}</p>
  </AdminPageCanvas>;
}
