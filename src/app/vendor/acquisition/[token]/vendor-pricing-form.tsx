"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

type RequestData = {
  vendorName: string;
  currency: string;
  notes: string | null;
  status: "OPEN" | "SUBMITTED" | "EXPIRED" | "REVOKED";
  expiresAt: string;
  submittedAt: string | null;
  items: Array<{
    id: string;
    title: string;
    audienceSegment: "MEN" | "WOMEN" | "UNISEX";
    hasImage: boolean;
    unitCost: string | null;
    vendorNote: string | null;
  }>;
};

function digits(value: string) {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

function formatInput(value: string) {
  const raw = digits(value);
  return raw ? new Intl.NumberFormat("vi-VN").format(Number(raw)) : "";
}

export default function VendorPricingForm({ token, request }: { token: string; request: RequestData }) {
  const [rows, setRows] = useState(() => request.items.map((item) => ({
    id: item.id,
    unitCost: item.unitCost ? formatInput(item.unitCost) : "",
    vendorNote: item.vendorNote ?? "",
  })));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(request.status === "SUBMITTED");
  const [error, setError] = useState<string | null>(null);
  const lockRef = useRef(false);
  const editable = request.status === "OPEN" && !submitted;
  const total = useMemo(() => rows.reduce((sum, row) => sum + Number(digits(row.unitCost) || 0), 0), [rows]);
  const currency = request.currency || "VND";

  function update(id: string, patch: Partial<(typeof rows)[number]>) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  }

  async function submit() {
    if (lockRef.current || !editable) return;
    const payload = rows.map((row) => ({ id: row.id, unitCost: Number(digits(row.unitCost)), vendorNote: row.vendorNote.trim() || null }));
    if (payload.some((item) => !Number.isFinite(item.unitCost) || item.unitCost <= 0)) {
      setError("Vui lòng nhập giá nhập lớn hơn 0 cho tất cả đồng hồ.");
      return;
    }
    if (!window.confirm(`Xác nhận báo giá tổng cộng ${new Intl.NumberFormat("vi-VN").format(total)} ${currency}? Sau khi gửi sẽ không thể chỉnh sửa.`)) return;
    lockRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/public/vendor-acquisitions/${encodeURIComponent(token)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.error || "Không thể xác nhận báo giá.");
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể xác nhận báo giá.");
    } finally {
      lockRef.current = false;
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
        <section className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-bold">Đã xác nhận báo giá</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Cảm ơn {request.vendorName}. Hệ thống đã tạo phiếu nhập nháp để cửa hàng kiểm tra và duyệt.</p>
        </section>
      </main>
    );
  }

  if (!editable) {
    const message = request.status === "EXPIRED" ? "Link báo giá đã hết hạn." : "Link báo giá đã bị thu hồi.";
    return <main className="min-h-screen bg-slate-50 px-4 py-12"><section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-slate-900">Không thể tiếp tục</h1><p className="mt-3 text-slate-600">{message} Vui lòng liên hệ cửa hàng để nhận link mới.</p></section></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3"><div className="rounded-2xl bg-violet-100 p-3 text-violet-700"><ShieldCheck className="h-6 w-6" /></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Vendor pricing</p><h1 className="mt-1 text-2xl font-bold">Xác nhận giá nhập đồng hồ</h1><p className="mt-2 text-sm text-slate-600">Vendor: <strong>{request.vendorName}</strong> · Hạn đến {new Date(request.expiresAt).toLocaleString("vi-VN")}</p></div></div>
          {request.notes ? <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{request.notes}</div> : null}
        </header>

        <section className="space-y-4">
          {request.items.map((item, index) => {
            const row = rows.find((candidate) => candidate.id === item.id)!;
            return (
              <article key={item.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[160px_1fr] sm:p-5">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                  {item.hasImage ? <Image unoptimized fill sizes="(max-width: 640px) 100vw, 160px" src={`/api/public/vendor-acquisitions/${encodeURIComponent(token)}/items/${item.id}/image`} alt={item.title} className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">Không có ảnh</div>}
                </div>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">Đồng hồ #{index + 1}</span><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{item.audienceSegment === "WOMEN" ? "Nữ" : item.audienceSegment === "UNISEX" ? "Unisex" : "Nam"}</span></div><h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Giá nhập ({currency})<input inputMode="numeric" value={row.unitCost} onChange={(event) => update(item.id, { unitCost: formatInput(event.target.value) })} placeholder="0" className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-base font-semibold outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /></label><label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ghi chú (không bắt buộc)<input value={row.vendorNote} maxLength={500} onChange={(event) => update(item.id, { vendorNote: event.target.value })} placeholder="Tình trạng, phụ kiện..." className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /></label></div>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="sticky bottom-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between sm:px-6"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tổng giá trị báo giá</p><p className="mt-1 text-2xl font-bold text-emerald-700">{new Intl.NumberFormat("vi-VN").format(total)} {currency}</p></div><div className="mt-4 sm:mt-0">{error ? <p className="mb-2 max-w-md text-sm text-rose-600">{error}</p> : null}<button type="button" disabled={submitting} onClick={submit} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 font-semibold text-white disabled:opacity-60 sm:w-auto">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Xác nhận báo giá</button></div></footer>
      </div>
    </main>
  );
}
