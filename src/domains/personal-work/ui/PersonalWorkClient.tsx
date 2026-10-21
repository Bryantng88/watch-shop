"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Circle, Clock3, ExternalLink, Filter, Plus, RefreshCw } from "lucide-react";
import { createPersonalWorkAction, getGoogleCalendarConnectUrlAction, searchPersonalWorkTargetsAction, syncPersonalWorkCalendarAction, updatePersonalWorkAction } from "../actions/personal-work.actions";
import { PERSONAL_WORK_DOMAINS, PERSONAL_WORK_TYPES, type PersonalCalendarEvent, type PersonalWorkDomain, type PersonalWorkPageData, type PersonalWorkTarget, type PersonalWorkTargetType } from "../shared/personal-work.types";

const domainStyle: Record<PersonalWorkDomain, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  MEDIA: "bg-violet-50 text-violet-700",
  TECHNICAL: "bg-blue-50 text-blue-700",
  SALES: "bg-emerald-50 text-emerald-700",
  ORDER: "bg-amber-50 text-amber-700",
  ACQUISITION: "bg-rose-50 text-rose-700",
};

const domainTargets: Record<PersonalWorkDomain, { type: PersonalWorkTargetType; label: string }[]> = {
  GENERAL: [],
  MEDIA: [{ type: "WATCH", label: "Watch" }],
  TECHNICAL: [{ type: "WATCH", label: "Watch" }, { type: "SERVICE_REQUEST", label: "Yêu cầu kỹ thuật" }],
  SALES: [{ type: "WATCH", label: "Watch" }, { type: "PURCHASE_REQUEST", label: "Yêu cầu mua hàng" }],
  ORDER: [{ type: "ORDER", label: "Đơn hàng" }],
  ACQUISITION: [{ type: "ACQUISITION", label: "Phiếu nhập" }],
};

function localInputDate(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function dueLabel(value: string | null) {
  if (!value) return "Chưa có lịch";
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function calendarEventDate(value: string, allDay: boolean) {
  const date = allDay ? new Date(`${value}T00:00:00`) : new Date(value);
  return new Intl.DateTimeFormat("vi-VN", allDay
    ? { weekday: "short", day: "2-digit", month: "2-digit" }
    : { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }
  ).format(date);
}

function localDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function eventDayKey(value: string, allDay: boolean) {
  return allDay ? value.slice(0, 10) : localDayKey(new Date(value));
}

function monthCells(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function PersonalWorkClient({ data }: { data: PersonalWorkPageData }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"TODAY" | "UPCOMING" | "ALL" | "DONE">("TODAY");
  const [domain, setDomain] = useState<PersonalWorkDomain | "ALL">("ALL");
  const [title, setTitle] = useState("");
  const [newDomain, setNewDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [workType, setWorkType] = useState<string>(PERSONAL_WORK_TYPES.GENERAL[0].key);
  const [targetType, setTargetType] = useState<PersonalWorkTargetType | "">("");
  const [targetQuery, setTargetQuery] = useState("");
  const [targetResults, setTargetResults] = useState<PersonalWorkTarget[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<PersonalWorkTarget | null>(null);
  const [dueAt, setDueAt] = useState(localInputDate(new Date()));
  const [message, setMessage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
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
  const calendarDays = useMemo(() => monthCells(calendarCursor), [calendarCursor]);
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, PersonalCalendarEvent[]>();
    for (const event of data.calendar.events) {
      const key = eventDayKey(event.startAt, event.allDay);
      grouped.set(key, [...(grouped.get(key) || []), event]);
    }
    return grouped;
  }, [data.calendar.events]);

  useEffect(() => {
    if (!message) return;
    const timeoutId = window.setTimeout(() => setMessage(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  function run(action: () => Promise<unknown>, success?: string, onSuccess?: () => void) {
    setMessage(null);
    startTransition(async () => {
      try { await action(); onSuccess?.(); if (success) setMessage(success); router.refresh(); }
      catch (error) { setMessage(error instanceof Error ? error.message : "Không thể xử lý yêu cầu"); }
    });
  }

  function changeDomain(nextDomain: PersonalWorkDomain) {
    setNewDomain(nextDomain);
    setWorkType(PERSONAL_WORK_TYPES[nextDomain][0]?.key || "");
    setTargetType(domainTargets[nextDomain][0]?.type || "");
    setTargetQuery("");
    setTargetResults([]);
    setSelectedTarget(null);
  }

  function searchTargets() {
    if (!targetType) return;
    run(async () => {
      const result = await searchPersonalWorkTargetsAction({ type: targetType, query: targetQuery });
      setTargetResults(result.items);
    });
  }

  return <div className="space-y-6 px-6 py-5">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Không gian cá nhân</p><h1 className="mt-1 text-2xl font-bold text-slate-950">Công việc của tôi</h1><p className="mt-1 text-sm text-slate-500">Lập lịch, theo dõi và gắn công việc với từng khu vực nghiệp vụ.</p></div>
      <div className="flex items-center gap-5 text-sm"><span><b className="text-lg text-slate-950">{openCount}</b> việc đang mở</span><span><b className="text-lg text-amber-600">{overdue}</b> quá hạn</span></div>
    </header>

    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={(event) => {
        event.preventDefault();
        const nextTitle = title.trim();
        if (!nextTitle) {
          setMessage("Vui lòng nhập nội dung công việc cần làm");
          return;
        }
        run(
          () => createPersonalWorkAction({ title: nextTitle, domain: newDomain, workType, target: selectedTarget, dueAt: dueAt ? new Date(dueAt).toISOString() : null }),
          "Đã thêm công việc",
          () => { setTitle(""); setTargetQuery(""); setTargetResults([]); setSelectedTarget(null); },
        );
      }}>
        <div className="flex items-center gap-2"><Plus className="h-5 w-5 text-blue-600"/><h2 className="font-semibold text-slate-950">Thêm việc nhanh</h2></div>
        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_220px_auto]">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Việc cần làm..." className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          <select value={newDomain} onChange={(e) => changeDomain(e.target.value as PersonalWorkDomain)} className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm">{PERSONAL_WORK_DOMAINS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
          <input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          <button type="submit" disabled={pending} className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">Thêm việc</button>
        </div>
        {newDomain !== "GENERAL" && <div className="mt-3 grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[220px_180px_minmax(0,1fr)_auto]">
          <label className="space-y-1"><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Loại công việc</span><select value={workType} onChange={(e) => setWorkType(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">{PERSONAL_WORK_TYPES[newDomain].map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
          <label className="space-y-1"><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Liên kết tới</span><select value={targetType} onChange={(e) => { setTargetType(e.target.value as PersonalWorkTargetType); setSelectedTarget(null); setTargetResults([]); }} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">{domainTargets[newDomain].map((item) => <option key={item.type} value={item.type}>{item.label}</option>)}</select></label>
          <label className="relative space-y-1"><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Tìm đối tượng nghiệp vụ</span><input value={selectedTarget ? selectedTarget.label : targetQuery} onChange={(e) => { setSelectedTarget(null); setTargetQuery(e.target.value); }} placeholder="Tên, SKU hoặc mã tham chiếu..." className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm" />{targetResults.length > 0 && !selectedTarget && <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">{targetResults.map((item) => <button type="button" key={`${item.type}-${item.id}`} onClick={() => { setSelectedTarget(item); setTargetQuery(item.label); setTargetResults([]); }} className="block w-full rounded-md px-3 py-2 text-left hover:bg-slate-50"><span className="block text-sm font-medium text-slate-900">{item.label}</span>{item.secondary && <span className="block text-xs text-slate-500">{item.secondary}</span>}</button>)}</div>}</label>
          <button type="button" disabled={pending || !targetType} onClick={searchTargets} className="mt-5 h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">Tìm</button>
        </div>}
      </form>

      <aside className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 shadow-sm">
        <button type="button" aria-expanded={calendarOpen} aria-controls="personal-google-calendar-agenda" onClick={() => data.calendar.connected && setCalendarOpen((open) => !open)} className="flex w-full items-start justify-between gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300"><div className="flex gap-3"><span className="rounded-lg bg-white p-2 text-blue-600 shadow-sm"><CalendarDays className="h-5 w-5"/></span><div><h2 className="font-semibold text-slate-950">Google Calendar</h2><p className="mt-0.5 text-xs text-slate-500">{data.calendar.connected ? data.calendar.accountEmail || "Đã kết nối" : data.calendar.configured ? "Chưa kết nối tài khoản" : "Chưa cấu hình OAuth"}</p></div></div><div className="flex items-center gap-2">{data.calendar.connected && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">ĐÃ KẾT NỐI</span>}{data.calendar.connected && <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${calendarOpen ? "rotate-180" : ""}`}/>}</div></button>
        <button disabled={pending || !data.calendar.configured} onClick={() => data.calendar.connected ? run(async () => undefined, "Đã tải lại Google Calendar") : run(async () => { const result = await getGoogleCalendarConnectUrlAction(); window.location.assign(result.url); })} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">{data.calendar.connected ? <><RefreshCw className="h-4 w-4"/> Tải lại lịch</> : <><ExternalLink className="h-4 w-4"/> Kết nối Google Calendar</>}</button>
      </aside>
    </section>

    {message && <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}

    <div className={`grid items-start gap-4 ${data.calendar.connected && calendarOpen ? "xl:grid-cols-[minmax(540px,0.9fr)_minmax(0,1.1fr)]" : "grid-cols-1"}`}>
    {data.calendar.connected && calendarOpen && <section id="personal-google-calendar-agenda" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div><h2 className="text-sm font-semibold text-slate-950">Lịch Google của tôi</h2><p className="mt-0.5 text-xs text-slate-500">Lịch cá nhân và công việc đã liên kết trên cùng một dòng thời gian.</p></div>
        <div className="flex items-center gap-2"><button type="button" onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))} aria-label="Tháng trước" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><ChevronLeft className="h-4 w-4"/></button><p className="min-w-32 text-center text-sm font-semibold capitalize text-slate-800">{new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(calendarCursor)}</p><button type="button" onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))} aria-label="Tháng sau" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><ChevronRight className="h-4 w-4"/></button><button type="button" onClick={() => { const date = new Date(); setCalendarCursor(new Date(date.getFullYear(), date.getMonth(), 1)); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Hôm nay</button></div>
      </div>
      {data.calendar.loadError ? <div className="px-4 py-4 text-sm text-amber-700">{data.calendar.loadError}</div> : <div className="overflow-x-auto"><div className="min-w-[520px]"><div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">{["T2","T3","T4","T5","T6","T7","CN"].map((day) => <div key={day} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">{day}</div>)}</div><div className="grid grid-cols-7">{calendarDays.map((date) => {
        const key = localDayKey(date);
        const dayEvents = eventsByDay.get(key) || [];
        const outsideMonth = date.getMonth() !== calendarCursor.getMonth();
        const isToday = key === localDayKey(new Date());
        return <div key={key} className={`min-h-20 border-b border-r border-slate-100 p-1.5 ${outsideMonth ? "bg-slate-50/50" : "bg-white"}`}><div className="mb-1 flex items-center justify-between"><span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold ${isToday ? "bg-blue-600 text-white" : outsideMonth ? "text-slate-300" : "text-slate-600"}`}>{date.getDate()}</span>{dayEvents.length > 2 && <span className="text-[9px] text-slate-400">{dayEvents.length}</span>}</div><div className="space-y-1">{dayEvents.slice(0, 2).map((event) => {
          const content = <><span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${event.linkedTaskItemId ? "bg-emerald-500" : "bg-blue-500"}`}/>{!event.allDay && <span className="mr-1 text-[10px] opacity-70">{new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date(event.startAt))}</span>}<span>{event.title}</span></>;
          return event.htmlLink ? <a key={event.id} href={event.htmlLink} target="_blank" rel="noreferrer" title={`${calendarEventDate(event.startAt, event.allDay)} · ${event.title}`} className={`block truncate rounded px-1.5 py-1 text-[11px] font-medium ${event.linkedTaskItemId ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>{content}</a> : <div key={event.id} className="truncate rounded bg-blue-50 px-1.5 py-1 text-[11px] font-medium text-blue-800">{content}</div>;
        })}{dayEvents.length > 2 && <p className="px-1 text-[9px] font-medium text-slate-500">+{dayEvents.length - 2} lịch</p>}</div></div>;
      })}</div></div></div>}
    </section>}

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">{([['TODAY','Hôm nay'],['UPCOMING','Sắp tới'],['ALL','Tất cả'],['DONE','Đã xong']] as const).map(([key,label]) => <button key={key} onClick={() => setView(key)} className={`rounded-md px-3 py-2 text-sm font-medium ${view === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div>
        <label className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400"/><select value={domain} onChange={(e) => setDomain(e.target.value as PersonalWorkDomain | "ALL")} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="ALL">Tất cả nghiệp vụ</option>{PERSONAL_WORK_DOMAINS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
      </div>
      <div className="divide-y divide-slate-100">{items.length ? items.map((item) => {
        const late = item.status !== "DONE" && item.dueAt && new Date(item.dueAt) < now;
        return <div key={item.id} className="group grid gap-3 px-4 py-4 transition hover:bg-slate-50/80 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <button aria-label="Đánh dấu hoàn thành" disabled={pending} onClick={() => run(() => updatePersonalWorkAction({ id: item.id, status: item.status === "DONE" ? "TODO" : "DONE" }))} className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${item.status === "DONE" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent hover:border-emerald-400 hover:text-emerald-500"}`}><Check className="h-4 w-4"/></button>
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className={`truncate text-sm font-semibold ${item.status === "DONE" ? "text-slate-400 line-through" : "text-slate-950"}`}>{item.title}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${domainStyle[item.domain]}`}>{PERSONAL_WORK_DOMAINS.find((domain) => domain.key === item.domain)?.label}</span>{item.workType && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{PERSONAL_WORK_TYPES[item.domain].find((type) => type.key === item.workType)?.label || item.workType}</span>}{item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{tag}</span>)}</div>{item.target && <Link href={item.target.href} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline">{item.target.label}{item.target.secondary ? ` · ${item.target.secondary}` : ""}<ExternalLink className="h-3 w-3"/></Link>}<p className={`mt-1 flex items-center gap-1 text-xs ${late ? "font-semibold text-amber-700" : "text-slate-500"}`}><Clock3 className="h-3.5 w-3.5"/>{late ? "Quá hạn · " : ""}{dueLabel(item.dueAt)}</p></div>
          <div className="flex items-center gap-2">{data.calendar.connected && item.status !== "DONE" && <button disabled={pending} onClick={() => run(() => syncPersonalWorkCalendarAction(item.id), "Đã đồng bộ Google Calendar")} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${item.calendar.synced ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>{item.calendar.synced ? "Cập nhật lịch" : "Đưa lên lịch"}</button>}<ChevronRight className="h-4 w-4 text-slate-300"/></div>
        </div>;
      }) : <div className="flex flex-col items-center py-16 text-center"><Circle className="h-8 w-8 text-slate-200"/><p className="mt-3 text-sm font-medium text-slate-600">Không có công việc trong nhóm này</p></div>}</div>
    </section>
    </div>
  </div>;
}
