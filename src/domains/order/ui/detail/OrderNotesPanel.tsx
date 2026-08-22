"use client";

import { StickyNote } from "lucide-react";
import { SectionCard, type OrderDetailData } from "./shared";

export default function OrderNotesPanel({ data }: { data: OrderDetailData }) {
  return (
    <SectionCard icon={<StickyNote className="h-5 w-5" />} title="Ghi chú nội bộ" subtitle="Lưu ý vận hành đơn hàng">
      <div className="min-h-[96px] whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200/70">
        {data.notes?.trim() || "Chưa có ghi chú."}
      </div>
    </SectionCard>
  );
}
