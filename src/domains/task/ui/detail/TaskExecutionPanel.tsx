"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

function targetLabel(type: string) {
  if (type === "SERVICE_REQUEST") return "Service Request";
  if (type === "TECHNICAL_ISSUE") return "Technical Issue";
  if (type === "ORDER") return "Order";
  if (type === "SHIPMENT") return "Shipment";
  if (type === "PAYMENT") return "Payment";
  if (type === "WATCH") return "Watch";
  if (type === "WORK_CASE") return "Phiếu xử lý";
  if (type === "ACQUISITION") return "Acquisition";
  return type;
}

function actionLabel(type: string) {
  if (type === "CREATED") return "Đã tạo";
  if (type === "LINKED") return "Đã link";
  if (type === "UPDATED") return "Đã cập nhật";
  if (type === "CANCELLED") return "Đã hủy";
  return type;
}

function actionTone(type: string) {
  if (type === "CREATED") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  if (type === "LINKED") return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  if (type === "UPDATED") return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  if (type === "CANCELLED") return "bg-slate-100 text-slate-500 ring-1 ring-slate-200";
  return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
}

function targetHref(type: string, id: string) {
  if (type === "SERVICE_REQUEST") return `/admin/services/${id}`;
  if (type === "ORDER") return `/admin/orders/${id}`;
  if (type === "SHIPMENT") return `/admin/shipments/${id}`;
  if (type === "PAYMENT") return `/admin/payments`;
  if (type === "WATCH") return `/admin/watches/${id}`;
  if (type === "WORK_CASE") return `/admin/work-cases/${id}`;
  return null;
}

export default function TaskExecutionPanel({ executions = [] }: { executions?: any[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Kết quả thực thi</p>
          <h3 className="text-base font-semibold text-slate-950">Nghiệp vụ đã tạo / đã link</h3>
        </div>
      </div>

      {!executions.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Chưa có nghiệp vụ nào được tạo hoặc link từ task này.
        </div>
      ) : (
        <div className="space-y-3">
          {executions.map((item) => {
            const href = targetHref(item.targetType, item.targetId);
            return (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {targetLabel(item.targetType)}
                      </span>
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", actionTone(item.actionType))}>
                        {actionLabel(item.actionType)}
                      </span>
                    </div>
                    <p className="mt-2 break-all text-xs text-slate-400">ID: {item.targetId}</p>
                    {item.note ? <p className="mt-2 text-sm text-slate-600">{item.note}</p> : null}
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                      {item.createdByUser ? ` · ${item.createdByUser.name ?? item.createdByUser.email}` : ""}
                    </p>
                  </div>
                  {href ? (
                    <a href={href} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
                      Mở <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
