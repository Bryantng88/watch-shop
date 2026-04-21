"use client";

import { Wrench } from "lucide-react";
import { CollapsibleSection, DotLabel, SectionEmpty, fmtDate, toneForStatus } from "./shared";

export default function WatchServicePanel({ serviceHistory = [] }: { serviceHistory?: any[]; }) {
  const openService = (serviceHistory ?? []).find(
    (x: any) => !["COMPLETED", "DELIVERED", "CANCELED", "CANCELLED"].includes(String(x?.status ?? "").toUpperCase())
  );

  return (
    <CollapsibleSection
      title="Lịch sử service"
      desc="Theo dõi trạng thái xử lý kỹ thuật."
      icon={<Wrench className="h-5 w-5" />}
      defaultOpen
      right={openService ? <span className="hidden text-xs text-slate-500 sm:block">Đang mở: {openService.status || "-"}</span> : null}
    >
      {serviceHistory.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-medium">Issue</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Vendor</th>
                <th className="px-3 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {serviceHistory.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-900">{item?.issueTitle || item?.title || item?.issueType || "-"}</td>
                  <td className="px-3 py-3"><DotLabel label={item?.status || "-"} tone={toneForStatus(item?.status)} /></td>
                  <td className="px-3 py-3 text-slate-700">{item?.vendor?.name || item?.vendorName || "-"}</td>
                  <td className="px-3 py-3 text-slate-500">{fmtDate(item?.updatedAt || item?.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <SectionEmpty text="Chưa có lịch sử service." />
      )}
    </CollapsibleSection>
  );
}
