import Link from "next/link";
import {
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import type { OperationsDashboardData, OperationsDashboardQueue } from "../shared";
import { ADMIN_UI, ADMIN_DOMAIN_TONE, AdminPageCanvas, AdminPageHeader } from "@/domains/shared/ui/admin-design-contract";
import { operationalDomainPresentation, operationalStagePresentation } from "@/domains/shared/ui/signals";
import { cn } from "@/lib/utils";
import { QueueStageSummary } from "./QueueStageSummary";
import { StageConcentrationInsights } from "./StageConcentrationInsights";
import styles from "./OperationsDashboard.module.css";

const queueTones = {
  orders: ADMIN_DOMAIN_TONE.ORDER,
  "purchase-requests": ADMIN_DOMAIN_TONE.ACQUISITION,
  media: ADMIN_DOMAIN_TONE.MEDIA,
  technical: ADMIN_DOMAIN_TONE.TECHNICAL,
  payments: ADMIN_DOMAIN_TONE.SALES,
  "personal-work": ADMIN_DOMAIN_TONE.GENERAL,
} satisfies Record<OperationsDashboardQueue["key"], { soft: string; dot: string }>;

const number = (value: number) => value.toLocaleString("vi-VN");

function DashboardCharts({ data }: { data: OperationsDashboardData }) {
  const completionTotal = data.completionTrend.reduce((sum, item) => sum + item.count, 0);
  const completionMax = Math.max(1, ...data.completionTrend.map((item) => item.count));

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="min-w-0 py-4">
        <div><h2 className={ADMIN_UI.sectionTitle}>Cơ cấu việc đang mở</h2><p className="mt-0.5 text-xs text-slate-500">Tỷ trọng số mục theo từng khu vực nghiệp vụ</p></div>
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
          <div className="grid w-full gap-2.5">{data.queues.map((queue) => <div key={queue.key} className="flex items-center justify-between gap-4 text-xs"><span className="flex min-w-0 items-center gap-2 text-slate-600"><span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", queueTones[queue.key].dot)} /><span className="truncate">{operationalDomainPresentation(queue.key).label}</span></span><span className="font-semibold tabular-nums text-slate-800">{queue.activeCount}</span></div>)}</div>
        </div>
      </article>

      <article className="min-w-0 py-4">
        <div className="flex items-start justify-between gap-4"><div><h2 className={ADMIN_UI.sectionTitle}>Nhịp hoàn tất 7 ngày</h2><p className="mt-0.5 text-xs text-slate-500">Số đơn hàng được hoàn tất theo ngày</p></div><div className="text-right"><div className="text-2xl font-bold tabular-nums text-slate-950">{completionTotal}</div><div className="text-xs font-medium uppercase tracking-wide text-slate-400">đơn hoàn tất</div></div></div>
        <div className="mt-6 flex h-40 items-end gap-2 border-b border-slate-100 px-1 pb-2">{data.completionTrend.map((item) => <div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold tabular-nums text-slate-500">{item.count}</span><div className="w-full max-w-9 rounded-t-md bg-emerald-400/80 transition-colors group-hover:bg-emerald-500" style={{ height: item.count ? `${Math.max(12, (item.count / completionMax) * 100)}%` : "3px" }} title={`${item.label}: ${item.count} đơn`} /><span className="text-xs font-medium capitalize text-slate-400">{item.label}</span></div>)}</div>
        <p className="mt-3 text-xs leading-5 text-slate-500">{completionTotal > 0 ? `Trung bình ${(completionTotal / 7).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} đơn/ngày trong tuần gần nhất.` : "Chưa có đơn hàng hoàn tất trong 7 ngày gần nhất."}</p>
      </article>

      <article className="min-w-0 py-4">
        <div><h2 className={ADMIN_UI.sectionTitle}>Phân bố theo giai đoạn</h2><p className="mt-0.5 text-xs text-slate-500">Nhìn nhanh công việc đang tập trung ở bước nào trong từng pipeline</p></div>
        <div className="mt-5 space-y-5">{data.queues.map((queue) => { const total = queue.stages.reduce((sum, stage) => sum + stage.count, 0); return <div key={queue.key}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-700">{operationalDomainPresentation(queue.key).label}</span><span className="tabular-nums text-slate-400">{total} mục</span></div><div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">{queue.stages.filter((stage) => stage.count > 0).map((stage) => <div key={stage.key} className={cn("h-full", operationalStagePresentation(stage.key).dotClassName)} style={{ width: `${total ? (stage.count / total) * 100 : 0}%` }} title={`${stage.label}: ${stage.count}`} />)}</div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{queue.stages.map((stage) => <span key={stage.key} className="inline-flex items-center gap-1.5 text-xs text-slate-500"><span className={cn("h-1.5 w-1.5 rounded-full", operationalStagePresentation(stage.key).dotClassName)} />{stage.label} <strong className="font-semibold text-slate-700">{stage.count}</strong></span>)}</div></div>; })}</div>
      </article>
    </section>
  );
}

function QueueRow({ queue }: { queue: OperationsDashboardQueue }) {
  const visual = operationalDomainPresentation(queue.key);
  const Icon = visual.icon;
  const insights = queue.insights.filter((insight) => insight.count > 0).sort((a, b) => {
    const rank = { risk: 0, attention: 1, neutral: 2 };
    return rank[a.severity] - rank[b.severity];
  });
  const primaryInsight = insights[0];
  return (
    <li className={cn(styles.queueRow, "group px-2 py-3 transition-colors hover:bg-slate-50 focus-within:bg-slate-50")}>
      <div className={styles.queueIdentity}>
        <Link href={queue.href} title={queue.description} className="flex min-h-10 min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", queueTones[queue.key].soft)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className={ADMIN_UI.rowTitle}>{visual.label}</h2>
        </Link>
      </div>
      <div className={styles.queueCount}>
        <Link href={queue.href} aria-label={`Mở ${visual.label}: ${number(queue.activeCount)} việc đang mở`} className="flex min-h-10 items-center gap-2 rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          <strong className="text-lg font-semibold tabular-nums text-slate-950">{number(queue.activeCount)}</strong>
          <span className="sr-only">việc đang mở</span>
          <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.queueDetails}>
        <QueueStageSummary stages={queue.stages} activeCount={queue.activeCount} />
        {primaryInsight && <Link href={primaryInsight.href} className={cn("mt-1 inline-flex min-h-8 max-w-full items-start gap-1.5 rounded-md py-1 text-xs leading-5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400", primaryInsight.severity === "risk" ? "text-rose-600" : primaryInsight.severity === "attention" ? "text-amber-700" : "text-slate-500")}>
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{number(primaryInsight.count)} {primaryInsight.label.toLocaleLowerCase("vi-VN")}</span>
        </Link>}
      </div>
    </li>
  );
}

export default function OperationsDashboard({ data }: { data: OperationsDashboardData }) {
  return (
    <AdminPageCanvas className="mx-auto w-full max-w-none min-w-0 pb-8 sm:px-4 lg:px-5 xl:px-6 2xl:px-8">
      <AdminPageHeader title="Trung tâm điều hành" description="Việc đang mở và những điểm cần chú ý." meta={
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-slate-500">
          <span><strong className="text-lg font-semibold tabular-nums text-slate-950">{number(data.totalActive)}</strong> việc đang mở</span>
          <span>Toàn shop</span>
        </div>
      } />

      <section className="border-t border-slate-100 pt-2" aria-label="Khu vực xử lý">
        {data.queues.length > 0 ? <ul className="divide-y divide-slate-100">
          {data.queues.map((queue) => <QueueRow key={queue.key} queue={queue} />)}
        </ul> : <p className="py-8 text-sm text-slate-500">Chưa có khu vực xử lý trong phạm vi truy cập của bạn.</p>}
      </section>

      <StageConcentrationInsights queues={data.queues} />
      <details className="group border-t border-slate-100 pt-4">
        <summary className="w-fit cursor-pointer rounded-md py-2 text-sm font-semibold text-slate-600 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Phân tích khối lượng &amp; nhịp hoàn tất</summary>
        <DashboardCharts data={data} />
      </details>
      <div className="mt-5 text-right text-xs text-slate-400">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(data.generatedAt))}</div>
    </AdminPageCanvas>
  );
}
