/** Read-only row timestamp in the product timezone, independent of browser locale. */
export function AdminListDateTime({ value }: { value?: string | Date | null }) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return <span className="text-xs text-slate-500">—</span>;
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  return <time dateTime={date.toISOString()} className="block text-xs font-normal leading-4 tabular-nums text-slate-500">
    <span className="block">{new Intl.DateTimeFormat("vi-VN", { ...options, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date)}</span>
    <span className="block">{new Intl.DateTimeFormat("vi-VN", { ...options, day: "2-digit", month: "2-digit", year: "numeric" }).format(date)}</span>
  </time>;
}
