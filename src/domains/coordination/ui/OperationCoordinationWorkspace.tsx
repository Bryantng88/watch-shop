"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, Inbox, MessageSquareWarning } from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import type { CoordinationDashboardDTO } from "../server/coordination-dashboard.types";

type Props = {
  data: CoordinationDashboardDTO;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function progressText(progress: CoordinationDashboardDTO["workTickets"][number]["progress"]) {
  return `${progress.queue} Queue · ${progress.waiting} Waiting · ${progress.feedback} Feedback · ${progress.done} Done`;
}

export default function OperationCoordinationWorkspace({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateDate(date: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("date", date);
    router.push(`/admin/coordination/operation?${next.toString()}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <AdminBreadcrumbs
          items={[
            { label: "Điều phối" },
            { label: "Vận hành" },
          ]}
        />

        <section className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{data.cycle.title}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
              {data.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {data.week.label}/{data.week.year}
              </span>
              <span>
                {formatDate(data.week.startDate)} - {formatDate(data.week.endDate)}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[160px_220px]">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Tuần</span>
              <select
                value={data.week.periodKey}
                onChange={(event) => {
                  const option = data.filters.weekOptions.find(
                    (item) => item.value === event.target.value,
                  );
                  if (option) updateDate(option.date);
                }}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400"
              >
                {data.filters.weekOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Khoảng thời gian</span>
              <input
                type="date"
                value={data.filters.selectedDate}
                onChange={(event) => updateDate(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {data.report.map((metric) => (
            <div
              key={metric.key}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-medium uppercase text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {metric.value}
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">
              {data.week.label}
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {data.workTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/task-items/${ticket.id}`}
                className="grid gap-3 px-4 py-4 transition hover:bg-slate-50 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr_1fr_0.8fr_1.3fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-950">
                      {ticket.title}
                    </span>
                    {ticket.needAttention ? (
                      <MessageSquareWarning className="h-4 w-4 text-amber-600" />
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {progressText(ticket.progress)}
                  </div>
                </div>

                <SummaryCell label="Owner" value={ticket.ownerLabel} />
                <SummaryCell label="Queue" value={String(ticket.queueCount)} />
                <SummaryCell
                  label="Need Attention"
                  value={ticket.needAttention ? "Có" : "Không"}
                />
                <SummaryCell label="Feedback" value={String(ticket.feedbackCount)} />
                <SummaryCell label="Updated" value={formatDateTime(ticket.updatedAt)} />

                <div className="min-w-0 text-sm">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Last Activity
                  </div>
                  <div className="truncate text-slate-800">
                    {ticket.lastActivity || "-"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {formatDateTime(ticket.lastActivityAt)}
                  </div>
                </div>

                <div className="flex items-center justify-end text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}

            {!data.workTickets.length ? (
              <div className="flex items-center gap-3 px-4 py-10 text-sm text-slate-500">
                <Inbox className="h-5 w-5" />
                Chưa có Phiếu xử lý cho tuần này.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 truncate text-slate-800">{value}</div>
    </div>
  );
}
