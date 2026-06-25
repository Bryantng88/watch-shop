"use client";

import { cn } from "@/lib/utils";

export type SegmentTabItem<TKey extends string> = {
  key: TKey;
  label: string;
  count?: number | string | null;
  disabled?: boolean;
};

type Props<TKey extends string> = {
  items: Array<SegmentTabItem<TKey>>;
  value: TKey;
  onChange: (key: TKey) => void;
  className?: string;
  variant?: "tabs" | "chips";
};

export default function SegmentTabs<TKey extends string>({
  items,
  value,
  onChange,
  className,
  variant = "tabs",
}: Props<TKey>) {
  const isChips = variant === "chips";

  return (
    <div className={cn(isChips ? "" : "border-b border-slate-200", className)}>
      <div
        className={cn(
          "flex min-w-max items-center overflow-x-auto",
          isChips ? "gap-2" : "gap-6",
        )}
      >
        {items.map((item) => {
          const active = value === item.key;

          return (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => onChange(item.key)}
              className={cn(
                "relative inline-flex shrink-0 items-center whitespace-nowrap transition",
                isChips
                  ? "h-7 rounded-full px-2.5 text-xs"
                  : "h-12 text-sm",
                isChips
                  ? active
                    ? "bg-slate-900 font-semibold text-white"
                    : "font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  : active
                    ? "font-semibold text-slate-950"
                    : "font-medium text-slate-500 hover:text-slate-800",
                item.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <span>{item.label}</span>
              {item.count !== undefined && item.count !== null ? (
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                    isChips
                      ? active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                      : active
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-50 text-slate-400",
                  )}
                >
                  {item.count}
                </span>
              ) : null}

              {!isChips && active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
