import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";

import type { DashboardTone, OperationsDashboardData, OperationsDashboardQueue } from "../shared";
import { ADMIN_UI, AdminPageCanvas, AdminPageHeader } from "@/domains/shared/ui/admin-design-contract";
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
function QueueCard({ queue }: { queue: OperationsDashboardQueue }) {
  const visual = operationalDomainPresentation(queue.key);
  const Icon = visual.icon;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_7px_20px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-4 p-4">
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
        <div className="mx-3 mt-2 rounded-lg bg-amber-50/65 px-3 py-2">
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
      <div className="flex-1 divide-y divide-slate-100 px-3">
        {queue.stages.map((stage) => (
          <Link key={stage.key} href={stage.href} className={cn("group flex items-center justify-between gap-3 rounded-md px-1 py-3.5", ADMIN_UI.interactiveSurface, stage.count === 0 && "opacity-45 hover:opacity-75")}>
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
      <div className="px-3 pb-3 pt-2">
        <Link href={queue.href} className={cn("group/cta flex h-10 items-center justify-between rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", visual.actionClassName)}>
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

      <section className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">{data.queues.map((queue) => <QueueCard key={queue.key} queue={queue} />)}</section>

      <section className="!mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035),0_8px_24px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <div><h2 className="font-bold text-slate-950">Cần ưu tiên</h2><p className="mt-0.5 text-xs text-slate-500">Xếp theo mức độ ảnh hưởng, sau đó theo thời gian tồn</p></div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{data.attention.length}</span>
          </div>
          {data.attention.length ? (
            <div className="divide-y divide-slate-200/60">
              {data.attention.map((item) => {
                const isTopPriority = item.id === priority?.id;
                return (
                  <Link key={item.id} href={item.href} className={cn("group grid gap-3 px-5 transition sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:items-center", isTopPriority ? "border-l-2 border-amber-400 bg-gradient-to-r from-amber-50/80 via-amber-50/30 to-transparent py-[18px] hover:from-amber-50 hover:via-violet-50/45" : cn("py-4", ADMIN_UI.interactiveSurface))}>
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

        <div className="overflow-hidden rounded-2xl bg-slate-50/80 shadow-[0_1px_2px_rgba(15,23,42,0.025),0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="px-5 pb-3 pt-5">
            <h2 className="font-bold text-slate-950">Tín hiệu cần can thiệp</h2>
            <p className="mt-0.5 text-xs text-slate-500">Cảnh báo nổi bật cần kiểm tra theo từng khu vực</p>
          </div>
          <div className="divide-y divide-slate-200/60">
            {data.queues.map((queue) => {
              const warnings = queue.insights.filter((insight) => insight.count > 0);
              const visual = operationalDomainPresentation(queue.key);
              const Icon = visual.icon;
              const primaryWarning = warnings.find((insight) => insight.severity === "risk") ?? warnings[0];
              const targetHref = primaryWarning?.href ?? queue.href;
              return (
                <Link key={queue.key} href={targetHref} className={cn("group flex items-center gap-3 px-5 py-4", ADMIN_UI.interactiveSurface)}>
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

      <div className="mt-5 text-right text-xs text-slate-400">Cập nhật lúc {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(data.generatedAt))}</div>
    </AdminPageCanvas>
  );
}
