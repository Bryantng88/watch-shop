"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildCompletedSummaryPoints,
  buildServiceImageSrc,
  formatCurrency,
  formatDateTime,
  serviceScopeLabel,
  serviceStatusLabel,
} from "./helpers";
import type { ServiceRequestDetailViewModel } from "./types";

function PriorityBadge({ priority }: { priority?: string | null }) {
  const normalized = String(priority || "NORMAL").toUpperCase();
  const tone =
    normalized === "URGENT"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : normalized === "HIGH"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-50 text-slate-600";
  const label = normalized === "URGENT" ? "Ưu tiên gấp" : normalized === "HIGH" ? "Ưu tiên cao" : "Ưu tiên thường";

  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", tone)}>{label}</span>;
}

function StatusBadge({ status }: { status?: string | null }) {
  const normalized = String(status || "").toUpperCase();
  const tone: Record<string, string> = {
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-700",
    DIAGNOSING: "border-indigo-200 bg-indigo-50 text-indigo-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    OPEN: "border-sky-200 bg-sky-50 text-sky-700",
    DRAFT: "border-slate-200 bg-slate-50 text-slate-700",
    CANCELED: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", tone[normalized] || tone.DRAFT)}>
      {serviceStatusLabel(status)}
    </span>
  );
}

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-base font-semibold text-slate-950">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DetailActionButton({
  children,
  onClick,
  primary = false,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
        primary ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function ServiceDetailHero({
  detail,
  onBack,
  onEditSpec,
  onOpenIssues,
}: {
  detail: ServiceRequestDetailViewModel;
  onBack: () => void;
  onEditSpec?: () => void;
  onOpenIssues: () => void;
}) {
  const sr = detail.serviceRequest;
  const imageSrc = buildServiceImageSrc(sr.primaryImageUrl);
  const totalCost = Number(detail.financialSummary?.totalCost ?? 0);
  const appearanceScore = Number(detail.appearanceSummary?.score ?? 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Service Request Detail</h1>
          <p className="mt-1 text-sm text-slate-500">{sr.refNo || sr.id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DetailActionButton onClick={onBack}>← Quay lại</DetailActionButton>
          <DetailActionButton onClick={onOpenIssues} primary icon={<ExternalLink className="h-4 w-4" />}>
            Quản lý issue
          </DetailActionButton>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {imageSrc ? <img src={imageSrc} alt={sr.productTitle || "product"} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={sr.status} />
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">{serviceScopeLabel(sr.scope)}</span>
                <PriorityBadge priority={sr.priority} />
              </div>

              <h2 className="mt-3 line-clamp-2 text-2xl font-semibold tracking-tight text-slate-950">{sr.productTitle || "-"}</h2>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span>SKU: <span className="font-medium text-slate-700">{sr.skuSnapshot || "-"}</span></span>
                <span>Ref: <span className="font-medium text-slate-700">{sr.ref || "-"}</span></span>
                <span>Model: <span className="font-medium text-slate-700">{sr.model || "-"}</span></span>
                <span>Máy: <span className="font-medium text-slate-700">{sr.movement || "-"}</span></span>
                <span>KTV: <span className="font-medium text-slate-700">{sr.technicianNameSnap || "-"}</span></span>
                <span>Cập nhật: <span className="font-medium text-slate-700">{formatDateTime(sr.updatedAt)}</span></span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 xl:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{appearanceScore}/100</div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{formatCurrency(totalCost)}</div>
            </div>
            {onEditSpec ? (
              <DetailActionButton onClick={onEditSpec} icon={<PencilLine className="h-4 w-4" />}>
                Sửa spec sản phẩm
              </DetailActionButton>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewStatCard({ label, value, helper, icon, accent = "slate" }: { label: string; value: React.ReactNode; helper?: string; icon?: React.ReactNode; accent?: "slate" | "sky" | "emerald" | "amber" }) {
  const accents: Record<string, string> = {
    slate: "before:bg-slate-300",
    sky: "before:bg-sky-400",
    emerald: "before:bg-emerald-400",
    amber: "before:bg-amber-400",
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1", accents[accent])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
          {helper ? <div className="mt-1 text-sm text-slate-500">{helper}</div> : null}
        </div>
        {icon ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500">{icon}</div> : null}
      </div>
    </div>
  );
}

export function ServiceOverviewCard({ detail }: { detail: ServiceRequestDetailViewModel }) {
  const technical = detail.technicalSummary ?? {};
  const technicalIssues = detail.technicalIssues ?? [];
  const issueCount = Number(technical.issueCount ?? 0);
  const openIssueCount = Number(technical.openIssueCount ?? 0);
  const doneIssueCount = Math.max(0, issueCount - openIssueCount);
  const vendorCount = technicalIssues.filter((x) => String(x.actionMode || "").toUpperCase() === "VENDOR" && String(x.executionStatus || "").toUpperCase() !== "CANCELED").length;

  return (
    <SectionCard title="Tổng quan service" subtitle="Trang detail chỉ dùng để xem thông tin. Thao tác issue được xử lý trong modal quản lý issue.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <OverviewStatCard label="Tổng issue" value={issueCount} helper="Tất cả hạng mục đã ghi nhận" accent="slate" icon={<ClipboardList className="h-5 w-5" />} />
        <OverviewStatCard label="Issue đang mở" value={openIssueCount} helper="Đang cần theo dõi tiếp" accent="sky" icon={<AlertTriangle className="h-5 w-5" />} />
        <OverviewStatCard label="Issue đã xong" value={doneIssueCount} helper="Đã xử lý hoàn tất" accent="emerald" icon={<CheckCircle2 className="h-5 w-5" />} />
        <OverviewStatCard label="Số lần thuê vendor" value={vendorCount} helper="Tổng số hạng mục thuê ngoài" accent="amber" icon={<CircleDollarSign className="h-5 w-5" />} />
      </div>
    </SectionCard>
  );
}

export function ServiceCompletedSummaryCard({ detail }: { detail: ServiceRequestDetailViewModel }) {
  const assessment = detail.technicalAssessment ?? detail.assessment ?? null;
  const points = buildCompletedSummaryPoints({ assessment, technicalIssues: detail.technicalIssues ?? [], movementStatus: assessment?.movementStatus });
  const totalCost = Number(detail.financialSummary?.totalCost ?? 0);
  const score = Number(detail.appearanceSummary?.score ?? 100);

  return (
    <SectionCard title="Kết luận kỹ thuật" subtitle="Bản tóm tắt nhanh kết quả service.">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_280px]">
        <div className="rounded-2xl bg-slate-50/70 p-4">
          <div className="text-sm font-semibold text-slate-800">Tóm tắt xử lý</div>
          {assessment?.conclusion ? <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{assessment.conclusion}</p> : null}
          <div className="mt-4 space-y-2">
            {points.slice(0, 6).map((item, idx) => (
              <div key={`${item}-${idx}`} className="flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-600">Điểm thẩm mỹ</div>
            <div className="mt-2 text-2xl font-semibold text-emerald-700">{score}/100</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Tổng phí service</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(totalCost)}</div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function ServiceReadonlyInfoCard({ detail }: { detail: ServiceRequestDetailViewModel }) {
  const sr = detail.serviceRequest;
  return (
    <SectionCard title="Thông tin ghi chú" subtitle="Các thông tin tham chiếu của phiếu service.">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Dịch vụ</div>
          <div className="mt-2 text-sm font-medium text-slate-900">{sr.serviceName || "-"}</div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Vendor</div>
          <div className="mt-2 text-sm font-medium text-slate-900">{sr.vendorNameSnap || "-"}</div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Ngày tạo</div>
          <div className="mt-2 text-sm font-medium text-slate-900">{formatDateTime(sr.createdAt)}</div>
        </div>
      </div>
      {sr.customerItemNote ? (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-700">
          {sr.customerItemNote}
        </div>
      ) : null}
    </SectionCard>
  );
}

function issueExecutionLabel(status?: string | null) {
  const key = String(status ?? "").toUpperCase();
  if (key === "OPEN") return "Mở";
  if (key === "IN_PROGRESS") return "Đang xử lý";
  if (key === "DONE" || key === "COMPLETED") return "Hoàn tất";
  if (key === "CANCELED") return "Đã hủy";
  return status || "-";
}

export function ServiceIssuesSummaryCard({ detail }: { detail: ServiceRequestDetailViewModel }) {
  const issues = detail.technicalIssues ?? [];

  return (
    <SectionCard
      title="Technical issues"
      subtitle="Tổng hợp đầu bài, hạng mục kết luận, linh kiện và chi phí của từng issue."
    >
      {!issues.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
          Chưa có issue kỹ thuật nào.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hạng mục</th>
                <th className="px-4 py-3">Linh kiện / part</th>
                <th className="px-4 py-3 text-right">Chi phí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {issues.map((issue: any) => {
                const catalog = issue.serviceCatalog?.name ?? "-";
                const parts = [issue.supplyCatalog?.name, issue.mechanicalPartCatalog?.name].filter(Boolean).join(", ") || "-";

                return (
                  <tr key={issue.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{issue.summary || "Technical issue"}</div>
                      {issue.resolutionNote ? (
                        <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{issue.resolutionNote}</div>
                      ) : issue.note ? (
                        <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{issue.note}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{issueExecutionLabel(issue.executionStatus)}</td>
                    <td className="px-4 py-3 text-slate-700">{catalog}</td>
                    <td className="px-4 py-3 text-slate-600">{parts}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(Number(issue.actualCost ?? 0))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
