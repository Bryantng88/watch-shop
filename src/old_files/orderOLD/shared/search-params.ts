import type {
  OrderListSort,
  OrderSearchInput,
  OrderViewKey,
} from "@/old_files/orderOLD/server/shared";

function first(params: URLSearchParams, key: string) {
  return params.get(key) ?? "";
}

function toPositiveInt(value: string | null | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

const viewKeys = new Set<OrderViewKey>([
  "all",
  "web_pending",
  "need_action",
  "processing",
  "delivered",
  "completed",
  "cancelled",
]);

const sortKeys = new Set<OrderListSort>([
  "updatedDesc",
  "updatedAsc",
  "createdDesc",
  "createdAsc",
]);

export function parseOrderSearchParams(params: URLSearchParams): OrderSearchInput {
  const rawView = first(params, "view") as OrderViewKey;
  const rawSort = first(params, "sort") as OrderListSort;

  return {
    q: first(params, "q").trim() || undefined,
    view: viewKeys.has(rawView) ? rawView : "all",
    sort: sortKeys.has(rawSort) ? rawSort : "updatedDesc",
    page: toPositiveInt(params.get("page"), 1),
    pageSize: Math.min(100, toPositiveInt(params.get("pageSize"), 20)),
  };
}
