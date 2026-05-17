import { getOrderInventoryEffect, getOrderStatusLabel, getOrderStatusTone } from "../shared/order-status";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function fmtMoney(value?: number | null, currency = "VND") {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} ${currency}`;
}

export function fmtDate(value?: string | Date | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function orderStatusMeta(status?: string | null) {
  const effect = getOrderInventoryEffect(status);
  const tone = getOrderStatusTone(status);
  return {
    label: getOrderStatusLabel(status),
    effect,
    tone,
    badgeClass:
      effect === "SOLD"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : effect === "HOLD"
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-slate-100 text-slate-700 ring-slate-200",
  };
}

export function sourceLabel(value?: string | null) {
  if (!value) return "-";
  if (value === "WEB") return "Web";
  if (value === "ADMIN") return "Admin";
  if (value === "POS") return "POS";
  return value;
}

export function verificationLabel(value?: string | null) {
  if (!value) return "-";
  if (value === "PENDING") return "Chờ xác minh";
  if (value === "VERIFIED") return "Đã xác minh";
  if (value === "REJECTED") return "Từ chối";
  return value;
}
