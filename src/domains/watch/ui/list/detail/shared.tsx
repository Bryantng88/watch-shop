"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

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

export function signedImageUrl(key?: string | null) {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/")) {
    return key;
  }
  return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

export function toneForStatus(status?: string | null): "green" | "blue" | "gray" | "orange" {
  const s = String(status ?? "").toUpperCase();

  if (["AVAILABLE", "ACTIVE", "READY", "COMPLETED", "PUBLISHED", "PAID", "DELIVERED"].includes(s)) {
    return "green";
  }
  if (["HOLD", "IN_SERVICE", "RESERVED", "WAIT_APPROVAL", "DIAGNOSING", "DRAFT", "PENDING", "PROCESSING"].includes(s)) {
    return "orange";
  }
  if (["SOLD", "ARCHIVED", "HIDDEN", "CANCELED", "CANCELLED", "FAILED", "REFUNDED"].includes(s)) {
    return "gray";
  }

  return "blue";
}

export function DotLabel({
  label,
  tone = "gray",
}: {
  label: string;
  tone?: "green" | "blue" | "gray" | "orange";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "orange"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : tone === "blue"
          ? "bg-blue-50 text-blue-700 ring-blue-200"
          : "bg-slate-100 text-slate-700 ring-slate-200";

  const dotClass =
    tone === "green"
      ? "bg-emerald-500"
      : tone === "orange"
        ? "bg-amber-500"
        : tone === "blue"
          ? "bg-blue-500"
          : "bg-slate-400";

  return (
    <span className={cls("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", toneClass)}>
      <span className={cls("h-1.5 w-1.5 rounded-full", dotClass)} />
      {label}
    </span>
  );
}

export function CollapsibleSection({
  title,
  desc,
  icon,
  defaultOpen = true,
  right,
  children,
}: {
  title: string;
  desc?: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  right?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">{title}</h2>
            {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {right}
          <span className="text-slate-400">
            {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </span>
        </div>
      </button>

      {open ? <div className="p-5">{children}</div> : null}
    </section>
  );
}

export function Field({
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div>
      <div className={cls("text-sm leading-6 text-slate-900", mono && "font-mono")}>{value}</div>
    </div>
  );
}

export function TinyStat({
  label,
  value,
  hint,
  emphasize = false,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  emphasize?: boolean;
}) {
  return (
    <div className={cls(
      "rounded-2xl border px-4 py-3.5",
      emphasize ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-slate-50"
    )}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div>
      <div className={cls("mt-1 font-semibold", emphasize ? "text-lg text-orange-700" : "text-base text-slate-900")}>
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function SectionEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
