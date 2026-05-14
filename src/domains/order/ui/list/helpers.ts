import type { OrderListCounts, OrderListItem, OrderListSort, OrderViewKey } from "./types";
import { cx, fmtDate, fmtMoney, sourceLabel, verificationLabel } from "../order-ui.helpers";

export { cx, fmtDate, fmtMoney, sourceLabel, verificationLabel };

export const ORDER_LIST_VIEWS: Array<{ key: OrderViewKey; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "web_pending", label: "Chờ xác minh" },
  { key: "need_action", label: "Cần xử lý" },
  { key: "processing", label: "Đang xử lý" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã hủy" },
];

export const ORDER_SORT_OPTIONS: Array<{ value: OrderListSort; label: string }> = [
  { value: "updatedDesc", label: "Cập nhật ↓" },
  { value: "updatedAsc", label: "Cập nhật ↑" },
  { value: "createdDesc", label: "Tạo mới ↓" },
  { value: "createdAsc", label: "Tạo mới ↑" },
];

export const ORDER_PAGE_SIZE_OPTIONS = ["10", "20", "50"].map((value) => ({
  value,
  label: value,
}));

export function normalizeOrderView(value?: string | null): OrderViewKey {
  const found = ORDER_LIST_VIEWS.find((view) => view.key === value);
  return found?.key ?? "all";
}

export function normalizeOrderSort(value?: string | null): OrderListSort {
  return ORDER_SORT_OPTIONS.some((item) => item.value === value)
    ? (value as OrderListSort)
    : "updatedDesc";
}

export function buildHref(
  pathname: string,
  sp: URLSearchParams,
  patch: Record<string, string | null>,
) {
  const next = new URLSearchParams(sp.toString());

  Object.entries(patch).forEach(([key, value]) => {
    if (value == null || value === "") next.delete(key);
    else next.set(key, value);
  });

  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function buildCounts(input: {
  counts?: Partial<OrderListCounts>;
  currentView: OrderViewKey;
  total: number;
}): OrderListCounts {
  return {
    all: input.counts?.all ?? (input.currentView === "all" ? input.total : 0),
    web_pending:
      input.counts?.web_pending ??
      (input.currentView === "web_pending" ? input.total : 0),
    need_action:
      input.counts?.need_action ??
      (input.currentView === "need_action" ? input.total : 0),
    processing:
      input.counts?.processing ??
      (input.currentView === "processing" ? input.total : 0),
    delivered:
      input.counts?.delivered ??
      (input.currentView === "delivered" ? input.total : 0),
    completed:
      input.counts?.completed ??
      (input.currentView === "completed" ? input.total : 0),
    cancelled:
      input.counts?.cancelled ??
      (input.currentView === "cancelled" ? input.total : 0),
  };
}

export function isOrderSelectable(order: OrderListItem) {
  return order.status === "DRAFT" || order.status === "RESERVED";
}
