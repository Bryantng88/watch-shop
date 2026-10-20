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

function PersonalWorkPreviewCard() {
  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-900/[0.05] sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays className="h-5 w-5" /></div>
        <div className="min-w-0">
          <div className="flex items-center gap-2"><h2 className="text-sm font-bold text-slate-950">Việc cá nhân & Google Calendar</h2><span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">Sắp phát triển</span></div>
          <p className="mt-1 text-xs leading-5 text-slate-500">Theo dõi việc riêng, lịch hẹn và nhắc việc ngay trong trung tâm điều hành.</p>
        </div>
      </div>
      <span className="shrink-0 text-xs font-semibold text-slate-400">Roadmap</span>
    </article>
  );
}

function QueueCard({ queue }: { queue: OperationsDashboardQueue }) {
  const visual = operationalDomainPresentation(queue.key);
  const Icon = visual.icon;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.05]">
      <div className="flex items-start justify-between gap-4 bg-slate-50/50 p-5">
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
        <Link href={queue.href} className="group/cta flex items-center justify-between rounded-xl bg-slate-100/80 px-3.5 py-3 text-sm font-bold text-slate-900 ring-1 ring-slate-900/[0.06] transition hover:bg-slate-200/70">
          <span>{queue.actionLabel}</span>
          <span className="flex items-center gap-2 text-xs tabular-nums">{queue.activeCount} việc <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white"><ArrowRight className="h-3.5 w-3.5 transition group-hover/cta:translate-x-0.5" /></span></span>
        </Link>
      </div>
    </article>
  );
}

export default function OperationsDashboard({ data }: { data: OperationsDashboardData }) {
  const priority = data.priorityAction;
  return (
    <main className={ADMIN_OPERATION_CONTENT_CLASS}>
      <div className="mb-3 flex items-center justify-end gap-3">
        <span className="text-xs font-semibold text-slate-500">Phạm vi dashboard</span>
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button type="button" disabled className="rounded-lg px-3 py-2 text-slate-400" title="Sẽ bật khi chuẩn hóa người phụ trách trên mọi nghiệp vụ">Của tôi</button>
          <span className="rounded-lg bg-white px-3 py-2 text-slate-900 shadow-sm">Toàn shop</span>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-white to-white px-6 py-6 shadow-sm md:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Ưu tiên số 1 hôm nay</div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{priority ? priority.reason : "Không có việc quá hạn hôm nay"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{priority ? `${priority.title}${priority.reference ? ` · ${priority.reference}` : ""} · ${priority.ownerLabel}` : "Các pipeline hiện không có ngoại lệ cần ưu tiên ngay."}</p>
          </div>
          <div className="flex flex-wrap items-stretch gap-3">
            {priority ? <Link href={priority.href} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">{priority.actionLabel}<ArrowRight className="h-4 w-4" /></Link> : null}
            <div className="rounded-2xl bg-white px-5 py-3 ring-1 ring-slate-200">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Việc đang mở</div>
              <div className="mt-1 text-3xl font-bold tabular-nums text-slate-950">{data.totalActive}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data.queues.map((queue) => <QueueCard key={queue.key} queue={queue} />)}</section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h2 className="font-bold text-slate-950">Cần ưu tiên</h2><p className="mt-0.5 text-xs text-slate-500">Xếp theo mức độ ảnh hưởng, sau đó theo thời gian tồn</p></div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{data.attention.length}</span>
          </div>
          {data.attention.length ? (
            <div className="divide-y divide-slate-100">
              {data.attention.map((item) => (
                <Link key={item.id} href={item.href} className="group grid gap-3 px-5 py-4 transition hover:bg-slate-50 sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:items-center">
                  <span className={cn("w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", toneClass[item.tone])}>{domainLabels[item.domain]}</span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900">{item.title}</span><span className={cn("mt-1 block truncate text-xs font-semibold", item.tone === "rose" ? "text-rose-700" : item.tone === "amber" ? "text-amber-700" : "text-slate-600")}>{item.reason}</span><span className="mt-0.5 block truncate text-xs text-slate-400">{item.reference ? `${item.reference} · ` : ""}{item.ownerLabel}</span></span>
                  <span className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white"><span className="hidden lg:inline">{item.actionLabel}</span><ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
                </Link>
              ))}
            </div>
          ) : <div className="flex min-h-48 items-center justify-center px-6 text-center text-sm text-slate-500">Không có ngoại lệ quá hạn trong dữ liệu hiện tại.</div>}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">Bản đồ việc đang mở</h2>
            <p className="mt-0.5 text-xs text-slate-500">Số mục đang mở theo khu vực</p>
          </div>
          <div className="space-y-4 p-5">
            {data.queues.map((queue) => {
              const warnings = queue.insights.filter((insight) => insight.count > 0);
              const visual = operationalDomainPresentation(queue.key);
              const Icon = visual.icon;
              const primaryWarning = warnings.find((insight) => insight.severity === "risk") ?? warnings[0];
              const share = data.totalActive ? Math.round((queue.activeCount / data.totalActive) * 100) : 0;
              return (
                <div key={queue.key} className="group">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <Link href={queue.href} className="flex min-w-0 items-center gap-2 font-semibold text-slate-700 transition hover:text-slate-950">
                      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", visual.softClassName)}><Icon className="h-3.5 w-3.5" /></span>
                      <span className="truncate">{visual.label}</span>
                    </Link>
                    <Link href={queue.href} className="shrink-0 font-bold tabular-nums text-slate-950">{queue.activeCount} <span className="font-normal text-slate-400">· {share}%</span></Link>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full opacity-80 transition-all group-hover:opacity-100", visual.accentClassName)} style={{ width: `${share}%` }} /></div>
                  <div className="mt-1.5 flex min-h-4 justify-end">
                    {primaryWarning ? <Link href={primaryWarning.href} className={cn("inline-flex items-center gap-1 text-xs font-semibold transition hover:text-slate-950", primaryWarning.severity === "risk" ? "text-rose-700" : "text-amber-700")}>{primaryWarning.count} {primaryWarning.label}<ArrowRight className="h-3.5 w-3.5" /></Link> : <span className="text-xs text-slate-400">Không có cảnh báo</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-5"><PersonalWorkPreviewCard /></section>
      <div className="mt-5 text-right text-xs text-slate-400">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(data.generatedAt))}</div>
    </main>
  );
}
