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
};

export default function SegmentTabs<TKey extends string>({ items, value, onChange, className }: Props<TKey>) {
  return (
    <div className={cn("border-b border-slate-200", className)}>
      <div className="flex min-w-max items-center gap-6 overflow-x-auto">
        {items.map((item) => {
          const active = value === item.key;

          return (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => onChange(item.key)}
              className={cn(
                "relative inline-flex h-12 shrink-0 items-center whitespace-nowrap text-sm transition",
                active ? "font-semibold text-slate-950" : "font-medium text-slate-500 hover:text-slate-800",
                item.disabled && "cursor-not-allowed opacity-50 hover:text-slate-500",
              )}
            >
              <span>{item.label}</span>
              {item.count !== undefined && item.count !== null ? (
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                    active ? "bg-slate-100 text-slate-700" : "bg-slate-50 text-slate-400",
                  )}
                >
                  {item.count}
                </span>
              ) : null}

              {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
