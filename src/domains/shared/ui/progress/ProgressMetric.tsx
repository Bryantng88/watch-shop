import { cn } from "@/lib/utils";

type ProgressMetricProps = {
  value: number;
  numerator?: number;
  denominator?: number;
  caption?: string;
  label?: string;
  semantic?: "completion" | "ratio";
  size?: "sm" | "md";
  layout?: "stacked" | "inline";
  className?: string;
};

export function ProgressMetric({
  value,
  numerator,
  denominator,
  caption,
  label,
  semantic = "completion",
  size = "sm",
  layout = "stacked",
  className,
}: ProgressMetricProps) {
  const normalized = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
  const hasFraction = numerator !== undefined && denominator !== undefined;
  const isComplete = normalized === 100;
  const fractionLabel = semantic === "ratio" ? "đang ở đây" : "đầu việc";
  const accessibleLabel = label ?? (hasFraction ? `${numerator}/${denominator} · ${normalized}%` : `${normalized}%`);

  return (
    <span
      role="progressbar"
      aria-label={accessibleLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalized}
      className={cn("inline-flex min-w-0 gap-2", layout === "inline" ? "flex-row items-center" : "flex-col", size === "md" ? "w-full max-w-sm" : "w-full max-w-xs", className)}
    >
      <span className={cn("flex min-w-0 items-center justify-between gap-3", layout === "inline" && "order-last shrink-0")}>
        {caption ? <span className="truncate text-xs font-bold text-slate-900">{caption}</span> : layout === "stacked" ? <span /> : null}
        <strong className={cn("inline-flex min-w-10 shrink-0 items-center justify-center rounded-md px-2 py-1.5 text-[10px] font-extrabold tabular-nums", isComplete ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700")}>{normalized}%</strong>
      </span>
      <span className={cn("flex min-w-0 items-center gap-2.5", layout === "inline" && "flex-1")}>
        <span className={cn("block min-w-20 flex-1 overflow-hidden rounded-full bg-slate-100", size === "md" ? "h-2" : "h-1.5")}>
          <span
            className={cn("block h-full rounded-full transition-[width,background-color] duration-500 ease-out", isComplete ? "bg-emerald-500" : "bg-blue-600")}
            style={{ width: `${normalized}%` }}
          />
        </span>
        {hasFraction ? <span className="shrink-0 whitespace-nowrap text-[10px] font-medium tabular-nums text-slate-500"><strong className="font-semibold text-slate-700">{numerator}/{denominator}</strong> {fractionLabel}</span> : null}
      </span>
    </span>
  );
}
