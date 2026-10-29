"use client";

import styles from "./PersonalWorkCreate.module.css";

export function PersonalWorkTimeFields({ start, end, onChange, disabled = false, compact = false }: {
  start: string; end: string; onChange: (start: string, end: string) => void; disabled?: boolean; compact?: boolean;
}) {
  const allDay = !start && !end;
  return <div className={compact ? styles.times : "space-y-3"}>
    <label className="flex w-fit items-center gap-2 text-xs font-medium text-slate-600">
      <input type="checkbox" checked={allDay} disabled={disabled} onChange={event => onChange(event.target.checked ? "" : "09:00", event.target.checked ? "" : "10:00")} />
      Cả ngày
    </label>
    <div className={compact ? styles.range : "grid grid-cols-2 gap-3"}>
      <label className={compact ? styles.timeLabel : "block space-y-1.5"}><span className={compact ? "sr-only" : "text-xs font-semibold text-slate-600"}>Giờ bắt đầu</span>
        <input required={!allDay} type="time" value={start} disabled={disabled || allDay} onChange={event => onChange(event.target.value, end)} className={`${compact ? "h-9 w-28" : "h-11 w-full"} rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50 disabled:text-slate-400`} />
      </label>
      <label className={compact ? styles.timeLabel : "block space-y-1.5"}><span className={compact ? "sr-only" : "text-xs font-semibold text-slate-600"}>Giờ kết thúc</span>
        <input required={!allDay} type="time" value={end} disabled={disabled || allDay} onChange={event => onChange(start, event.target.value)} className={`${compact ? "h-9 w-28" : "h-11 w-full"} rounded-lg border border-slate-200 px-3 text-sm disabled:bg-slate-50 disabled:text-slate-400`} />
      </label>
    </div>
  </div>;
}
