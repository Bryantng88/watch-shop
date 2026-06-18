"use client";

import Link from "next/link";
import {
  ExternalLink,
  PackageCheck,
  ReceiptText,
  Truck,
  WalletCards,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  task: any;
  executions?: any[];
};

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
  if (type === "ORDER") return <ReceiptText className="h-3.5 w-3.5" />;
  if (type === "SHIPMENT") return <Truck className="h-3.5 w-3.5" />;
  if (type === "PAYMENT") return <WalletCards className="h-3.5 w-3.5" />;
  if (type === "SERVICE_REQUEST") return <Wrench className="h-3.5 w-3.5" />;
  return <PackageCheck className="h-3.5 w-3.5" />;
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

function statusTone(status?: string | null) {
  const value = String(status ?? "").toUpperCase();

  if (["DONE", "COMPLETED", "DELIVERED", "PAID", "RESOLVED"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (["IN_PROGRESS", "PROCESSING", "SHIPPED", "POSTED"].includes(value)) {
    return "bg-blue-50 text-blue-700 ring-blue-100";
  }

  if (["CONFIRMED", "READY", "OPEN"].includes(value)) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  if (["CANCELLED", "CANCELED", "RETURNED"].includes(value)) {
    return "bg-slate-100 text-slate-500 ring-slate-200";
  }

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

function groupExecutions(executions: any[]) {
  const map = new Map<string, any>();

  for (const item of executions) {
    const key = `${item.targetType}:${item.targetId}`;

    if (!map.has(key)) {
      map.set(key, {
        ...item,
        events: [item],
        latestAt: item.createdAt,
      });
    } else {
      const group = map.get(key);
      group.events.push(item);

      if (new Date(item.createdAt).getTime() > new Date(group.latestAt).getTime()) {
        group.latestAt = item.createdAt;
        group.actionType = item.actionType;
        group.note = item.note;
        group.targetStatus = item.targetStatus;
        group.status = item.status;
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
  );
}

function isIssueDone(issue: any) {
  const status = String(issue?.executionStatus ?? "").toUpperCase();
  return status === "DONE" || status === "COMPLETED";
}

function isIssueInProgress(issue: any) {
  const status = String(issue?.executionStatus ?? "").toUpperCase();
  return status === "IN_PROGRESS";
}

function getSrProgress(sr: any) {
  const issues = sr?.technicalIssue ?? [];
  const total = issues.length;
  const done = issues.filter(isIssueDone).length;
  const inProgress = issues.filter(isIssueInProgress).length;

  if (!sr?.id) {
    return {
      total,
      done,
      label: "Chưa có Service Request",
      tone: "bg-slate-50 text-slate-500 ring-slate-200",
      percent: 0,
    };
  }

  if (total === 0) {
    return {
      total,
      done,
      label: "SR đã tạo, chưa có issue",
      tone: "bg-slate-50 text-slate-600 ring-slate-200",
      percent: 0,
    };
  }

  if (done === total) {
    return {
      total,
      done,
      label: "Tất cả issue đã xong",
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      percent: 100,
    };
  }

  if (done > 0 || inProgress > 0) {
    return {
      total,
      done,
      label: "Đang xử lý issue",
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
      percent: Math.round((done / total) * 100),
    };
  }

  return {
    total,
    done,
    label: "Issue đang mở",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
    percent: 0,
  };
}

function IssueStatusBadge({ status }: { status?: string | null }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
        statusTone(status),
      )}
    >
      {status || "-"}
    </span>
  );
}

function ExecutionShell({
  type,
  actionType,
  status,
  href,
  children,
}: {
  type: string;
  actionType?: string | null;
  status?: string | null;
  href?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {targetIcon(type)}
              {targetLabel(type)}
            </span>

            {actionType ? (
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                  actionTone(actionType),
                )}
              >
                {actionLabel(actionType)}
              </span>
            ) : null}

            {status ? (
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                  statusTone(status),
                )}
              >
                {status}
              </span>
            ) : null}
          </div>

          <div className="mt-3">{children}</div>
        </div>

        {href ? (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            onClick={(event) => event.stopPropagation()}
          >
            Mở
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ServiceRequestProgressCard({
  task,
  execution,
}: {
  task: any;
  execution: any;
}) {
  const sr = task?.serviceRequest ?? null;
  const issues = sr?.technicalIssue ?? [];
  const progress = getSrProgress(sr);
  const href = sr?.id ? `/admin/services/${sr.id}` : null;

  return (
    <ExecutionShell
      type="SERVICE_REQUEST"
      status={progress.label}
      href={href}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="font-semibold text-slate-950">
          {sr?.refNo || sr?.id || execution.targetId}
        </div>

        <div className="text-sm text-slate-500">
          SR:{" "}
          <span className="font-semibold text-slate-800">
            {sr?.status ?? "-"}
          </span>
        </div>

        <div className="text-sm text-slate-500">
          TI:{" "}
          <span className="font-semibold text-slate-800">
            {progress.done}/{progress.total}
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 max-w-[520px] overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            progress.total > 0 && progress.done === progress.total
              ? "bg-emerald-500"
              : "bg-blue-500",
          )}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {issues.length > 0 ? (
        <div className="mt-3 w-full space-y-2">
          {issues.slice(0, 5).map((issue: any) => (
            <div
              key={issue.id}
              className="flex w-full items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {issue.summary || issue.area || "Technical issue"}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Khu vực: {issue.area || "-"}
                </div>
              </div>

              <IssueStatusBadge status={issue.executionStatus} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-2 text-xs text-slate-300">
        ID: {sr?.id || execution.targetId}
      </div>
    </ExecutionShell>
  );
}

function DefaultExecutionCard({ item }: { item: any }) {
  const href = targetHref(item.targetType, item.targetId);
  const status = getStatus(item);
  const displayRef = getDisplayRef(item);

  return (
    <ExecutionShell
      type={item.targetType}
      actionType={item.actionType}
      status={status}
      href={href}
    >
      <div className="break-all font-semibold text-slate-950">
        {displayRef}
      </div>

      {item.note ? (
        <p className="mt-2 text-sm text-slate-600">{item.note}</p>
      ) : null}

      <p className="mt-2 text-xs text-slate-400">
        {formatDate(item.createdAt)}
        {item.createdByUser?.name ? ` · ${item.createdByUser.name}` : ""}
      </p>

      {item.targetId ? (
        <p className="mt-1 break-all text-[11px] text-slate-300">
          ID: {item.targetId}
        </p>
      ) : null}
    </ExecutionShell>
  );
}

export default function TaskExecutionPanel({
  task,
  executions = [],
}: Props) {
  const visibleExecutions = groupExecutions(
    executions.filter((item) => item.targetType !== "TECHNICAL_ISSUE"),
  );

  if (!executions.length) return null;

  return (
    <section className="border-y border-slate-100 bg-slate-50 px-3 py-4">
      <div className="space-y-3">
        {visibleExecutions.map((item) =>
          item.targetType === "SERVICE_REQUEST" ? (
            <ServiceRequestProgressCard
              key={`${item.targetType}:${item.targetId}`}
              task={task}
              execution={item}
            />
          ) : (
            <DefaultExecutionCard
              key={`${item.targetType}:${item.targetId}`}
              item={item}
            />
          ),
        )}
      </div>
    </section>
  );
}
{/* <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Kết quả thực thi
          </p>

          <h3 className="text-base font-semibold text-slate-950">
            Timeline nghiệp vụ từ task
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi Service Request, Technical Issue và các nghiệp vụ thật được tạo/link từ task này.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 sm:justify-end">
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

            {executions.length
              ? hasDoneSignal
                ? "Có kết quả hoàn tất"
                : "Đang thực hiện"
              : "Chưa có kết quả"}
          </div>

          {latest ? (
            <span className="text-xs text-slate-400">
              Cập nhật cuối: {targetLabel(latest.targetType)} · {formatDate(latest.createdAt)}
            </span>
          ) : null}
        </div>
      </div> */}