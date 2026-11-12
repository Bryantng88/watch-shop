"use client";

import { StickyNote } from "lucide-react";
import { SectionCard, type OrderDetailData } from "./shared";

export default function OrderNotesPanel({ data }: { data: OrderDetailData }) {
  return (
    <SectionCard icon={<StickyNote className="h-5 w-5" />} title="Ghi chú nội bộ" subtitle="Lưu ý vận hành đơn hàng">
      <div className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {data.notes?.trim() || "Chưa có ghi chú."}
      </div>
    </SectionCard>
  );
}
