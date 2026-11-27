import { isContinuousWork } from "./continuous-work";
import { isPersonalEvent } from "./personal-event";
import { personalDayBucket } from "./personal-work-day";
import type { PersonalWorkItem } from "./personal-work.types";

export const WORK_LIST_VIEWS = ["TODAY", "OVERDUE", "UPCOMING", "ALL", "EVENTS", "DONE", "CANCELLED"] as const;
export type WorkListView = typeof WORK_LIST_VIEWS[number];
export type WorkListQuery = { view: WorkListView; scope: "ALL" | "MINE" | "SHARED"; domain: string; day: string };
export const WORK_PAGE_SIZE = 30;
export function matchesWorkList(item: PersonalWorkItem, query: WorkListQuery) {
  if (query.scope === "MINE" && item.access !== "OWNER" && !item.assignedToMe && !item.checklistOnly) return false;
  if (query.scope === "SHARED" && item.access === "OWNER") return false;
  if (query.domain !== "ALL" && item.category.key !== query.domain) return false;
  if (query.view === "CANCELLED") return item.status === "CANCELLED";
  if (item.status === "CANCELLED") return false;
  if (isContinuousWork(item.workType)) return query.view === "TODAY" || query.view === "ALL";
  const event = isPersonalEvent(item.workType);
  if (query.view === "EVENTS") return event;
  if (query.view === "DONE") return !event && item.status === "DONE";
  if (item.status === "DONE") return false;
  const start = Date.parse(query.day + "T00:00:00+07:00"), end = start + 86400000;
  if (query.view === "TODAY" || query.view === "OVERDUE") return personalDayBucket({dueAt: item.dueAt ? new Date(item.dueAt) : null, scheduledEndAt: item.scheduledEndAt ? new Date(item.scheduledEndAt) : null, estimatedDays: item.estimatedDays, workTypeId: item.workType}, start, end) === query.view;
  if (query.view === "UPCOMING") return Boolean(item.dueAt && Date.parse(item.dueAt) >= end);
  return true;
}
export function compareWorkList(a: PersonalWorkItem, b: PersonalWorkItem) {
  return Number(isContinuousWork(b.workType)) - Number(isContinuousWork(a.workType)) ||
    (a.dueAt && b.dueAt ? Date.parse(a.dueAt) - Date.parse(b.dueAt) : a.dueAt ? -1 : b.dueAt ? 1 : 0) ||
    Date.parse(b.createdAt || b.updatedAt || "1970-01-01") - Date.parse(a.createdAt || a.updatedAt || "1970-01-01") || a.id.localeCompare(b.id);
}
export function workViewCounts(items: PersonalWorkItem[], query: Omit<WorkListQuery, "view">): Record<WorkListView, number> {
  return Object.fromEntries(WORK_LIST_VIEWS.map(view => [view, items.filter(item => matchesWorkList(item, {...query, view})).length])) as Record<WorkListView, number>;
}
