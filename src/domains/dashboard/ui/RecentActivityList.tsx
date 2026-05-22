"use client";

import Link from "next/link";
import { ClipboardList, Package, ShoppingBag, Watch } from "lucide-react";

import { DomainSignalIcon } from "@/domains/shared/ui/icons";
import type { DashboardRecentItem } from "../shared";

function iconFor(type: DashboardRecentItem["type"]) {
  if (type === "ORDER") return <ShoppingBag />;
  if (type === "SHIPMENT") return <Package />;
  if (type === "WATCH") return <Watch />;
  return <ClipboardList />;
}

function labelFor(type: DashboardRecentItem["type"]) {
  if (type === "ORDER") return "Order";
  if (type === "SHIPMENT") return "Shipment";
  if (type === "WATCH") return "Watch";
  return "Acquisition";
}

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export default function RecentActivityList({ items }: { items: DashboardRecentItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const row = (
          <div className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3 transition hover:bg-slate-50">
            <div className="flex min-w-0 items-center gap-3">
              <DomainSignalIcon title={labelFor(item.type)} icon={iconFor(item.type)} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{item.title}</div>
                {item.subtitle ? <div className="mt-0.5 truncate text-xs text-slate-500">{item.subtitle}</div> : null}
              </div>
            </div>

            <div className="shrink-0 text-xs font-medium text-slate-400">
              {formatDate(item.updatedAt)}
            </div>
          </div>
        );

        return item.href ? <Link key={item.id} href={item.href}>{row}</Link> : <div key={item.id}>{row}</div>;
      })}
    </div>
  );
}
