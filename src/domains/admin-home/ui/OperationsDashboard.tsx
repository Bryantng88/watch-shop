import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";

import type { OperationsDashboardData, OperationsDashboardQueue } from "../shared";
import { AdminPageCanvas, AdminPageHeader } from "@/domains/shared/ui/admin-design-contract";
import { operationalDomainPresentation, operationalStagePresentation } from "@/domains/shared/ui/signals";
import { cn } from "@/lib/utils";
import { QueueStageNavigator } from "./QueueStageNavigator";

const chartColors: Record<OperationsDashboardQueue["key"], string> = {
  orders: "#64748b", "purchase-requests": "#f59e0b", media: "#8b5cf6",
  technical: "#3b82f6", payments: "#10b981", "personal-work": "#475569",
};

function DashboardCharts({ data }: { data: OperationsDashboardData }) {
  let cursor = 0;
  const stops = data.queues.map((queue) => {
    const start = cursor;
    cursor += data.totalActive ? (queue.activeCount / data.totalActive) * 100 : 0;
    return `${chartColors[queue.key]} ${start}% ${cursor}%`;
  });
  const completionTotal = data.completionTrend.reduce((sum, item) => sum + item.count, 0);
  const completionMax = Math.max(1, ...data.completionTrend.map((item) => item.count));

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_8px_24px_rgba(15,23,42,0.035)]">
        <div><h2 className="font-bold text-slate-950">Cơ cấu việc đang mở</h2><p className="mt-0.5 text-xs text-slate-500">Tỷ trọng số mục theo từng khu vực nghiệp vụ</p></div>
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
          <div className="relative h-36 w-36 shrink-0 rounded-full" style={{ background: data.totalActive ? `conic-gradient(${stops.join(", ")})` : "#e2e8f0" }}>
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white shadow-inner"><span className="text-2xl font-bold tabular-nums text-slate-950">{data.totalActive}</span><span className="text-[11px] font-medium text-slate-500">việc đang mở</span></div>
          </div>
          <div className="grid w-full gap-2.5">{data.queues.map((queue) => <div key={queue.key} className="flex items-center justify-between gap-4 text-xs"><span className="flex min-w-0 items-center gap-2 text-slate-600"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[queue.key] }} /><span className="truncate">{operationalDomainPresentation(queue.key).label}</span></span><span className="font-semibold tabular-nums text-slate-800">{queue.activeCount}</span></div>)}</div>
        </div>
      </article>

      <article className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_8px_24px_rgba(15,23,42,0.035)]">
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-bold text-slate-950">Nhịp hoàn tất 7 ngày</h2><p className="mt-0.5 text-xs text-slate-500">Số đơn hàng được hoàn tất theo ngày</p></div><div className="text-right"><div className="text-2xl font-bold tabular-nums text-slate-950">{completionTotal}</div><div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">đơn hoàn tất</div></div></div>
        <div className="mt-6 flex h-40 items-end gap-2 border-b border-slate-100 px-1 pb-2">{data.completionTrend.map((item) => <div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-semibold tabular-nums text-slate-500 opacity-0 transition group-hover:opacity-100">{item.count}</span><div className="w-full max-w-9 rounded-t-md bg-emerald-400/80 transition-colors group-hover:bg-emerald-500" style={{ height: item.count ? `${Math.max(12, (item.count / completionMax) * 100)}%` : "3px" }} title={`${item.label}: ${item.count} đơn`} /><span className="text-[10px] font-medium capitalize text-slate-400">{item.label}</span></div>)}</div>
        <p className="mt-3 text-xs leading-5 text-slate-500">{completionTotal > 0 ? `Trung bình ${(completionTotal / 7).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} đơn/ngày trong tuần gần nhất.` : "Chưa có đơn hàng hoàn tất trong 7 ngày gần nhất."}</p>
      </article>

      <article className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_8px_24px_rgba(15,23,42,0.035)]">
        <div><h2 className="font-bold text-slate-950">Phân bố theo giai đoạn</h2><p className="mt-0.5 text-xs text-slate-500">Nhìn nhanh công việc đang tập trung ở bước nào trong từng pipeline</p></div>
        <div className="mt-5 space-y-5">{data.queues.map((queue) => { const total = queue.stages.reduce((sum, stage) => sum + stage.count, 0); return <div key={queue.key}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-700">{operationalDomainPresentation(queue.key).label}</span><span className="tabular-nums text-slate-400">{total} mục</span></div><div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">{queue.stages.filter((stage) => stage.count > 0).map((stage) => <div key={stage.key} className={cn("h-full", operationalStagePresentation(stage.key).dotClassName)} style={{ width: `${total ? (stage.count / total) * 100 : 0}%` }} title={`${stage.label}: ${stage.count}`} />)}</div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{queue.stages.map((stage) => <span key={stage.key} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500"><span className={cn("h-1.5 w-1.5 rounded-full", operationalStagePresentation(stage.key).dotClassName)} />{stage.label} <strong className="font-semibold text-slate-700">{stage.count}</strong></span>)}</div></div>; })}</div>
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
    <div className="group grid gap-3 px-4 py-4 transition-colors hover:bg-slate-50/80 sm:px-5 lg:grid-cols-[minmax(190px,1.05fr)_100px_minmax(260px,1.35fr)_minmax(220px,1fr)_150px] lg:items-center lg:gap-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", visual.softClassName)}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-950">{visual.label}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">{queue.description}</p>
        </div>
      </div>

      <div className="flex w-fit min-w-[84px] items-baseline gap-1.5 text-slate-600">
        <strong className="text-lg font-semibold tracking-tight tabular-nums text-slate-800">{queue.activeCount}</strong>
        <span className="text-[11px] font-medium text-slate-500">đang mở</span>
      </div>

      <div className="min-w-0">
        <QueueStageNavigator stages={queue.stages} />
      </div>

      <div className="min-w-0">
        {primaryInsight ? (
          <Link href={primaryInsight.href} className={cn("inline-flex max-w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500", primaryInsight.severity === "risk" ? "bg-rose-50 text-rose-700" : primaryInsight.severity === "attention" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-700")}>
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", primaryInsight.severity === "risk" ? "bg-rose-500" : primaryInsight.severity === "attention" ? "bg-amber-500" : "bg-slate-400")} />
            <span className="truncate"><strong className="tabular-nums">{primaryInsight.count}</strong> {primaryInsight.label.toLocaleLowerCase("vi-VN")}</span>
          </Link>
        ) : <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Ổn định</span>}
      </div>

      <Link href={queue.href} className="inline-flex min-h-9 w-fit items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 lg:ml-auto">
        Mở khu vực<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function OperationsDashboard({ data }: { data: OperationsDashboardData }) {
  return (
    <AdminPageCanvas className="mx-auto w-full max-w-none min-w-0 pb-8 sm:px-4 lg:px-5 xl:px-6 2xl:px-8">
      <AdminPageHeader title="Trung tâm điều hành" description="Theo dõi công việc đang mở, ngoại lệ và tiến độ các khu vực nghiệp vụ." meta={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="mr-1 flex items-baseline gap-1.5 text-slate-600"><span className="text-lg font-bold tabular-nums text-slate-950">{data.totalActive}</span><span className="text-xs font-semibold">việc đang mở</span></div>
          <span className="text-xs font-semibold text-slate-500">Phạm vi dashboard</span>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button type="button" disabled className="rounded-lg px-3 py-2 text-slate-400" title="Sẽ bật khi chuẩn hóa người phụ trách trên mọi nghiệp vụ">Của tôi</button>
            <span className="rounded-lg bg-white px-3 py-2 text-slate-900 shadow-sm">Toàn shop</span>
          </div>
        </div>
      } />

      <section className="!mt-6" aria-label="Khu vực xử lý">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035),0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="hidden border-b border-slate-200 bg-slate-100/80 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 lg:grid lg:grid-cols-[minmax(190px,1.05fr)_100px_minmax(260px,1.35fr)_minmax(220px,1fr)_150px] lg:gap-5">
            <span>Khu vực nghiệp vụ</span>
            <span>Khối lượng</span>
            <span className="text-center">Stage tập trung</span>
            <span>Cần chú ý nhất</span>
            <span className="text-right">Thao tác</span>
          </div>
          <div className="divide-y divide-slate-100">
            {data.queues.map((queue) => <QueueRow key={queue.key} queue={queue} />)}
          </div>
        </div>
      </section>

      <div className="mt-8"><DashboardCharts data={data} /></div>
      <div className="mt-5 text-right text-xs text-slate-400">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(data.generatedAt))}</div>
    </AdminPageCanvas>
  );
}
