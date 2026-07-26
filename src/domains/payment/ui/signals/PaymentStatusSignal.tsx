import { Ban, Check, CircleDollarSign, HandCoins } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  status?: string | null;
  totalAmount?: number | string | null;
  remainingAmount?: number | string | null;
  paidAmount?: number | string | null;
  className?: string;
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function PaymentStatusSignal(props: Props) {
  const key = String(props.status ?? "").toUpperCase();
  const cancelled = key === "CANCELLED" || key === "CANCELED";
  const total = Math.max(0, toNumber(props.totalAmount));
  const remaining = Math.max(0, toNumber(props.remainingAmount));
  const paid = Math.max(0, toNumber(props.paidAmount) || Math.max(0, total - remaining));
  const ratio = total > 0 ? Math.min(1, paid / total) : 0;
  const fullyPaid =
    !cancelled &&
    (["PAID", "FULL_PAID", "FULLY_PAID"].includes(key) || (total > 0 && remaining <= 0));
  const partial = !fullyPaid && ratio > 0;

  if (cancelled) {
    return (
      <span className={cn("inline-flex items-center gap-2", props.className)}>
        <span className="grid h-7 w-7 place-items-center rounded-md border border-rose-100 bg-rose-50 text-rose-500">
          <Ban className="h-3.5 w-3.5" strokeWidth={1.7} />
        </span>
        <span className="text-[11px] font-semibold text-rose-600">Đã hủy</span>
      </span>
    );
  }

  if (fullyPaid) {
    return (
      <span className={cn("inline-flex items-center gap-2", props.className)}>
        <span className="grid h-7 w-7 place-items-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-[0_1px_3px_rgba(16,185,129,0.08)]">
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <span className="text-[11px] font-semibold text-emerald-700">Đã thanh toán</span>
      </span>
    );
  }

  if (partial) {
    const percentage = Math.round(ratio * 100);
    return (
      <span
        title={`Đã thanh toán ${percentage}%`}
        className={cn("inline-flex items-center gap-2", props.className)}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full p-[2px]"
          style={{
            background: `conic-gradient(rgb(124 58 237) ${percentage}%, rgb(226 232 240) ${percentage}% 100%)`,
          }}
        >
          <span className="grid h-full w-full place-items-center rounded-full bg-white text-violet-600">
            <HandCoins className="h-3.5 w-3.5" strokeWidth={1.8} />
          </span>
        </span>
        <span className="text-[11px] font-semibold text-violet-700">
          Đã trả {percentage}%
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", props.className)}>
      <span className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-slate-50 text-slate-400">
        <CircleDollarSign className="h-3.5 w-3.5" strokeWidth={1.7} />
      </span>
      <span className="text-[11px] font-semibold text-slate-500">Chưa thanh toán</span>
    </span>
  );
}
