"use client";
import {loadPersonalWorkDetailAction} from "../actions/personal-work.actions";
import {matchesWorkList, compareWorkList, workViewCounts, type WorkListQuery} from "../shared/work-list-query";
import {useWorkListPage} from "./use-work-list-page";
import { PersonalWorkLifecycleActions } from "./PersonalWorkLifecycleActions";
import { isContinuousWork } from "../shared/continuous-work";

import { PersonalMediaMerge } from "./PersonalMediaMerge";
import { WorkImageAttachments } from "@/domains/work-media/ui/WorkImageAttachments";
import { WorkObjectThumbnail } from "@/domains/shared/ui/work-object/WorkObjectThumbnail";
import { AdminRowActionMenu } from "@/domains/shared/ui/admin-design-contract/AdminRowActionMenu";
import { PersonalWorkWorkspace } from "./PersonalWorkWorkspace";

import { AdminButton, AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { personalWorkSavedMessage, personalWorkActionFailure, type CalendarSaveResult } from "../shared/calendar-save-result";
import {PersonalWorkListRow} from "./PersonalWorkListRow";
import { PersonalWorkFloatingPanel } from "./PersonalWorkFloatingPanel";
import {PersonalWorkListToolbar} from "./PersonalWorkListToolbar";
import listStyles from "./PersonalWorkList.module.css";
import { personalWorkCode } from "../shared/personal-work-code";
import {PersonalChecklistShare} from "./PersonalChecklistShare";
import {PersonalChecklistTitle} from "./PersonalChecklistTitle";
import {PersonalWorkKindField} from "./PersonalWorkKindField";
import {isPersonalEvent,personalEventLabel,personalItemScheduleInput,personalEventTiming} from "../shared/personal-event";

import PersonalWorkTagsField, { parsePersonalWorkTags } from "./PersonalWorkTagsField";
import PersonalCodexPanel from "./PersonalCodexPanel";

import { usePersonalCalendar } from "./use-personal-calendar";
import createStyles from "./PersonalWorkCreate.module.css";
import { GoogleCalendarEventDialog } from "./GoogleCalendarEventDialog";
import { PersonalWorkTimeFields } from "./PersonalWorkTimeFields";
import { PersonalCalendarPreview } from "./PersonalCalendarPreview";
import { scheduleDate, scheduleTime } from "../shared/personal-work-schedule";
import { buildPersonalCalendarEvents, groupCalendarEvents, calendarShareLabel, calendarDayKey } from "../shared/personal-calendar";
import { PersonalWorkCategoryManager } from "./PersonalWorkCategoryManager";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Plus,
  Check,
  Settings2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Share2,
  X,
} from "lucide-react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppDialog } from "@/domains/shared/feedback";
import { AsyncActionButton, useUiMutation } from "@/domains/shared/ui/mutation";
import {
  ProgressMetric,
  AdminUserAvatar,
  AdminUserAvatarStack,
  AdminViewTabs,
} from "@/domains/shared/ui/admin-design-contract";
import {
  replacePersonalChecklistSharesAction,
  renamePersonalWorkChecklistItemAction,
  addPersonalWorkChecklistItemAction,
  createPersonalWorkAction,
  deletePersonalWorkChecklistItemAction,
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

const quickCategoryKeys = new Set(["GENERAL", "WORK", "WATCHSHOP", "CODEX_WORK"]);

const domainTargets: Record<PersonalWorkDomain, { type: PersonalWorkTargetType; label: string }[]> = {
  WATCHSHOP: [],
  CODEX_WORK: [],
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

export function PersonalWorkClient({ data }: { data: PersonalWorkPageData }) {
  const router = useRouter();
  const searchParams=useSearchParams();
  const requestedItem=searchParams.get("item");
  const listOnly=searchParams.get("view")==="list";
  const openedItem=useRef<string|null>(null);
  const appDialog = useAppDialog();
  const notify = useNotify();
  const completionMutation = useUiMutation();
  const checklistMutation = useUiMutation();
  const calendarCreateMutation = useUiMutation();
  const calendarSyncMutation = useUiMutation();
  const calendarCreating = calendarCreateMutation.isPending("calendar:create");
  const [calendarCreateError, setCalendarCreateError] = useState<string | null>(null);
  const [calendarSyncFailures, setCalendarSyncFailures] = useState<Record<string, {id:string;title:string}>>({});
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"TODAY" | "UPCOMING" | "ALL" | "DONE" | "EVENTS" | "OVERDUE" | "CANCELLED">(listOnly ? "ALL" : "TODAY");
  const [scope, setScope] = useState<"MINE" | "SHARED" | "ALL">("ALL");
  const [domain, setDomain] = useState<string>("ALL");
  const [newCategoryKey, setNewCategoryKey] = useState("GENERAL");
  const [editCategoryKey, setEditCategoryKey] = useState("GENERAL");
  const [calendarCategoryKey, setCalendarCategoryKey] = useState("GENERAL");
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [reminderMinutes,setReminderMinutes] = useState<number|null>(0);
  const [newTags, setNewTags] = useState("");
  const [editTags, setEditTags] = useState("");
  const [calendarTags, setCalendarTags] = useState("");
  const [newDomain, setNewDomain] = useState<PersonalWorkDomain>("GENERAL");
  const [workType, setWorkType] = useState<string>(PERSONAL_WORK_TYPES.GENERAL[0].key);
  const creatingEvent = isPersonalEvent(workType);
  const creatingContinuous = isContinuousWork(workType);
  const [targetType, setTargetType] = useState<PersonalWorkTargetType | "">("");
  const [targetQuery, setTargetQuery] = useState("");
  const [targetResults, setTargetResults] = useState<PersonalWorkTarget[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<PersonalWorkTarget[]>([]);
  const [dueAt, setDueAt] = useState(localInputDate(new Date()));
  const [quickStartTime, setQuickStartTime] = useState("09:00");
  const [quickEndTime, setQuickEndTime] = useState("10:00");
  const [estimatedDays, setEstimatedDays] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [messageIsError, setMessageIsError] = useState(false);
  const [quickOptionsOpen, setQuickOptionsOpen] = useState(false);
  const quickOptionsTrigger = useRef<HTMLButtonElement>(null);
  const closeQuickOptions = useCallback(() => setQuickOptionsOpen(false), []);
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [calendarSettingsOpen, setCalendarSettingsOpen] = useState(false);
  const calendarSettingsTrigger = useRef<HTMLButtonElement>(null);
  const closeCalendarSettings = useCallback(() => setCalendarSettingsOpen(false), []);
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
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, PersonalWorkItem>>({});
  const [recentCompletions, setRecentCompletions] = useState<Record<string, boolean>>({});
  const completionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => completionTimers.current.forEach(clearTimeout), []);
  useEffect(() => {
    setCompletedOverrides(current => {
      const confirmed = Object.keys(current).filter(id => calendar.items.some(item => item.id === id && item.status === current[id].status));
      if (!confirmed.length) return current;
      const next = {...current}; confirmed.forEach(id => delete next[id]); return next;
    });
  }, [calendar.items]);
  const workItems = useMemo(() => calendar.items.map(item => completedOverrides[item.id] || item), [calendar.items, completedOverrides]);
  const itemMap = useMemo(() => new Map(workItems.map(item => [item.id, item])), [workItems]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PersonalWorkItem | null>(null);
  const [editingChecklistTitleId, setEditingChecklistTitleId] = useState<string | null>(null);
  useEffect(()=>setEditingChecklistTitleId(null),[editingItem?.id]);
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
  const [editReminder,setEditReminder]=useState<number|null>(0);
  const [editNote, setEditNote] = useState("");
  const [editUpdateBody, setEditUpdateBody] = useState("");
  const [updateChecklistId, setUpdateChecklistId] = useState("");
  const updateComposerRef = useRef<HTMLTextAreaElement>(null);
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
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>{if(document.visibilityState==="visible")setNow(new Date());},60000);return()=>clearInterval(timer);},[]);
  const listQuery = useMemo<WorkListQuery>(()=>({view,scope,domain,day:scheduleDate(now)}),[view,scope,domain,now]);
  const matchingItems = useMemo(()=>workItems.filter(item=>matchesWorkList(item,listQuery)||Boolean(recentCompletions[item.id])&&view!=="DONE"&&item.status==="DONE"&&matchesWorkList({...item,status:"TODO"},listQuery)).sort(compareWorkList),[workItems,listQuery,recentCompletions,view]);
  const viewCounts = useMemo(()=>workViewCounts(workItems,listQuery),[workItems,listQuery]);
  const paged = useWorkListPage(Boolean(data.pagination),listQuery,calendar.items);
  const matchingIds = new Set(matchingItems.map(item=>item.id));
  const items = data.pagination ? paged.items.map(item=>completedOverrides[item.id]||item).filter(item=>matchingIds.has(item.id)) : matchingItems;
  const [detailLoading,setDetailLoading] = useState(false);
  const detailRequest = useRef(0);
  const openCount = workItems.filter((item) => !isContinuousWork(item.workType) && !isPersonalEvent(item.workType) && !["DONE","CANCELLED"].includes(item.status)).length;
  const overdue = workItems.filter(
    (item) => !isContinuousWork(item.workType) && !isPersonalEvent(item.workType) && !["DONE","CANCELLED"].includes(item.status) && isPastDueDate(item.scheduledEndAt || item.dueAt, now),
  ).length;
  const continuousItems=workItems.filter(item=>isContinuousWork(item.workType)&&item.status!=="CANCELLED"&&(scope!=="MINE"||item.access==="OWNER"||item.assignedToMe)&&(scope!=="SHARED"||item.access!=="OWNER")&&(domain==="ALL"||item.category.key===domain));
  const calendarDays = useMemo(() => monthCells(calendarCursor), [calendarCursor]);
  const visibleCalendarEvents = useMemo(() => buildPersonalCalendarEvents(workItems, calendar.events), [workItems, calendar.events]);
  const eventsByDay = useMemo(() => groupCalendarEvents(visibleCalendarEvents, calendarDays.map(localDayKey)), [visibleCalendarEvents, calendarDays]);

  useEffect(() => {
    if (!message || messageIsError) return;
    const timeoutId = window.setTimeout(() => setMessage(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message, messageIsError]);

  useEffect(() => {
    if (!editingItemId) return;
    const refreshed = workItems.find((item) => item.id === editingItemId);
    if(!refreshed){setEditingItem(null);return;}
    if(refreshed.detailsLoaded!==false){setEditingItem(refreshed);return;}
    let cancelled=false;
    void loadPersonalWorkDetailAction(editingItemId).then(item=>{if(!cancelled)setEditingItem(item);}).catch(()=>{if(!cancelled){setEditingItem(null);setMessageIsError(true);setMessage("Công việc không còn khả dụng hoặc quyền xem đã thay đổi.");}});
    return()=>{cancelled=true;};
  }, [workItems, editingItemId]);

  function run<T>(action: () => Promise<T>, success?: string | ((result: T) => string), onSuccess?: () => void, refresh = true) {
    setMessage(null);
    setMessageIsError(false);
    startTransition(async () => {
      try {
        const result = await action();
        onSuccess?.();
        if (success) setMessage(typeof success === "function" ? success(result) : success);
        if (refresh) router.refresh();
      } catch (error) {
        setMessageIsError(true);
        setMessage(personalWorkActionFailure(error));
      }
    });
  }

  function rememberCalendarSave(task: {id:string;title:string}, result: CalendarSaveResult) {
    setCalendarSyncFailures(current => {
      const next = {...current};
      if (result.calendarSync === "FAILED") next[task.id] = task;
      else delete next[task.id];
      return next;
    });
  }

  function completeWork(item: PersonalWorkItem, finalize = false) {
    if (item.checklistOnly || item.access === "VIEWER" || item.status === "CANCELLED" || isContinuousWork(item.workType) || isPersonalEvent(item.workType)) return;
    const done = item.status !== "DONE";
    void completionMutation.run({
      key: `complete:${item.id}`,
      action: async () => {
        const result = finalize ? await finalizePersonalWorkChecklistAction(item.id)
          : await updatePersonalWorkAction({id:item.id, status:done ? "DONE" : "TODO"});
        rememberCalendarSave(item, result);
        return result;
      },
      onSuccess: result => {
        const updated: PersonalWorkItem = {...item, status:done ? "DONE" : "TODO", progressPercent:done ? 100 : item.progressPercent,
          completedAt:done ? new Date().toISOString() : null, ...(finalize ? {checklistLockedAt:new Date().toISOString()} : {})};
        setCompletedOverrides(current => ({...current, [item.id]:updated}));
        setEditingItem(current => current?.id === item.id ? {...current, ...updated} : current);
        if (done) {
          setRecentCompletions(current => ({...current, [item.id]:true}));
          completionTimers.current.push(setTimeout(() => setRecentCompletions(current => {const next={...current};delete next[item.id];return next;}), 1000));
        }
        const message = done ? "Đã hoàn thành công việc" : "Đã mở lại công việc";
        if (result.calendarSync === "FAILED") notify.warning({message:`${message}. Chưa đồng bộ Google Calendar.`, density:"compact"});
        else notify.success({message, density:"compact"});
        router.refresh();
      },
      errorMessage: personalWorkActionFailure,
    });
  }

  function changeDomain(nextDomain: PersonalWorkDomain) {
    setNewDomain(nextDomain);
    setWorkType(previous=>isContinuousWork(previous)?"CONTINUOUS":isPersonalEvent(previous)?"EVENT":PERSONAL_WORK_TYPES[nextDomain][0]?.key || "");
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
    setCalendarTags("");
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
      onError: () => {
        setCalendarSyncFailures(current => ({...current, [task.id]:task}));
        void calendar.reload();
      },
      errorMessage: `Công việc “${task.title}” đã được lưu, nhưng chưa đồng bộ Google Calendar. Bạn có thể thử đồng bộ lại.`,
    });
  }

  function openCalendarEvent(event: PersonalCalendarEvent) {
    setSelectedDay(null);
    const item = event.linkedTaskItemId ? itemMap.get(event.linkedTaskItemId) : null;
    if (item) { setSelectedCalendarEvent(null); openTaskEdit(item); }
    else setSelectedCalendarEvent(event);
  }

  const openTaskEdit = useCallback(async (selected: PersonalWorkItem) => {
    const version=++detailRequest.current;
    let item=selected;
    if(item.detailsLoaded===false){
      setDetailLoading(true);
      try{item=await loadPersonalWorkDetailAction(item.id);}catch{if(version===detailRequest.current){setMessageIsError(true);setMessage("Không mở được công việc. Vui lòng thử lại.");}return;}finally{if(version===detailRequest.current)setDetailLoading(false);}
      if(version!==detailRequest.current)return;
    }
    setMessage(null);
    setMessageIsError(false);
    setEditingTitle(false);
    setScheduleExpanded(false);
    setHistoryExpanded(false);
    setEditingItem(item);
    setEditTitle(item.title);
    setEditReminder(item.reminderMinutes === undefined ? 0 : item.reminderMinutes);
    setEditTags(item.tags.join(", "));
    setEditNote(item.note || "");
    setEditUpdateBody("");
    setUpdateChecklistId("");
    setEditDomain(item.domain);
    setEditCategoryKey(item.category.key);
    setEditDueAt(item.dueAt ? scheduleDate(item.dueAt) : "");
    setEditStartTime(personalEventTiming(item).timed && item.dueAt ? scheduleTime(item.dueAt) : "");
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
    setAddingChecklist(false);
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

  useEffect(()=>{if(requestedItem&&openedItem.current!==requestedItem){const item=itemMap.get(data.mergedWorkRedirects?.[requestedItem]||requestedItem);if(item){openedItem.current=requestedItem;openTaskEdit(item);}}},[requestedItem,itemMap,openTaskEdit,data.mergedWorkRedirects]);
  const mediaMergeAction = <PersonalMediaMerge items={calendar.items} onMerged={id=>{const url=new URL(window.location.href);url.searchParams.set("item",id);router.replace(url.pathname+url.search);router.refresh();}}/>;
  return (
    <PersonalWorkWorkspace compact={listOnly} view={view} onView={setView} counts={viewCounts} summary={
      <div className={listStyles.summary}><span><b className="font-semibold tabular-nums text-slate-800">{openCount}</b> đang mở</span>{continuousItems.length>0&&<span>{continuousItems.length} duy trì</span>}{overdue > 0 && <span className="text-amber-700"><b className="font-semibold tabular-nums">{overdue}</b> quá hạn</span>}</div>
    } tools={<>{!listOnly && <PersonalWorkListToolbar inline hideViews view={view} onView={setView} counts={viewCounts} scope={scope} onScope={setScope} domain={domain} onDomain={setDomain} categories={filterCategories} onManage={() => setCategoryManagerOpen(true)} />}<AdminButton variant="quiet" density="compact" type="button" aria-label="Hiển thị lịch công việc"
      aria-expanded={calendarOpen} aria-controls="personal-google-calendar-agenda" onClick={() => setCalendarOpen(open => !open)}>
      <CalendarDays className="h-4 w-4" />Lịch
      {calendar.error && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-label={calendar.reconnectRequired ? "Lịch cần kết nối lại" : "Lịch có lỗi đồng bộ"} />}
    </AdminButton>{!listOnly && <><AdminButton ref={calendarSettingsTrigger} iconOnly variant="quiet" density="compact" type="button" aria-label="Cài đặt Google Calendar" title="Cài đặt Google Calendar" aria-expanded={calendarSettingsOpen} onClick={()=>setCalendarSettingsOpen(open=>!open)}><Settings2 className="h-4 w-4"/>{calendar.error && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-label="Google Calendar cần chú ý"/>}</AdminButton>{mediaMergeAction}</>}</>}>
      {calendarSettingsOpen && <PersonalWorkFloatingPanel anchor={calendarSettingsTrigger.current} onClose={closeCalendarSettings} label="Cài đặt Google Calendar" className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <h2 className="text-sm font-semibold text-slate-950">Google Calendar</h2>
        <p className="mt-1 break-all text-xs text-slate-500">{data.calendar.connected ? data.calendar.accountEmail || "Đã kết nối Google Calendar" : "Đang dùng lịch nội bộ"}</p>
        <p className={`mt-1 text-xs ${calendar.error ? "text-amber-700" : "text-slate-500"}`}>{calendar.reconnectRequired ? "Cần kết nối lại" : calendar.error ? "Có lỗi đồng bộ" : calendar.loading ? "Đang kiểm tra" : data.calendar.connected ? "Đã liên kết" : "Chưa kết nối Google Calendar"}</p>
          <AsyncActionButton variant="quiet"
            pending={data.calendar.connected && !calendar.reconnectRequired ? calendar.loading : pending}
            title={calendar.lastSyncedAt ? `Cập nhật lịch: ${new Date(calendar.lastSyncedAt).toLocaleString("vi-VN")}` : undefined}
            pendingLabel={data.calendar.connected && !calendar.reconnectRequired ? "Đang tải lịch…" : "Đang kết nối…"}
            disabled={!data.calendar.configured}
            onClick={() =>
              data.calendar.connected && !calendar.reconnectRequired
                ? void calendar.reload()
                : run(async () => {
                    const result = await getGoogleCalendarConnectUrlAction();
                    window.location.assign(result.url);
                  })
            }
            className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500 disabled:cursor-not-allowed"
          >
            {data.calendar.connected && !calendar.reconnectRequired ? (
              <>
                <RefreshCw className="h-4 w-4" /> Tải lại lịch
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" /> {calendar.reconnectRequired ? "Kết nối lại Google Calendar" : "Kết nối Google Calendar"}
              </>
            )}
          </AsyncActionButton>
          {!data.calendar.connected && !data.calendar.configured && (
            <p className="mt-2 text-xs text-slate-500">Kết nối Google Calendar chưa sẵn sàng. Bạn vẫn dùng được lịch công việc.</p>
          )}
      </PersonalWorkFloatingPanel>}
      {categoryManagerOpen && <PersonalWorkCategoryManager categories={data.categories} canManageDefaults={data.canManageDefaultCategories} onClose={() => setCategoryManagerOpen(false)} />}

      <section hidden={listOnly} className={listOnly ? "hidden" : "border-b border-slate-100 pb-4"}>
        <form
          className="flex h-full min-w-0 flex-col justify-center px-1"
          onSubmit={(event) => {
            event.preventDefault();
            const nextTitle = title.trim();
            if (!nextTitle) {
              setMessageIsError(true);
                setMessage("Vui lòng nhập nội dung công việc cần làm");
              return;
            }
            run(
              async () => {
                const created = await createPersonalWorkAction({
                  title: nextTitle,
                  reminderMinutes:creatingContinuous?null:reminderMinutes,
                    tags: creatingContinuous ? [] : parsePersonalWorkTags(newTags),
                  domain: creatingEvent ? "GENERAL" : newDomain,
                  categoryKey: creatingEvent ? "GENERAL" : newCategoryKey,
                  workType,
                  targets: creatingEvent ? [] : selectedTargets,
                  ...(!creatingContinuous&&dueAt ? personalItemScheduleInput(dueAt, quickStartTime, quickEndTime, estimatedDays,isPersonalEvent(workType)) : { dueAt: null, scheduledEndAt: null }),
                  estimatedDays:creatingContinuous?1:estimatedDays,
                });
                if (data.calendar.connected&&!creatingContinuous) syncCreatedCalendarTask({id:created.id,title:nextTitle});
              },
              isPersonalEvent(workType) ? "Đã thêm sự kiện" : "Đã thêm công việc",
              () => {
                setTitle("");
                setEstimatedDays(1);
                setNewTags("");
                setTargetQuery("");
                setTargetResults([]);
                setSelectedTargets([]);
              },
            );
          }}
        >
          <AdminViewTabs
            label="Kiểu mục"
            value={creatingContinuous?"CONTINUOUS":creatingEvent ? "EVENT" : "TASK"}
            items={[{ value: "TASK", label: "Công việc" }, { value: "EVENT", label: "Sự kiện" },{value:"CONTINUOUS",label:"Duy trì"}]}
            onValueChange={value => setWorkType(value === "CONTINUOUS"?"CONTINUOUS":value === "EVENT" ? "EVENT" : PERSONAL_WORK_TYPES[newDomain][0].key)}
            className="mb-2 max-w-sm"
          />
          <div className={createStyles.toolbar}>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label={creatingContinuous?"Tên việc duy trì":creatingEvent ? "Tên sự kiện" : "Tên công việc"}
              placeholder={creatingContinuous?"Việc cần duy trì...":creatingEvent?"Tên sự kiện...":"Việc cần làm..."}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {!creatingEvent && (
            <select
              aria-label="Nhóm công việc"
              value={newCategoryKey}
              onChange={(e) => { setNewCategoryKey(e.target.value); changeDomain(data.categories.find(c => c.key === e.target.value)?.domain || "GENERAL"); }}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              {data.categories.filter(item => !item.isDefault || quickCategoryKeys.has(item.key)).map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            )}
            {!creatingContinuous&&<>
            <input
              type="date"
              aria-label="Ngày dự kiến"
              required={creatingEvent}
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm"
            />

            <PersonalWorkTimeFields endOptional compact start={quickStartTime} end={quickEndTime} onChange={(start, end) => { setQuickStartTime(start); setQuickEndTime(end); }} />
            </>}
            {!creatingContinuous && <AdminButton ref={quickOptionsTrigger} iconOnly variant="quiet" density="compact" type="button" aria-label="Tùy chọn tạo việc" title="Tùy chọn tạo việc" aria-expanded={quickOptionsOpen} onClick={()=>setQuickOptionsOpen(open=>!open)}><Settings2 className="h-4 w-4"/>{(estimatedDays!==1||reminderMinutes!==0||newTags.trim())&&<span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-label="Đã chỉnh tùy chọn"/>}</AdminButton>}
            <AdminButton variant="primary"
              type="submit"
              disabled={pending}
              className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {creatingContinuous?"Thêm việc duy trì":creatingEvent?"Thêm sự kiện":"Thêm việc"}
            </AdminButton>
          </div>
          {quickOptionsOpen && !creatingContinuous && <PersonalWorkFloatingPanel anchor={quickOptionsTrigger.current} onClose={closeQuickOptions} label="Tùy chọn tạo việc" className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <div className="mb-3 flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-slate-950">Tùy chọn tạo việc</h3><AdminButton variant="quiet" density="compact" type="button" onClick={()=>{closeQuickOptions();quickOptionsTrigger.current?.focus();}}>Xong</AdminButton></div>
            <div className="space-y-3">
              {!creatingContinuous&&<><label className="flex items-center justify-between gap-3 text-xs text-slate-600">
                Số ngày dự kiến
                <input type="number" min={1} max={365} value={estimatedDays}
                  onChange={event => setEstimatedDays(Number(event.target.value) || 1)}
                  className="h-9 w-20 rounded-lg border border-slate-200 px-2" />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs text-slate-600">Nhắc lịch
                <select aria-label="Nhắc lịch" className="h-9 w-32 rounded-lg border border-slate-200 px-2" value={reminderMinutes === null ? "off" : reminderMinutes} onChange={e=>setReminderMinutes(e.target.value==="off"?null:Number(e.target.value))}>
                  <option value="off">Không nhắc</option><option value="0">Đúng giờ</option>
                  {[10,15,30,60].map(m=><option key={m} value={m}>Trước {m} phút</option>)}
                </select>
              </label>
              </>}<PersonalWorkTagsField allowCodex={!creatingEvent&&!creatingContinuous} value={newTags} onChange={setNewTags} configuration={data.codex} />
            </div>
          </PersonalWorkFloatingPanel>}
          {!isContinuousWork(workType)&&!isPersonalEvent(workType) && domainTargets[newDomain].length > 0 && (
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
                      <AdminButton variant="contextual"
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
                      </AdminButton>
                    ))}
                  </div>
                )}
                {selectedTargets.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedTargets.map((target) => (
                      <AdminButton variant="secondary" density="compact"
                        type="button"
                        key={`${target.type}:${target.id}`}
                        onClick={() => setSelectedTargets((current) => current.filter((item) => item.type !== target.type || item.id !== target.id))}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-rose-50 hover:text-rose-700"
                      >
                        {target.label} ×
                      </AdminButton>
                    ))}
                  </div>
                )}
                  </label>
                  <AdminButton variant="secondary"
                type="button"
                disabled={pending || !targetType}
                onClick={searchTargets}
                className="mt-5 h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Tìm
                  </AdminButton>
                </>
              )}
            </div>
          )}
        </form>


      </section>

      {message && !(editingItem && messageIsError) && (
        <div role={messageIsError ? "alert" : "status"} className={messageIsError ? "rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" : "rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"}>{message}</div>
      )}
      {Object.values(calendarSyncFailures).map(task => (
        <div key={task.id} role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <span>Đã lưu “{task.title}”. Chưa đồng bộ Google Calendar.</span>
          <AsyncActionButton variant="secondary" type="button" pending={calendarSyncMutation.isPending(`calendar-sync:${task.id}`)} pendingLabel="Đang đồng bộ…" onClick={() => syncCreatedCalendarTask(task)} className="rounded-md px-2 py-1 font-semibold hover:bg-amber-100">Thử đồng bộ lại</AsyncActionButton>
        </div>
      ))}

      <div
        className={`grid items-start gap-5 ${calendarOpen && !listOnly ? "xl:grid-cols-[minmax(340px,0.9fr)_minmax(420px,1.1fr)]" : "grid-cols-1"}`}
      >
        {calendarOpen && !listOnly && (
          <section aria-label="Lịch công việc" id="personal-google-calendar-agenda" className="order-2 min-w-0 bg-white xl:border-l xl:border-slate-100 xl:pl-5">
            <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-2">
              <div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Màu nền theo nhóm · Sọc cam: quá hạn · Gạch ngang: đã xong.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AdminButton iconOnly variant="quiet" density="compact"
                  type="button"
                  onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                  aria-label="Tháng trước"
                  className="text-slate-500"
                >
                  <ChevronLeft className="h-4 w-4" />
                </AdminButton>
                <p className="min-w-32 text-center text-sm font-semibold capitalize text-slate-800">
                  {new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(calendarCursor)}
                </p>
                <AdminButton iconOnly variant="quiet" density="compact"
                  type="button"
                  onClick={() => setCalendarCursor((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                  aria-label="Tháng sau"
                  className="text-slate-500"
                >
                  <ChevronRight className="h-4 w-4" />
                </AdminButton>
                <AdminButton variant="quiet" density="compact"
                  type="button"
                  onClick={() => {
                    const date = new Date();
                    setCalendarCursor(new Date(date.getFullYear(), date.getMonth(), 1));
                  }}
                  className="text-xs text-slate-600"
                >
                  Hôm nay
                </AdminButton>
              </div>
            </div>
            {calendar.error ? (
              <div role="status" className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {calendar.error}
              </div>
            ) : null}
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <div className="min-w-0">
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
                          className={`min-h-20 cursor-pointer border-b border-r border-slate-100 p-2 transition-colors hover:bg-blue-50/30 ${outsideMonth ? "bg-slate-50/50" : "bg-white"} ${isToday ? "relative z-10 !bg-blue-50/40 ring-2 ring-inset ring-blue-500/70" : ""}`}
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
                                linkedTask && !isPersonalEvent(linkedTask.workType) &&
                                  linkedTask.status !== "DONE" &&
                                  isPastDueDate(linkedTask.scheduledEndAt || linkedTask.dueAt, now),
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
                                <AdminButton variant="contextual" density="compact"
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
                                </AdminButton>
                                </PersonalCalendarPreview>
                              );
                            })}
                            {dayEvents.length > 3 && (
                              <AdminButton variant="quiet" density="compact" type="button" aria-label={`Xem tất cả ${dayEvents.length} lịch ngày ${key}`} onClick={(event) => {event.stopPropagation();setSelectedDay(key);}} className="rounded px-1 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">+{dayEvents.length - 3} lịch</AdminButton>
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

        <section className={`${listStyles.pane} order-1 flex min-h-0 flex-col bg-transparent`}>
          {listOnly && <div className="flex min-w-0 flex-wrap items-center justify-between gap-2"><PersonalWorkListToolbar hideViews={!listOnly} view={view} onView={setView} counts={viewCounts} scope={scope} onScope={setScope} domain={domain} onDomain={setDomain} categories={filterCategories} onManage={() => setCategoryManagerOpen(true)} />{mediaMergeAction}</div>}
          <div role="list" aria-label="Công việc" tabIndex={0} className={listStyles.listViewport}>
            {items.length ? (
              items.map((item) => {
                const late = !isContinuousWork(item.workType) && !isPersonalEvent(item.workType) && item.status !== "DONE" && isPastDueDate(item.scheduledEndAt || item.dueAt, now);
                return <PersonalWorkListRow key={item.id} item={item} now={now} showDate={view !== "TODAY"} late={item.status!=="CANCELLED"&&late}
                  scheduleLabel={dueLabel(item.dueAt, personalEventTiming(item).timed)} pending={pending || completionMutation.isPending(`complete:${item.id}`)} completionPending={completionMutation.isPending(`complete:${item.id}`)} justCompleted={Boolean(recentCompletions[item.id])} onOpen={() => openTaskEdit(item)}
                  onComplete={() => item.progressMode === "CHECKLIST" && item.status !== "DONE" ? openTaskEdit(item) : completeWork(item)} />;
              })
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <Circle className="h-8 w-8 text-slate-200" />
                <p className="mt-3 text-sm font-medium text-slate-600">{data.pagination && paged.loading ? "Đang tải công việc…" : data.pagination && paged.error ? "Chưa tải được danh sách" : "Không có công việc trong nhóm này"}</p>
              </div>
            )}
            {data.pagination && <div ref={paged.sentinel} className="flex min-h-10 flex-wrap items-center justify-center gap-2 py-3 text-xs text-slate-500" aria-live="polite">
              {paged.loading ? <span role="status">Đang tải thêm công việc…</span> : paged.error ? <><span role="alert">{paged.error}</span><AdminButton variant="quiet" density="compact" type="button" onClick={paged.retry}>Thử lại</AdminButton></> : paged.hasMore ? <AdminButton variant="quiet" density="compact" type="button" onClick={paged.retry}>Tải thêm</AdminButton> : items.length > 0 ? <span>Đã hiển thị {items.length} công việc</span> : null}
            </div>}
          </div>
        </section>
      </div>
      {detailLoading && <p role="status" className="text-xs text-slate-500">Đang mở chi tiết công việc…</p>}

      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 backdrop-blur-[1px] sm:p-4"
          onMouseDown={() => {if (!pending && !completionMutation.hasPending && !checklistMutation.hasPending) setEditingItem(null);}}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="personal-task-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              if(editingItem.status==="CANCELLED" || editingItem.checklistOnly || editingItem.access === "VIEWER" || pending || completionMutation.hasPending || checklistMutation.hasPending)return;
              const nextTitle = editTitle.trim();
              if (!nextTitle) {
                setMessageIsError(true);
                setMessage("Vui lòng nhập nội dung công việc cần làm");
                return;
              }
              let editedSchedule;
              try {
                if (!editDueAt && (editStartTime || editEndTime)) throw new Error("Vui lòng chọn ngày bắt đầu");
                editedSchedule = editDueAt ? personalItemScheduleInput(editDueAt, editStartTime, editEndTime, editEstimatedDays,isPersonalEvent(editWorkType)) : { dueAt: null, scheduledEndAt: null };
                setEditScheduleError(null);
              } catch (error) {
                setScheduleExpanded(true);
                setEditScheduleError(error instanceof Error ? error.message : "Thời gian không hợp lệ");
                return;
              }
              run(
                async () => {
                  const result = await updatePersonalWorkAction({
                    id: editingItem.id,
                    title: nextTitle,
                    reminderMinutes: editReminder,
                    note: editNote,
                    domain: editDomain,
                    categoryKey: editCategoryKey,
                    workType: editWorkType,
                    tags: parsePersonalWorkTags(editTags),
                    ...editedSchedule,
                    estimatedDays: editEstimatedDays,
                    targets: editTargets,
                    updateBody: editUpdateBody,
                    updateChecklistItemId: editUpdateBody.trim() ? updateChecklistId || null : undefined,
                  });
                  rememberCalendarSave(editingItem, result);
                  if (editingItem.access === "OWNER")
                    await replacePersonalWorkSharesAction({
                      taskItemId: editingItem.id,
                      shares: editShares.map((share) => ({ userId: share.user.id, accessLevel: share.accessLevel })),
                    });
                  return result;
                },
                personalWorkSavedMessage,
                () => setEditingItem(null),
              );
            }}
            className="h-[100dvh] w-full max-w-2xl overflow-y-auto overscroll-contain bg-white px-4 pb-5 sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:px-5 sm:shadow-2xl"
          >
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <AdminButton variant="contextual" type="button" disabled={pending || completionMutation.hasPending || checklistMutation.hasPending} onClick={() => setEditingItem(null)} className="min-h-11 text-sm font-semibold text-violet-700">← Danh sách công việc</AdminButton>
              <div>
                <p className="font-mono text-xs text-slate-600">{personalWorkCode(editingItem.id, editingItem.personalWorkNumber, editingItem.workType)}</p>
                <h2 id="personal-task-detail-title" className="mt-1 text-lg font-bold leading-6 text-slate-950">
                  {!editingItem.checklistOnly && editingItem.access !== "VIEWER" && editingItem.status!=="CANCELLED" ? <AdminButton variant="quiet" type="button" title="Sửa tên công việc" aria-label="Sửa tên công việc" onClick={() => setEditingTitle(value => !value)} className="max-w-full !p-0 text-left !text-lg !font-bold !leading-6">{editTitle || editingItem.title}</AdminButton> : editingItem.title}
                </h2>
                {editingTitle && <input autoFocus aria-label="Việc cần làm" value={editTitle} disabled={pending} onChange={event => setEditTitle(event.target.value)} onKeyDown={event => {if(event.key === "Enter"){event.preventDefault();setEditingTitle(false);}if(event.key === "Escape"){event.stopPropagation();setEditingTitle(false);}}} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"/>}
                <p className="mt-1 text-xs text-slate-500">{editingItem.status === "CANCELLED"?"Đã hủy":isContinuousWork(editingItem.workType)?"Đang duy trì":editingItem.status === "DONE" ? "Đã hoàn thành" : "Đang mở"}{!editingItem.checklistOnly && ` · ${editingItem.assignee?.name || editingItem.owner.name || editingItem.owner.email}`}</p>
                {editingItem.checklistOnly ? <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-700"><Share2 className="h-3.5 w-3.5 shrink-0"/>{editingItem.owner.name||editingItem.owner.email} chia sẻ đầu việc · {editingItem.status!=="CANCELLED"&&editingItem.checklist.some(e=>e.access === "EDITOR")?"Có thể cập nhật":"Chỉ xem"}</p> : calendarShareLabel(editingItem) && <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-700"><Share2 className="h-3.5 w-3.5 shrink-0" />{calendarShareLabel(editingItem)}</p>}
              </div>
            </div>
            {editingItem.status==="CANCELLED"&&<div role="status" className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><b>Đã hủy · Chỉ xem</b>{editingItem.cancelledAt&&<span> · {new Date(editingItem.cancelledAt).toLocaleString("vi-VN")}</span>}{editingItem.cancelledBy&&<span> · {editingItem.cancelledBy.name||editingItem.cancelledBy.email}</span>}{editingItem.cancellationReason&&<p className="mt-1 whitespace-pre-wrap break-words">{editingItem.cancellationReason}</p>}</div>}
            <fieldset disabled={editingItem.status==="CANCELLED"} className="contents">
            <div className="mt-5 space-y-4">
              {!!editingItem.mergeSources?.length&&!editingItem.checklistOnly&&<details className="text-xs text-slate-500"><AdminDisclosureSummary className="cursor-pointer">Gộp từ {editingItem.mergeSources.length} công việc</AdminDisclosureSummary><ul className="mt-2 space-y-1">{editingItem.mergeSources.map(source=><li key={source.id}>{source.title}</li>)}</ul><p className="mt-2">Lịch sử nguồn giữ nguyên bên dưới. Việc nguồn không được tính thêm vào báo cáo hoàn thành.</p></details>}
              {isContinuousWork(editingItem.workType)&&<p className="text-xs text-slate-500">Không có hạn chót hoặc xác nhận hoàn thành hằng ngày. Giữ một việc duy nhất và ghi nhận các cập nhật tại đây.</p>}
              {message && messageIsError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{message}</p>}
              {isPersonalEvent(editingItem.workType)?<p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800">Sự kiện · {personalEventLabel(editingItem.dueAt,editingItem.scheduledEndAt,new Date(),editingItem.estimatedDays)}. Không cần đánh dấu hoàn thành.</p>:<section className="space-y-2 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1">
                    <h3 className="min-w-0 text-sm font-semibold text-slate-900">Các đầu việc</h3>
                    {!editingItem.checklistLockedAt && editingItem.access !== "VIEWER" && editingItem.status !== "DONE" && editingItem.status !== "CANCELLED" && <AdminButton variant="quiet" iconOnly density="compact" type="button" aria-label={addingChecklist ? "Ẩn thêm đầu việc" : "Thêm đầu việc"} title="Thêm đầu việc" aria-expanded={addingChecklist} onClick={()=>setAddingChecklist(value=>!value)}><Plus className="h-4 w-4"/></AdminButton>}
                  </div>
                  {editingItem.checklist.length > 0 && <ProgressMetric appearance="quiet"
                    value={editingItem.progressPercent}
                    numerator={editingItem.checklist.filter((entry) => entry.isDone).length}
                    denominator={editingItem.checklist.length}
                    className="!w-28 shrink-0"
                    label={`Tiến độ ${editingItem.title}: ${editingItem.progressPercent}%`}
                  />}
                </div>
                {editingItem.checklist.length > 0 && (
                  <div className={`space-y-1 ${listStyles.checklistRows}`}>
                    {editingItem.checklist.map((entry) => (
                      <div key={entry.id} data-work-checklist-row={entry.id} className={listStyles.checklistRow}>
                        <AdminButton iconOnly variant="contextual" density="compact"
                          type="button"
                          disabled={completionMutation.hasPending || (entry.access ? entry.access === "VIEWER" : editingItem.access === "VIEWER") || Boolean(editingItem.checklistLockedAt) || checklistMutation.isPending(`toggle:${entry.id}`) || checklistMutation.isPending(`delete:${entry.id}`)}
                          aria-busy={checklistMutation.isPending(`toggle:${entry.id}`)}
                          aria-pressed={entry.isDone}
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
                          className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md after:absolute after:-inset-1.5 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <span aria-hidden="true" className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${entry.isDone ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-white text-transparent group-hover:border-blue-400"}`}>
                          {checklistMutation.isPending(`toggle:${entry.id}`) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          </span>
                        </AdminButton>
                        {checklistMutation.phase(`toggle:${entry.id}`) === "success" && <span className="sr-only" role="status">{entry.isDone ? "Đã hoàn thành đầu việc" : "Đã mở lại đầu việc"}</span>}
                        <div data-checklist-content className={listStyles.checklistContent}>
                        <PersonalChecklistTitle title={entry.title} done={entry.isDone} hideEditButton editing={editingChecklistTitleId===entry.id} onEditingChange={editing=>setEditingChecklistTitleId(editing?entry.id:null)}
                          disabled={(entry.access ? entry.access === "VIEWER" : editingItem.access === "VIEWER") || Boolean(editingItem.checklistLockedAt) || editingItem.status === "DONE" || editingItem.status === "CANCELLED" || checklistMutation.isPending(`toggle:${entry.id}`) || checklistMutation.isPending(`delete:${entry.id}`)}
                          onSave={async title=>{
                            await renamePersonalWorkChecklistItemAction({taskItemId:editingItem.id,checklistItemId:entry.id,title});
                            setEditingItem(current=>current&&current.id===editingItem.id?{...current,checklist:current.checklist.map(item=>item.id===entry.id?{...item,title}:item)}:current);
                            router.refresh();
                          }}/>
                        </div>
                        {entry.object?.type === "WATCH" && <span data-checklist-thumbnail className={listStyles.checklistThumbnail}><WorkObjectThumbnail object={entry.object} size={36}/></span>}
                        <div className={listStyles.checklistSecondary}>
                          <div className={listStyles.checklistTools}>
                            <div data-checklist-meta data-shared={Boolean(entry.sharedWith?.length)} className={listStyles.checklistMeta}>
                          {!entry.sharedWith?.length ? <><AdminUserAvatar user={editingItem.owner} size="xs"/><span>{editingItem.owner.name || editingItem.owner.email}</span></> : <AdminUserAvatarStack users={entry.sharedWith.map(share=>share.user)} max={2} size="xs"/>}
                        </div>
                            {editingItem.access === "OWNER" && <PersonalChecklistShare showCount={false} users={data.availableUsers} shares={entry.sharedWith??[]} onSave={async shares=>{
                          await replacePersonalChecklistSharesAction({taskItemId:editingItem.id,checklistItemId:entry.id,shares:shares.map(s=>({userId:s.user.id,accessLevel:s.accessLevel}))});
                          setEditingItem(current=>current?{...current,checklist:current.checklist.map(e=>e.id===entry.id?{...e,sharedWith:shares}:e)}:current);
                          router.refresh();
                        }}/>}
                          </div>
                          <div data-checklist-actions className={listStyles.checklistActions}>
                        {(entry.mediaContext || entry.object || (!editingItem.checklistOnly && editingItem.access !== "VIEWER") || (!(entry.access ? entry.access === "VIEWER" : editingItem.access === "VIEWER") && !editingItem.checklistLockedAt)) && <AdminRowActionMenu
                          label={`Thêm thao tác cho ${entry.title}`} status={null} iconOnly layer="dialogPopover" triggerIcon={<MoreHorizontal className="h-4 w-4"/>}
                          disabled={completionMutation.hasPending || checklistMutation.isPending(`delete:${entry.id}`) || checklistMutation.isPending(`toggle:${entry.id}`)}
                          actions={[
                            ...(!editingItem.checklistOnly && editingItem.access !== "VIEWER" ? [{key:"update",label:`Cập nhật ${entry.title}`,onSelect:()=>{setUpdateChecklistId(entry.id);updateComposerRef.current?.focus();updateComposerRef.current?.scrollIntoView({block:"nearest"});}}] : []),
                            ...(entry.mediaContext ? [{key:"media",label:"Mở media",onSelect:()=>router.push(entry.mediaContext!.href)}] : entry.object ? [{key:"record",label:"Xem liên kết",onSelect:()=>router.push(entry.object!.href)}] : []),
                            ...(!(entry.access ? entry.access === "VIEWER" : editingItem.access === "VIEWER") && !editingItem.checklistLockedAt ? [
                            {key:"edit",label:`Sửa ${entry.title}`,disabled:editingItem.status==="DONE"||editingItem.status==="CANCELLED",onSelect:()=>setEditingChecklistTitleId(entry.id)},
                            {key:"delete",label:`Xóa ${entry.title}`,onSelect:()=>{
                              const snapshot=editingItem;
                              void checklistMutation.run({
                                key:`delete:${entry.id}`,
                                optimistic:()=>{setOptimisticChecklist(editingItem.checklist.filter(item=>item.id!==entry.id));return snapshot;},
                                action:()=>deletePersonalWorkChecklistItemAction({taskItemId:editingItem.id,checklistItemId:entry.id}),
                                rollback:previous=>setEditingItem(previous),onSuccess:()=>router.refresh(),
                              });
                            }},
                            ] : []),
                          ]}/>}

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {addingChecklist && !editingItem.checklistLockedAt && editingItem.access !== "VIEWER" && editingItem.status !== "DONE" && editingItem.status !== "CANCELLED" && (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      aria-label="Tên đầu việc mới"
                      onKeyDown={event=>{if(event.key === "Escape"){event.preventDefault();event.stopPropagation();setAddingChecklist(false);}}}
                      value={newChecklistTitle}
                      maxLength={500}
                      onChange={(event) => setNewChecklistTitle(event.target.value)}
                      placeholder="Thêm đầu việc mới..."
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <AsyncActionButton variant="quiet"
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
                            setAddingChecklist(false);
                            setEditingItem((current) => current ? {
                              ...current,
                              checklist: current.checklist.map((item) => item.id === temporaryId ? result.item : item),
                            } : current);
                            router.refresh();
                          },
                        });
                      }}
                      className="px-2 text-sm font-medium text-slate-600 disabled:opacity-50"
                    >
                      Thêm
                    </AsyncActionButton>
                  </div>
                )}
                {editingItem.checklistLockedAt ? (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    Đã xác nhận hoàn thành. Danh sách đầu việc đã được khóa.
                  </p>
                ) : !isContinuousWork(editingItem.workType) && editingItem.checklist.length > 0 && editingItem.checklist.every((item) => item.isDone) && editingItem.access !== "VIEWER" ? (
                  <AsyncActionButton variant="secondary"
                    type="button"
                    pending={completionMutation.isPending(`complete:${editingItem.id}`)}
                    pendingLabel="Đang hoàn thành..."
                    disabled={checklistMutation.hasPending || pending}
                    onClick={async () => {
                      const confirmed = await appDialog.confirm({
                        title: "Xác nhận hoàn thành công việc?",
                        message: "Sau bước này bạn sẽ không thể thêm, xóa hoặc đổi trạng thái đầu việc.",
                        confirmText: "Xác nhận hoàn thành",
                        tone: "success",
                      });
                      if (!confirmed) return;
                      completeWork(editingItem, true);
                    }}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Xác nhận hoàn thành công việc
                  </AsyncActionButton>
                ) : null}
              </section>}
              {!editingItem.checklistOnly && <>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="personal-work-update" className="text-xs font-semibold text-slate-600">Nội dung cập nhật</label>
                  {editingItem.checklist.length > 0 && <label className="flex min-w-0 items-center gap-1 text-xs text-slate-500">Cập nhật cho:
                    <select aria-label="Cập nhật cho" value={updateChecklistId} disabled={editingItem.access === "VIEWER"} onChange={event=>setUpdateChecklistId(event.target.value)} className="h-8 max-w-56 rounded border-0 bg-transparent px-1 text-xs text-slate-700">
                      <option value="">Công việc chung</option>
                      {editingItem.checklist.map(entry=><option key={entry.id} value={entry.id}>{entry.title}</option>)}
                    </select>
                  </label>}
                </div>
                <textarea
                  id="personal-work-update"
                  ref={updateComposerRef}
                  value={editUpdateBody}
                  disabled={editingItem.access === "VIEWER"}
                  onChange={(event) => setEditUpdateBody(event.target.value)}
                  rows={2}
                  placeholder="Ghi lại kết quả, vấn đề hoặc bước tiếp theo..."
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <span className="block text-[11px] text-slate-400">Mỗi lần lưu sẽ tạo một mốc mới trong lịch sử cập nhật, không tự đánh dấu hoàn thành.</span>
              </div>
              {!isContinuousWork(editWorkType)&&<details open={scheduleExpanded} onToggle={event => setScheduleExpanded(event.currentTarget.open)} data-work-disclosure="schedule" className="border-t border-slate-100 pt-3">
                <AdminDisclosureSummary className="cursor-pointer text-xs font-medium text-slate-600">Lịch · {editDueAt ? `${editDueAt.split("-").reverse().join("/")}${editStartTime ? ` · ${editStartTime}` : " · Cả ngày"}` : "Chưa có lịch"}</AdminDisclosureSummary>
                <div className="mt-3 space-y-3">
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
              <label className="flex items-center gap-2 text-xs text-slate-600">Nhắc lịch
                <select aria-label="Nhắc lịch" disabled={editingItem.access === "VIEWER"} value={editReminder === null ? "off" : editReminder} onChange={e=>setEditReminder(e.target.value==="off"?null:Number(e.target.value))} className="h-9 rounded-lg border border-slate-200 px-2">
                  <option value="off">Không nhắc</option><option value="0">Đúng giờ</option>{[10,15,30,60].map(m=><option key={m} value={m}>Trước {m} phút</option>)}
                </select>
              </label>
              <PersonalWorkTimeFields endOptional start={editStartTime} end={editEndTime} disabled={editingItem.access === "VIEWER"} onChange={(start, end) => { setEditStartTime(start); setEditEndTime(end); }} />
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
              {editingItem.calendar.htmlLink && <a href={editingItem.calendar.htmlLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline">Mở trong Google <ExternalLink className="h-3.5 w-3.5" /></a>}
              {data.calendar.connected && !editingItem.calendar.synced && editingItem.access !== "VIEWER" && <AsyncActionButton variant="quiet" density="compact" type="button" pending={calendarSyncMutation.isPending(`calendar-sync:${editingItem.id}`)} pendingLabel="Đang đồng bộ…" onClick={() => syncCreatedCalendarTask(editingItem)} className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Đồng bộ Google Calendar</AsyncActionButton>}
                </div>
              </details>}
              <details key={editingItem.id} data-work-disclosure="settings" className="border-t border-slate-100 pt-3">
                <AdminDisclosureSummary className="cursor-pointer text-xs font-medium text-slate-600">Thông tin khác · {editCategories.find(category => category.key === editCategoryKey)?.label}</AdminDisclosureSummary>
                <div className="mt-3 space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Nhóm công việc</span>
                  <select
                    aria-label="Nhóm công việc"
                    value={editCategoryKey}
                    disabled={editingItem.access === "VIEWER"}
                    onChange={(event) => {
                      setEditCategoryKey(event.target.value);
                      const nextDomain = editCategories.find(c => c.key === event.target.value)?.domain || "GENERAL";
                      setEditDomain(nextDomain);
                      setEditWorkType(previous=>isContinuousWork(previous)?"CONTINUOUS":isPersonalEvent(previous)?"EVENT":PERSONAL_WORK_TYPES[nextDomain][0].key);
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
                </label>              {!isContinuousWork(editWorkType)&&!isPersonalEvent(editWorkType) && editCategories.find(category => category.key === editCategoryKey)?.isDefault && PERSONAL_WORK_TYPES[editDomain].length > 1 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Loại công việc</span>
                  <select aria-label="Loại công việc" value={editWorkType} disabled={editingItem.access === "VIEWER"} onChange={event => setEditWorkType(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {PERSONAL_WORK_TYPES[editDomain].map(type => <option key={type.key} value={type.key}>{type.label}</option>)}
                  </select>
                </label>
              )}
              <details className="border-b border-slate-100 pb-2">
                <AdminDisclosureSummary className="w-fit cursor-pointer text-xs text-slate-500">Thẻ công việc</AdminDisclosureSummary>
                <div className="pt-2"><PersonalWorkTagsField allowCodex={!isContinuousWork(editWorkType)&&!isPersonalEvent(editWorkType)} value={editTags} onChange={setEditTags} disabled={editingItem.access === "VIEWER"} configuration={data.codex} /></div>
              </details>
              {domainTargets[editDomain].length > 0 && (
                <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-600">Liên kết nghiệp vụ</span>
                    <span className="text-[11px] text-slate-400">Có thể chọn nhiều đối tượng</span>
                  </div>
                  {editTargets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {editTargets.map((target) => (
                        <AdminButton variant="quiet" density="compact"
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
                        </AdminButton>
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
                              <AdminButton variant="contextual"
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
                              </AdminButton>
                            ))}
                          </div>
                        )}
                      </div>
                      <AdminButton variant="quiet" density="compact"
                        type="button"
                        disabled={pending || !editTargetType}
                        onClick={searchEditTargets}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                      >
                        Tìm
                      </AdminButton>
                    </div>
                  )}
                </div>
              )}
                {editingItem.access === "OWNER" && <PersonalWorkShareEditor users={data.availableUsers} shares={editShares} onChange={setEditShares} />}
                {!isContinuousWork(editingItem.workType)&&<PersonalCodexPanel item={editingItem} configuration={data.codex} />}


                </div>
              </details>
              </>}
            </div>
            </fieldset>
            {!editingItem.checklistOnly && <WorkImageAttachments key={editingItem.id} workId={editingItem.id} />}
            {editingItem.activities.length > 0 && (
              <section className="mt-4 border-t border-slate-100 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lịch sử cập nhật
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {editingItem.activities.length} mốc
                  </span>
                </div>
                <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
                  {editingItem.activities
                    .slice(0, historyExpanded ? undefined : 2)
                    .map((activity) => (
                      <article key={activity.id} className="rounded-lg bg-slate-50 px-3 py-2">
                        <p className="text-xs font-semibold text-slate-700">{activity.title}</p>
                        {activity.body && <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-700">{activity.body}</p>}
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
                {editingItem.activities.length > 2 && <AdminButton variant="quiet" density="compact" type="button" onClick={() => setHistoryExpanded(value => !value)}>{historyExpanded ? "Thu gọn lịch sử" : `Xem thêm ${editingItem.activities.length - 2} cập nhật`}</AdminButton>}
              </section>
            )}
            {editingItem.access === "VIEWER" && !editingItem.checklistOnly && (
              <p className="mt-4 rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">
                Bạn đang xem công việc được chia sẻ ở chế độ chỉ xem.
              </p>
            )}
            <div className="sticky bottom-0 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-white py-3">
              <PersonalWorkLifecycleActions key={editingItem.id} item={editingItem} disabled={pending||completionMutation.hasPending||checklistMutation.hasPending} onSaved={text=>{setMessageIsError(false);setMessage(text);setEditingItem(null);setView(editingItem.status==="CANCELLED"?"ALL":"CANCELLED");}}/>
              <div className="ml-auto flex flex-wrap justify-end gap-2">
                {!editingItem.checklistOnly && editingItem.status !== "CANCELLED" && !isContinuousWork(editingItem.workType) && !isPersonalEvent(editingItem.workType) && editingItem.progressMode !== "CHECKLIST" && editingItem.access !== "VIEWER" && <AsyncActionButton variant="quiet" density="compact" type="button" pending={completionMutation.isPending(`complete:${editingItem.id}`)} pendingLabel="Đang lưu…" disabled={pending} onClick={() => completeWork(editingItem)}><Check className="h-4 w-4"/>{editingItem.status === "DONE" ? "Mở lại" : "Hoàn thành"}</AsyncActionButton>}
                <AdminButton variant="quiet" density="compact"
                  type="button"
                  disabled={pending || completionMutation.hasPending || checklistMutation.hasPending}
                  onClick={() => setEditingItem(null)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </AdminButton>
                {!editingItem.checklistOnly && editingItem.status!=="CANCELLED" && <AdminButton variant="primary"
                  type="submit"
                  disabled={pending || completionMutation.hasPending || checklistMutation.hasPending || editingItem.access === "VIEWER"}
                  className="rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {pending ? "Đang lưu..." : "Lưu thay đổi"}
                </AdminButton>}
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
              <AdminButton variant="secondary" autoFocus type="button" aria-label="Đóng danh sách lịch trong ngày" onClick={() => setSelectedDay(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><X className="h-4 w-4" /></AdminButton>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto px-3 pb-3">
              {(eventsByDay.get(selectedDay) || []).map(event => {
                const item = event.linkedTaskItemId ? itemMap.get(event.linkedTaskItemId) : undefined;
                const share = item ? calendarShareLabel(item) : null;
                return <PersonalCalendarPreview key={event.id} event={event} item={item}><AdminButton variant="contextual" type="button" data-task-item-id={item?.id} onClick={() => openCalendarEvent(event)} className="group flex min-h-11 w-full items-center gap-2.5 rounded-md px-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{backgroundColor:item?.category.color || "#0ea5e9"}} />
                  {!event.allDay && <span className="shrink-0 text-[11px] tabular-nums text-slate-400">{scheduleTime(event.startAt)}</span>}
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${item?.status === "DONE" ? "text-slate-400 line-through" : "text-slate-800"}`}>{event.title}</span>
                  {share && <Share2 aria-label={share} className="h-3 w-3 shrink-0 text-violet-500" />}
                  <span className="max-w-20 shrink-0 truncate text-[10px] text-slate-400">{item?.category.label || "Google"}</span>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500" />
                </AdminButton></PersonalCalendarPreview>;
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
        onSaved={updated => { calendar.updateEvent(updated); setSelectedCalendarEvent(null); setMessageIsError(false); setMessage("Đã lưu thay đổi lên Google Calendar"); void calendar.reload(); }}
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
                schedule = personalItemScheduleInput(calendarCreateDueAt, calendarStartTime, calendarEndTime, calendarCreateEstimatedDays,isPersonalEvent(calendarWorkType));
              } catch (error) {
                setCalendarCreateError(error instanceof Error ? error.message : "Thời gian không hợp lệ");
                return;
              }
              setCalendarCreateError(null);
              void calendarCreateMutation.run({
                key: "calendar:create",
                action: () => createPersonalWorkAction({
                  title: nextTitle,
                  tags: parsePersonalWorkTags(calendarTags),
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
                <h2 id="calendar-create-title" className="mt-1 text-xl font-bold text-slate-950">{isPersonalEvent(calendarWorkType)?"Thêm sự kiện":"Thêm công việc"}</h2>
              </div>
              <AdminButton variant="secondary"
                type="button"
                aria-label="Đóng"
                disabled={calendarCreating}
                onClick={() => setCalendarCreateOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </AdminButton>
            </div>
            <fieldset disabled={calendarCreating} className="mt-5 min-w-0 space-y-4">
              <PersonalWorkKindField event={isPersonalEvent(calendarWorkType)} onChange={event=>setCalendarWorkType(event?"EVENT":PERSONAL_WORK_TYPES[calendarCreateDomain][0].key)}/>
              <PersonalWorkTagsField allowCodex={!isPersonalEvent(calendarWorkType)} value={calendarTags} onChange={setCalendarTags} configuration={data.codex} />
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">{isPersonalEvent(calendarWorkType)?"Tên sự kiện":"Việc cần làm"}</span>
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
                      setCalendarWorkType(previous=>isContinuousWork(previous)?"CONTINUOUS":isPersonalEvent(previous)?"EVENT":PERSONAL_WORK_TYPES[nextDomain][0].key);
                    }}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  >
                    {data.categories.filter(item => !item.isDefault || quickCategoryKeys.has(item.key)).map((item) => (
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
              {!isPersonalEvent(calendarWorkType) && data.categories.find(category => category.key === calendarCategoryKey)?.isDefault && PERSONAL_WORK_TYPES[calendarCreateDomain].length > 1 && (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Loại công việc</span>
                  <select aria-label="Loại công việc" value={calendarWorkType} onChange={event => setCalendarWorkType(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {PERSONAL_WORK_TYPES[calendarCreateDomain].map(type => <option key={type.key} value={type.key}>{type.label}</option>)}
                  </select>
                </label>
              )}
              <PersonalWorkTimeFields endOptional start={calendarStartTime} end={calendarEndTime} onChange={(start, end) => { setCalendarStartTime(start); setCalendarEndTime(end); }} />
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
              <AdminButton variant="secondary"
                type="button"
                disabled={calendarCreating}
                onClick={() => setCalendarCreateOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </AdminButton>
              <AsyncActionButton variant="primary"
                type="submit"
                pending={calendarCreating}
                pendingLabel="Đang tạo…"
                className="w-40 rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {isPersonalEvent(calendarWorkType)?"Tạo sự kiện":"Tạo công việc"}
              </AsyncActionButton>
            </div>
          </form>
        </div>
      )}
    </PersonalWorkWorkspace>
  );
}
