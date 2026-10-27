"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  Filter,
  Loader2,
  MapPin,
  RefreshCw,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { useAppDialog } from "@/domains/shared/feedback";
import { AsyncActionButton, useUiMutation } from "@/domains/shared/ui/mutation";
import {
  ADMIN_DOMAIN_TONE,
  AdminUserAvatar,
  AdminUserInlineList,
  AdminFlatToolbar,
  AdminPageCanvas,
  AdminPageHeader,
} from "@/domains/shared/ui/admin-design-contract";
import {
  addPersonalWorkChecklistItemAction,
  createPersonalWorkAction,
  deletePersonalWorkChecklistItemAction,
  deletePersonalWorkAction,
  finalizePersonalWorkChecklistAction,
  getGoogleCalendarConnectUrlAction,
  replacePersonalWorkSharesAction,
  searchPersonalWorkTargetsAction,
  syncPersonalWorkCalendarAction,
  togglePersonalWorkChecklistItemAction,
  updatePersonalWorkAction,
} from "../actions/personal-work.actions";
import {
  PERSONAL_WORK_DOMAINS,
  PERSONAL_WORK_TYPES,
  type PersonalCalendarEvent,
  type PersonalWorkDomain,
  type PersonalWorkItem,
  type PersonalWorkPageData,
  type PersonalWorkTarget,
  type PersonalWorkTargetType,
} from "../shared/personal-work.types";
import { PersonalWorkShareEditor } from "./PersonalWorkShareEditor";

const domainStyle: Record<PersonalWorkDomain, string> = {
  GENERAL: ADMIN_DOMAIN_TONE.GENERAL.soft,
  WORK: ADMIN_DOMAIN_TONE.WORK.soft,
  MEDIA: ADMIN_DOMAIN_TONE.MEDIA.soft,
  TECHNICAL: ADMIN_DOMAIN_TONE.TECHNICAL.soft,
  SALES: ADMIN_DOMAIN_TONE.SALES.soft,
  ORDER: ADMIN_DOMAIN_TONE.ORDER.soft,
  ACQUISITION: ADMIN_DOMAIN_TONE.ACQUISITION.soft,
};

const calendarDomainStyle: Record<PersonalWorkDomain, { event: string; dot: string }> = {
  GENERAL: { event: "bg-slate-100 text-slate-700 hover:bg-slate-200", dot: ADMIN_DOMAIN_TONE.GENERAL.dot },
  WORK: { event: "bg-indigo-50 text-indigo-800 hover:bg-indigo-100", dot: ADMIN_DOMAIN_TONE.WORK.dot },
  MEDIA: { event: "bg-violet-50 text-violet-800 hover:bg-violet-100", dot: ADMIN_DOMAIN_TONE.MEDIA.dot },
  TECHNICAL: { event: "bg-blue-50 text-blue-800 hover:bg-blue-100", dot: ADMIN_DOMAIN_TONE.TECHNICAL.dot },
  SALES: { event: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100", dot: ADMIN_DOMAIN_TONE.SALES.dot },
  ORDER: { event: "bg-amber-50 text-amber-800 hover:bg-amber-100", dot: ADMIN_DOMAIN_TONE.ORDER.dot },
  ACQUISITION: { event: "bg-rose-50 text-rose-800 hover:bg-rose-100", dot: ADMIN_DOMAIN_TONE.ACQUISITION.dot },
};

const externalCalendarStyle = {
  event: "bg-sky-50 text-sky-800 hover:bg-sky-100",
  dot: "bg-sky-500",
};

const domainTargets: Record<PersonalWorkDomain, { type: PersonalWorkTargetType; label: string }[]> = {
  GENERAL: [],
  WORK: [],
  MEDIA: [{ type: "WATCH", label: "Watch" }],
  TECHNICAL: [
    { type: "WATCH", label: "Watch" },
    { type: "SERVICE_REQUEST", label: "Yêu cầu kỹ thuật" },
  ],
  SALES: [
    { type: "WATCH", label: "Watch" },
    { type: "PURCHASE_REQUEST", label: "Yêu cầu mua hàng" },
  ],
  ORDER: [{ type: "ORDER", label: "Đơn hàng" }],
  ACQUISITION: [{ type: "ACQUISITION", label: "Phiếu nhập" }],
};

function localInputDate(date: Date) {
  return localDayKey(date);
}

function dateInputToIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
}

function isPastDueDate(value: string | null, now: Date) {
  if (!value) return false;
  return localDayKey(new Date(value)) < localDayKey(now);
}

function dueLabel(value: string | null) {
  if (!value) return "Chưa có lịch";
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function calendarEventDate(value: string, allDay: boolean) {
  const date = allDay ? new Date(`${value}T00:00:00`) : new Date(value);
  return new Intl.DateTimeFormat(
    "vi-VN",
    allDay
      ? { weekday: "short", day: "2-digit", month: "2-digit" }
      : { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" },
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

function addCalendarDayKey(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
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
  const appDialog = useAppDialog();
  const checklistMutation = useUiMutation();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"TODAY" | "UPCOMING" | "ALL" | "DONE">("TODAY");
  const [scope, setScope] = useState<"MINE" | "SHARED" | "ALL">("MINE");
  const [domain, setDomain] = useState<PersonalWorkDomain | "ALL">("ALL");
  const [title, setTitle] = useState("");
  const [newDomain, setNewDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [workType, setWorkType] = useState<string>(PERSONAL_WORK_TYPES.GENERAL[0].key);
  const [targetType, setTargetType] = useState<PersonalWorkTargetType | "">("");
  const [targetQuery, setTargetQuery] = useState("");
  const [targetResults, setTargetResults] = useState<PersonalWorkTarget[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<PersonalWorkTarget[]>([]);
  const [dueAt, setDueAt] = useState(localInputDate(new Date()));
  const [estimatedDays, setEstimatedDays] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(data.calendar.connected);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<PersonalCalendarEvent | null>(null);
  const [calendarCreateOpen, setCalendarCreateOpen] = useState(false);
  const [calendarCreateTitle, setCalendarCreateTitle] = useState("");
  const [calendarCreateDomain, setCalendarCreateDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [calendarCreateDueAt, setCalendarCreateDueAt] = useState(localInputDate(new Date()));
  const [calendarCreateEstimatedDays, setCalendarCreateEstimatedDays] = useState(1);
  const [calendarCreateSync, setCalendarCreateSync] = useState(true);
  const lastCalendarRefreshAtRef = useRef(Date.now());
  const [editingItem, setEditingItem] = useState<PersonalWorkItem | null>(null);
  const editingItemId = editingItem?.id;
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const editNoteRef = useRef<HTMLTextAreaElement>(null);
  const [editUpdateBody, setEditUpdateBody] = useState("");
  const [editDomain, setEditDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [editDueAt, setEditDueAt] = useState("");
  const [editEstimatedDays, setEditEstimatedDays] = useState(1);
  const [editTargets, setEditTargets] = useState<PersonalWorkTarget[]>([]);
  const [editTargetType, setEditTargetType] = useState<PersonalWorkTargetType | "">("");
  const [editTargetQuery, setEditTargetQuery] = useState("");
  const [editTargetResults, setEditTargetResults] = useState<PersonalWorkTarget[]>([]);
  const [editShares, setEditShares] = useState<PersonalWorkItem["sharedWith"]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const now = new Date();
  const todayEndMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const items = useMemo(
    () =>
      data.items.filter((item) => {
        if (scope === "MINE" && item.access !== "OWNER") return false;
        if (scope === "SHARED" && item.access === "OWNER") return false;
        if (domain !== "ALL" && item.domain !== domain) return false;
        if (view === "DONE") return item.status === "DONE";
        if (item.status === "DONE") return false;
        if (view === "TODAY") return !item.dueAt || new Date(item.dueAt).getTime() <= todayEndMs;
        if (view === "UPCOMING") return Boolean(item.dueAt && new Date(item.dueAt).getTime() > todayEndMs);
        return true;
      }),
    [data.items, domain, scope, view, todayEndMs],
  );
  const openCount = data.items.filter((item) => item.status !== "DONE").length;
  const overdue = data.items.filter(
    (item) => item.status !== "DONE" && isPastDueDate(item.dueAt, now),
  ).length;
  const selectedLinkedTask = selectedCalendarEvent?.linkedTaskItemId
    ? data.items.find((item) => item.id === selectedCalendarEvent.linkedTaskItemId) || null
    : null;
  const calendarDays = useMemo(() => monthCells(calendarCursor), [calendarCursor]);
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, PersonalCalendarEvent[]>();
    for (const event of data.calendar.events) {
      const firstKey = eventDayKey(event.startAt, event.allDay);
      const keys = [firstKey];
      if (event.allDay && event.endAt) {
        const cursor = new Date(`${firstKey}T00:00:00Z`);
        const exclusiveEnd = new Date(`${event.endAt.slice(0, 10)}T00:00:00Z`);
        while (keys.length < 365) {
          cursor.setUTCDate(cursor.getUTCDate() + 1);
          if (cursor >= exclusiveEnd) break;
          keys.push(cursor.toISOString().slice(0, 10));
        }
      }
      for (const key of keys) grouped.set(key, [...(grouped.get(key) || []), event]);
    }
    return grouped;
  }, [data.calendar.events]);

  useEffect(() => {
    if (!message) return;
    const timeoutId = window.setTimeout(() => setMessage(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  useEffect(() => {
    if (!data.calendar.connected) return;

    const refreshCalendar = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastCalendarRefreshAtRef.current < 5_000) return;
      lastCalendarRefreshAtRef.current = now;
      router.refresh();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshCalendar();
    };
    const intervalId = window.setInterval(refreshCalendar, 120_000);
    window.addEventListener("focus", refreshCalendar);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshCalendar);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [data.calendar.connected, router]);

  useEffect(() => {
    const textarea = editNoteRef.current;
    if (!editingItem || !textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(224, Math.min(textarea.scrollHeight, window.innerHeight * 0.55))}px`;
  }, [editNote, editingItem]);

  useEffect(() => {
    if (!editingItemId) return;
    const refreshed = data.items.find((item) => item.id === editingItemId);
    if (refreshed) setEditingItem(refreshed);
  }, [data.items, editingItemId]);

  function run(action: () => Promise<unknown>, success?: string, onSuccess?: () => void) {
    setMessage(null);
    startTransition(async () => {
      try {
        await action();
        onSuccess?.();
        if (success) setMessage(success);
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Không thể xử lý yêu cầu");
      }
    });
  }

  function changeDomain(nextDomain: PersonalWorkDomain) {
    setNewDomain(nextDomain);
    setWorkType(PERSONAL_WORK_TYPES[nextDomain][0]?.key || "");
    setTargetType(domainTargets[nextDomain][0]?.type || "");
    setTargetQuery("");
    setTargetResults([]);
    setSelectedTargets([]);
  }

  function searchTargets() {
    if (!targetType) return;
    run(async () => {
      const result = await searchPersonalWorkTargetsAction({ type: targetType, query: targetQuery });
      setTargetResults(result.items);
    });
  }

  function searchEditTargets() {
    if (!editTargetType) return;
    run(async () => {
      const result = await searchPersonalWorkTargetsAction({
        type: editTargetType,
        query: editTargetQuery,
      });
      setEditTargetResults(result.items);
    });
  }

  function openCalendarCreate(date: Date) {
    setCalendarCreateTitle("");
    setCalendarCreateDomain("GENERAL");
    setCalendarCreateDueAt(localInputDate(date));
    setCalendarCreateEstimatedDays(1);
    setCalendarCreateSync(data.calendar.connected);
    setCalendarCreateOpen(true);
  }

  function openTaskEdit(item: PersonalWorkItem) {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditNote(item.note || "");
    setEditUpdateBody("");
    setEditDomain(item.domain);
    setEditDueAt(item.dueAt ? localInputDate(new Date(item.dueAt)) : "");
    setEditEstimatedDays(item.estimatedDays || 1);
    setEditTargets(item.targets);
    setEditTargetType(domainTargets[item.domain][0]?.type || "");
    setEditTargetQuery("");
    setEditTargetResults([]);
    setEditShares(item.sharedWith);
    setNewChecklistTitle("");
  }

  function setOptimisticChecklist(checklist: PersonalWorkItem["checklist"]) {
    setEditingItem((current) => {
      if (!current) return current;
      const done = checklist.filter((item) => item.isDone).length;
      return {
        ...current,
        checklist,
        progressMode: "CHECKLIST",
        progressPercent: checklist.length ? Math.round((done / checklist.length) * 100) : 0,
      };
    });
  }

  return (
    <AdminPageCanvas>
      <AdminPageHeader
        eyebrow="Không gian cá nhân"
        title="Công việc của tôi"
        description="Lập lịch, theo dõi và gắn công việc với từng khu vực nghiệp vụ."
        meta={
          <>
            <span>
              <b className="text-lg text-slate-950">{openCount}</b> việc đang mở
            </span>
            <span>
              <b className="text-lg text-amber-600">{overdue}</b> quá hạn
            </span>
          </>
        }
      />

      <section className="grid gap-5 border-b border-slate-100 pb-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <form
          className="flex h-full min-w-0 flex-col justify-center px-1"
          onSubmit={(event) => {
            event.preventDefault();
            const nextTitle = title.trim();
            if (!nextTitle) {
              setMessage("Vui lòng nhập nội dung công việc cần làm");
              return;
            }
            run(
              async () => {
                const created = await createPersonalWorkAction({
                  title: nextTitle,
                  domain: newDomain,
                  workType,
                  targets: selectedTargets,
                  dueAt: dueAt ? dateInputToIso(dueAt) : null,
                  estimatedDays,
                });
                if (data.calendar.connected) await syncPersonalWorkCalendarAction(created.id);
              },
              data.calendar.connected ? "Đã thêm công việc vào Google Calendar" : "Đã thêm công việc",
              () => {
                setTitle("");
                setTargetQuery("");
                setTargetResults([]);
                setSelectedTargets([]);
              },
            );
          }}
        >
          <AdminFlatToolbar
            className={`grid w-full gap-2 ${
              newDomain === "WORK"
                ? "md:grid-cols-[minmax(0,1fr)_150px_170px_210px_150px_auto]"
                : "md:grid-cols-[minmax(0,1fr)_170px_210px_150px_auto]"
            }`}
          >
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Việc cần làm..."
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={newDomain}
              onChange={(e) => changeDomain(e.target.value as PersonalWorkDomain)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              {PERSONAL_WORK_DOMAINS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            {newDomain === "WORK" && (
              <select
                aria-label="Loại công việc"
                value={workType}
                onChange={(event) => setWorkType(event.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                {PERSONAL_WORK_TYPES.WORK.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm"
            />
            <div className="flex min-w-0 gap-2">
              <select
                aria-label="Thời lượng dự kiến"
                value={estimatedDays === 1 ? "ONE_DAY" : "MULTI_DAY"}
                onChange={(event) => setEstimatedDays(event.target.value === "ONE_DAY" ? 1 : 2)}
                className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="ONE_DAY">Trong ngày</option>
                <option value="MULTI_DAY">Nhiều ngày</option>
              </select>
              {estimatedDays > 1 && (
                <input
                  aria-label="Số ngày dự kiến"
                  type="number"
                  min={2}
                  max={365}
                  value={estimatedDays}
                  onChange={(event) => setEstimatedDays(Math.max(2, Number(event.target.value) || 2))}
                  className="h-11 w-20 rounded-lg border border-slate-200 px-3 text-sm"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              Thêm việc
            </button>
          </AdminFlatToolbar>
          {newDomain !== "GENERAL" && newDomain !== "WORK" && (
            <div className="mt-3 grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[220px_180px_minmax(0,1fr)_auto]">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Loại công việc</span>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  {PERSONAL_WORK_TYPES[newDomain].map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              {domainTargets[newDomain].length > 0 && (
                <>
                  <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Liên kết tới</span>
                <select
                  value={targetType}
                  onChange={(e) => {
                    setTargetType(e.target.value as PersonalWorkTargetType);
                    setSelectedTargets([]);
                    setTargetResults([]);
                  }}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  {domainTargets[newDomain].map((item) => (
                    <option key={item.type} value={item.type}>
                      {item.label}
                    </option>
                  ))}
                </select>
                  </label>
                  <label className="relative space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Tìm đối tượng nghiệp vụ
                </span>
                <input
                  value={targetQuery}
                  onChange={(e) => {
                    setTargetQuery(e.target.value);
                  }}
                  placeholder="Tên, SKU hoặc mã tham chiếu..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                />
                {targetResults.length > 0 && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                    {targetResults.map((item) => (
                      <button
                        type="button"
                        key={`${item.type}-${item.id}`}
                        onClick={() => {
                          setSelectedTargets((current) => current.some((target) => target.type === item.type && target.id === item.id) ? current : [...current, item]);
                          setTargetQuery("");
                          setTargetResults([]);
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <span className="block text-sm font-medium text-slate-900">{item.label}</span>
                        {item.secondary && <span className="block text-xs text-slate-500">{item.secondary}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {selectedTargets.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedTargets.map((target) => (
                      <button
                        type="button"
                        key={`${target.type}:${target.id}`}
                        onClick={() => setSelectedTargets((current) => current.filter((item) => item.type !== target.type || item.id !== target.id))}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-rose-50 hover:text-rose-700"
                      >
                        {target.label} ×
                      </button>
                    ))}
                  </div>
                )}
                  </label>
                  <button
                type="button"
                disabled={pending || !targetType}
                onClick={searchTargets}
                className="mt-5 h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Tìm
                  </button>
                </>
              )}
            </div>
          )}
        </form>

        <aside className="border-t border-slate-100 pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
          <button
            type="button"
            aria-expanded={calendarOpen}
            aria-controls="personal-google-calendar-agenda"
            onClick={() => data.calendar.connected && setCalendarOpen((open) => !open)}
            className="flex w-full items-start justify-between gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <div className="flex gap-3">
              <span className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-950">Google Calendar</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {data.calendar.connected
                    ? data.calendar.accountEmail || "Đã kết nối"
                    : data.calendar.configured
                      ? "Chưa kết nối tài khoản"
                      : "Chưa cấu hình OAuth"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.calendar.connected && (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  ĐÃ KẾT NỐI
                </span>
              )}
              {data.calendar.connected && (
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${calendarOpen ? "rotate-180" : ""}`}
                />
              )}
            </div>
          </button>
          <button
            disabled={pending || !data.calendar.configured}
            onClick={() =>
              data.calendar.connected
                ? run(async () => undefined, "Đã tải lại Google Calendar")
                : run(async () => {
                    const result = await getGoogleCalendarConnectUrlAction();
                    window.location.assign(result.url);
                  })
            }
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-50 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {data.calendar.connected ? (
              <>
                <RefreshCw className="h-4 w-4" /> Tải lại lịch
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" /> Kết nối Google Calendar
              </>
            )}
          </button>
        </aside>
      </section>

      {message && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>
      )}

      <div
        className={`grid items-start gap-5 ${data.calendar.connected && calendarOpen ? "xl:grid-cols-[minmax(0,1.55fr)_minmax(380px,0.85fr)]" : "grid-cols-1"}`}
      >
        {data.calendar.connected && calendarOpen && (
          <section id="personal-google-calendar-agenda" className="min-w-0 overflow-hidden bg-white">
            <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">Lịch Google của tôi</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Lịch cá nhân và công việc đã liên kết trên cùng một dòng thời gian.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                  aria-label="Tháng trước"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="min-w-32 text-center text-sm font-semibold capitalize text-slate-800">
                  {new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(calendarCursor)}
                </p>
                <button
                  type="button"
                  onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                  aria-label="Tháng sau"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const date = new Date();
                    setCalendarCursor(new Date(date.getFullYear(), date.getMonth(), 1));
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hôm nay
                </button>
              </div>
            </div>
            {data.calendar.loadError ? (
              <div className="px-5 py-4 text-sm text-amber-700">{data.calendar.loadError}</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <div className="min-w-[640px]">
                  <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                      <div
                        key={day}
                        className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {calendarDays.map((date) => {
                      const key = localDayKey(date);
                      const dayEvents = eventsByDay.get(key) || [];
                      const outsideMonth = date.getMonth() !== calendarCursor.getMonth();
                      const isToday = key === localDayKey(new Date());
                      return (
                        <div
                          key={key}
                          role="button"
                          tabIndex={0}
                          aria-label={`Tạo việc ngày ${key}`}
                          onClick={() => openCalendarCreate(date)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") openCalendarCreate(date);
                          }}
                          className={`min-h-28 cursor-pointer border-b border-r border-slate-100 p-2 transition-colors hover:bg-blue-50/30 ${outsideMonth ? "bg-slate-50/50" : "bg-white"}`}
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span
                              className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold ${isToday ? "bg-blue-600 text-white" : outsideMonth ? "text-slate-300" : "text-slate-600"}`}
                            >
                              {date.getDate()}
                            </span>
                            {dayEvents.length > 3 && (
                              <span className="text-[9px] text-slate-400">{dayEvents.length}</span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => {
                              const linkedTask = event.linkedTaskItemId
                                ? data.items.find((item) => item.id === event.linkedTaskItemId)
                                : null;
                              const style = linkedTask ? calendarDomainStyle[linkedTask.domain] : externalCalendarStyle;
                              const isOverdue = Boolean(
                                linkedTask &&
                                  linkedTask.status !== "DONE" &&
                                  isPastDueDate(linkedTask.dueAt, now),
                              );
                              const eventStartKey = eventDayKey(event.startAt, event.allDay);
                              const eventEndKey = event.endAt?.slice(0, 10) || eventStartKey;
                              const continuesFromPreviousDay = event.allDay && key > eventStartKey;
                              const continuesToNextDay = event.allDay && key < eventEndKey && addCalendarDayKey(key, 1) < eventEndKey;
                              const connectsLeft = continuesFromPreviousDay && date.getDay() !== 1;
                              const connectsRight = continuesToNextDay && date.getDay() !== 0;
                              const startsVisibleWeekSegment = !connectsLeft;
                              const connectionClass = connectsLeft && connectsRight
                                ? "-mx-2 w-[calc(100%+1rem)] rounded-none"
                                : connectsLeft
                                  ? "-ml-2 w-[calc(100%+0.5rem)] rounded-l-none"
                                  : connectsRight
                                    ? "-mr-2 w-[calc(100%+0.5rem)] rounded-r-none"
                                    : "w-full rounded";
                              const content = (
                                <>
                                  {startsVisibleWeekSegment && (
                                    <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                  )}
                                  {!event.allDay && (
                                    <span className="mr-1 text-[10px] opacity-70">
                                      {new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(
                                        new Date(event.startAt),
                                      )}
                                    </span>
                                  )}
                                  <span className={startsVisibleWeekSegment ? "truncate" : "select-none opacity-0"}>
                                    {startsVisibleWeekSegment ? event.title : "Tiếp diễn"}
                                  </span>
                                </>
                              );
                              return (
                                <button
                                  type="button"
                                  key={event.id}
                                  onClick={(clickEvent) => {
                                    clickEvent.stopPropagation();
                                    setSelectedCalendarEvent(event);
                                  }}
                                  title={`${calendarEventDate(event.startAt, event.allDay)} · ${event.title}`}
                                  className={`flex min-h-[22px] items-center overflow-hidden whitespace-nowrap px-1.5 py-1 text-left text-[11px] font-medium leading-none ${connectionClass} ${style.event} ${startsVisibleWeekSegment && isOverdue ? "border-l-2 border-l-orange-400" : "border-l-0"}`}
                                >
                                  {content}
                                </button>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <p className="px-1 text-[9px] font-medium text-slate-500">+{dayEvents.length - 3} lịch</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="min-w-0 bg-transparent xl:flex xl:h-[766px] xl:flex-col xl:overflow-hidden xl:border-l xl:border-slate-100">
          <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 px-1 py-2 xl:ml-5 xl:shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1 rounded-lg bg-slate-100/80 p-1">
                {(
                  [
                    ["TODAY", "Hôm nay"],
                    ["UPCOMING", "Sắp tới"],
                    ["ALL", "Tất cả"],
                    ["DONE", "Đã xong"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ${view === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center">
                <span className="sr-only">Phạm vi công việc</span>
                <select
                  value={scope}
                  onChange={(event) => setScope(event.target.value as "MINE" | "SHARED" | "ALL")}
                  className="h-8 rounded-lg border-0 bg-slate-100/80 px-3 text-xs font-medium text-slate-700 outline-none ring-0 transition-colors hover:bg-slate-200/70 focus:ring-2 focus:ring-blue-400/30"
                >
                  <option value="MINE">Của tôi</option>
                  <option value="SHARED">Được chia sẻ</option>
                  <option value="ALL">Tất cả công việc</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as PersonalWorkDomain | "ALL")}
                className="h-8 rounded-lg border-0 bg-slate-100/80 px-3 text-xs font-medium text-slate-700 outline-none ring-0"
              >
                <option value="ALL">Tất cả nghiệp vụ</option>
                {PERSONAL_WORK_DOMAINS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              </label>
            </div>
          </div>
          <div className="space-y-1 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pl-5 xl:[direction:rtl] [&>*]:[direction:ltr]">
            {items.length ? (
              items.map((item) => {
                const late = item.status !== "DONE" && isPastDueDate(item.dueAt, now);
                return (
                  <div
                    key={item.id}
                    className="group grid gap-2 px-1 py-3 transition-colors hover:bg-slate-100/60 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
                  >
                    <button
                      aria-label="Đánh dấu hoàn thành"
                      disabled={pending || item.access === "VIEWER"}
                      onClick={() =>
                        item.progressMode === "CHECKLIST" && item.status !== "DONE"
                          ? openTaskEdit(item)
                          : run(() =>
                              updatePersonalWorkAction({ id: item.id, status: item.status === "DONE" ? "TODO" : "DONE" }),
                            )
                      }
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${item.status === "DONE" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent hover:border-emerald-400 hover:text-emerald-500"}`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`truncate text-sm font-semibold ${item.status === "DONE" ? "text-slate-400 line-through" : "text-slate-950"}`}
                        >
                          {item.title}
                        </p>
                        {item.access !== "OWNER" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                            <Share2 className="h-3 w-3" /> {item.access === "EDITOR" ? "Có thể sửa" : "Chỉ xem"}
                          </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${domainStyle[item.domain]}`}>
                          {PERSONAL_WORK_DOMAINS.find((domain) => domain.key === item.domain)?.label}
                        </span>
                        {item.workType && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            {PERSONAL_WORK_TYPES[item.domain].find((type) => type.key === item.workType)?.label ||
                              item.workType}
                          </span>
                        )}
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {item.targets.map((target) => (
                        <Link
                          key={`${target.type}:${target.id}`}
                          href={target.href}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                        >
                          {target.label}
                          {target.secondary ? ` · ${target.secondary}` : ""}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ))}
                      <p
                        className={`mt-1 flex items-center gap-1 text-xs ${late ? "font-semibold text-amber-700" : "text-slate-500"}`}
                      >
                        <Clock3 className="h-3.5 w-3.5" />
                        {late ? "Quá hạn · " : ""}
                        {dueLabel(item.dueAt)} · {item.estimatedDays === 1 ? "trong ngày" : `dự kiến ${item.estimatedDays} ngày`}
                      </p>
                      {item.progressMode === "CHECKLIST" && item.checklist.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${item.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500">
                            {item.checklist.filter((entry) => entry.isDone).length}/{item.checklist.length} đầu việc
                          </span>
                        </div>
                      )}
                      {item.access === "OWNER" && item.sharedWith.length > 0 && (
                        <div
                          className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-violet-700"
                          title={item.sharedWith
                            .map(
                              (share) =>
                                `${share.user.name || share.user.email} (${share.accessLevel === "EDITOR" ? "Có thể sửa" : "Chỉ xem"})`,
                            )
                            .join(", ")}
                        >
                          <span className="shrink-0 text-slate-500">Chia sẻ với</span>
                          <AdminUserInlineList users={item.sharedWith.map((share) => share.user)} />
                          <span className="sr-only">
                            {item.sharedWith
                              .slice(0, 2)
                              .map((share) => share.user.name || share.user.email)
                              .join(" · ")}
                            {item.sharedWith.length > 2 ? ` +${item.sharedWith.length - 2}` : ""}
                          </span>
                        </div>
                      )}
                      {item.access !== "OWNER" && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-violet-700">
                          <AdminUserAvatar user={item.owner} size="xs" />
                          <span className="truncate">
                            {item.owner.name || item.owner.email} đã chia sẻ với bạn
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.status !== "DONE" && (
                        <button
                          type="button"
                          onClick={() => openTaskEdit(item)}
                          className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          {item.progressPercent}%
                        </button>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <Circle className="h-8 w-8 text-slate-200" />
                <p className="mt-3 text-sm font-medium text-slate-600">Không có công việc trong nhóm này</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[1px]"
          onMouseDown={() => setEditingItem(null)}
        >
          <form
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              const nextTitle = editTitle.trim();
              if (!nextTitle) {
                setMessage("Vui lòng nhập nội dung công việc cần làm");
                return;
              }
              run(
                async () => {
                  await updatePersonalWorkAction({
                    id: editingItem.id,
                    title: nextTitle,
                    note: editNote,
                    domain: editDomain,
                    tags: editingItem.tags,
                    dueAt: editDueAt ? dateInputToIso(editDueAt) : null,
                    estimatedDays: editEstimatedDays,
                    targets: editTargets,
                    updateBody: editUpdateBody,
                  });
                  if (editingItem.access === "OWNER")
                    await replacePersonalWorkSharesAction({
                      taskItemId: editingItem.id,
                      shares: editShares.map((share) => ({ userId: share.user.id, accessLevel: share.accessLevel })),
                    });
                },
                editingItem.calendar.synced ? "Đã cập nhật công việc và Google Calendar" : "Đã cập nhật công việc",
                () => setEditingItem(null),
              );
            }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Công việc cá nhân</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">Chỉnh sửa công việc</h2>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">Việc cần làm</span>
                <input
                  autoFocus
                  required
                  value={editTitle}
                  disabled={editingItem.access === "VIEWER"}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">Ghi chú</span>
                <textarea
                  ref={editNoteRef}
                  value={editNote}
                  disabled={editingItem.access === "VIEWER"}
                  onChange={(event) => setEditNote(event.target.value)}
                  rows={8}
                  placeholder="Mô tả chi tiết công việc, yêu cầu hoặc các bước cần thực hiện..."
                  className="min-h-56 max-h-[55vh] w-full resize-y overflow-y-auto rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Các đầu việc</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {editingItem.checklist.filter((item) => item.isDone).length}/{editingItem.checklist.length} hoàn thành
                    </p>
                  </div>
                  <span className="text-lg font-bold text-emerald-700">{editingItem.progressPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${editingItem.progressPercent}%` }}
                  />
                </div>
                {editingItem.checklist.length > 0 && (
                  <div className="space-y-2">
                    {editingItem.checklist.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100">
                        <button
                          type="button"
                          disabled={editingItem.access === "VIEWER" || Boolean(editingItem.checklistLockedAt) || checklistMutation.isPending(`toggle:${entry.id}`) || checklistMutation.isPending(`delete:${entry.id}`)}
                          aria-busy={checklistMutation.isPending(`toggle:${entry.id}`)}
                          aria-label={entry.isDone ? `Mở lại ${entry.title}` : `Hoàn thành ${entry.title}`}
                          onClick={() => {
                            const snapshot = editingItem;
                            void checklistMutation.run({
                              key: `toggle:${entry.id}`,
                              optimistic: () => {
                                setOptimisticChecklist(
                                  editingItem.checklist.map((item) =>
                                    item.id === entry.id ? { ...item, isDone: !item.isDone } : item,
                                  ),
                                );
                                return snapshot;
                              },
                              action: () => togglePersonalWorkChecklistItemAction({
                                taskItemId: editingItem.id,
                                checklistItemId: entry.id,
                                isDone: !entry.isDone,
                              }),
                              rollback: (previous) => setEditingItem(previous),
                              onSuccess: () => router.refresh(),
                            });
                          }}
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${entry.isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent"} disabled:cursor-default`}
                        >
                          {checklistMutation.isPending(`toggle:${entry.id}`) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <span className={`min-w-0 flex-1 text-sm ${entry.isDone ? "text-slate-400 line-through" : "text-slate-700"}`}>
                          {entry.title}
                        </span>
                        {!editingItem.checklistLockedAt && editingItem.access !== "VIEWER" && (
                          <button
                            type="button"
                            disabled={checklistMutation.isPending(`delete:${entry.id}`) || checklistMutation.isPending(`toggle:${entry.id}`)}
                            aria-busy={checklistMutation.isPending(`delete:${entry.id}`)}
                            aria-label={`Xóa ${entry.title}`}
                            onClick={() => {
                              const snapshot = editingItem;
                              void checklistMutation.run({
                                key: `delete:${entry.id}`,
                                optimistic: () => {
                                  setOptimisticChecklist(editingItem.checklist.filter((item) => item.id !== entry.id));
                                  return snapshot;
                                },
                                action: () => deletePersonalWorkChecklistItemAction({
                                  taskItemId: editingItem.id,
                                  checklistItemId: entry.id,
                                }),
                                rollback: (previous) => setEditingItem(previous),
                                onSuccess: () => router.refresh(),
                              });
                            }}
                            className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                          >
                            {checklistMutation.isPending(`delete:${entry.id}`) ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {!editingItem.checklistLockedAt && editingItem.access !== "VIEWER" && editingItem.status !== "DONE" && (
                  <div className="flex gap-2">
                    <input
                      value={newChecklistTitle}
                      maxLength={500}
                      onChange={(event) => setNewChecklistTitle(event.target.value)}
                      placeholder="Thêm đầu việc mới..."
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <AsyncActionButton
                      type="button"
                      pending={checklistMutation.isPending("checklist:add")}
                      pendingLabel="Đang thêm..."
                      disabled={!newChecklistTitle.trim()}
                      onClick={() => {
                        const title = newChecklistTitle.trim();
                        if (!title) return;
                        const snapshot = editingItem;
                        const temporaryId = `optimistic-${Date.now()}`;
                        void checklistMutation.run({
                          key: "checklist:add",
                          optimistic: () => {
                            setOptimisticChecklist([
                              ...editingItem.checklist,
                              { id: temporaryId, title, isDone: false },
                            ]);
                            setNewChecklistTitle("");
                            return snapshot;
                          },
                          action: () => addPersonalWorkChecklistItemAction({ taskItemId: editingItem.id, title }),
                          rollback: (previous) => {
                            setEditingItem(previous);
                            setNewChecklistTitle(title);
                          },
                          onSuccess: (result) => {
                            setEditingItem((current) => current ? {
                              ...current,
                              checklist: current.checklist.map((item) => item.id === temporaryId ? result.item : item),
                            } : current);
                            router.refresh();
                          },
                        });
                      }}
                      className="rounded-lg bg-white px-4 text-sm font-semibold text-blue-700 ring-1 ring-slate-200 hover:bg-blue-50 disabled:opacity-50"
                    >
                      Thêm
                    </AsyncActionButton>
                  </div>
                )}
                {editingItem.checklistLockedAt ? (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    Đã xác nhận hoàn thành. Danh sách đầu việc đã được khóa.
                  </p>
                ) : editingItem.checklist.length > 0 && editingItem.checklist.every((item) => item.isDone) && editingItem.access !== "VIEWER" ? (
                  <AsyncActionButton
                    type="button"
                    pending={checklistMutation.isPending("checklist:finalize")}
                    pendingLabel="Đang hoàn thành..."
                    disabled={checklistMutation.hasPending && !checklistMutation.isPending("checklist:finalize")}
                    onClick={async () => {
                      const confirmed = await appDialog.confirm({
                        title: "Xác nhận hoàn thành công việc?",
                        message: "Sau bước này bạn sẽ không thể thêm, xóa hoặc đổi trạng thái đầu việc.",
                        confirmText: "Xác nhận hoàn thành",
                        tone: "success",
                      });
                      if (!confirmed) return;
                      void checklistMutation.run({
                        key: "checklist:finalize",
                        action: () => finalizePersonalWorkChecklistAction(editingItem.id),
                        successMessage: "Đã xác nhận hoàn thành và khóa danh sách đầu việc",
                        onSuccess: () => {
                          setEditingItem(null);
                          router.refresh();
                        },
                      });
                    }}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Xác nhận hoàn thành công việc
                  </AsyncActionButton>
                ) : null}
              </section>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">Nội dung cập nhật</span>
                <textarea
                  value={editUpdateBody}
                  disabled={editingItem.access === "VIEWER"}
                  onChange={(event) => setEditUpdateBody(event.target.value)}
                  rows={2}
                  placeholder="Ghi lại kết quả, vấn đề hoặc bước tiếp theo..."
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <span className="block text-[11px] text-slate-400">Mỗi lần lưu sẽ tạo một mốc mới trong lịch sử cập nhật.</span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Nghiệp vụ</span>
                  <select
                    value={editDomain}
                    disabled={editingItem.access === "VIEWER"}
                    onChange={(event) => {
                      const nextDomain = event.target.value as PersonalWorkDomain;
                      setEditDomain(nextDomain);
                      setEditTargetType(domainTargets[nextDomain][0]?.type || "");
                      setEditTargetQuery("");
                      setEditTargetResults([]);
                      setEditTargets([]);
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    {PERSONAL_WORK_DOMAINS.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Thời gian</span>
                  <input
                    type="date"
                    value={editDueAt}
                    disabled={editingItem.access === "VIEWER"}
                    onChange={(event) => setEditDueAt(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Thời lượng dự kiến</span>
                  <select
                    value={editEstimatedDays === 1 ? "ONE_DAY" : "MULTI_DAY"}
                    disabled={editingItem.access === "VIEWER"}
                    onChange={(event) => setEditEstimatedDays(event.target.value === "ONE_DAY" ? 1 : 2)}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="ONE_DAY">Trong ngày</option>
                    <option value="MULTI_DAY">Kéo dài nhiều ngày</option>
                  </select>
                </label>
                {editEstimatedDays > 1 && (
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">Số ngày dự kiến</span>
                    <input
                      type="number"
                      min={2}
                      max={365}
                      value={editEstimatedDays}
                      disabled={editingItem.access === "VIEWER"}
                      onChange={(event) => setEditEstimatedDays(Math.max(2, Number(event.target.value) || 2))}
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
                    />
                  </label>
                )}
              </div>
              {domainTargets[editDomain].length > 0 && (
                <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-600">Liên kết nghiệp vụ</span>
                    <span className="text-[11px] text-slate-400">Có thể chọn nhiều đối tượng</span>
                  </div>
                  {editTargets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {editTargets.map((target) => (
                        <button
                          type="button"
                          key={`${target.type}:${target.id}`}
                          disabled={editingItem.access === "VIEWER"}
                          onClick={() =>
                            setEditTargets((current) =>
                              current.filter((item) => item.type !== target.type || item.id !== target.id),
                            )
                          }
                          className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-default disabled:hover:bg-blue-50 disabled:hover:text-blue-700"
                        >
                          {target.label}{editingItem.access !== "VIEWER" ? " ×" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                  {editingItem.access !== "VIEWER" && (
                    <div className="grid gap-2 sm:grid-cols-[150px_minmax(0,1fr)_auto]">
                      <select
                        value={editTargetType}
                        onChange={(event) => {
                          setEditTargetType(event.target.value as PersonalWorkTargetType);
                          setEditTargetQuery("");
                          setEditTargetResults([]);
                        }}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                      >
                        {domainTargets[editDomain].map((item) => (
                          <option key={item.type} value={item.type}>{item.label}</option>
                        ))}
                      </select>
                      <div className="relative">
                        <input
                          value={editTargetQuery}
                          onChange={(event) => setEditTargetQuery(event.target.value)}
                          placeholder="Tên, SKU hoặc mã tham chiếu..."
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                        />
                        {editTargetResults.length > 0 && (
                          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                            {editTargetResults.map((target) => (
                              <button
                                type="button"
                                key={`${target.type}:${target.id}`}
                                onClick={() => {
                                  setEditTargets((current) =>
                                    current.some((item) => item.type === target.type && item.id === target.id)
                                      ? current
                                      : [...current, target],
                                  );
                                  setEditTargetQuery("");
                                  setEditTargetResults([]);
                                }}
                                className="block w-full rounded-md px-3 py-2 text-left hover:bg-slate-50"
                              >
                                <span className="block text-sm font-medium text-slate-900">{target.label}</span>
                                {target.secondary && <span className="block text-xs text-slate-500">{target.secondary}</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={pending || !editTargetType}
                        onClick={searchEditTargets}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                      >
                        Tìm
                      </button>
                    </div>
                  )}
                </div>
              )}
              {editingItem.calendar.synced && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  Thay đổi sẽ được cập nhật vào sự kiện Google Calendar hiện có.
                </p>
              )}
            </div>
            {editingItem.activities.some((activity) => activity.body) && (
              <section className="mt-4 border-t border-slate-100 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lịch sử cập nhật
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {editingItem.activities.filter((activity) => activity.body).length} mốc
                  </span>
                </div>
                <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
                  {editingItem.activities
                    .filter((activity) => activity.body)
                    .slice(0, 8)
                    .map((activity) => (
                      <article key={activity.id} className="rounded-lg bg-slate-50 px-3 py-2">
                        <p className="whitespace-pre-wrap text-sm leading-5 text-slate-700">{activity.body}</p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {activity.actor?.name || activity.actor?.email || "Hệ thống"}
                          {" · "}
                          {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(activity.occurredAt))}
                        </p>
                      </article>
                    ))}
                </div>
              </section>
            )}
            {editingItem.access === "OWNER" && (
              <div className="mt-4">
                <PersonalWorkShareEditor users={data.availableUsers} shares={editShares} onChange={setEditShares} />
              </div>
            )}
            {editingItem.access === "VIEWER" && (
              <p className="mt-4 rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                Bạn đang xem công việc được chia sẻ ở chế độ chỉ xem.
              </p>
            )}
            <div className="mt-6 flex items-center justify-between gap-3">
              {editingItem.access === "OWNER" ? <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (!window.confirm("Xóa công việc này? Sự kiện đã liên kết trên Google Calendar cũng sẽ bị xóa."))
                    return;
                  run(
                    () => deletePersonalWorkAction(editingItem.id),
                    "Đã xóa công việc",
                    () => setEditingItem(null),
                  );
                }}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> Xóa
              </button> : <span />}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={pending || editingItem.access === "VIEWER"}
                  className="rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {pending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedCalendarEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[1px]"
          onMouseDown={() => setSelectedCalendarEvent(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-event-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                  {selectedLinkedTask ? "Công việc đã liên kết" : "Sự kiện Google Calendar"}
                </p>
                <h2 id="calendar-event-title" className="mt-1 text-xl font-bold text-slate-950">
                  {selectedCalendarEvent.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setSelectedCalendarEvent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>
                  {calendarEventDate(selectedCalendarEvent.startAt, selectedCalendarEvent.allDay)}
                  {selectedCalendarEvent.endAt
                    ? ` – ${calendarEventDate(selectedCalendarEvent.endAt, selectedCalendarEvent.allDay)}`
                    : ""}
                </span>
              </p>
              {selectedCalendarEvent.location && (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>{selectedCalendarEvent.location}</span>
                </p>
              )}
              {selectedCalendarEvent.description && (
                <p className="whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 leading-6 text-slate-700">
                  {selectedCalendarEvent.description}
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {selectedLinkedTask &&
                selectedLinkedTask.status !== "DONE" &&
                selectedLinkedTask.access !== "VIEWER" && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(
                      () => updatePersonalWorkAction({ id: selectedLinkedTask.id, status: "DONE" }),
                      "Đã hoàn thành công việc",
                      () => setSelectedCalendarEvent(null),
                    )
                  }
                  className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Đánh dấu hoàn thành
                </button>
              )}
              {selectedCalendarEvent.htmlLink && (
                <a
                  href={selectedCalendarEvent.htmlLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Mở trong Google <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </section>
        </div>
      )}

      {calendarCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[1px]"
          onMouseDown={() => setCalendarCreateOpen(false)}
        >
          <form
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              const nextTitle = calendarCreateTitle.trim();
              if (!nextTitle) {
                setMessage("Vui lòng nhập nội dung công việc cần làm");
                return;
              }
              run(
                async () => {
                  const created = await createPersonalWorkAction({
                    title: nextTitle,
                    domain: calendarCreateDomain,
                    dueAt: dateInputToIso(calendarCreateDueAt),
                    estimatedDays: calendarCreateEstimatedDays,
                  });
                  if (calendarCreateSync && data.calendar.connected) await syncPersonalWorkCalendarAction(created.id);
                },
                calendarCreateSync && data.calendar.connected
                  ? "Đã tạo việc và đồng bộ Google Calendar"
                  : "Đã tạo công việc",
                () => setCalendarCreateOpen(false),
              );
            }}
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Tạo từ Calendar</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">Thêm công việc</h2>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setCalendarCreateOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">Việc cần làm</span>
                <input
                  autoFocus
                  required
                  value={calendarCreateTitle}
                  onChange={(event) => setCalendarCreateTitle(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nhập nội dung công việc..."
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Nghiệp vụ</span>
                  <select
                    value={calendarCreateDomain}
                    onChange={(event) => setCalendarCreateDomain(event.target.value as PersonalWorkDomain)}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    {PERSONAL_WORK_DOMAINS.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Thời gian</span>
                  <input
                    required
                    type="date"
                    value={calendarCreateDueAt}
                    onChange={(event) => setCalendarCreateDueAt(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">Thời lượng dự kiến</span>
                <select
                  value={calendarCreateEstimatedDays === 1 ? "ONE_DAY" : "MULTI_DAY"}
                  onChange={(event) => setCalendarCreateEstimatedDays(event.target.value === "ONE_DAY" ? 1 : 2)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="ONE_DAY">Trong ngày</option>
                  <option value="MULTI_DAY">Kéo dài nhiều ngày</option>
                </select>
              </label>
              {calendarCreateEstimatedDays > 1 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Số ngày dự kiến</span>
                  <input
                    type="number"
                    min={2}
                    max={365}
                    value={calendarCreateEstimatedDays}
                    onChange={(event) => setCalendarCreateEstimatedDays(Math.max(2, Number(event.target.value) || 2))}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </label>
              )}
              {data.calendar.connected && (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
                  <input
                    type="checkbox"
                    checked={calendarCreateSync}
                    onChange={(event) => setCalendarCreateSync(event.target.checked)}
                    className="h-4 w-4 rounded border-blue-300 text-blue-600"
                  />
                  <span>
                    <b className="font-semibold">Đồng bộ lên Google Calendar</b>
                    <span className="mt-0.5 block text-xs text-blue-700/80">
                      Sự kiện sẽ xuất hiện ngay trong lịch Google đã kết nối.
                    </span>
                  </span>
                </label>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCalendarCreateOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {pending ? "Đang tạo..." : "Tạo công việc"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminPageCanvas>
  );
}
