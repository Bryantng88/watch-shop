"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronRight, Circle, Clock3, ExternalLink, Filter, Plus, RefreshCw } from "lucide-react";
import { createPersonalWorkAction, getGoogleCalendarConnectUrlAction, syncPersonalWorkCalendarAction, updatePersonalWorkAction } from "../actions/personal-work.actions";
import { PERSONAL_WORK_DOMAINS, type PersonalWorkDomain, type PersonalWorkPageData } from "../shared/personal-work.types";

const domainStyle: Record<PersonalWorkDomain, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  MEDIA: "bg-violet-50 text-violet-700",
  TECHNICAL: "bg-blue-50 text-blue-700",
  SALES: "bg-emerald-50 text-emerald-700",
  ORDER: "bg-amber-50 text-amber-700",
  ACQUISITION: "bg-rose-50 text-rose-700",
};

function localInputDate(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function dueLabel(value: string | null) {
  if (!value) return "Chưa có lịch";
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function PersonalWorkClient({ data }: { data: PersonalWorkPageData }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"TODAY" | "UPCOMING" | "ALL" | "DONE">("TODAY");
  const [domain, setDomain] = useState<PersonalWorkDomain | "ALL">("ALL");
  const [title, setTitle] = useState("");
  const [newDomain, setNewDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [dueAt, setDueAt] = useState(localInputDate(new Date()));
  const [message, setMessage] = useState<string | null>(null);
  const now = new Date();
  const todayEndMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const items = useMemo(() => data.items.filter((item) => {
    if (domain !== "ALL" && item.domain !== domain) return false;
    if (view === "DONE") return item.status === "DONE";
    if (item.status === "DONE") return false;
    if (view === "TODAY") return !item.dueAt || new Date(item.dueAt).getTime() <= todayEndMs;
    if (view === "UPCOMING") return Boolean(item.dueAt && new Date(item.dueAt).getTime() > todayEndMs);
    return true;
  }), [data.items, domain, view, todayEndMs]);
  const openCount = data.items.filter((item) => item.status !== "DONE").length;
  const overdue = data.items.filter((item) => item.status !== "DONE" && item.dueAt && new Date(item.dueAt) < now).length;

  function run(action: () => Promise<unknown>, success?: string) {
    setMessage(null);
    startTransition(async () => {
      try { await action(); if (success) setMessage(success); router.refresh(); }
      catch (error) { setMessage(error instanceof Error ? error.message : "Không thể xử lý yêu cầu"); }
    });
  }

  return <div className="space-y-6 px-6 py-5">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Không gian cá nhân</p><h1 className="mt-1 text-2xl font-bold text-slate-950">Công việc của tôi</h1><p className="mt-1 text-sm text-slate-500">Lập lịch, theo dõi và gắn công việc với từng khu vực nghiệp vụ.</p></div>
      <div className="flex items-center gap-5 text-sm"><span><b className="text-lg text-slate-950">{openCount}</b> việc đang mở</span><span><b className="text-lg text-amber-600">{overdue}</b> quá hạn</span></div>
    </header>

    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={(event) => { event.preventDefault(); if (!title.trim()) return; run(() => createPersonalWorkAction({ title, domain: newDomain, dueAt: dueAt ? new Date(dueAt).toISOString() : null }), "Đã thêm công việc"); setTitle(""); }}>
        <div className="flex items-center gap-2"><Plus className="h-5 w-5 text-blue-600"/><h2 className="font-semibold text-slate-950">Thêm việc nhanh</h2></div>
        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_220px_auto]">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Việc cần làm..." className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          <select value={newDomain} onChange={(e) => setNewDomain(e.target.value as PersonalWorkDomain)} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm">{PERSONAL_WORK_DOMAINS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
          <input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          <button disabled={pending} className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">Thêm việc</button>
        </div>
      </form>

      <aside className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="rounded-lg bg-white p-2 text-blue-600 shadow-sm"><CalendarDays className="h-5 w-5"/></span><div><h2 className="font-semibold text-slate-950">Google Calendar</h2><p className="mt-0.5 text-xs text-slate-500">{data.calendar.connected ? data.calendar.accountEmail || "Đã kết nối" : data.calendar.configured ? "Chưa kết nối tài khoản" : "Chưa cấu hình OAuth"}</p></div></div>{data.calendar.connected && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">ĐÃ KẾT NỐI</span>}</div>
        <button disabled={pending || !data.calendar.configured} onClick={() => run(async () => { const result = await getGoogleCalendarConnectUrlAction(); window.location.assign(result.url); })} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">{data.calendar.connected ? <><RefreshCw className="h-4 w-4"/> Kết nối lại</> : <><ExternalLink className="h-4 w-4"/> Kết nối Google Calendar</>}</button>
      </aside>
    </section>

    {message && <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">{([['TODAY','Hôm nay'],['UPCOMING','Sắp tới'],['ALL','Tất cả'],['DONE','Đã xong']] as const).map(([key,label]) => <button key={key} onClick={() => setView(key)} className={`rounded-md px-3 py-2 text-sm font-medium ${view === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div>
        <label className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400"/><select value={domain} onChange={(e) => setDomain(e.target.value as PersonalWorkDomain | "ALL")} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="ALL">Tất cả nghiệp vụ</option>{PERSONAL_WORK_DOMAINS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
      </div>
      <div className="divide-y divide-slate-100">{items.length ? items.map((item) => {
        const late = item.status !== "DONE" && item.dueAt && new Date(item.dueAt) < now;
        return <div key={item.id} className="group grid gap-3 px-4 py-4 transition hover:bg-slate-50/80 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <button aria-label="Đánh dấu hoàn thành" disabled={pending} onClick={() => run(() => updatePersonalWorkAction({ id: item.id, status: item.status === "DONE" ? "TODO" : "DONE" }))} className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${item.status === "DONE" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent hover:border-emerald-400 hover:text-emerald-500"}`}><Check className="h-4 w-4"/></button>
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className={`truncate text-sm font-semibold ${item.status === "DONE" ? "text-slate-400 line-through" : "text-slate-950"}`}>{item.title}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${domainStyle[item.domain]}`}>{PERSONAL_WORK_DOMAINS.find((domain) => domain.key === item.domain)?.label}</span>{item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{tag}</span>)}</div><p className={`mt-1 flex items-center gap-1 text-xs ${late ? "font-semibold text-amber-700" : "text-slate-500"}`}><Clock3 className="h-3.5 w-3.5"/>{late ? "Quá hạn · " : ""}{dueLabel(item.dueAt)}</p></div>
          <div className="flex items-center gap-2">{data.calendar.connected && item.status !== "DONE" && <button disabled={pending} onClick={() => run(() => syncPersonalWorkCalendarAction(item.id), "Đã đồng bộ Google Calendar")} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${item.calendar.synced ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>{item.calendar.synced ? "Cập nhật lịch" : "Đưa lên lịch"}</button>}<ChevronRight className="h-4 w-4 text-slate-300"/></div>
        </div>;
      }) : <div className="flex flex-col items-center py-16 text-center"><Circle className="h-8 w-8 text-slate-200"/><p className="mt-3 text-sm font-medium text-slate-600">Không có công việc trong nhóm này</p></div>}</div>
    </section>
  </div>;
}
