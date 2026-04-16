import * as React from "react";

export function ReadyToCloseBadge() {
  return (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
      SR sẵn sàng đóng
    </span>
  );
}

export function ClosedSrBadge() {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
      SR đã đóng
    </span>
  );
}

export function PriorityBadge({
  level,
}: {
  level?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string | null;
}) {
  const raw = String(level || "").toUpperCase();
  if (!raw) return null;

  if (raw === "URGENT") {
    return (
      <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        Gấp
      </span>
    );
  }

  if (raw === "HIGH") {
    return (
      <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700">
        Ưu tiên
      </span>
    );
  }

  if (raw === "MEDIUM" || raw === "NORMAL") {
    return (
      <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] text-sky-700">
        Bình thường
      </span>
    );
  }

  return (
    <span className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-[11px] text-stone-600">
      Thấp
    </span>
  );
}
