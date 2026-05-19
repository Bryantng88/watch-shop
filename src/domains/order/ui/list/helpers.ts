import type { OrderListCounts, OrderListItem, OrderProcessingSubFilter, OrderViewKey } from "./types";
import { ReserveType } from "@prisma/client";
import {
  isCodReserveType,
  isDepositReserveType,
  isFullPaymentReserveType,
  normalizeReserveType,
} from "@/domains/order/shared/order-reserve-type";
export const ORDER_SORT_OPTIONS = [
  { label: "Cập nhật ↓", value: "updatedDesc" },
  { label: "Cập nhật ↑", value: "updatedAsc" },
  { label: "Tạo mới ↓", value: "createdDesc" },
  { label: "Tạo mới ↑", value: "createdAsc" },
];

export const ORDER_PAGE_SIZE_OPTIONS = [
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

export function normalizeOrderView(value?: string | null): OrderViewKey {
  const v = String(value ?? "all").trim();
  const allowed: OrderViewKey[] = ["all", "pending", "need_action", "processing", "completed", "cancelled"];
  return allowed.includes(v as OrderViewKey) ? (v as OrderViewKey) : "all";
}

export function normalizeOrderProcessingSubFilter(value?: string | null): OrderProcessingSubFilter {
  const v = String(value ?? "").trim();
  const allowed: OrderProcessingSubFilter[] = ["", "awaiting_payment", "remaining_payment", "awaiting_shipment", "shipping", "delivered_remaining"];
  return allowed.includes(v as OrderProcessingSubFilter) ? (v as OrderProcessingSubFilter) : "";
}

export function normalizeOrderSort(value?: string | null, fallback = "updatedDesc") {
  const v = String(value ?? "").trim();
  return v || fallback;
}

export function isOrderSelectable(item: OrderListItem) {
  return ["DRAFT", "RESERVED"].includes(String(item.status ?? "").toUpperCase());
}

export function buildCounts(input: { counts?: OrderListCounts; currentView: OrderViewKey; total: number }): OrderListCounts {
  return { all: input.total, ...(input.counts ?? {}) };
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
  return "Nội bộ";
}

export function sourceTone(item: OrderListItem) {
  const source = String(item.source ?? "").toUpperCase();
  if (source === "WEB") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (source === "WATCH_QUICK_ORDER") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function orderStatusLabel(status?: string | null) {
  const s = String(status ?? "").toUpperCase();
  if (s === "DRAFT") return "Nháp";
  if (s === "POSTED") return "Đang xử lý";
  if (s === "PAID") return "Đã thu đủ";
  if (s === "PROCESSING") return "Đang xử lý";
  if (s === "SHIPPED") return "Đang giao";
  if (s === "COMPLETED") return "Hoàn tất";
  if (s === "CANCELLED") return "Đã huỷ";
  if (s === "RESERVED") return "Đang giữ";
  return status || "-";
}

export function orderStatusTone(status?: string | null) {
  const s = String(status ?? "").toUpperCase();
  if (s === "COMPLETED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (["POSTED", "PAID", "PROCESSING", "SHIPPED", "RESERVED"].includes(s)) return "bg-blue-50 text-blue-700 ring-blue-200";
  if (s === "CANCELLED") return "bg-slate-100 text-slate-500 ring-slate-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export function paymentLabel(value?: string | null, item?: OrderListItem) {
  const paid = Number(item?.depositPaid ?? 0);
  const remaining = Number(item?.remainingAmount ?? 0);
  const status = String(value ?? "").toUpperCase();
  if (status === "PAID") return "Đã thu đủ";
  if (paid > 0 && remaining > 0) return "Còn phải thu";
  return "Chờ thanh toán";
}

export function shipmentLabel(value?: string | null, item?: OrderListItem) {
  if (!item?.hasShipment) return "Không giao hàng";
  const status = String(value ?? "").toUpperCase();
  if (status === "DELIVERED") return "Đã giao";
  if (status === "SHIPPED") return "Đang giao";
  if (status === "READY") return "Sẵn sàng giao";
  if (status === "CANCELLED") return "Giao hàng hủy";
  return "Chờ giao";
}

export function buildHref(pathname: string, sp: URLSearchParams, patch: Record<string, string | null | undefined>) {
  const next = new URLSearchParams(sp.toString());
  Object.entries(patch).forEach(([key, value]) => {
    if (!value) next.delete(key);
    else next.set(key, value);
  });
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
export function isCompletedOrder(status?: string | null) {
  return String(status ?? "").toUpperCase() === "COMPLETED";
}

export function isCancelledOrder(status?: string | null) {
  return String(status ?? "").toUpperCase() === "CANCELLED";
}

export function canPostOrder(item: { status?: string | null }) {
  return String(item.status ?? "").toUpperCase() === "DRAFT";
}

export function canCancelOrder(item: { status?: string | null }) {
  return !["COMPLETED", "CANCELLED"].includes(
    String(item.status ?? "").toUpperCase(),
  );
}

export function canCreatePayment(item: OrderListItem) {
  const status = String(item.status ?? "").toUpperCase();

  if (["DRAFT", "CANCELLED", "CANCELED", "COMPLETED"].includes(status)) {
    return false;
  }

  const remainingAmount = Number(item.remainingAmount ?? 0);
  const depositRequired = Number(item.depositRequired ?? 0);
  const paymentMethod = String(item.paymentMethod ?? "").toUpperCase();
  const paymentFlow = String(item.paymentFlowLabel ?? "").toUpperCase();

  const isCod = paymentMethod === "COD" || paymentFlow.includes("COD");
  const isDepositOrder = depositRequired > 0 || paymentFlow.includes("CỌC");

  // Đơn full 100% đã được tạo payment khi post order.
  // Không cho tạo thêm payment mới, chỉ cho hoàn tất payment pending.
  if (!isDepositOrder && !isCod) {
    return false;
  }

  // COD: phần COD còn lại đi theo shipment/delivered flow, không tạo payment thủ công từ menu.
  if (isCod) {
    return false;
  }

  // Deposit thường: cho multi-payment nếu còn phải thu và không có payment pending.
  return remainingAmount > 0 && !item.hasPendingPayment;
}

export function canMarkPaymentPaid(item: {
  status?: string | null;
  hasPendingPayment?: boolean | null;
}) {
  const status = String(item.status ?? "").toUpperCase();

  return (
    !["DRAFT", "CANCELLED", "CANCELED", "COMPLETED"].includes(status) &&
    Boolean(item.hasPendingPayment)
  );
}

export function canMarkShipmentDelivered(item: {
  status?: string | null;
  hasShipment?: boolean | null;
  fulfillmentStatus?: string | null;
}) {
  return (
    String(item.status ?? "").toUpperCase() === "POSTED" &&
    Boolean(item.hasShipment) &&
    String(item.fulfillmentStatus ?? "").toUpperCase() !== "DELIVERED"
  );
}

export function orderOperationLabel(item: {
  status?: string | null;
  paymentStatus?: string | null;
  fulfillmentStatus?: string | null;
  isFullyPaid?: boolean | null;
  remainingAmount?: number | string | null;
}) {
  const status = String(item.status ?? "").toUpperCase();
  const payment = String(item.paymentStatus ?? "").toUpperCase();
  const fulfillment = String(item.fulfillmentStatus ?? "").toUpperCase();
  const remaining = Number(item.remainingAmount ?? 0);

  if (status === "DRAFT") return "Nháp";
  if (status === "CANCELLED") return "Đã hủy";
  if (status === "COMPLETED") return "Hoàn tất";

  if (fulfillment === "DELIVERED" && remaining > 0) {
    return "Đã giao / chờ đối soát";
  }

  if (fulfillment === "DELIVERED" && item.isFullyPaid) {
    return "Chờ hoàn tất";
  }

  if (fulfillment === "SHIPPING" || fulfillment === "IN_TRANSIT") {
    return "Đang giao";
  }

  if (item.isFullyPaid) return "Chờ giao";

  if (payment === "PARTIAL" || payment === "DEPOSIT_PAID" || remaining > 0) {
    return "Còn phải thu";
  }

  return "Chờ thanh toán";
}

export function orderOperationTone(item: {
  status?: string | null;
  fulfillmentStatus?: string | null;
  isFullyPaid?: boolean | null;
  remainingAmount?: number | string | null;
}) {
  const status = String(item.status ?? "").toUpperCase();
  const fulfillment = String(item.fulfillmentStatus ?? "").toUpperCase();
  const remaining = Number(item.remainingAmount ?? 0);

  if (status === "COMPLETED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "CANCELLED") return "bg-slate-100 text-slate-500 ring-slate-200";
  if (status === "DRAFT") return "bg-amber-50 text-amber-700 ring-amber-200";

  if (fulfillment === "DELIVERED" && remaining > 0) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (item.isFullyPaid) return "bg-blue-50 text-blue-700 ring-blue-200";

  return "bg-orange-50 text-orange-700 ring-orange-200";
}
export function orderPaymentFlowTone(item: OrderListItem) {
  const tone = item.paymentFlowTone ?? "neutral";

  if (tone === "warning") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  if (tone === "info") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  if (tone === "success") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (tone === "danger") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function paymentDisplayLabel(item: OrderListItem) {
  const paymentStatus = String(item.paymentStatus ?? "").toUpperCase();
  const paidAmount = Number(item.paidAmount ?? 0);
  const depositPaid = Number(item.depositPaid ?? 0);
  const remainingAmount = Number(item.remainingAmount ?? 0);

  if (item.isFullyPaid || paymentStatus === "PAID" || paymentStatus === "FULL_PAID") {
    return "FULL PAID";
  }

  if (
    paymentStatus === "PARTIAL" ||
    paymentStatus === "PARTIALLY_PAID" ||
    paymentStatus === "DEPOSIT_PAID" ||
    paidAmount > 0 ||
    depositPaid > 0
  ) {
    return "PARTIAL PAID";
  }

  if (remainingAmount <= 0) {
    return "FULL PAID";
  }

  return "UNPAID";
}

export function paymentDisplayTone(item: OrderListItem) {
  const label = paymentDisplayLabel(item);

  if (label === "FULL PAID") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (label === "PARTIAL PAID") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-rose-50 text-rose-700 ring-rose-200";
}

export function paymentKindLabel(item: OrderListItem) {
  const depositRequired = Number(item.depositRequired ?? 0);
  const method = String(item.paymentMethod ?? "").toUpperCase();
  const flow = String(item.paymentFlowLabel ?? "").toUpperCase();

  if (method === "COD" || flow.includes("COD")) return "COD";
  if (depositRequired > 0 || flow.includes("CỌC")) return "Deposit";
  return "Thanh toán full";
}

export function paymentKindTone(item: OrderListItem) {
  const kind = paymentKindLabel(item);

  if (kind === "COD") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (kind === "Deposit") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function shipmentDisplayLabel(item: OrderListItem) {
  const orderStatus = String(item.status ?? "").toUpperCase();
  const status = String(item.fulfillmentStatus ?? "").toUpperCase();

  if (orderStatus === "DRAFT") return "PENDING";
  if (orderStatus === "CANCELLED" || orderStatus === "CANCELED") return "CANCELLED";
  if (orderStatus === "COMPLETED" && status !== "DELIVERED") return "DELIVERED";

  if (["DELIVERED", "COMPLETED"].includes(status)) return "DELIVERED";
  if (["SHIPPING", "SHIPPED", "IN_TRANSIT", "DELIVERING"].includes(status)) {
    return "DELIVERING";
  }

  return "PENDING";
}

export function shipmentDisplayTone(item: OrderListItem) {
  const label = shipmentDisplayLabel(item);

  if (label === "DELIVERED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (label === "DELIVERING") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  if (label === "CANCELLED") {
    return "bg-slate-100 text-slate-500 ring-slate-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export function formatPaymentMethod(method?: string | null) {
  const value = String(method ?? "").toUpperCase();

  if (value === "BANK_TRANSFER") return "Chuyển khoản";
  if (value === "CASH") return "Tiền mặt";
  if (value === "COD") return "COD";
  if (value === "MOMO") return "Momo";
  if (value === "CREDIT_CARD") return "Thẻ";

  return method || "-";
}

export function getPaymentTypeLabel(reserveType?: string | null) {
  const type = normalizeReserveType(reserveType);

  if (type === ReserveType.COD) return "COD";
  if (type === ReserveType.DEPOSIT) return "Deposit";

  return "Thanh toán full";
}

export function getPaymentTypeTone(reserveType?: string | null) {
  const type = normalizeReserveType(reserveType);

  if (type === ReserveType.COD) return "purple";
  if (type === ReserveType.DEPOSIT) return "amber";

  return "slate";
}

export function getPaymentKind(item: {
  reserveType?: string | null;
  depositRequired?: number | null;
  paymentMethod?: string | null;
}) {
  const type = normalizeReserveType(item.reserveType);

  if (type === ReserveType.COD) {
    return {
      label: "COD",
      tone: "purple" as const,
    };
  }

  if (type === ReserveType.DEPOSIT) {
    return {
      label: "Deposit",
      tone: "amber" as const,
    };
  }

  return {
    label: "Thanh toán full",
    tone: "slate" as const,
  };
}