import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ServerCog,
  UserRound,
  Zap,
} from "lucide-react";

import type { GlobalActivityResult } from "../server/global-activity.service";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { ADMIN_OPERATION_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";

type Props = {
  data: GlobalActivityResult;
};

function formatDate(value: string) {
  const date = new Date(value);
  return {
    time: new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
    date: new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date),
  };
}

function initials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "HT";
}

function hrefWithPage(data: GlobalActivityResult, page: number) {
  const params = new URLSearchParams();
  if (data.filters.query) params.set("q", data.filters.query);
  if (data.filters.targetType) params.set("targetType", data.filters.targetType);
  if (data.filters.eventKey) params.set("eventKey", data.filters.eventKey);
  if (data.filters.actorUserId) params.set("actorUserId", data.filters.actorUserId);
  if (data.filters.period) params.set("period", data.filters.period);
  params.set("page", String(page));
  params.set("pageSize", String(data.pagination.pageSize));
  return `/admin/activity?${params.toString()}`;
}

function SummaryCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  note: string;
  icon: typeof Activity;
  tone: "violet" | "blue" | "emerald" | "slate";
}) {
  const styles = {
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">{label}</div>
          <div className="mt-3 text-2xl font-bold tabular-nums text-slate-950">
            {value.toLocaleString("vi-VN")}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">{note}</div>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${styles}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export default function GlobalActivityPage({ data }: Props) {
  return (
    <div className={ADMIN_OPERATION_CONTENT_CLASS}>
      <section className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-white via-white to-violet-50 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-l-4 border-violet-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-950">Activity hệ thống</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Nhật ký sự kiện nghiệp vụ trên toàn hệ thống
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-violet-700">
            Projection log · chỉ đọc
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Tổng sự kiện"
          value={data.summary.total}
          note="Khớp bộ lọc hiện tại"
          icon={Activity}
          tone="violet"
        />
        <SummaryCard
          label="Phát sinh hôm nay"
          value={data.summary.today}
          note="Từ 00:00 hôm nay"
          icon={CalendarDays}
          tone="blue"
        />
        <SummaryCard
          label="Business event"
          value={data.summary.businessEvents}
          note="Cập nhật từ domain"
          icon={Zap}
          tone="emerald"
        />
        <SummaryCard
          label="System update"
          value={data.summary.systemUpdates}
          note="Cập nhật vận hành nội bộ"
          icon={ServerCog}
          tone="slate"
        />
      </section>

      <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_180px_240px_200px_150px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={data.filters.query}
              placeholder="Tìm event, đối tượng, người thao tác..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
            />
          </label>
          <select name="targetType" defaultValue={data.filters.targetType} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-300">
            <option value="">Tất cả domain</option>
            {data.options.targetTypes.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select name="eventKey" defaultValue={data.filters.eventKey} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-300">
            <option value="">Tất cả event</option>
            {data.options.eventKeys.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select name="actorUserId" defaultValue={data.filters.actorUserId} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-300">
            <option value="">Tất cả người thao tác</option>
            {data.options.actors.map((actor) => (
              <option key={actor.id} value={actor.id}>{actor.name || actor.email || actor.id}</option>
            ))}
          </select>
          <select name="period" defaultValue={data.filters.period} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-300">
            <option value="TODAY">Hôm nay</option>
            <option value="7D">7 ngày qua</option>
            <option value="30D">30 ngày qua</option>
            <option value="ALL">Toàn bộ</option>
          </select>
          <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Filter className="h-4 w-4" /> Lọc
          </button>
        </div>
      </form>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] table-fixed">
            <colgroup>
              <col className="w-[130px]" />
              <col className="w-[300px]" />
              <col className="w-[330px]" />
              <col className="w-[210px]" />
              <col className="w-[150px]" />
              <col className="w-[80px]" />
            </colgroup>
            <thead className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-4 py-3">Domain / Event</th>
                <th className="px-4 py-3">Hoạt động / Đối tượng</th>
                <th className="px-4 py-3">Người thao tác</th>
                <th className="px-4 py-3">Workspace</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item) => {
                const date = formatDate(item.occurredAt);
                const avatarSrc = item.actor.avatarUrl
                  ? resolveMediaPreviewSrc(item.actor.avatarUrl) ?? item.actor.avatarUrl
                  : null;
                return (
                  <tr key={item.id} className="group transition hover:bg-violet-50/30">
                    <td className="px-5 py-4 align-top">
                      <div className="text-sm font-semibold tabular-nums text-slate-800">{date.time}</div>
                      <div className="mt-1 text-xs tabular-nums text-slate-400">{date.date}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700 ring-1 ring-violet-100">
                        {item.targetType}
                      </span>
                      <div title={item.eventKey} className="mt-2 truncate font-mono text-[11px] text-slate-500">
                        {item.eventKey}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="truncate text-sm font-bold text-slate-950">{item.title}</div>
                      {item.body ? <div className="mt-1 line-clamp-1 text-xs text-slate-500">{item.body}</div> : null}
                      <div className="mt-2 truncate text-[11px] text-slate-400">
                        {item.taskItemTitle} · {item.targetId}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-900 text-[10px] font-bold text-white">
                          {avatarSrc ? (
                            <Image src={avatarSrc} alt="" fill sizes="32px" unoptimized className="object-cover" />
                          ) : item.actor.isSystem ? (
                            <ServerCog className="h-3.5 w-3.5" />
                          ) : (
                            initials(item.actor.label)
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-slate-800">{item.actor.label}</span>
                          <span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                            <UserRound className="h-3 w-3" />
                            {item.actor.isSystem ? "System" : "User"}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="line-clamp-2 text-xs font-medium leading-5 text-slate-600">
                        {item.workspaceTitle}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center align-top">
                      <Link href={item.targetHref} title="Mở đối tượng" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!data.items.length ? (
          <div className="px-6 py-20 text-center">
            <Activity className="mx-auto h-9 w-9 text-slate-300" />
            <div className="mt-3 font-semibold text-slate-700">Không có activity phù hợp</div>
            <div className="mt-1 text-sm text-slate-400">Thử thay đổi bộ lọc hoặc khoảng thời gian.</div>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <span className="text-xs text-slate-500">
            Hiển thị {data.items.length} / {data.pagination.total.toLocaleString("vi-VN")} activity · Trang {data.pagination.page}/{data.pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Link aria-disabled={data.pagination.page <= 1} href={hrefWithPage(data, Math.max(1, data.pagination.page - 1))} className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold ${data.pagination.page <= 1 ? "pointer-events-none border-slate-100 text-slate-300" : "border-slate-200 text-slate-700 hover:border-violet-200 hover:text-violet-700"}`}>
              <ChevronLeft className="h-4 w-4" /> Trước
            </Link>
            <Link aria-disabled={data.pagination.page >= data.pagination.totalPages} href={hrefWithPage(data, Math.min(data.pagination.totalPages, data.pagination.page + 1))} className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold ${data.pagination.page >= data.pagination.totalPages ? "pointer-events-none border-slate-100 text-slate-300" : "border-slate-200 text-slate-700 hover:border-violet-200 hover:text-violet-700"}`}>
              Sau <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
