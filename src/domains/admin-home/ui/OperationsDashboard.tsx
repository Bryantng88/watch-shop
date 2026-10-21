import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import type { DashboardTone, OperationsDashboardData, OperationsDashboardQueue } from "../shared";
import { ADMIN_OPERATION_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";
import { operationalDomainPresentation, operationalStagePresentation } from "@/domains/shared/ui/signals";
import { cn } from "@/lib/utils";

const toneClass: Record<DashboardTone, string> = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-700",
  violet: "bg-violet-50 text-violet-700",
};

const domainLabels = { ORDER: "Đơn hàng", PURCHASE_REQUEST: "Yêu cầu", MEDIA: "Media", TECHNICAL: "Technical" };
const chartColors: Record<OperationsDashboardQueue["key"], string> = {
  orders: "#64748b",
  "purchase-requests": "#f59e0b",
  media: "#8b5cf6",
  technical: "#3b82f6",
};

function DashboardCharts({ data }: { data: OperationsDashboardData }) {
  let cursor = 0;
  const stops = data.queues.map((queue) => {
    const start = cursor;
    cursor += data.totalActive ? (queue.activeCount / data.totalActive) * 100 : 0;
    return `${chartColors[queue.key]} ${start}% ${cursor}%`;
  });
  const donutBackground = data.totalActive ? `conic-gradient(${stops.join(", ")})` : "#e2e8f0";
  const completionTotal = data.completionTrend.reduce((sum, item) => sum + item.count, 0);
  const completionMax = Math.max(1, ...data.completionTrend.map((item) => item.count));

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div><h2 className="font-bold text-slate-950">Cơ cấu việc đang mở</h2><p className="mt-0.5 text-xs text-slate-500">Tỷ trọng số mục theo từng khu vực nghiệp vụ</p></div>
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
          <div className="relative h-36 w-36 shrink-0 rounded-full" style={{ background: donutBackground }}>
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span className="text-2xl font-bold tabular-nums text-slate-950">{data.totalActive}</span>
              <span className="text-[11px] font-medium text-slate-500">việc đang mở</span>
            </div>
          </div>
          <div className="grid w-full gap-2.5">
            {data.queues.map((queue) => (
              <div key={queue.key} className="flex items-center justify-between gap-4 text-xs">
                <span className="flex min-w-0 items-center gap-2 text-slate-600"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[queue.key] }} /><span className="truncate">{operationalDomainPresentation(queue.key).label}</span></span>
                <span className="font-semibold tabular-nums text-slate-800">{queue.activeCount}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="font-bold text-slate-950">Nhịp hoàn tất 7 ngày</h2><p className="mt-0.5 text-xs text-slate-500">Số đơn hàng được hoàn tất theo ngày</p></div>
          <div className="text-right"><div className="text-2xl font-bold tabular-nums text-slate-950">{completionTotal}</div><div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">đơn hoàn tất</div></div>
        </div>
        <div className="mt-6 flex h-40 items-end gap-2 border-b border-slate-100 px-1 pb-2">
          {data.completionTrend.map((item) => (
            <div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] font-semibold tabular-nums text-slate-500 opacity-0 transition group-hover:opacity-100">{item.count}</span>
              <div className="w-full max-w-9 rounded-t-md bg-emerald-400/80 transition-colors group-hover:bg-emerald-500" style={{ height: item.count ? `${Math.max(12, (item.count / completionMax) * 100)}%` : "3px" }} title={`${item.label}: ${item.count} đơn`} />
              <span className="text-[10px] font-medium capitalize text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">{completionTotal > 0 ? `Trung bình ${(completionTotal / 7).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} đơn/ngày trong tuần gần nhất.` : "Chưa có đơn hàng hoàn tất trong 7 ngày gần nhất."}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div><h2 className="font-bold text-slate-950">Phân bố theo giai đoạn</h2><p className="mt-0.5 text-xs text-slate-500">Nhìn nhanh công việc đang tập trung ở bước nào trong từng pipeline</p></div>
        <div className="mt-5 space-y-5">
          {data.queues.map((queue) => {
            const total = queue.stages.reduce((sum, stage) => sum + stage.count, 0);
            return (
              <div key={queue.key}>
                <div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-700">{operationalDomainPresentation(queue.key).label}</span><span className="tabular-nums text-slate-400">{total} mục</span></div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                  {queue.stages.filter((stage) => stage.count > 0).map((stage) => <div key={stage.key} className={cn("h-full", operationalStagePresentation(stage.key).dotClassName)} style={{ width: `${total ? (stage.count / total) * 100 : 0}%` }} title={`${stage.label}: ${stage.count}`} />)}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {queue.stages.map((stage) => <span key={stage.key} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500"><span className={cn("h-1.5 w-1.5 rounded-full", operationalStagePresentation(stage.key).dotClassName)} />{stage.label} <strong className="font-semibold text-slate-700">{stage.count}</strong></span>)}
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}

function PersonalWorkPreviewCard() {
  return (
    <Link href="/admin/personal-work" className="group flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-900/[0.05] transition hover:bg-blue-50/50 hover:ring-blue-200 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays className="h-5 w-5" /></div>
        <div className="min-w-0">
          <div className="flex items-center gap-2"><h2 className="text-sm font-bold text-slate-950">Việc cá nhân & Google Calendar</h2><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">Mở quản lý</span></div>
          <p className="mt-1 text-xs leading-5 text-slate-500">Theo dõi việc riêng, lịch hẹn và nhắc việc ngay trong trung tâm điều hành.</p>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700">Mở công việc <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
    </Link>
  );
}

function QueueCard({ queue }: { queue: OperationsDashboardQueue }) {
  const visual = operationalDomainPresentation(queue.key);
  const Icon = visual.icon;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 bg-white p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", visual.accentClassName)}><Icon className="h-5 w-5" /></div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-950">{queue.label}</h2>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{queue.description}</p>
          </div>
        </div>
        <div className={cn("rounded-xl px-3 py-1.5 text-lg font-bold tabular-nums", visual.softClassName)}>{queue.activeCount}</div>
      </div>
      {queue.insights.some((insight) => insight.count > 0) ? (
        <div className="mx-4 mt-3 rounded-xl bg-amber-50/55 px-3 py-2.5">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {queue.insights.filter((insight) => insight.count > 0).map((insight) => (
              <Link key={insight.key} href={insight.href} className={cn(
                "group/insight inline-flex items-center gap-1.5 text-xs font-medium transition hover:text-slate-950",
                insight.severity === "risk" ? "text-rose-700" : insight.severity === "attention" ? "text-amber-800" : "text-slate-600",
              )}>
                <span className="font-bold tabular-nums">{insight.count}</span> {insight.label}
                <ArrowRight className="h-3 w-3 opacity-40 transition group-hover/insight:translate-x-0.5 group-hover/insight:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex-1 divide-y divide-slate-100 px-4">
        {queue.stages.map((stage) => (
          <Link key={stage.key} href={stage.href} className={cn("group flex items-center justify-between gap-3 px-1 py-4 transition hover:bg-slate-50/80", stage.count === 0 && "opacity-45 hover:opacity-75")}>
              <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-slate-700">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", operationalStagePresentation(stage.key).dotClassName)} />
                <span className="truncate">{stage.label}</span>
              </span>
              <span className={cn("flex shrink-0 items-center gap-1 text-xs font-semibold tabular-nums transition group-hover:text-slate-950", stage.count > 0 ? "text-slate-700" : "text-slate-400")}>
                {stage.count > 0 ? `${stage.actionLabel} · ${stage.count}` : "Xem"}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
          </Link>
        ))}
      </div>
      <div className="px-4 pb-4 pt-2">
        <Link href={queue.href} className={cn("group/cta flex h-10 items-center justify-between rounded-lg border px-4 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", visual.actionClassName)}>
          <span>{queue.actionLabel}</span>
          <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums opacity-75">{queue.activeCount} việc <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" /></span>
        </Link>
      </div>
    </article>
  );
}

export default function OperationsDashboard({ data }: { data: OperationsDashboardData }) {
  const priority = data.priorityAction;
  return (
    <main className={ADMIN_OPERATION_CONTENT_CLASS}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Trung tâm điều hành</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi công việc đang mở, ngoại lệ và tiến độ các khu vực nghiệp vụ.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="mr-1 flex items-baseline gap-1.5 text-slate-600"><span className="text-lg font-bold tabular-nums text-slate-950">{data.totalActive}</span><span className="text-xs font-semibold">việc đang mở</span></div>
          <span className="text-xs font-semibold text-slate-500">Phạm vi dashboard</span>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button type="button" disabled className="rounded-lg px-3 py-2 text-slate-400" title="Sẽ bật khi chuẩn hóa người phụ trách trên mọi nghiệp vụ">Của tôi</button>
            <span className="rounded-lg bg-white px-3 py-2 text-slate-900 shadow-sm">Toàn shop</span>
          </div>
        </div>
      </div>

      <section className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data.queues.map((queue) => <QueueCard key={queue.key} queue={queue} />)}</section>

      <section className="!mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h2 className="font-bold text-slate-950">Cần ưu tiên</h2><p className="mt-0.5 text-xs text-slate-500">Xếp theo mức độ ảnh hưởng, sau đó theo thời gian tồn</p></div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{data.attention.length}</span>
          </div>
          {data.attention.length ? (
            <div className="divide-y divide-slate-100">
              {data.attention.map((item) => {
                const isTopPriority = item.id === priority?.id;
                return (
                  <Link key={item.id} href={item.href} className={cn("group grid gap-3 px-5 transition sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:items-center", isTopPriority ? "border-l-2 border-amber-400 bg-gradient-to-r from-amber-50/80 via-amber-50/30 to-transparent py-[18px] hover:from-amber-50 hover:via-amber-50/45" : "py-4 hover:bg-slate-50")}>
                    <span className="flex items-center gap-2"><span className={cn("w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", toneClass[item.tone])}>{domainLabels[item.domain]}</span>{isTopPriority ? <span className="text-[10px] font-bold tabular-nums text-amber-600">#1</span> : null}</span>
                    <span className="min-w-0">
                      {isTopPriority ? <><span className="block truncate text-base font-semibold text-slate-950">{item.reason}</span><span className="mt-1 block truncate text-xs font-medium text-slate-600">{item.title}{item.reference ? ` · ${item.reference}` : ""}</span></> : <><span className="block truncate text-sm font-semibold text-slate-900">{item.title}</span><span className={cn("mt-1 block truncate text-xs font-semibold", item.tone === "rose" ? "text-rose-700" : item.tone === "amber" ? "text-amber-700" : "text-slate-600")}>{item.reason}</span></>}
                      <span className="mt-0.5 block truncate text-xs text-slate-400">{item.ownerLabel}</span>
                    </span>
                    <span className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition", isTopPriority ? "border-amber-200 bg-white text-amber-800 group-hover:bg-amber-50" : "border-transparent bg-slate-100 text-slate-700 group-hover:border-slate-200 group-hover:bg-slate-200")}><span className="hidden lg:inline">{item.actionLabel}</span><ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
                  </Link>
                );
              })}
            </div>
          ) : <div className="flex min-h-48 items-center justify-center px-6 text-center text-sm text-slate-500">Không có ngoại lệ quá hạn trong dữ liệu hiện tại.</div>}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">Tín hiệu cần can thiệp</h2>
            <p className="mt-0.5 text-xs text-slate-500">Cảnh báo nổi bật cần kiểm tra theo từng khu vực</p>
          </div>
          <div className="divide-y divide-slate-100">
            {data.queues.map((queue) => {
              const warnings = queue.insights.filter((insight) => insight.count > 0);
              const visual = operationalDomainPresentation(queue.key);
              const Icon = visual.icon;
              const primaryWarning = warnings.find((insight) => insight.severity === "risk") ?? warnings[0];
              const targetHref = primaryWarning?.href ?? queue.href;
              return (
                <Link key={queue.key} href={targetHref} className="group flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/80">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", visual.softClassName)}><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{visual.label}</span>
                    {primaryWarning ? <span className={cn("mt-0.5 block truncate text-xs font-medium", primaryWarning.severity === "risk" ? "text-rose-700" : "text-amber-700")}>{primaryWarning.count} {primaryWarning.label}</span> : <span className="mt-0.5 block text-xs text-slate-400">Không có cảnh báo nổi bật</span>}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400"><strong className="font-semibold tabular-nums text-slate-700">{queue.activeCount}</strong> đang mở<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-5"><PersonalWorkPreviewCard /></section>
      <DashboardCharts data={data} />
      <div className="mt-5 text-right text-xs text-slate-400">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(data.generatedAt))}</div>
    </main>
  );
}
