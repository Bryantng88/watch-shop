"use client";

import type { ReactNode } from "react";
import { Badge } from "@/domains/shared/ui/badge/Badge";
import { SectionCard } from "@/domains/shared/ui/surface/card";
import { cx, fmtDate, fmtMoney } from "@/domains/order/ui/order-ui.helpers";
import { getOrderInventoryEffect, getOrderStatusLabel } from "@/domains/order/shared/order-status";

export { SectionCard, cx, fmtDate, fmtMoney };

export type OrderDetailItem = {
  id: string;
  title: string;
  quantity: number;
  kind?: string | null;
  listPrice: number;
  unitPriceAgreed?: number | null;
  subtotal?: number | null;
  img?: string | null;
  productId?: string | null;
  variantId?: string | null;
  serviceScope?: string | null;
  customerItemNote?: string | null;
  linkedProductTitle?: string | null;
};

export type OrderDetailData = {
  id: string;
  refNo?: string | null;
  status: string;
  source?: string | null;
  verificationStatus?: string | null;
  reserveType?: string | null;
  reserveUntil?: string | null;
  customerName?: string | null;
  shipPhone?: string | null;
  shipAddress?: string | null;
  shipWard?: string | null;
  shipDistrict?: string | null;
  shipCity?: string | null;
  paymentMethod?: string | null;
  depositRequired?: number | null;
  depositPaid?: number | null;
  hasShipment?: boolean | null;
  currency?: string | null;
  subtotal?: number | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  items: OrderDetailItem[];
};

export function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function itemLineTotal(item: OrderDetailItem) {
  if (item.subtotal != null) return toNumber(item.subtotal);
  return toNumber(item.unitPriceAgreed ?? item.listPrice) * Math.max(toNumber(item.quantity), 1);
}

export function buildMediaUrl(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("blob:") ||
    raw.startsWith("data:") ||
    raw.startsWith("/api/media/sign")
  ) {
    return raw;
  }

  const key = raw.replace(/^\/+/, "");
  return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

export function orderDisplayCode(data: OrderDetailData) {
  return data.refNo?.trim() || "Đơn hàng chưa phát sinh mã";
}

export function orderTotal(data: OrderDetailData) {
  if (data.subtotal != null) return toNumber(data.subtotal);
  return (data.items ?? []).reduce((sum, item) => sum + itemLineTotal(item), 0);
}

export function fullAddress(data: OrderDetailData) {
  return [data.shipAddress, data.shipWard, data.shipDistrict, data.shipCity]
    .filter(Boolean)
    .join(", ") || "-";
}

export function InventoryEffectBadge({ status }: { status?: string | null }) {
  const effect = getOrderInventoryEffect(status);

  const className =
    effect === "SOLD"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : effect === "HOLD"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span className={cx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", className)}>
      {effect}
    </span>
  );
}

export function OrderStateBadge({ status }: { status?: string | null }) {
  const effect = getOrderInventoryEffect(status);
  const tone = effect === "SOLD" ? "danger" : effect === "HOLD" ? "warning" : "info";

  return <Badge tone={tone}>{getOrderStatusLabel(status)}</Badge>;
}

export function DetailText({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">{label}</div>
      <div className={cx("text-sm leading-6 text-slate-900", mono && "font-mono text-[13px]")}>{value || "-"}</div>
    </div>
  );
}

export function SoftMetric({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950">{value || "-"}</div>
      {hint ? <div className="mt-0.5 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
