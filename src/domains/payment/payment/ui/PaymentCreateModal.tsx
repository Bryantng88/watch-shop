"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, X } from "lucide-react";

import { Button, Input, Select } from "@/domains/shared/ui/form/fields";
import { PAYMENT_METHOD_OPTIONS } from "../shared";

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
  onSubmit: (payload: {
    ownerType: "ORDER";
    ownerId: string;
    amount: number;
    method: string;
    note?: string | null;
    markPaidNow: boolean;
  }) => void | Promise<void>;
};

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value: unknown) {
  return `${Math.round(toNumber(value)).toLocaleString("vi-VN")} đ`;
}

export default function PaymentCreateModal({ open, order, submitting, onClose, onSubmit }: Props) {
  const remainingAmount = useMemo(
    () => Math.max(0, toNumber(order?.remainingAmount ?? order?.totalAmount)),
    [order],
  );

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [note, setNote] = useState("");
  const [markPaidNow, setMarkPaidNow] = useState(false);

  useEffect(() => {
    if (!open || !order) return;
    setAmount(String(Math.round(remainingAmount)));
    setMethod("BANK_TRANSFER");
    setNote("");
    setMarkPaidNow(false);
  }, [open, order, remainingAmount]);

  if (!open || !order) return null;

  const parsedAmount = toNumber(amount);
  const invalidAmount = parsedAmount <= 0 || parsedAmount > remainingAmount;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-[540px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-slate-900 p-2 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Payment domain</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Tạo payment bổ sung</h2>
              <p className="mt-1 text-sm text-slate-500">{order.refNo || order.id} · {order.customerName || "-"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Tổng đơn</p>
              <p className="mt-1 font-bold text-slate-950">{formatMoney(order.totalAmount)}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3">
              <p className="text-xs text-amber-700">Còn phải thu</p>
              <p className="mt-1 font-bold text-amber-700">{formatMoney(remainingAmount)}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Số tiền</label>
            <Input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={submitting} />
            {invalidAmount ? <p className="mt-2 text-xs text-red-500">Số tiền phải lớn hơn 0 và không vượt quá phần còn phải thu.</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Phương thức thu</label>
            <Select value={method} onChange={(event) => setMethod(event.target.value)} disabled={submitting} options={PAYMENT_METHOD_OPTIONS as any} />
            {method === "COD" ? (
              <p className="mt-2 text-xs text-amber-700">COD sẽ chỉ chuyển sang “chờ đối soát” khi shipment được đánh dấu đã giao. Shop vẫn cần hoàn tất payment thủ công khi thật sự nhận tiền.</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Ghi chú</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={submitting}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="VD: Khách chuyển khoản thêm đợt 2..."
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={markPaidNow}
              onChange={(event) => setMarkPaidNow(event.target.checked)}
              disabled={submitting || method === "COD"}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              Xác nhận đã nhận tiền ngay sau khi tạo payment
              {method === "COD" ? <span className="mt-1 block text-xs font-normal text-slate-500">COD không nên mark paid ngay vì còn bước đối soát/nhận tiền từ đơn vị vận chuyển.</span> : null}
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button
            type="button"
            disabled={submitting || invalidAmount}
            onClick={() => onSubmit({ ownerType: "ORDER", ownerId: order.id, amount: parsedAmount, method, note: note.trim() || null, markPaidNow })}
          >
            {submitting ? "Đang tạo..." : "Tạo payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
