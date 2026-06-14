"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Link2,
  PackageCheck,
  ReceiptText,
  Truck,
  WalletCards,
  Wrench,
} from "lucide-react";
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

function targetIcon(type: string) {
  if (type === "ORDER") return <ReceiptText className="h-4 w-4" />;
  if (type === "SHIPMENT") return <Truck className="h-4 w-4" />;
  if (type === "PAYMENT") return <WalletCards className="h-4 w-4" />;
  if (type === "SERVICE_REQUEST") return <Wrench className="h-4 w-4" />;
  return <PackageCheck className="h-4 w-4" />;
}

function actionLabel(type: string) {
  if (type === "CREATED") return "Đã tạo";
  if (type === "LINKED") return "Đã link";
  if (type === "UPDATED") return "Đã cập nhật";
  if (type === "CANCELLED") return "Đã hủy";
  return type;
}

function actionTone(type: string) {
  if (type === "CREATED") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (type === "LINKED") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (type === "UPDATED") return "bg-amber-50 text-amber-700 ring-amber-100";
  if (type === "CANCELLED") return "bg-slate-100 text-slate-500 ring-slate-200";
  return "bg-slate-50 text-slate-600 ring-slate-200";
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

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
}

function getDisplayRef(item: any) {
  return (
    item.targetRefNo ||
    item.targetCode ||
    item.targetTitle ||
    item.refNo ||
    item.targetId
  );
}

function getStatus(item: any) {
  return item.targetStatus || item.status || null;
}
function meta(item: any) {
  return item?.metadataJson ?? item?.metadata ?? {};
}

function shouldHideServiceRequestExecution(item: any, executions: any[]) {
  if (item.targetType !== "SERVICE_REQUEST") return false;

  return executions.some((x) => {
    const m = meta(x);
    return (
      x.targetType === "TECHNICAL_ISSUE" &&
      m?.serviceRequestId === item.targetId
    );
  });
}


export default function TaskExecutionPanel({ executions = [] }: { executions?: any[] }) {
  const latest = executions[0] ?? null;
  const hasDoneSignal = executions.some((item) =>
    ["DONE", "COMPLETED", "DELIVERED", "PAID"].includes(String(getStatus(item) ?? "").toUpperCase()),
  );
  const visibleExecutions = executions.filter(
    (item) => !shouldHideServiceRequestExecution(item, executions),
  );
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Kết quả thực thi
          </p>
          <h3 className="text-base font-semibold text-slate-950">
            Timeline nghiệp vụ từ task
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi các nghiệp vụ thật được tạo/link từ task này.
          </p>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
            executions.length
              ? hasDoneSignal
                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                : "bg-blue-50 text-blue-700 ring-blue-100"
              : "bg-slate-50 text-slate-500 ring-slate-200",
          )}
        >
          {executions.length ? (
            hasDoneSignal ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Clock3 className="h-3.5 w-3.5" />
            )
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          {executions.length ? (hasDoneSignal ? "Có kết quả hoàn tất" : "Đang thực hiện") : "Chưa có kết quả"}
        </div>
      </div>

      {!executions.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Chưa có nghiệp vụ nào được tạo hoặc link từ task này.
        </div>
      ) : (
        <div className="space-y-3">
          {visibleExecutions.map((item) => {
            const href = targetHref(item.targetType, item.targetId);
            const status = getStatus(item);
            const displayRef = getDisplayRef(item);

            return (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {targetIcon(item.targetType)}
                        {targetLabel(item.targetType)}
                      </span>

                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", actionTone(item.actionType))}>
                        {actionLabel(item.actionType)}
                      </span>

                      {status ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                          {String(status)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-semibold text-slate-950">
                        {displayRef}
                      </div>

                      {item.targetTitle ? (
                        <div className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {item.targetTitle}
                        </div>
                      ) : null}

                      {item.note ? (
                        <p className="mt-2 text-sm text-slate-600">{item.note}</p>
                      ) : null}
                      {item.targetType === "TECHNICAL_ISSUE" && meta(item)?.serviceRequestId ? (
                        <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                          Nằm trong SR:{" "}
                          <Link
                            href={`/admin/services/${meta(item).serviceRequestId}`}
                            className="font-semibold text-blue-700 hover:text-blue-900"
                          >
                            {meta(item).serviceRequestRefNo || meta(item).serviceRequestId}
                          </Link>
                          {meta(item).serviceRequestStatus ? (
                            <span className="ml-1 text-slate-400">
                              · {meta(item).serviceRequestStatus}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(item.createdAt)}
                        {item.createdByUser ? ` · ${item.createdByUser.name ?? item.createdByUser.email}` : ""}
                      </p>

                      {!item.targetRefNo && !item.targetTitle ? (
                        <p className="mt-1 break-all text-[11px] text-slate-300">
                          ID: {item.targetId}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {href ? (
                    <Link
                      href={href}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Mở <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {latest ? (
        <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <span className="text-slate-300">Cập nhật mới nhất:</span>{" "}
          <span className="font-semibold">{targetLabel(latest.targetType)}</span>{" "}
          {actionLabel(latest.actionType).toLowerCase()} lúc {formatDate(latest.createdAt)}
        </div>
      ) : null}
    </section>
  );
}