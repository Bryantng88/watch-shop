"use client";

import PersonalCodexPanel from "./PersonalCodexPanel";

import { usePersonalCalendar } from "./use-personal-calendar";
import createStyles from "./PersonalWorkCreate.module.css";
import { GoogleCalendarEventDialog } from "./GoogleCalendarEventDialog";
import { PersonalWorkTimeFields } from "./PersonalWorkTimeFields";
import { PersonalCalendarPreview } from "./PersonalCalendarPreview";
import { calendarScheduleInput, scheduleDate, scheduleTime } from "../shared/personal-work-schedule";
import { buildPersonalCalendarEvents, groupCalendarEvents, calendarShareLabel, calendarDayKey } from "../shared/personal-calendar";
import { PersonalWorkCategoryManager } from "./PersonalWorkCategoryManager";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
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
  Loader2,
  RefreshCw,
  Share2,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { useAppDialog } from "@/domains/shared/feedback";
import { AsyncActionButton, useUiMutation } from "@/domains/shared/ui/mutation";
import {
  AdminUserAvatar,
  AdminUserInlineList,
  AdminFlatToolbar,
  AdminPageCanvas,
  AdminPageHeader,
  ProgressMetric,
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
  updateGoogleCalendarEventAction,
} from "../actions/personal-work.actions";
import {
  personalCategoryStyle,
  PERSONAL_WORK_TYPES,
  type PersonalCalendarEvent,
  type PersonalWorkDomain,
  type PersonalWorkItem,
  type PersonalWorkPageData,
  type PersonalWorkTarget,
  type PersonalWorkTargetType,
} from "../shared/personal-work.types";
import { PersonalWorkShareEditor } from "./PersonalWorkShareEditor";

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

function isPastDueDate(value: string | null, now: Date) {
  if (!value) return false;
  return localDayKey(new Date(value)) < localDayKey(now);
}

function dueLabel(value: string | null, timed = false) {
  if (!value) return "Chưa có lịch";
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Bangkok",
    ...(timed ? { hour: "2-digit" as const, minute: "2-digit" as const } : {}),
  }).format(new Date(value));
}

function calendarEventDate(value: string, allDay: boolean) {
  const date = allDay ? new Date(`${value.slice(0, 10)}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return "Không xác định ngày";
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
  return calendarDayKey(value, allDay);
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

export function PersonalWorkClient({ data, localCalendar = false }: { data: PersonalWorkPageData; localCalendar?: boolean }) {
  const calendarAvailable = data.calendar.connected || localCalendar;
  const router = useRouter();
  const appDialog = useAppDialog();
  const checklistMutation = useUiMutation();
  const calendarCreateMutation = useUiMutation();
  const calendarSyncMutation = useUiMutation();
  const calendarCreating = calendarCreateMutation.isPending("calendar:create");
  const [calendarCreateError, setCalendarCreateError] = useState<string | null>(null);
  const [calendarSyncFailures, setCalendarSyncFailures] = useState<Record<string, {id:string;title:string}>>({});
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"TODAY" | "UPCOMING" | "ALL" | "DONE">("ALL");
  const [scope, setScope] = useState<"MINE" | "SHARED" | "ALL">("MINE");
  const [domain, setDomain] = useState<string>("ALL");
  const [newCategoryKey, setNewCategoryKey] = useState("GENERAL");
  const [editCategoryKey, setEditCategoryKey] = useState("GENERAL");
  const [calendarCategoryKey, setCalendarCategoryKey] = useState("GENERAL");
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [newDomain, setNewDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [workType, setWorkType] = useState<string>(PERSONAL_WORK_TYPES.GENERAL[0].key);
  const [targetType, setTargetType] = useState<PersonalWorkTargetType | "">("");
  const [targetQuery, setTargetQuery] = useState("");
  const [targetResults, setTargetResults] = useState<PersonalWorkTarget[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<PersonalWorkTarget[]>([]);
  const [dueAt, setDueAt] = useState(localInputDate(new Date()));
  const [quickStartTime, setQuickStartTime] = useState("09:00");
  const [quickEndTime, setQuickEndTime] = useState("10:00");
  const [estimatedDays, setEstimatedDays] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(calendarAvailable);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<PersonalCalendarEvent | null>(null);
  const [calendarCreateOpen, setCalendarCreateOpen] = useState(false);
  const [calendarCreateTitle, setCalendarCreateTitle] = useState("");
  const [calendarCreateDomain, setCalendarCreateDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [calendarCreateDueAt, setCalendarCreateDueAt] = useState(localInputDate(new Date()));
  const [calendarStartTime, setCalendarStartTime] = useState("09:00");
  const [calendarEndTime, setCalendarEndTime] = useState("10:00");
  const [calendarWorkType, setCalendarWorkType] = useState<string>(PERSONAL_WORK_TYPES.GENERAL[0].key);
  const [calendarCreateEstimatedDays, setCalendarCreateEstimatedDays] = useState(1);
  const [calendarCreateSync, setCalendarCreateSync] = useState(true);
  const calendar = usePersonalCalendar(data);
  const workItems = calendar.items;
  const itemMap = useMemo(() => new Map(workItems.map(item => [item.id, item])), [workItems]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PersonalWorkItem | null>(null);
  const editingItemId = editingItem?.id;
  const editCategories = editingItem?.access === "OWNER"
    ? data.categories
    : [...data.categories.filter(c => c.isDefault), ...(editingItem && !editingItem.category.isDefault ? [editingItem.category] : [])];
  const filterCategories = [...new Map(
    [...data.categories, ...workItems.map(item => item.category)].map(c => [c.key, c]),
  ).values()];
  useEffect(() => {
    if (!data.categories.some(c => c.key === newCategoryKey)) {
      setNewCategoryKey("GENERAL");
      setNewDomain("GENERAL");
      setWorkType("REMINDER");
      setSelectedTargets([]);
    }
    if (!data.categories.some(c => c.key === calendarCategoryKey)) {
      setCalendarCategoryKey("GENERAL");
      setCalendarCreateDomain("GENERAL");
    }
  }, [data.categories, newCategoryKey, calendarCategoryKey]);
  useEffect(() => {
    if (domain !== "ALL" && !data.categories.some(c => c.key === domain) && !workItems.some(item => item.category.key === domain)) setDomain("ALL");
  }, [data.categories, workItems, domain]);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const editNoteRef = useRef<HTMLTextAreaElement>(null);
  const [editUpdateBody, setEditUpdateBody] = useState("");
  const [editDomain, setEditDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [editDueAt, setEditDueAt] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editWorkType, setEditWorkType] = useState("");
  const [editScheduleError, setEditScheduleError] = useState<string | null>(null);
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
      workItems.filter((item) => {
        if (scope === "MINE" && item.access !== "OWNER") return false;
        if (scope === "SHARED" && item.access === "OWNER") return false;
        if (domain !== "ALL" && item.category.key !== domain) return false;
        if (view === "DONE") return item.status === "DONE";
        if (item.status === "DONE") return false;
        if (view === "TODAY") return !item.dueAt || new Date(item.dueAt).getTime() <= todayEndMs;
        if (view === "UPCOMING") return Boolean(item.dueAt && new Date(item.dueAt).getTime() > todayEndMs);
        return true;
      }),
    [workItems, domain, scope, view, todayEndMs],
  );
  const openCount = workItems.filter((item) => item.status !== "DONE").length;
  const overdue = workItems.filter(
    (item) => item.status !== "DONE" && isPastDueDate(item.dueAt, now),
  ).length;
  const calendarDays = useMemo(() => monthCells(calendarCursor), [calendarCursor]);
  const visibleCalendarEvents = useMemo(() => buildPersonalCalendarEvents(workItems, calendar.events), [workItems, calendar.events]);
  const eventsByDay = useMemo(() => groupCalendarEvents(visibleCalendarEvents, calendarDays.map(localDayKey)), [visibleCalendarEvents, calendarDays]);

  useEffect(() => {
    if (!message) return;
    const timeoutId = window.setTimeout(() => setMessage(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  useEffect(() => {
    const textarea = editNoteRef.current;
    if (!editingItem || !textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(224, Math.min(textarea.scrollHeight, window.innerHeight * 0.55))}px`;
  }, [editNote, editingItem]);

  useEffect(() => {
    if (!editingItemId) return;
    const refreshed = workItems.find((item) => item.id === editingItemId);
    setEditingItem(refreshed || null);
  }, [workItems, editingItemId]);

  function run(action: () => Promise<unknown>, success?: string, onSuccess?: () => void, refresh = true) {
    setMessage(null);
    startTransition(async () => {
      try {
        await action();
        onSuccess?.();
        if (success) setMessage(success);
        if (refresh) router.refresh();
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
    }, undefined, undefined, false);
  }

  function searchEditTargets() {
    if (!editTargetType) return;
    run(async () => {
      const result = await searchPersonalWorkTargetsAction({
        type: editTargetType,
        query: editTargetQuery,
      });
      setEditTargetResults(result.items);
    }, undefined, undefined, false);
  }

  function openCalendarCreate(date: Date) {
    setCalendarCreateError(null);
    setCalendarCreateTitle("");
    setCalendarCreateDomain("GENERAL");
    setCalendarCategoryKey("GENERAL");
    setCalendarCreateDueAt(localInputDate(date));
    setCalendarStartTime("09:00");
    setCalendarEndTime("10:00");
    setCalendarWorkType(PERSONAL_WORK_TYPES.GENERAL[0].key);
    setCalendarCreateEstimatedDays(1);
    setCalendarCreateSync(data.calendar.connected);
    setCalendarCreateOpen(true);
  }

  function syncCreatedCalendarTask(task: {id:string;title:string}) {
    void calendarSyncMutation.run({
      key: `calendar-sync:${task.id}`,
      action: () => syncPersonalWorkCalendarAction(task.id),
      onSuccess: () => {
        setCalendarSyncFailures(current => {
          const remaining = {...current};
          delete remaining[task.id];
          return remaining;
        });
        router.refresh();
      },
      onError: () => setCalendarSyncFailures(current => ({...current, [task.id]:task})),
      errorMessage: `Công việc “${task.title}” đã được lưu, nhưng chưa đồng bộ Google Calendar. Bạn có thể thử đồng bộ lại.`,
    });
  }

  function openCalendarEvent(event: PersonalCalendarEvent) {
    setSelectedDay(null);
    const item = event.linkedTaskItemId ? itemMap.get(event.linkedTaskItemId) : null;
    if (item) { setSelectedCalendarEvent(null); openTaskEdit(item); }
    else setSelectedCalendarEvent(event);
  }

  const openTaskEdit = useCallback((item: PersonalWorkItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditNote(item.note || "");
    setEditUpdateBody("");
    setEditDomain(item.domain);
    setEditCategoryKey(item.category.key);
    setEditDueAt(item.dueAt ? scheduleDate(item.dueAt) : "");
    setEditStartTime(item.scheduledEndAt && item.dueAt ? scheduleTime(item.dueAt) : "");
    setEditEndTime(item.scheduledEndAt ? scheduleTime(item.scheduledEndAt) : "");
    setEditWorkType(item.workType || PERSONAL_WORK_TYPES[item.domain][0].key);
    setEditScheduleError(null);
    setEditEstimatedDays(item.scheduledEndAt && item.dueAt
      ? Math.round((Date.parse(`${scheduleDate(item.scheduledEndAt)}T00:00:00Z`) - Date.parse(`${scheduleDate(item.dueAt)}T00:00:00Z`)) / 86400000) + 1
      : item.estimatedDays || 1);
    setEditTargets(item.targets);
    setEditTargetType(domainTargets[item.domain][0]?.type || "");
    setEditTargetQuery("");
    setEditTargetResults([]);
    setEditShares(item.sharedWith);
    setNewChecklistTitle("");
  }, []);
  const openedWork = useRef<string | null>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("work");
    const item = id && workItems.find(candidate => candidate.id === id);
    if (item && openedWork.current !== id) { openedWork.current = id; openTaskEdit(item); }
  }, [workItems, openTaskEdit]);

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

      {categoryManagerOpen && <PersonalWorkCategoryManager categories={data.categories} canManageDefaults={data.canManageDefaultCategories} onClose={() => setCategoryManagerOpen(false)} />}

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
                  categoryKey: newCategoryKey,
                  workType,
                  targets: selectedTargets,
                  ...(dueAt ? calendarScheduleInput(dueAt, quickStartTime, quickEndTime, estimatedDays) : { dueAt: null, scheduledEndAt: null }),
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
            className={createStyles.toolbar}
          >
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Việc cần làm..."
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={newCategoryKey}
              onChange={(e) => { setNewCategoryKey(e.target.value); changeDomain(data.categories.find(c => c.key === e.target.value)?.domain || "GENERAL"); }}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              {data.categories.map((item) => (
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
            <PersonalWorkTimeFields compact start={quickStartTime} end={quickEndTime} onChange={(start, end) => { setQuickStartTime(start); setQuickEndTime(end); }} />
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
            onClick={() => calendarAvailable && setCalendarOpen((open) => !open)}
            className="flex w-full items-start justify-between gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <div className="flex gap-3">
              <span className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-950">{localCalendar && !data.calendar.connected ? "Lịch công việc" : "Google Calendar"}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {localCalendar && !data.calendar.connected ? "Theo dõi công việc trên lịch" : data.calendar.connected
                    ? data.calendar.accountEmail || "Đã kết nối"
                    : data.calendar.configured
                      ? "Chưa kết nối tài khoản"
                      : data.calendar.configurationIssue || "Chưa cấu hình OAuth"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.calendar.connected && (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  ĐÃ KẾT NỐI
                </span>
              )}
              {calendarAvailable && (
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${calendarOpen ? "rotate-180" : ""}`}
                />
              )}
            </div>
          </button>
          {(!localCalendar || data.calendar.connected) && <AsyncActionButton
            pending={data.calendar.connected ? calendar.loading : pending}
            title={calendar.lastSyncedAt ? `Cập nhật lịch: ${new Date(calendar.lastSyncedAt).toLocaleString("vi-VN")}` : undefined}
            pendingLabel={data.calendar.connected ? "Đang tải lịch…" : "Đang kết nối…"}
            disabled={!data.calendar.configured}
            onClick={() =>
              data.calendar.connected
                ? void calendar.reload()
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
          </AsyncActionButton>}
        </aside>
      </section>

      {message && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>
      )}
      {Object.values(calendarSyncFailures).map(task => (
        <div key={task.id} role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <span>Đã lưu “{task.title}”. Chưa đồng bộ Google Calendar.</span>
          <AsyncActionButton type="button" pending={calendarSyncMutation.isPending(`calendar-sync:${task.id}`)} pendingLabel="Đang đồng bộ…" onClick={() => syncCreatedCalendarTask(task)} className="rounded-md px-2 py-1 font-semibold hover:bg-amber-100">Thử đồng bộ lại</AsyncActionButton>
        </div>
      ))}

      <div
        className={`grid items-start gap-5 ${calendarAvailable && calendarOpen ? "xl:grid-cols-[minmax(0,1.55fr)_minmax(380px,0.85fr)]" : "grid-cols-1"}`}
      >
        {calendarAvailable && calendarOpen && (
          <section id="personal-google-calendar-agenda" className="min-w-0 overflow-hidden bg-white">
            <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">{data.calendar.connected ? "Lịch Google của tôi" : "Lịch công việc"}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Màu nền theo nhóm · Sọc cam: quá hạn · Gạch ngang: đã xong.
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
            {calendar.error ? (
              <div role="status" className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {calendar.error}
              </div>
            ) : null}
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
                            if (event.target !== event.currentTarget) return;
                            if (event.key === "Enter" || event.key === " ") openCalendarCreate(date);
                          }}
                          className={`min-h-28 cursor-pointer border-b border-r border-slate-100 p-2 transition-colors hover:bg-blue-50/30 ${outsideMonth ? "bg-slate-50/50" : "bg-white"} ${isToday ? "relative z-10 !bg-blue-50/40 ring-2 ring-inset ring-blue-500/70" : ""}`}
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
                                ? itemMap.get(event.linkedTaskItemId)
                                : null;
                              const category = linkedTask?.category;
                              const isOverdue = Boolean(
                                linkedTask &&
                                  linkedTask.status !== "DONE" &&
                                  isPastDueDate(linkedTask.dueAt, now),
                              );
                              const isDone = linkedTask?.status === "DONE";
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
                                  {!event.allDay && key === eventStartKey && (
                                    <span className="mr-1 text-[10px] opacity-70">
                                      {scheduleTime(event.startAt)}
                                    </span>
                                  )}
                                  <span className={startsVisibleWeekSegment ? `truncate ${isDone ? "text-slate-500 line-through decoration-slate-400/80 decoration-1" : ""}` : "select-none opacity-0"}>
                                    {startsVisibleWeekSegment ? event.title : "Tiếp diễn"}
                                  </span>
                                </>
                              );
                              return (
                                <PersonalCalendarPreview key={event.id} event={event} item={linkedTask}>
                                <button
                                  type="button"
                                  key={event.id}
                                  data-task-item-id={linkedTask?.id}
                                  onClick={(clickEvent) => {
                                    clickEvent.stopPropagation();
                                    openCalendarEvent(event);
                                  }}
                                  style={category ? personalCategoryStyle(category.color) : undefined}
                                  className={`flex min-h-[22px] items-center overflow-hidden whitespace-nowrap px-1.5 py-1 text-left text-[11px] font-medium leading-none ${connectionClass} ${category ? "hover:brightness-95" : externalCalendarStyle.event} ${isDone ? "opacity-65 saturate-50" : ""} ${startsVisibleWeekSegment && isOverdue ? "border-l-2 border-l-orange-400" : "border-l-0"}`}
                                >
                                  {content}
                                  {startsVisibleWeekSegment && linkedTask && calendarShareLabel(linkedTask) && <Share2 aria-label={calendarShareLabel(linkedTask)!} className="ml-1 h-3 w-3 shrink-0 text-violet-600" />}
                                </button>
                                </PersonalCalendarPreview>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <button type="button" aria-label={`Xem tất cả ${dayEvents.length} lịch ngày ${key}`} onClick={(event) => {event.stopPropagation();setSelectedDay(key);}} className="rounded px-1 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">+{dayEvents.length - 3} lịch</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
          </section>
        )}

        <section className="min-w-0 bg-transparent xl:flex xl:h-[766px] xl:flex-col xl:overflow-hidden xl:border-l xl:border-slate-100">
          <div className="flex min-h-[56px] flex-nowrap items-center justify-between gap-2 overflow-x-auto whitespace-nowrap px-1 py-2 xl:ml-5 xl:shrink-0">
            <div className="flex shrink-0 items-center">
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
                    className={`rounded-md px-2 py-1.5 text-xs font-medium ${view === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <label className="flex items-center">
                <span className="sr-only">Phạm vi công việc</span>
                <select
                  value={scope}
                  onChange={(event) => setScope(event.target.value as "MINE" | "SHARED" | "ALL")}
                  className="h-8 w-20 truncate rounded-lg border-0 bg-slate-100/80 pl-2 pr-5 text-xs font-medium text-slate-700 outline-none ring-0 transition-colors hover:bg-slate-200/70 focus:ring-2 focus:ring-blue-400/30"
                >
                  <option value="MINE">Của tôi</option>
                  <option value="SHARED">Được chia sẻ</option>
                  <option value="ALL">Tất cả công việc</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
              <select
                aria-label="Loại công việc"
                value={domain}
                onChange={(e) => setDomain(e.target.value as PersonalWorkDomain | "ALL")}
                className="h-8 w-32 truncate rounded-lg border-0 bg-slate-100/80 pl-2 pr-5 text-xs font-medium text-slate-700 outline-none ring-0"
              >
                <option value="ALL">Tất cả loại</option>
                {filterCategories.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              </label>
              <button type="button" aria-label="Quản lý loại công việc" title="Quản lý loại công việc" onClick={() => setCategoryManagerOpen(true)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <Settings2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-1 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pl-5 xl:[direction:rtl] [&>*]:[direction:ltr]">
            {items.length ? (
              items.map((item) => {
                const late = item.status !== "DONE" && isPastDueDate(item.dueAt, now);
                return (
                  <div
                    key={item.id}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
                      openTaskEdit(item);
                    }}
                    className="group grid cursor-pointer gap-2 px-1 py-3 transition-colors hover:bg-slate-100/60 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
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
                        <button
                          type="button"
                          onClick={() => openTaskEdit(item)}
                          className={`truncate rounded-sm text-left text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${item.status === "DONE" ? "text-slate-400 line-through" : "text-slate-950"}`}
                        >
                          {item.title}
                        </button>
                        {item.access !== "OWNER" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                            <Share2 className="h-3 w-3" /> {item.access === "EDITOR" ? "Có thể sửa" : "Chỉ xem"}
                          </span>
                        )}
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={personalCategoryStyle(item.category.color)}>
                          {item.category.label}
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
                        {dueLabel(item.dueAt, Boolean(item.scheduledEndAt))} · {item.estimatedDays === 1 ? "trong ngày" : `dự kiến ${item.estimatedDays} ngày`}
                      </p>
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
                    <div className="flex items-center justify-end gap-3">
                      {item.progressMode === "CHECKLIST" && item.checklist.length > 0 && (
                        <ProgressMetric
                          value={item.progressPercent}
                          numerator={item.checklist.filter((entry) => entry.isDone).length}
                          denominator={item.checklist.length}
                          layout="inline"
                          className="max-w-[210px]"
                          label={`Tiến độ ${item.title}: ${item.progressPercent}%`}
                        />
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="personal-task-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              const nextTitle = editTitle.trim();
              if (!nextTitle) {
                setMessage("Vui lòng nhập nội dung công việc cần làm");
                return;
              }
              let editedSchedule;
              try {
                if (!editDueAt && (editStartTime || editEndTime)) throw new Error("Vui lòng chọn ngày bắt đầu");
                editedSchedule = editDueAt ? calendarScheduleInput(editDueAt, editStartTime, editEndTime, editEstimatedDays) : { dueAt: null, scheduledEndAt: null };
                setEditScheduleError(null);
              } catch (error) {
                setEditScheduleError(error instanceof Error ? error.message : "Thời gian không hợp lệ");
                return;
              }
              run(
                async () => {
                  await updatePersonalWorkAction({
                    id: editingItem.id,
                    title: nextTitle,
                    note: editNote,
                    domain: editDomain,
                    categoryKey: editCategoryKey,
                    workType: editWorkType,
                    tags: editingItem.tags,
                    ...editedSchedule,
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
                <h2 id="personal-task-detail-title" className="mt-1 text-xl font-bold text-slate-950">{editingItem.access === "VIEWER" ? "Chi tiết công việc" : "Chỉnh sửa công việc"}</h2>
                {calendarShareLabel(editingItem) && <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-700"><Share2 className="h-3.5 w-3.5 shrink-0" />{calendarShareLabel(editingItem)}</p>}
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
                  <ProgressMetric
                    value={editingItem.progressPercent}
                    numerator={editingItem.checklist.filter((entry) => entry.isDone).length}
                    denominator={editingItem.checklist.length}
                    className="max-w-[210px]"
                    label={`Tiến độ ${editingItem.title}: ${editingItem.progressPercent}%`}
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
                  <span className="text-xs font-semibold text-slate-600">Nhóm công việc</span>
                  <select
                    value={editCategoryKey}
                    disabled={editingItem.access === "VIEWER"}
                    onChange={(event) => {
                      setEditCategoryKey(event.target.value);
                      const nextDomain = editCategories.find(c => c.key === event.target.value)?.domain || "GENERAL";
                      setEditDomain(nextDomain);
                      setEditWorkType(PERSONAL_WORK_TYPES[nextDomain][0].key);
                      setEditTargetType(domainTargets[nextDomain][0]?.type || "");
                      setEditTargetQuery("");
                      setEditTargetResults([]);
                      setEditTargets([]);
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    {editCategories.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Ngày bắt đầu</span>
                  <input
                    type="date"
                    value={editDueAt}
                    disabled={editingItem.access === "VIEWER"}
                    onChange={(event) => setEditDueAt(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </label>
              </div>
              {editCategories.find(category => category.key === editCategoryKey)?.isDefault && PERSONAL_WORK_TYPES[editDomain].length > 1 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Loại công việc</span>
                  <select aria-label="Loại công việc" value={editWorkType} disabled={editingItem.access === "VIEWER"} onChange={event => setEditWorkType(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {PERSONAL_WORK_TYPES[editDomain].map(type => <option key={type.key} value={type.key}>{type.label}</option>)}
                  </select>
                </label>
              )}
              <PersonalWorkTimeFields start={editStartTime} end={editEndTime} disabled={editingItem.access === "VIEWER"} onChange={(start, end) => { setEditStartTime(start); setEditEndTime(end); }} />
              {editScheduleError && <p role="alert" className="text-xs text-rose-600">{editScheduleError}</p>}
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
              {editingItem.calendar.htmlLink && <a href={editingItem.calendar.htmlLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline">Mở trong Google <ExternalLink className="h-3.5 w-3.5" /></a>}
              {data.calendar.connected && !editingItem.calendar.synced && editingItem.access !== "VIEWER" && <AsyncActionButton type="button" pending={calendarSyncMutation.isPending(`calendar-sync:${editingItem.id}`)} pendingLabel="Đang đồng bộ…" onClick={() => syncCreatedCalendarTask(editingItem)} className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Đồng bộ Google Calendar</AsyncActionButton>}
            </div>
            <PersonalCodexPanel item={editingItem} configuration={data.codex} />
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
                onClick={async () => {
                  const confirmed = await appDialog.confirm({title:"Xóa công việc?",message:"Task sẽ bị xóa khỏi lịch và danh sách của những người được chia sẻ. Sự kiện liên kết trong Google Calendar của bạn cũng sẽ bị xóa.",confirmText:"Xóa công việc",tone:"danger"});
                  if (!confirmed) return;
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

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[1px]" onMouseDown={() => setSelectedDay(null)} onKeyDown={event => {if(event.key === "Escape") setSelectedDay(null);}}>
          <section role="dialog" aria-modal="true" aria-labelledby="calendar-day-title" onMouseDown={event => event.stopPropagation()} className="flex max-h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-950/10">
            <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-4">
              <div className="flex items-baseline gap-2.5"><h2 id="calendar-day-title" className="text-sm font-semibold text-slate-950">{calendarEventDate(selectedDay, true)}</h2><span className="text-xs text-slate-400">{eventsByDay.get(selectedDay)?.length || 0} lịch</span></div>
              <button autoFocus type="button" aria-label="Đóng danh sách lịch trong ngày" onClick={() => setSelectedDay(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><X className="h-4 w-4" /></button>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto px-3 pb-3">
              {(eventsByDay.get(selectedDay) || []).map(event => {
                const item = event.linkedTaskItemId ? itemMap.get(event.linkedTaskItemId) : undefined;
                const share = item ? calendarShareLabel(item) : null;
                return <PersonalCalendarPreview key={event.id} event={event} item={item}><button type="button" data-task-item-id={item?.id} onClick={() => openCalendarEvent(event)} className="group flex min-h-11 w-full items-center gap-2.5 rounded-md px-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{backgroundColor:item?.category.color || "#0ea5e9"}} />
                  {!event.allDay && <span className="shrink-0 text-[11px] tabular-nums text-slate-400">{scheduleTime(event.startAt)}</span>}
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${item?.status === "DONE" ? "text-slate-400 line-through" : "text-slate-800"}`}>{event.title}</span>
                  {share && <Share2 aria-label={share} className="h-3 w-3 shrink-0 text-violet-500" />}
                  <span className="max-w-20 shrink-0 truncate text-[10px] text-slate-400">{item?.category.label || "Google"}</span>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500" />
                </button></PersonalCalendarPreview>;
              })}
            </div>
          </section>
        </div>
      )}

      {selectedCalendarEvent && <GoogleCalendarEventDialog
        key={`${selectedCalendarEvent.id}:${selectedCalendarEvent.etag || ""}`}
        event={selectedCalendarEvent}
        saveEvent={updateGoogleCalendarEventAction}
        onClose={() => setSelectedCalendarEvent(null)}
        onSaved={updated => { calendar.updateEvent(updated); setSelectedCalendarEvent(null); setMessage("Đã lưu thay đổi lên Google Calendar"); void calendar.reload(); }}
      />}

      {calendarCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[1px]"
          onMouseDown={() => {if(!calendarCreating) setCalendarCreateOpen(false);}}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-create-title"
            aria-busy={calendarCreating}
            style={{ maxHeight: "calc(100dvh - 32px)", overflowY: "auto" }}
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              const nextTitle = calendarCreateTitle.trim();
              if (!nextTitle) {
                setCalendarCreateError("Vui lòng nhập nội dung công việc cần làm");
                return;
              }
              const syncToGoogle = calendarCreateSync && data.calendar.connected;
              let schedule;
              try {
                schedule = calendarScheduleInput(calendarCreateDueAt, calendarStartTime, calendarEndTime, calendarCreateEstimatedDays);
              } catch (error) {
                setCalendarCreateError(error instanceof Error ? error.message : "Thời gian không hợp lệ");
                return;
              }
              setCalendarCreateError(null);
              void calendarCreateMutation.run({
                key: "calendar:create",
                action: () => createPersonalWorkAction({
                  title: nextTitle,
                  domain: calendarCreateDomain,
                  categoryKey: calendarCategoryKey,
                  workType: calendarWorkType,
                  ...schedule,
                  estimatedDays: calendarCreateEstimatedDays,
                }),
                onSuccess: (created) => {
                  setCalendarCreateOpen(false);
                  setCalendarCreateTitle("");
                  router.refresh();
                  if (syncToGoogle) syncCreatedCalendarTask({id:created.id,title:nextTitle});
                },
                onError: (error) => setCalendarCreateError(error instanceof Error ? error.message : "Không thể tạo công việc. Vui lòng thử lại."),
                successMessage: "Đã tạo công việc",
              });
            }}
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Tạo từ Calendar</p>
                <h2 id="calendar-create-title" className="mt-1 text-xl font-bold text-slate-950">Thêm công việc</h2>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                disabled={calendarCreating}
                onClick={() => setCalendarCreateOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <fieldset disabled={calendarCreating} className="mt-5 min-w-0 space-y-4">
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
                  <span className="text-xs font-semibold text-slate-600">Nhóm công việc</span>
                  <select
                    value={calendarCategoryKey}
                    onChange={(event) => {
                      const nextDomain = data.categories.find(c => c.key === event.target.value)?.domain || "GENERAL";
                      setCalendarCategoryKey(event.target.value);
                      setCalendarCreateDomain(nextDomain);
                      setCalendarWorkType(PERSONAL_WORK_TYPES[nextDomain][0].key);
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    {data.categories.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Ngày bắt đầu</span>
                  <input
                    required
                    type="date"
                    value={calendarCreateDueAt}
                    onChange={(event) => setCalendarCreateDueAt(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                </label>
              </div>
              {data.categories.find(category => category.key === calendarCategoryKey)?.isDefault && PERSONAL_WORK_TYPES[calendarCreateDomain].length > 1 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Loại công việc</span>
                  <select aria-label="Loại công việc" value={calendarWorkType} onChange={event => setCalendarWorkType(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {PERSONAL_WORK_TYPES[calendarCreateDomain].map(type => <option key={type.key} value={type.key}>{type.label}</option>)}
                  </select>
                </label>
              )}
              <PersonalWorkTimeFields start={calendarStartTime} end={calendarEndTime} onChange={(start, end) => { setCalendarStartTime(start); setCalendarEndTime(end); }} />
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
            </fieldset>
            {calendarCreateError && <p role="alert" className="mt-3 text-sm text-rose-600">{calendarCreateError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={calendarCreating}
                onClick={() => setCalendarCreateOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <AsyncActionButton
                type="submit"
                pending={calendarCreating}
                pendingLabel="Đang tạo…"
                className="w-40 rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Tạo công việc
              </AsyncActionButton>
            </div>
          </form>
        </div>
      )}
    </AdminPageCanvas>
  );
}
