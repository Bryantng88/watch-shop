import { AdminMoney } from "@/domains/shared/ui/admin-design-contract/AdminMoney";
import { cn } from "@/lib/utils";

type Props = {
  kind?: "receivable" | "payable";
  variant?: "default" | "inline";
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

  if (props.variant === "inline") {
    const total = toNumber(props.totalAmount);
    const unpaid = total > 0 && remaining === total;
    const payable = props.kind === "payable";
    return <div className={cn("flex flex-col items-end gap-1 text-right", props.className)}>
      <AdminMoney amount={total} currency={currency} className="text-sm font-medium leading-5 text-slate-900" />
      {!props.cancelled && remaining > 0 && <span className="flex items-baseline justify-end gap-1 text-xs font-normal leading-4 text-amber-700">
        {unpaid ? payable ? "Chưa trả" : "Chưa thu" : <>{payable ? "Còn trả" : "Còn thu"} <AdminMoney amount={remaining} currency={currency} /></>}
      </span>}
    </div>;
  }
  return (
    <div className={cn("whitespace-nowrap text-right", props.className)}>
      <div className="font-semibold tabular-nums text-slate-950">
        {format(toNumber(props.totalAmount))}
      </div>
      {!props.cancelled && remaining > 0 ? (
        <div className="mt-1 text-[11px] font-normal tabular-nums text-rose-600">
          Còn {format(remaining)}
        </div>
      ) : null}
    </div>
  );
}
