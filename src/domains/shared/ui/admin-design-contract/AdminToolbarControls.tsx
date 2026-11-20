"use client";

import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { AdminButton } from "./AdminButton";

/** The same quiet refresh target for every workspace toolbar. */
export function AdminRefreshAction({ loading = false, refreshedAt, onRefresh, label = "Làm mới dữ liệu" }: { loading?: boolean; refreshedAt?: Date | null; onRefresh: () => void; label?: string }) {
  const time = refreshedAt?.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return <AdminButton variant="quiet" iconOnly type="button" onClick={onRefresh} disabled={loading} aria-busy={loading} aria-label={loading ? "Đang làm mới dữ liệu" : label} title={time ? `${label} · Cập nhật lúc ${time}` : label}>
    <RefreshCw aria-hidden="true" className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
  </AdminButton>;
}

export function AdminIconViewSwitch({ value, items, onChange }: { value?: string; items: { value: string; label: string; icon: ReactNode; disabled?: boolean }[]; onChange: (value: string) => void }) {
  return <div role="group" aria-label="Cách hiển thị" className="inline-flex shrink-0 items-center gap-1">
    {items.map(item => <AdminButton key={item.value} variant="quiet" iconOnly type="button" aria-label={item.label} title={item.label} aria-pressed={value === item.value} disabled={item.disabled} onClick={() => onChange(item.value)}><span aria-hidden="true">{item.icon}</span></AdminButton>)}
  </div>;
}

/** Native select keeps keyboard/mobile behavior while the toolbar shows only its icon. */
export function AdminIconSelect({ label, value, options, icon, onChange }: { label: string; value: string; options: { value: string; label: string }[]; icon: ReactNode; onChange: (value: string) => void }) {
  const active = value !== options[0]?.value;
  const selected = options.find(option => option.value === value)?.label ?? "";
  return <label title={`${label}: ${selected}`} className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 focus-within:ring-2 focus-within:ring-blue-400 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11 ${active ? "text-blue-700" : "text-slate-600"}`}>
    <span aria-hidden="true">{icon}</span>
    {active && <span aria-hidden="true" className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-600" />}
    <select aria-label={label} value={value} onChange={event => onChange(event.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
  </label>;
}
