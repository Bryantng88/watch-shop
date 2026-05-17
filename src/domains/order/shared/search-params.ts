import type {
  OrderListSort,
  OrderProcessingSubFilter,
  OrderSearchInput,
  OrderViewKey,
} from "@/domains/order/server/shared";

function first(params: URLSearchParams, key: string) {
  return params.get(key) ?? "";
}

function toPositiveInt(value: string | null | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

const viewKeys = new Set<OrderViewKey>([
  "all",
  "pending",
  "need_action",
  "processing",
  "completed",
  "cancelled",
]);

const processingSubFilters = new Set<OrderProcessingSubFilter>([
  "",
  "awaiting_payment",
  "remaining_payment",
  "awaiting_shipment",
  "shipping",
  "delivered_remaining",
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
  const rawSubFilter = first(params, "subFilter") as OrderProcessingSubFilter;

  return {
    q: first(params, "q").trim() || undefined,
    view: viewKeys.has(rawView) ? rawView : "all",
    subFilter: processingSubFilters.has(rawSubFilter) ? rawSubFilter : "",
    sort: sortKeys.has(rawSort) ? rawSort : "updatedDesc",
    page: toPositiveInt(params.get("page"), 1),
    pageSize: Math.min(100, toPositiveInt(params.get("pageSize"), 20)),
  };
}
