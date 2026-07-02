"use client";

import { type FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, Inbox, MessageSquareWarning, Plus } from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import { createTaskItemAction } from "@/domains/task/actions/task.actions";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
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

function initials(label: string) {
  return label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "U";
}

function contextPath(context: CoordinationDashboardDTO["context"]) {
  if (context === "SALES") return "sales";
  if (context === "TECHNICAL") return "technical";
  if (context === "GENERAL") return "general";
  return "operation";
}

function prefixedLabel(prefix: "Space" | "Workspace", value: string) {
  const cleanValue = value.trim();
  if (!cleanValue) return prefix;
  if (cleanValue.toLowerCase().startsWith(`${prefix.toLowerCase()} `)) {
    return cleanValue;
  }

  return `${prefix} ${cleanValue}`;
}

function OwnerCell({
  owner,
}: {
  owner: CoordinationDashboardDTO["workTickets"][number]["owner"];
}) {
  const src = resolveMediaPreviewSrc(owner.avatarUrl);

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500">Owner</div>
      <div className="mt-1 inline-flex min-w-0 items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${owner.isSystem ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={owner.label} className="h-full w-full object-cover" />
          ) : owner.isSystem ? (
            "S"
          ) : (
            initials(owner.label)
          )}
        </span>
        <span className="truncate font-medium text-slate-800">{owner.label}</span>
      </div>
    </div>
  );
}

export default function OperationCoordinationWorkspace({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateDate(date: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("date", date);
    router.push(`/admin/coordination/${contextPath(data.context)}?${next.toString()}`);
  }

  function createWorkTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setError(null);
    startTransition(async () => {
      try {
        await createTaskItemAction({
          taskId: data.cycle.id,
          title: cleanTitle,
          priority: "MEDIUM",
        });
        setTitle("");
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Cannot add workspace.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <AdminBreadcrumbs
          items={[
            { label: "Space Management" },
            { label: data.spacesLabel },
          ]}
        />

        <section className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-700">
              {prefixedLabel("Space", data.cycle.title)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Week {data.week.weekNumber}/{data.week.year}
              </span>
              <span>
                {formatDate(data.week.startDate)} - {formatDate(data.week.endDate)}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[160px_220px]">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Week</span>
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
              <span className="mb-1 block font-medium text-slate-600">Date range</span>
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                {prefixedLabel("Space", data.cycle.title)}
              </h2>

              <form className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center" onSubmit={createWorkTicket}>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Add workspace"
                  className="h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400 sm:w-64"
                />
                <button
                  type="submit"
                  disabled={isPending || !title.trim()}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </form>
            </div>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
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
                      {prefixedLabel("Workspace", ticket.title)}
                    </span>
                    {ticket.needAttention ? (
                      <MessageSquareWarning className="h-4 w-4 text-amber-600" />
                    ) : null}
                  </div>
                </div>

                <OwnerCell owner={ticket.owner} />
                <QueueSummaryCell summary={ticket.queueSummary} />
                <SummaryCell
                  label="Need Attention"
                  value={ticket.needAttention ? "Yes" : "No"}
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
                No workspaces for this week.
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

function QueueSummaryCell({
  summary,
}: {
  summary: CoordinationDashboardDTO["workTickets"][number]["queueSummary"];
}) {
  const items = [
    { label: "Ready", value: summary.ready },
    { label: "Review", value: summary.review },
    { label: "Feedback", value: summary.feedback },
    { label: "Done", value: summary.done },
  ];

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500">Items Summary</div>
      <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
        {items.map((item) => (
          <span key={item.label} className="flex items-center justify-between gap-2">
            <span>{item.label}</span>
            <span className="font-medium text-slate-900">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
