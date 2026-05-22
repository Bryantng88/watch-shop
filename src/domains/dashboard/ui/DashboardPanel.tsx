"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DashboardActionItem, DashboardPipelineItem } from "../shared";

const dotTone = {
  slate: "bg-slate-400",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
};

const chipTone = {
  slate: "bg-slate-50 text-slate-600 ring-slate-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Number(value ?? 0));
}

function formatActionValue(item: DashboardActionItem) {
  if (item.format === "money") return `${formatNumber(item.value)} VND`;
  return formatNumber(item.value);
}

export function DashboardPanel({
  title,
  subtitle,
  totalLabel,
  total,
  children,
}: {
  title: string;
  subtitle?: string;
  totalLabel?: string;
  total?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>

        {typeof total === "number" ? (
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {totalLabel || "Tổng"} {formatNumber(total)}
          </div>
        ) : null}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

export function PipelineList({ items }: { items: DashboardPipelineItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const row = (
          <div className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2.5 transition hover:bg-slate-50">
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dotTone[item.tone ?? "slate"])} />
              <span className="truncate text-sm font-medium text-slate-700">{item.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold ring-1", chipTone[item.tone ?? "slate"])}>
                {formatNumber(item.value)}
              </span>
              {item.href ? <ArrowUpRight className="h-3.5 w-3.5 text-slate-300" /> : null}
            </div>
          </div>
        );

        return item.href ? <Link key={item.key} href={item.href}>{row}</Link> : <div key={item.key}>{row}</div>;
      })}
    </div>
  );
}

export function ActionList({ items }: { items: DashboardActionItem[] }) {
  if (!items.length) return <div className="text-sm text-slate-500">Không có việc cần xử lý.</div>;

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const row = (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-slate-200 hover:bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                {item.helper ? <div className="mt-1 text-xs text-slate-500">{item.helper}</div> : null}
              </div>

              <div className={cn("rounded-full px-2.5 py-1 text-xs font-bold ring-1", chipTone[item.tone ?? "slate"])}>
                {formatActionValue(item)}
              </div>
            </div>
          </div>
        );

        return item.href ? <Link key={item.key} href={item.href}>{row}</Link> : <div key={item.key}>{row}</div>;
      })}
    </div>
  );
}
