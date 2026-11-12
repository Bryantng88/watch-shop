"use client";

import { useId, useState } from "react";

/** UI uses thousands of VND; domain values and payloads always use full currency units. */
export function parseAcquisitionMoney(raw: string, currency = "VND"): number | "" | null {
  if (!raw.trim()) return "";
  if (!/^\d+(?:[.,]\d{0,3})?$/.test(raw.trim())) return null;
  const amount = Number(raw.trim().replace(",", ".")) * (currency === "VND" ? 1000 : 1);
  return Number.isFinite(amount) && amount >= 0 && amount <= Number.MAX_SAFE_INTEGER ? Math.round(amount * 100) / 100 : null;
}

export function displayAcquisitionMoney(value: number | "", currency = "VND") {
  return value === "" ? "" : String(value / (currency === "VND" ? 1000 : 1));
}

export default function AcquisitionMoneyInput({ value, onChange, currency = "VND", disabled, label, placeholder = "0" }: {
  value: number | "";
  onChange: (value: number | "") => void;
  currency?: string;
  disabled?: boolean;
  label: string;
  placeholder?: string;
}) {
  const id = useId();
  const [editing, setEditing] = useState<string | null>(null);
  const text = editing ?? displayAcquisitionMoney(value, currency);
  return <span className="group relative block min-w-0">
    <span className="flex h-10 items-center overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
      <input aria-label={label} aria-describedby={id} type="text" inputMode="decimal" disabled={disabled} value={text} placeholder={placeholder}
        onFocus={() => setEditing(displayAcquisitionMoney(value, currency))}
        onBlur={() => setEditing(null)}
        onChange={event => {
          const next = parseAcquisitionMoney(event.target.value, currency);
          if (next === null) return;
          setEditing(event.target.value);
          onChange(next);
        }}
        className="h-full w-full min-w-0 bg-transparent px-2 text-right text-sm tabular-nums outline-none disabled:text-slate-400" />
      <span className="shrink-0 pr-2 text-xs text-slate-500">{currency === "VND" ? "nghìn ₫" : currency}</span>
    </span>
    <span id={id} role="tooltip" className="pointer-events-none absolute right-0 top-full z-20 mt-1 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs tabular-nums text-white group-focus-within:block">
      {new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value || 0)} {currency === "VND" ? "₫" : currency}
    </span>
  </span>;
}
