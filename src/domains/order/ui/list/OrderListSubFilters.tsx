"use client";

import { cn } from "@/lib/utils";
import type { OrderListCounts, OrderProcessingSubFilter } from "./types";
import { ORDER_PROCESSING_SUB_FILTERS } from "./types";

type Props = {
  currentView: string;
  currentSubFilter: OrderProcessingSubFilter;
  counts: OrderListCounts;
  onChange: (subFilter: OrderProcessingSubFilter) => void;
};

export default function OrderListSubFilters({
  currentView,
  currentSubFilter,
  counts,
  onChange,
}: Props) {
  if (currentView !== "processing") return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <span className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Theo dõi
      </span>

      {ORDER_PROCESSING_SUB_FILTERS.map((item) => {
        const active = currentSubFilter === item.key;
        const count = item.key
          ? counts.processingSub?.[item.key as keyof NonNullable<OrderListCounts["processingSub"]>] ?? 0
          : counts.processing ?? 0;

        return (
          <button
            key={item.key || "all"}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800",
            )}
          >
            <span>{item.label}</span>
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-white/15 text-white" : "bg-white text-slate-400")}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
