import { Ban, Check, FilePenLine } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  status?: string | null;
  className?: string;
};

export default function AcquisitionStatusSignal({ status, className }: Props) {
  const key = String(status ?? "").toUpperCase();

  if (key === "POSTED" || key === "APPROVED") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <span className="grid h-7 w-7 place-items-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-[0_1px_3px_rgba(16,185,129,0.08)]">
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <span className="text-[11px] font-semibold text-emerald-700">Đã nhập kho</span>
      </span>
    );
  }

  if (key === "CANCELLED" || key === "CANCELED") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <span className="grid h-7 w-7 place-items-center rounded-md border border-rose-100 bg-rose-50 text-rose-500">
          <Ban className="h-3.5 w-3.5" strokeWidth={1.7} />
        </span>
        <span className="text-[11px] font-semibold text-rose-600">Đã hủy</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-slate-50 text-slate-400">
        <FilePenLine className="h-3.5 w-3.5" strokeWidth={1.7} />
      </span>
      <span className="text-[11px] font-semibold text-slate-500">Bản nháp</span>
    </span>
  );
}
