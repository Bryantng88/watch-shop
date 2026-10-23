"use client";

import { useEffect, useState } from "react";

import type { WatchRow } from "./types";

type Props = {
  open: boolean;
  rows: WatchRow[];
  onClose: () => void;
  onCreated: (request: { id: string; reference: string }) => void;
};

export default function InternalPurchaseRequestModal({ open, rows, onClose, onCreated }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setIdempotencyKey(crypto.randomUUID());
    setError(null);
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/purchase-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productIds: rows.map((row) => row.productId),
          customerName,
          phone,
          customerEmail: customerEmail || null,
          note: note || null,
          followUpAt: followUpAt ? new Date(followUpAt).toISOString() : null,
          idempotencyKey,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Không thể tạo yêu cầu.");
      onCreated(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể tạo yêu cầu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] grid place-items-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-label="Tạo yêu cầu xử lý đơn hàng">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-600">Yêu cầu nội bộ</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Tạo yêu cầu xử lý đơn hàng</h2>
            <p className="mt-1 text-sm text-slate-500">{rows.length} watch sẽ được gắn vào cùng một yêu cầu và gửi thông báo Zalo cho admin.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100">×</button>
        </header>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Tên khách hàng *
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Số điện thoại *
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Email
            <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Lịch follow-up
            <input type="datetime-local" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">Ghi chú
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>
          {error ? <p className="text-sm font-medium text-rose-600 sm:col-span-2">{error}</p> : null}
        </div>
        <footer className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Hủy</button>
          <button type="button" onClick={() => void submit()} disabled={submitting || !customerName.trim() || !phone.trim()} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">{submitting ? "Đang tạo..." : "Tạo yêu cầu"}</button>
        </footer>
      </div>
    </div>
  );
}
