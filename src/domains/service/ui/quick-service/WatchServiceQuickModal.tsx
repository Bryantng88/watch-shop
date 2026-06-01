"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Plus,
  Wrench,
  X,
} from "lucide-react";

type QuickIssue = {
  id: string;
  area?: string | null;
  summary?: string | null;
  note?: string | null;
  issueType?: string | null;
  actionMode?: string | null;
  executionStatus?: string | null;
  priority?: string | null;
  openedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isConfirmed?: boolean | null;
  vendorNameSnap?: string | null;
  serviceCatalogName?: string | null;
  supplyCatalogName?: string | null;
  partName?: string | null;
};

type QuickServiceData = {
  serviceRequest: {
    id: string;
    refNo?: string | null;
    status?: string | null;
    scope?: string | null;
    priority?: string | null;
    notes?: string | null;
    productId?: string | null;
    skuSnapshot?: string | null;
    productTitle?: string | null;
    primaryImageUrl?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    isActive?: boolean | null;
    isClosed?: boolean | null;
  };
  issues: QuickIssue[];
};

type Props = {
  open: boolean;
  productId: string | null;
  productTitle?: string | null;
  sku?: string | null;
  onClose: () => void;
  onUpdated?: () => void;
};

const PRIORITY_OPTIONS = [
  { value: "NORMAL", label: "Bình thường" },
  { value: "HIGH", label: "Ưu tiên" },
  { value: "URGENT", label: "Rất gấp" },
  { value: "LOW", label: "Thấp" },
];

const AREA_OPTIONS = [
  { value: "GENERAL", label: "Tổng quát" },
  { value: "MOVEMENT", label: "Máy" },
  { value: "CASE", label: "Vỏ" },
  { value: "CRYSTAL", label: "Kính" },
  { value: "DIAL", label: "Mặt số" },
  { value: "CROWN", label: "Núm" },
  { value: "BRACELET", label: "Dây / khóa" },
];

function priorityClass(priority?: string | null) {
  const key = String(priority ?? "NORMAL").toUpperCase();
  if (key === "URGENT") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (key === "HIGH") return "bg-amber-50 text-amber-700 ring-amber-100";
  if (key === "LOW") return "bg-slate-50 text-slate-500 ring-slate-100";
  return "bg-sky-50 text-sky-700 ring-sky-100";
}

function priorityLabel(priority?: string | null) {
  const key = String(priority ?? "NORMAL").toUpperCase();
  if (key === "URGENT") return "Rất gấp";
  if (key === "HIGH") return "Ưu tiên";
  if (key === "LOW") return "Thấp";
  return "Bình thường";
}

function statusLabel(status?: string | null) {
  const key = String(status ?? "").toUpperCase();
  if (key === "IN_PROGRESS") return "Đang xử lý";
  if (key === "WAIT_APPROVAL") return "Chờ duyệt";
  if (key === "DIAGNOSING") return "Đang kiểm tra";
  if (key === "COMPLETED") return "Hoàn tất";
  if (key === "CANCELED") return "Đã hủy";
  if (key === "DRAFT") return "Nháp";
  return status || "-";
}

function issueStatusLabel(status?: string | null) {
  const key = String(status ?? "").toUpperCase();
  if (key === "IN_PROGRESS") return "Đang xử lý";
  if (key === "DONE") return "Đã xong";
  if (key === "CANCELED") return "Đã hủy";
  if (key === "OPEN") return "Mở";
  return status || "-";
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function boardUrl(serviceRequestId?: string | null) {
  const query = serviceRequestId ? `?serviceRequestId=${encodeURIComponent(serviceRequestId)}` : "";
  return `/admin/services/issues${query}`;
}

export default function WatchServiceQuickModal({
  open,
  productId,
  productTitle,
  sku,
  onClose,
  onUpdated,
}: Props) {
  const [data, setData] = useState<QuickServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [area, setArea] = useState("GENERAL");
  const [priority, setPriority] = useState("NORMAL");
  const [summary, setSummary] = useState("");
  const [note, setNote] = useState("");

  const canSubmit = Boolean(productId) && summary.trim().length > 0 && !loading && !isPending;

  const title = useMemo(
    () => data?.serviceRequest?.productTitle || productTitle || "Watch service",
    [data?.serviceRequest?.productTitle, productTitle],
  );

  async function load() {
    if (!open || !productId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/service-requests/watch-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Không tải được phiếu service active.");
      }

      setData(json.data ?? null);
    } catch (err: any) {
      setError(err?.message || "Không tải được phiếu service active.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, productId]);

  function resetForm() {
    setArea("GENERAL");
    setPriority("NORMAL");
    setSummary("");
    setNote("");
  }

  function submitIssue() {
    if (!canSubmit) return;

    startTransition(async () => {
      setError(null);

      try {
        const res = await fetch("/api/admin/service-requests/watch-active", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            serviceRequestId: data?.serviceRequest?.id ?? null,
            area,
            priority,
            summary,
            note,
            issueType: "CHECK",
          }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || "Không tạo được technical issue.");
        }

        setData(json.data ?? null);
        resetForm();
        onUpdated?.();
      } catch (err: any) {
        setError(err?.message || "Không tạo được technical issue.");
      }
    });
  }

  if (!open) return null;

  const sr = data?.serviceRequest ?? null;
  const issues = data?.issues ?? [];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-7 py-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Service Domain
              </div>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Quản lý kỹ thuật nhanh</h2>
              <p className="mt-1 truncate text-sm text-slate-500">
                {title}{sku ? ` · ${sku}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_360px]">
          <div className="space-y-5 px-7 py-6">
            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang mở service request active...
              </div>
            ) : null}

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {sr ? (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Phiếu</div>
                  <div className="mt-2 font-bold text-slate-950">{sr.refNo || sr.id}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Trạng thái</div>
                  <div className="mt-2 font-semibold text-slate-800">{statusLabel(sr.status)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Cập nhật</div>
                  <div className="mt-2 font-semibold text-slate-800">{formatDateTime(sr.updatedAt)}</div>
                </div>
              </div>
            ) : null}

            <section className="rounded-3xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-950">Technical issue hiện tại</div>
                    <div className="text-sm text-slate-500">Chỉ xem tại modal này. Kỹ thuật xử lý ở Issue Board.</div>
                  </div>
                </div>

                <a
                  href={boardUrl(sr?.id)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Mở Issue Board
                </a>
              </div>

              <div className="divide-y divide-slate-100">
                {!issues.length ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-400">
                    Chưa có technical issue nào cho phiếu service active.
                  </div>
                ) : (
                  issues.map((issue) => (
                    <div key={issue.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-950">
                              {issue.summary || issue.note || "Technical issue"}
                            </span>
                            <span className={`rounded-full px-2 py-1 text-[11px] font-bold ring-1 ${priorityClass(issue.priority)}`}>
                              {priorityLabel(issue.priority)}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>{issue.area || "GENERAL"}</span>
                            <span>•</span>
                            <span>{issueStatusLabel(issue.executionStatus)}</span>
                            {issue.vendorNameSnap ? <><span>•</span><span>{issue.vendorNameSnap}</span></> : null}
                          </div>
                          {issue.note ? (
                            <div className="mt-2 text-sm leading-6 text-slate-500">{issue.note}</div>
                          ) : null}
                        </div>
                        {String(issue.executionStatus ?? "").toUpperCase() === "DONE" ? (
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="border-t border-slate-100 bg-slate-50/60 px-6 py-6 lg:border-l lg:border-t-0">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-950">Thêm issue nhanh</div>
                  <div className="text-sm text-slate-500">Không xử lý issue tại đây.</div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Khu vực</span>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="mt-1 w-full border-b border-slate-200 bg-transparent py-2 text-sm outline-none focus:border-slate-950"
                  >
                    {AREA_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Mức ưu tiên</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mt-1 w-full border-b border-slate-200 bg-transparent py-2 text-sm outline-none focus:border-slate-950"
                  >
                    {PRIORITY_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Issue</span>
                  <input
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Ví dụ: Núm lỏng, máy yếu cót..."
                    className="mt-1 w-full border-b border-slate-200 bg-transparent py-2 text-sm outline-none focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Ghi chú</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú thêm cho kỹ thuật nếu cần"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-slate-950"
                  />
                </label>

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={submitIssue}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Thêm issue
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
