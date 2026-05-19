"use client";

import { Building2, Globe2, Watch } from "lucide-react";

import { cn } from "@/lib/utils";

export function getOrderSourceIconConfig(source?: string | null) {
  const value = String(source ?? "").toUpperCase();

  if (value === "WEB") {
    return {
      label: "Web",
      title: "Nguồn đơn: Web",
      Icon: Globe2,
      className: "bg-blue-50 text-blue-700 ring-blue-200",
    };
  }

  if (value === "WATCH_QUICK_ORDER") {
    return {
      label: "Tạo từ watch",
      title: "Nguồn đơn: Tạo từ watch",
      Icon: Watch,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  }

  return {
    label: "Nội bộ",
    title: "Nguồn đơn: Nội bộ",
    Icon: Building2,
    className: "bg-slate-50 text-slate-500 ring-slate-200",
  };
}

type Props = {
  source?: string | null;
  withLabel?: boolean;
  className?: string;
};

export default function OrderSourceIcon({ source, withLabel = false, className }: Props) {
  const config = getOrderSourceIconConfig(source);
  const Icon = config.Icon;

  return (
    <span
      title={config.title}
      aria-label={config.title}
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full text-[11px] font-semibold ring-1",
        withLabel ? "gap-1.5 px-2" : "w-5",
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {withLabel ? <span>{config.label}</span> : null}
    </span>
  );
}
