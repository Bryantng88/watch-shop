"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DashboardMetric } from "../shared";

const toneClass = {
  slate: "bg-slate-50 text-slate-700 ring-slate-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
};

function formatValue(item: DashboardMetric) {
  if (item.format === "money") {
    return `${new Intl.NumberFormat("vi-VN").format(Number(item.value ?? 0))} VND`;
  }

  return new Intl.NumberFormat("vi-VN").format(Number(item.value ?? 0));
}

export default function DashboardMetricCard({ item }: { item: DashboardMetric }) {
  const content = (
    <div className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {item.label}
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            {formatValue(item)}
          </div>
          {item.helper ? <div className="mt-2 text-sm text-slate-500">{item.helper}</div> : null}
        </div>

        <div
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ring-1",
            toneClass[item.tone ?? "slate"],
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  return item.href ? <Link href={item.href}>{content}</Link> : content;
}
