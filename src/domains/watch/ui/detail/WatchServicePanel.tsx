"use client";

import { Wrench } from "lucide-react";
import {
  DetailField,
  SectionCard,
  SectionEmpty,
  StatusBadge,
  fmtDate,
} from "./shared";

type Props = {
  serviceHistory?: any[];
};

export default function WatchServicePanel({ serviceHistory = [] }: Props) {
  const items = Array.isArray(serviceHistory) ? serviceHistory : [];

  return (
    <SectionCard
      title="Lịch sử service"
      subtitle="Theo dõi trạng thái xử lý kỹ thuật."
      icon={<Wrench className="h-5 w-5" />}
      defaultOpen
    >
      {items.length === 0 ? (
        <SectionEmpty text="Chưa có lịch sử service cho watch này." />
      ) : (
        <div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-slate-200">
          <div className="grid grid-cols-12 gap-3 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            <div className="col-span-4">Issue</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Vendor</div>
            <div className="col-span-3">Updated</div>
          </div>

          <div className="divide-y divide-slate-200">
            {items.map((item, index) => (
              <div
                key={item.id ?? index}
                className="grid grid-cols-12 gap-3 px-4 py-4 text-sm"
              >
                <div className="col-span-4 min-w-0">
                  <div className="truncate font-medium text-slate-900">
                    {item.issue || item.title || "-"}
                  </div>
                  {item.note || item.description ? (
                    <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {item.note || item.description}
                    </div>
                  ) : null}
                </div>

                <div className="col-span-2">
                  <StatusBadge label={item.status} />
                </div>

                <div className="col-span-3 text-slate-700">
                  {item.vendor?.name || item.vendorName || "-"}
                </div>

                <div className="col-span-3 text-slate-500">
                  {fmtDate(item.updatedAt || item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}