"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";

import { Button, Input } from "@/domains/shared/ui/form/fields";
import { PAYMENT_PURPOSE_LABEL, PAYMENT_STATUS_LABEL, type PaymentListItem } from "../shared";

type OrderPaymentTarget = {
  id: string;
  refNo?: string | null;
  customerName?: string | null;
  totalAmount?: number | string | null;
  remainingAmount?: number | string | null;
};

type Props = {
  open: boolean;
  order: OrderPaymentTarget | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { paymentId: string; reference?: string | null; note?: string | null }) => void | Promise<void>;
};

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value: unknown) {
  return `${Math.round(toNumber(value)).toLocaleString("vi-VN")} đ`;
}

function canComplete(payment: PaymentListItem) {
  const status = String(payment.status ?? "").toUpperCase();
  return status === "UNPAID" || status === "COLLECTED";
}

export default function PaymentCompleteModal({ open, order, submitting, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const payablePayments = useMemo(() => payments.filter(canComplete), [payments]);
  const selectedPayment = payablePayments.find((payment) => payment.id === selectedPaymentId) ?? null;

  useEffect(() => {
    if (!open || !order) return;

    let cancelled = false;
    setLoading(true);
    setPayments([]);
    setSelectedPaymentId("");
    setReference("");
    setNote("");

    fetch(`/api/admin/orders/${order.id}/payment`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const items: PaymentListItem[] = Array.isArray(json?.items) ? json.items : [];
        const completable = items.filter(canComplete);
        setPayments(items);
        setSelectedPaymentId(completable[0]?.id ?? "");
      })
      .catch(() => {
        if (!cancelled) setPayments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, order]);

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-[640px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-600 p-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Payment domain</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Hoàn tất payment</h2>
              <p className="mt-1 text-sm text-slate-500">{order.refNo || order.id} · {order.customerName || "-"}</p>
            </div>
          </div>

          <button type="button" onClick={onClose} disabled={submitting} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Tổng đơn</p>
              <p className="mt-1 font-bold text-slate-950">{formatMoney(order.totalAmount)}</p>
            </div>
            <div className="rounded-2xl bg-rose-50 px-4 py-3">
              <p className="text-xs text-rose-700">Còn theo order</p>
              <p className="mt-1 font-bold text-rose-700">{formatMoney(order.remainingAmount)}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Chọn payment cần hoàn tất</label>
              {loading ? <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Loader2 className="h-3 w-3 animate-spin" /> Đang tải</span> : null}
            </div>

            <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
              {!loading && !payablePayments.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">Không có payment nào đang chờ hoàn tất.</div>
              ) : null}

              {payablePayments.map((payment) => {
                const checked = payment.id === selectedPaymentId;
                const isCodCollected = String(payment.status).toUpperCase() === "COLLECTED";

                return (
                  <button
                    key={payment.id}
                    type="button"
                    onClick={() => setSelectedPaymentId(payment.id)}
                    disabled={submitting}
                    className={[
                      "w-full rounded-2xl border px-4 py-3 text-left transition",
                      checked ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-950">{payment.refNo || payment.id}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {PAYMENT_PURPOSE_LABEL[String(payment.purpose ?? "")] ?? payment.purpose ?? "Payment"} · {payment.method || "-"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-950">{formatMoney(payment.amount)}</div>
                        <div className={isCodCollected ? "mt-1 text-xs font-semibold text-amber-700" : "mt-1 text-xs text-slate-500"}>
                          {PAYMENT_STATUS_LABEL[String(payment.status)] ?? payment.status}
                        </div>
                      </div>
                    </div>
                    {payment.note ? <div className="mt-2 text-xs text-slate-500">{payment.note}</div> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPayment ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Xác nhận shop đã thật sự nhận {formatMoney(selectedPayment.amount)} cho payment này. Với COD, đây là bước sau đối soát/nhận tiền từ đơn vị vận chuyển.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Mã tham chiếu</label>
              <Input value={reference} onChange={(event) => setReference(event.target.value)} disabled={submitting} placeholder="VD: mã giao dịch bank" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Ghi chú xác nhận</label>
              <Input value={note} onChange={(event) => setNote(event.target.value)} disabled={submitting} placeholder="VD: đã nhận COD ngày..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button
            type="button"
            disabled={submitting || !selectedPaymentId}
            onClick={() => onSubmit({ paymentId: selectedPaymentId, reference: reference.trim() || null, note: note.trim() || null })}
          >
            {submitting ? "Đang hoàn tất..." : "Xác nhận đã nhận tiền"}
          </Button>
        </div>
      </div>
    </div>
  );
}
