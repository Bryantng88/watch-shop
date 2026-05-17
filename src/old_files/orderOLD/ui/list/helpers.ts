import type { OrderListCounts, OrderListItem, OrderViewKey } from "./types";

export const ORDER_SORT_OPTIONS = [
  { label: "Cập nhật ↓", value: "updatedDesc" },
  { label: "Cập nhật ↑", value: "updatedAsc" },
  { label: "Tổng tiền ↓", value: "totalDesc" },
  { label: "Tổng tiền ↑", value: "totalAsc" },
];

export const ORDER_PAGE_SIZE_OPTIONS = [
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

export function normalizeOrderView(value?: string | null): OrderViewKey {
  const v = String(value ?? "all").trim();

  const allowed: OrderViewKey[] = [
    "all",
    "pending",
    "need_action",
    "processing",
    "delivered",
    "completed",
    "cancelled",
  ];

  return allowed.includes(v as OrderViewKey) ? (v as OrderViewKey) : "all";
}

export function normalizeOrderSort(value?: string | null, fallback = "updatedDesc") {
  const v = String(value ?? "").trim();
  return v || fallback;
}

export function isOrderSelectable(_item: OrderListItem) {
  return true;
}

export function buildCounts(input: {
  counts?: OrderListCounts;
  currentView: OrderViewKey;
  total: number;
}): OrderListCounts {
  return {
    all: input.total,
    ...(input.counts ?? {}),
  };
}

export function formatMoney(value?: number | string | null) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "-";

  return `${new Intl.NumberFormat("vi-VN").format(n)} VND`;
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatOrderSource(item: OrderListItem) {
  const source = String(item.source ?? "").toUpperCase();

  if (item.sourceLabel) return item.sourceLabel;
  if (source === "WEB") return "Web";
  if (source === "WATCH_QUICK_ORDER") return "Tạo từ watch";
  if (source === "ADMIN" || source === "INTERNAL") return "Nội bộ";

  return "Nội bộ";
}

export function sourceTone(item: OrderListItem) {
  const source = String(item.source ?? "").toUpperCase();

  if (source === "WEB") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  if (source === "WATCH_QUICK_ORDER") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function orderStatusLabel(status?: string | null) {
  const s = String(status ?? "").toUpperCase();

  if (s === "DRAFT") return "Draft";
  if (s === "RESERVED") return "Đã giữ hàng";
  if (s === "POSTED") return "Đã xác nhận";
  if (s === "PAID") return "Đã thanh toán";
  if (s === "PENDING") return "Chờ xác minh";
  if (s === "PROCESSING") return "Đang xử lý";
  if (s === "SHIPPED" || s === "DELIVERED") return "Đã giao";
  if (s === "COMPLETED") return "Hoàn tất";
  if (s === "CANCELLED") return "Đã huỷ";

  return status || "-";
}

export function orderStatusTone(status?: string | null) {
  const s = String(status ?? "").toUpperCase();

  if (s === "DRAFT") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (s === "RESERVED" || s === "POSTED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (s === "PAID" || s === "COMPLETED" || s === "SHIPPED" || s === "DELIVERED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (s === "PROCESSING") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (s === "CANCELLED") return "bg-slate-100 text-slate-500 ring-slate-200";

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export function buildHref(
  pathname: string,
  sp: URLSearchParams,
  patch: Record<string, string | null | undefined>,
) {
  const next = new URLSearchParams(sp.toString());

  Object.entries(patch).forEach(([key, value]) => {
    if (!value) next.delete(key);
    else next.set(key, value);
  });

  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}