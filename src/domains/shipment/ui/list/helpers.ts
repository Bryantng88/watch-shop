import type { ShipmentListItem, ShipmentViewKey } from "./types";

export const SHIPMENT_PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10 / trang" },
  { value: "20", label: "20 / trang" },
  { value: "50", label: "50 / trang" },
  { value: "100", label: "100 / trang" },
];

export function buildHref(pathname: string, current: URLSearchParams, patch: Record<string, string | null | undefined>) {
  const next = new URLSearchParams(current.toString());
  Object.entries(patch).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") next.delete(key);
    else next.set(key, value);
  });
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function normalizeShipmentView(value?: string | null): ShipmentViewKey {
  const raw = String(value ?? "").toLowerCase();
  if (["ready", "shipping", "returning", "delivered", "returned", "cancelled"].includes(raw)) return raw as ShipmentViewKey;
  return "all";
}

export function statusFromView(view: ShipmentViewKey) {
  if (view === "ready") return "READY";
  if (view === "shipping") return "SHIPPED";
  if (view === "returning") return "RETURNING";
  if (view === "delivered") return "DELIVERED";
  if (view === "returned") return "RETURNED";
  if (view === "cancelled") return "CANCELLED";
  return null;
}

export function viewFromStatus(status?: string | null): ShipmentViewKey {
  const raw = String(status ?? "").toUpperCase();
  if (raw === "READY") return "ready";
  if (raw === "SHIPPED") return "shipping";
  if (raw === "RETURNING") return "returning";
  if (raw === "DELIVERED") return "delivered";
  if (raw === "RETURNED") return "returned";
  if (raw === "CANCELLED") return "cancelled";
  return "all";
}

export function formatMoney(value: unknown, currency = "VND") {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "-";
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(n))} ${currency || "VND"}`;
}

export function formatDateTime(value: unknown) {
  if (!value) return "-";
  const date = new Date(value as any);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function fullAddress(item: ShipmentListItem) {
  return [item.shipAddress, item.shipWard, item.shipDistrict, item.shipCity].filter(Boolean).join(", ") || "-";
}

export function shipmentStatusLabel(status?: string | null) {
  switch (String(status ?? "").toUpperCase()) {
    case "READY": return "Chờ giao";
    case "SHIPPED": return "Đang giao";
    case "RETURNING": return "Đang hoàn";
    case "DELIVERED": return "Đã giao";
    case "RETURNED": return "Hoàn trả";
    case "CANCELLED": return "Đã huỷ";
    case "DRAFT": return "Nháp";
    default: return status || "-";
  }
}

export function shipmentStatusTone(status?: string | null) {
  switch (String(status ?? "").toUpperCase()) {
    case "READY": return "bg-amber-50 text-amber-700 ring-amber-200";
    case "SHIPPED": return "bg-blue-50 text-blue-700 ring-blue-200";
    case "RETURNING": return "bg-orange-50 text-orange-700 ring-orange-200";
    case "DELIVERED": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "RETURNED": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "CANCELLED": return "bg-rose-50 text-rose-700 ring-rose-200";
    default: return "bg-slate-50 text-slate-600 ring-slate-200";
  }
}

export function paymentMethodLabel(method?: string | null) {
  switch (String(method ?? "").toUpperCase()) {
    case "COD": return "COD";
    case "CASH": return "Tiền mặt";
    case "BANK_TRANSFER": return "Chuyển khoản";
    case "MOMO": return "Momo";
    case "PAYPAL": return "PayPal";
    case "CREDIT_CARD": return "Thẻ";
    default: return method || "-";
  }
}

export function isCodShipment(item: ShipmentListItem) {
  return String(item.order?.paymentMethod ?? "").toUpperCase() === "COD";
}

export function canEditShipment(item: ShipmentListItem) {
  return ["READY", "SHIPPED"].includes(String(item.status ?? "").toUpperCase());
}

export function canCreateShipmentFee(item: ShipmentListItem) {
  return ["READY", "SHIPPED"].includes(String(item.status ?? "").toUpperCase());
}

export function canMarkDelivered(item: ShipmentListItem) {
  return String(item.status ?? "").toUpperCase() === "SHIPPED";
}

export function canMarkReturned(item: ShipmentListItem) {
  return ["SHIPPED", "DELIVERED"].includes(String(item.status ?? "").toUpperCase());
}

export function canReceiveReturn(item: ShipmentListItem) {
  return String(item.status ?? "").toUpperCase() === "RETURNING";
}
export function canReceiveReturnedShipment(item: ShipmentListItem) {
  return ["RETURNING", "RETURNED"].includes(String(item.status ?? "").toUpperCase());
}
