"use client";

import type { ReactNode } from "react";
import { Badge } from "@/domains/shared/ui/badge/Badge";
import { SectionCard, SidebarStat } from "@/domains/shared/ui/surface/card";
import { cx } from "@/domains/shared/ui/form/fields";

export { SectionCard, SidebarStat, cx };

export function fmtDate(value?: string | Date | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";

  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtMoney(value?: string | number | null, currency = "VND") {
  if (value == null || value === "") return "-";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);

  return `${new Intl.NumberFormat("vi-VN").format(n)} ${currency}`;
}

export function boolText(value?: boolean | null) {
  if (value == null) return "-";
  return value ? "Có" : "Không";
}

export function toneForStatus(status?: string | null) {
  const s = String(status ?? "").toUpperCase();

  if (["AVAILABLE", "ACTIVE", "READY", "COMPLETED", "PUBLISHED", "PAID", "DELIVERED", "IN_STOCK"].includes(s)) {
    return "success";
  }

  if (["HOLD", "IN_SERVICE", "RESERVED", "WAIT_APPROVAL", "DIAGNOSING", "DRAFT", "PENDING", "PROCESSING", "OFF_SHELF"].includes(s)) {
    return "warning";
  }

  if (["SOLD", "ARCHIVED", "HIDDEN", "CANCELED", "CANCELLED", "FAILED", "REFUNDED"].includes(s)) {
    return "muted";
  }

  return "info";
}

export function StatusBadge({ label }: { label?: string | null }) {
  if (!label) return null;

  return (
    <Badge tone={toneForStatus(label)}>
      {label}
    </Badge>
  );
}

export function DetailField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
      <div className={cx("text-sm leading-6 text-slate-900", mono && "font-mono")}>
        {value || "-"}
      </div>
    </div>
  );
}

export function SectionEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}