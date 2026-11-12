"use client";

import { Clock3 } from "lucide-react";
import { fmtDate, SectionCard, type OrderDetailData } from "./shared";

export default function OrderTimelinePanel({ data }: { data: OrderDetailData }) {
  const events = [
    { label: "Order created", time: data.createdAt, description: "Đơn hàng được tạo trong hệ thống." },
    { label: "Latest update", time: data.updatedAt, description: "Lần cập nhật dữ liệu gần nhất." },
  ];

  return (
    <SectionCard icon={<Clock3 className="h-5 w-5" />} title="Timeline" subtitle="Dòng thời gian vận hành">
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-950" />
              {index < events.length - 1 ? <span className="mt-2 h-full w-px flex-1 bg-slate-200" /> : null}
            </div>
            <div className="pb-2">
              <div className="text-sm font-semibold text-slate-950">{event.label}</div>
              <div className="mt-0.5 text-xs text-slate-400">{fmtDate(event.time)}</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
