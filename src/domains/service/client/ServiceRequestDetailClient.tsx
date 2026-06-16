"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ImageIcon,
  Plus,
  Wrench,
  ExternalLink,
} from "lucide-react";

import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { createTechnicalIssueForServiceRequestAction } from "@/domains/service/actions/service-request.actions";
import {
  ServiceIssueManageModal,
  type IssueBoardCatalogs,
  type IssueItem,
} from "@/domains/service/ui/issue-board";
import type { ServiceRequestDetailViewModel } from "@/domains/service/ui/detail/types";

type IssueBoardPayload = {
  items: IssueItem[];
  counts: {
    pendingConfirm: number;
    ready: number;
    inProgress: number;
    done: number;
    readyToCloseSrCount?: number;
  };
  catalogs?: IssueBoardCatalogs;
};

function mediaUrl(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return raw;
  return `/api/media/${raw}`;
}

function money(value: unknown) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "0đ";
  return `${n.toLocaleString("vi-VN")}đ`;
}

function labelOf(value: unknown) {
  const raw = String(value ?? "").trim();
  return raw || "-";
}

function issueStatusTone(status: string) {
  const s = status.toUpperCase();

  if (s.includes("DONE") || s.includes("COMPLETED")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (s.includes("PROGRESS")) {
    return "bg-blue-50 text-blue-700 ring-blue-100";
  }

  if (s.includes("CANCEL")) {
    return "bg-slate-50 text-slate-500 ring-slate-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function areaLabel(value?: string | null) {
  const map: Record<string, string> = {
    GENERAL: "Tổng quát",
    MOVEMENT: "Máy",
    CASE: "Vỏ",
    CRYSTAL: "Kính",
    DIAL: "Mặt số",
    HANDS: "Kim",
    CROWN: "Núm",
    BRACELET: "Dây / bracelet",
  };

  const key = String(value ?? "").toUpperCase();
  return map[key] ?? value ?? "-";
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function issueTitle(item: any) {
  return item.summary || item.area || "Technical issue";
}

function issueVendorName(item: any) {
  return (
    item.vendorName ??
    item.vendorNameSnap ??
    item.vendor?.name ??
    item.serviceRequest?.vendorNameSnap ??
    null
  );
}

function issueCreatedBy(item: any) {
  return (
    item.createdByUser?.name ??
    item.createdBy?.name ??
    item.technician?.name ??
    item.technicianNameSnap ??
    null
  );
}

export default function ServiceRequestDetailClient({
  detail,
  issueBoard,
}: {
  detail: ServiceRequestDetailViewModel;
  issueBoard: IssueBoardPayload;
}) {
  const router = useRouter();
  const notify = useNotify();
  const [pending, startTransition] = React.useTransition();

  const [issueModalOpen, setIssueModalOpen] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);

  const sr = detail.serviceRequest;
  const issueCount = issueBoard.items?.length ?? 0;

  const image = mediaUrl(
    sr.primaryImageUrlSnapshot ??
    (sr as any).primaryImageUrl ??
    (sr as any).product?.primaryImageUrl ??
    null,
  );

  const title =
    sr.modelSnapshot ??
    (sr as any).productTitle ??
    (sr as any).model ??
    (sr as any).product?.title ??
    "Service Request";

  const [summary, setSummary] = React.useState("");
  const [area, setArea] = React.useState("GENERAL");
  const [actionMode, setActionMode] = React.useState("INTERNAL");
  const [technicalDetailCatalogId, setTechnicalDetailCatalogId] =
    React.useState("");
  const [note, setNote] = React.useState("");

  const technicalOptions =
    issueBoard.catalogs?.technicalDetailCatalogOptions ?? [];

  const totalCost = React.useMemo(() => {
    return (issueBoard.items ?? []).reduce((sum, item: any) => {
      const cost = Number(item.actualCost ?? item.cost ?? 0);
      return sum + (Number.isFinite(cost) ? cost : 0);
    }, 0);
  }, [issueBoard.items]);

  function resetForm() {
    setSummary("");
    setArea("GENERAL");
    setActionMode("INTERNAL");
    setTechnicalDetailCatalogId("");
    setNote("");
  }

  function createIssue() {
    const cleanSummary = summary.trim();

    if (!cleanSummary) {
      notify.error("Vui lòng nhập nội dung issue");
      return;
    }

    startTransition(async () => {
      try {
        await createTechnicalIssueForServiceRequestAction({
          serviceRequestId: sr.id,
          summary: cleanSummary,
          area,
          actionMode,
          note: note.trim() || null,
          technicalDetailCatalogId: technicalDetailCatalogId || null,
        });

        notify.success("Đã tạo issue kỹ thuật");
        resetForm();
        router.refresh();
      } catch (error: any) {
        notify.error(error?.message || "Không tạo được issue");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-5 px-6 py-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        {issueCount > 0 ? (
          <button
            type="button"
            onClick={() => setIssueModalOpen(true)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Quản lý issue
          </button>
        ) : null}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {sr.status}
              </span>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {sr.priority || "NORMAL"}
              </span>

              {sr.refNo ? (
                <span className="text-xs text-slate-400">{sr.refNo}</span>
              ) : null}
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              {title}
            </h1>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
              <span>SKU: {labelOf(sr.skuSnapshot)}</span>
              <span>KTV: {labelOf(sr.technicianNameSnap)}</span>
              <span>Vendor: {labelOf(sr.vendorNameSnap)}</span>
            </div>
          </div>

          <div className="hidden shrink-0 gap-2 md:flex">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <div className="text-xs font-semibold uppercase text-slate-400">
                Issue
              </div>
              <div className="mt-1 text-xl font-bold text-slate-950">
                {issueCount}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <div className="text-xs font-semibold uppercase text-slate-400">
                Phí
              </div>
              <div className="mt-1 text-xl font-bold text-slate-950">
                {money(totalCost)}
              </div>
            </div>
          </div>
        </div>

        {sr.notes ? (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {sr.notes}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-950">
              Tạo issue kỹ thuật
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Nhập nhanh issue. Các chi tiết khác có thể bổ sung sau.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions((value) => !value)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            Tuỳ chọn
            {showOptions ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                createIssue();
              }
            }}
            placeholder="Ví dụ: kiểm tra máy, kiểm tra kính, thay pin..."
            className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
          />

          <button
            type="button"
            disabled={pending}
            onClick={createIssue}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            {pending ? "Đang tạo..." : "Tạo"}
          </button>
        </div>

        {showOptions ? (
          <div className="mt-3 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 lg:grid-cols-3">
            <select
              value={area}
              onChange={(event) => {
                setArea(event.target.value);
                setTechnicalDetailCatalogId("");
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="GENERAL">Tổng quát</option>
              <option value="MOVEMENT">Máy</option>
              <option value="CASE">Vỏ</option>
              <option value="CRYSTAL">Kính</option>
              <option value="DIAL">Mặt số</option>
              <option value="HANDS">Kim</option>
              <option value="CROWN">Núm</option>
              <option value="BRACELET">Dây / bracelet</option>
            </select>

            <select
              value={actionMode}
              onChange={(event) => setActionMode(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="INTERNAL">Nội bộ</option>
              <option value="VENDOR">Vendor</option>
            </select>

            <select
              value={technicalDetailCatalogId}
              onChange={(event) =>
                setTechnicalDetailCatalogId(event.target.value)
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Chi tiết kỹ thuật: chọn sau</option>
              {technicalOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {[item.code, item.name].filter(Boolean).join(" - ") ||
                    "Không tên"}
                </option>
              ))}
            </select>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="Ghi chú thêm nếu cần"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 lg:col-span-3"
            />
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Kết quả kỹ thuật
            </p>
            <h3 className="text-base font-semibold text-slate-950">
              Technical issues
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi các hạng mục kỹ thuật đã tạo trong phiếu service này.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            <ClipboardList className="h-3.5 w-3.5" />
            {issueCount} issue
          </div>
        </div>

        {issueCount === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Chưa có issue kỹ thuật nào. Nhập issue đầu tiên bằng form phía trên.
          </div>
        ) : (
          <div className="space-y-3">
            {issueBoard.items.map((item: any) => {
              const status = String(item.executionStatus ?? "OPEN");
              const cost = Number(item.actualCost ?? item.cost ?? 0);
              const vendor = issueVendorName(item);
              const createdBy = issueCreatedBy(item);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          <ClipboardList className="h-4 w-4" />
                          Technical Issue
                        </span>

                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                            issueStatusTone(status),
                          ].join(" ")}
                        >
                          {status}
                        </span>

                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                          {item.actionMode || "INTERNAL"}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-semibold text-slate-950">
                          {issueTitle(item)}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span>Khu vực: {areaLabel(item.area)}</span>
                          <span>Chi phí: {money(cost)}</span>
                          {vendor ? <span>Vendor: {vendor}</span> : null}
                          {createdBy ? <span>Người xử lý: {createdBy}</span> : null}
                        </div>

                        <div className="mt-2 text-xs text-slate-400">
                          {formatDateTime(item.createdAt)} · ID: {item.id}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIssueModalOpen(true)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Mở
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ServiceIssueManageModal
        open={issueModalOpen}
        onClose={() => {
          setIssueModalOpen(false);
          router.refresh();
        }}
        currentServiceRequestId={sr.id}
        serviceRefNo={sr.refNo}
        items={issueBoard.items}
        counts={issueBoard.counts}
        catalogs={{
          ...(issueBoard.catalogs ?? {}),
          technicalDetailCatalogOptions:
            issueBoard.catalogs?.technicalDetailCatalogOptions ??
            (issueBoard as any).technicalDetailCatalogOptions ??
            [],
        }}
      />
    </div>
  );
}