import { cn } from "@/lib/utils";

type Props = {
  totalAmount?: number | string | null;
  remainingAmount?: number | string | null;
  currency?: string | null;
  cancelled?: boolean;
  className?: string;
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function PaymentAmountSummary(props: Props) {
  const currency = String(props.currency || "VND").toUpperCase();
  const format = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ${currency}`;
  const remaining = Math.max(0, toNumber(props.remainingAmount));

  return (
    <div className={cn("whitespace-nowrap text-right", props.className)}>
      <div className="font-semibold tabular-nums text-slate-950">
        {format(toNumber(props.totalAmount))}
      </div>
      {!props.cancelled && remaining > 0 ? (
        <div className="mt-1 text-[11px] font-medium tabular-nums text-rose-600">
          Còn {format(remaining)}
        </div>
      ) : null}
    </div>
  );
}
