"use client";

import type { OrderListCounts, OrderViewKey } from "./types";
import { ORDER_LIST_VIEWS } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  currentView: OrderViewKey;
  counts: OrderListCounts;
  onViewChange: (view: OrderViewKey) => void;
};

export default function OrderListViewTabs({
  currentView,
  counts,
  onViewChange,
}: Props) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex min-w-max items-center gap-6 overflow-x-auto">
        {ORDER_LIST_VIEWS.map((view) => {
          const active = currentView === view.key;

          return (
            <button
              key={view.key}
              type="button"
              onClick={() => onViewChange(view.key)}
              className={cn(
                "relative inline-flex h-12 shrink-0 items-center whitespace-nowrap text-sm transition",
                active
                  ? "font-semibold text-slate-950"
                  : "font-medium text-slate-500 hover:text-slate-800",
              )}
            >
              <span>{view.label}</span>
              <span
                className={cn(
                  "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                  active
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-400",
                )}
              >
                {counts[view.key] ?? 0}
              </span>

              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
