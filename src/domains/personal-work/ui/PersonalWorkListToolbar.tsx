"use client";
import { useCallback, useRef, useState } from "react";
import { Settings2, SlidersHorizontal, X } from "lucide-react";
import type { PersonalWorkCategory } from "../shared/personal-work.types";
import styles from "./PersonalWorkList.module.css";
import { PersonalWorkFloatingPanel } from "./PersonalWorkFloatingPanel";
export type WorkListView = "TODAY" | "OVERDUE" | "UPCOMING" | "ALL" | "EVENTS" | "DONE";
const views = [["TODAY", "Hôm nay"], ["OVERDUE", "Quá hạn"], ["UPCOMING", "Sắp tới"], ["ALL", "Tất cả"], ["EVENTS", "Sự kiện"], ["DONE", "Đã xong"]] as const;
export function PersonalWorkListToolbar({ view, onView, scope, onScope, domain, onDomain, categories, onManage }: {
  view: WorkListView; onView: (value: WorkListView) => void;
  scope: "MINE" | "SHARED" | "ALL"; onScope: (value: "MINE" | "SHARED" | "ALL") => void;
  domain: string; onDomain: (value: string) => void;
  categories: PersonalWorkCategory[]; onManage: () => void;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const scopeLabel = scope === "MINE" ? "Của tôi" : scope === "SHARED" ? "Được chia sẻ" : "Tất cả";
  return <div className={styles.toolbar}>
    <select aria-label="Hiển thị công việc" className={styles.mobileView} value={view} onChange={event => onView(event.target.value as WorkListView)}>{views.map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select>
    <div className={styles.tabs} aria-label="Hiển thị công việc">{views.map(([key, label]) => <button key={key} type="button" aria-pressed={view === key} onClick={() => onView(key)} className={`h-8 whitespace-nowrap rounded-md px-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-blue-300 ${view === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div>
    <button ref={trigger} type="button" aria-label={`Bộ lọc công việc: ${scopeLabel}`} aria-expanded={open} onClick={() => setOpen(value => !value)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2 text-xs text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-300"><SlidersHorizontal className="h-3.5 w-3.5" />{scopeLabel}{domain !== "ALL" && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-label="Đang lọc loại công việc" />}</button>
    {open && <PersonalWorkFloatingPanel anchor={trigger.current} onClose={close} label="Bộ lọc công việc" className={styles.filters}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-700">Bộ lọc<button type="button" aria-label="Đóng bộ lọc" className="grid h-8 w-8 place-items-center rounded hover:bg-slate-50" onClick={() => { setOpen(false); trigger.current?.focus(); }}><X className="h-3.5 w-3.5" /></button></div>
      <label className="block text-xs text-slate-500">Phạm vi công việc<select value={scope} onChange={event => onScope(event.target.value as typeof scope)} className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"><option value="MINE">Của tôi</option><option value="SHARED">Được chia sẻ</option><option value="ALL">Tất cả công việc</option></select></label>
      <label className="mt-3 block text-xs text-slate-500">Loại công việc<select value={domain} onChange={event => onDomain(event.target.value as typeof domain)} className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"><option value="ALL">Tất cả loại</option>{categories.map(category => <option value={category.key} key={category.key}>{category.label}</option>)}</select></label>
      <button type="button" onClick={() => { setOpen(false); onManage(); }} className="mt-3 inline-flex h-8 items-center gap-2 rounded px-1 text-xs text-slate-500 hover:bg-slate-50"><Settings2 className="h-3.5 w-3.5" />Quản lý loại công việc</button>
    </PersonalWorkFloatingPanel>}
  </div>;
}
