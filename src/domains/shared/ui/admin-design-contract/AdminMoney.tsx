import { cn } from "@/lib/utils";
/** Passive amount; never renders a button or link. Keep amount and currency together. */
export function AdminMoney({ amount, currency = "VND", className }: { amount: number | string | null | undefined; currency?: string | null; className?: string }) {
  const value = Number(amount ?? 0);
  const unit = String(currency || "VND").toUpperCase();
  return <span className={cn("inline-flex items-baseline justify-end gap-1 whitespace-nowrap tabular-nums", className)}><span>{new Intl.NumberFormat("vi-VN").format(Number.isFinite(value) ? value : 0)}</span><span className="text-[0.8em] font-normal text-slate-500">{unit === "VND" ? "₫" : unit}</span></span>;
}
