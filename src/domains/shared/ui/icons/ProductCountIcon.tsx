"use client";

import { Package, PackageOpen } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  count?: number | string | null;
  withLabel?: boolean;
  className?: string;
};

export default function ProductCountIcon({ count, withLabel = false, className }: Props) {
  const n = Number(count ?? 0);
  const isMulti = n > 1;
  const Icon = isMulti ? PackageOpen : Package;
  const label = isMulti ? `${n} sản phẩm` : "1 sản phẩm";

  return (
    <span
      title={isMulti ? "Đơn nhiều sản phẩm" : "Đơn một sản phẩm"}
      aria-label={isMulti ? "Đơn nhiều sản phẩm" : "Đơn một sản phẩm"}
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full bg-slate-50 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200",
        withLabel ? "gap-1.5 px-2" : "w-5",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {withLabel ? <span>{label}</span> : null}
    </span>
  );
}
