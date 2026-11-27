import {getAuthUserId} from "@/server/auth/auth-user-id";
import { getPersonalWorkPageData } from "./personal-work.service";
import { compareWorkList, matchesWorkList, workViewCounts, WORK_LIST_VIEWS, WORK_PAGE_SIZE, type WorkListQuery } from "../shared/work-list-query";
import type {PersonalWorkPageData} from "../shared/personal-work.types";

export async function getWorkListPage(input: WorkListQuery & {cursor?: string | null}, auth: unknown, preloaded?: PersonalWorkPageData) {
  if (!input || !WORK_LIST_VIEWS.includes(input.view) || !["ALL", "MINE", "SHARED"].includes(input.scope) || typeof input.domain !== "string" || input.domain.length > 160 || !/^\d{4}-\d{2}-\d{2}$/.test(input.day) || !Number.isFinite(Date.parse(input.day + "T00:00:00+07:00")) || input.cursor && !/^[\w:-]{1,160}$/.test(input.cursor)) throw new Error("Bộ lọc không hợp lệ.");
  // The index is owner/share projected before filtering. It carries calendar/count
  // fields only; history, object hydration and Codex runs are fetched for 30 IDs.
  const index = preloaded ?? await getPersonalWorkPageData(auth, {summary: true});
  if(index.currentUserId !== getAuthUserId(auth)) throw new Error("Ngữ cảnh người dùng không hợp lệ.");
  const rows = index.items.filter(item => matchesWorkList(item, input)).sort(compareWorkList);
  const position = input.cursor ? rows.findIndex(item => item.id === input.cursor) : -1;
  if (input.cursor && position < 0) return {items: [], nextCursor: null, restart: true, total: rows.length};
  const selected = rows.slice(position + 1, position + 1 + WORK_PAGE_SIZE);
  const details = selected.length ? await getPersonalWorkPageData(auth, {ids: selected.map(item => item.id), row: true, context: index}) : null;
  const byId = new Map(details?.items.map(item => [item.id, item]));
  return {items: selected.flatMap(item => {const detail = byId.get(item.id); return detail ? [detail] : [];}), nextCursor: position + 1 + WORK_PAGE_SIZE < rows.length ? selected.at(-1)!.id : null, restart: false, total: rows.length, counts: workViewCounts(index.items, input)};
}
