"use client";

import Link from "next/link";
import { useState } from "react";

type Row = {
  id: string;
  reference: string;
  status: "WAITING" | "PROCESSING" | "COMPLETED";
  outcome: string | null;
  customerName: string;
  phone: string;
  contactPreference: string;
  customerNote: string | null;
  completionReason: string | null;
  createdAt: string;
  items: Array<{ id: string; titleSnapshot: string; listPriceSnapshot: number }>;
  order: { id: string; refNo: string | null; status: string } | null;
};

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export default function PurchaseRequestQueueClient({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(row: Row, action: "start" | "convert" | "complete", body?: object) {
    setBusyId(row.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/purchase-requests/${row.id}/${action}`, {
        method: "POST",
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Thao tác thất bại.");
      if (action === "convert") {
        window.location.href = `/admin/orders/${payload.id}`;
        return;
      }
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, ...payload } : item));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Thao tác thất bại.");
    } finally {
      setBusyId(null);
    }
  }

  function finish(row: Row) {
    const outcome = window.prompt("Kết quả: REJECTED, CANCELLED, EXPIRED hoặc DUPLICATE", "REJECTED")?.trim().toUpperCase();
    if (!outcome) return;
    const reason = window.prompt("Lý do kết thúc yêu cầu")?.trim();
    if (!reason) return;
    void run(row, "complete", { outcome, reason });
  }

  function convert(row: Row) {
    const agreedPrices: Record<string, number> = {};
    for (const item of row.items) {
      const raw = window.prompt(`Giá đã chốt cho ${item.titleSnapshot}`, String(item.listPriceSnapshot));
      if (raw == null) return;
      const value = Number(raw.replaceAll(/[.,\s]/g, ""));
      if (!Number.isFinite(value) || value <= 0) {
        setError(`Giá chốt của ${item.titleSnapshot} không hợp lệ.`);
        return;
      }
      agreedPrices[item.id] = value;
    }
    void run(row, "convert", { agreedPrices });
  }

  return (
    <main className="space-y-5 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Storefront intake</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Yêu cầu mua hàng</h1>
        <p className="mt-1 text-sm text-slate-500">Xác minh nhu cầu trước khi tạo Order và Payment.</p>
      </header>
      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
      <section className="grid gap-4">
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-slate-900">{row.reference}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{row.status}</span>
                  {row.outcome ? <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">{row.outcome}</span> : null}
                </div>
                <p className="mt-2 font-semibold text-slate-950">{row.customerName} · {row.phone}</p>
                <p className="mt-1 text-xs text-slate-500">Ưu tiên {row.contactPreference === "ZALO" ? "Zalo" : "điện thoại"} · {new Date(row.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {row.status === "WAITING" ? <button disabled={busyId === row.id} onClick={() => void run(row, "start")} className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Tiếp nhận</button> : null}
                {row.status === "PROCESSING" ? <button disabled={busyId === row.id} onClick={() => convert(row)} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Chốt giá & tạo đơn</button> : null}
                {row.status !== "COMPLETED" ? <button disabled={busyId === row.id} onClick={() => finish(row)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50">Kết thúc</button> : null}
                {row.order ? <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" href={`/admin/orders/${row.order.id}`}>Mở {row.order.refNo ?? "Order"}</Link> : null}
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {row.items.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-medium text-slate-900">{item.titleSnapshot}</p><p className="mt-1 text-xs text-slate-500">{money.format(item.listPriceSnapshot)}</p></div>)}
            </div>
            {row.customerNote ? <p className="mt-3 text-sm text-slate-600">Khách ghi chú: {row.customerNote}</p> : null}
            {row.completionReason ? <p className="mt-2 text-sm text-slate-600">Kết quả: {row.completionReason}</p> : null}
          </article>
        ))}
        {!rows.length ? <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">Chưa có yêu cầu mua hàng.</div> : null}
      </section>
    </main>
  );
}
