"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, FieldLabel, Input, Select, Textarea, moneyPreview } from "@/domains/shared/ui/form/fields";
import type { ShipmentListItem } from "../list";
import { SHIPMENT_CARRIER_OPTIONS } from "@/domains/shipment/shared/shipment-carriers";
const PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "CASH", label: "Tiền mặt" },
  { value: "MOMO", label: "Momo" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "CREDIT_CARD", label: "Thẻ" },
];

type FormState = {
  amount: string;
  method: string;
  carrier: string;
  trackingCode: string;
  reference: string;
  note: string;
  payer: "BUSINESS" | "CUSTOMER";
};

export default function ShipmentFeeModal({
  shipment,
  submitting,
  onClose,
  onSubmit,
}: {
  shipment: ShipmentListItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    amount: number;
    method: string;
    carrier?: string | null;
    trackingCode?: string | null;
    reference?: string | null;
    note?: string | null;
    payer: "BUSINESS" | "CUSTOMER";
  }) => void | Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    amount: "",
    method: "BANK_TRANSFER",
    carrier: "",
    trackingCode: "",
    reference: "",
    note: "",
    payer: "CUSTOMER",
  });

  useEffect(() => {
    if (!shipment) return;
    setForm({
      amount: shipment.shippingFee && Number(shipment.shippingFee) > 0 ? String(Number(shipment.shippingFee)) : "",
      method: "BANK_TRANSFER",
      carrier: shipment.carrier ?? "",
      trackingCode: shipment.trackingCode ?? "",
      reference: "",
      note: "",
      payer: "CUSTOMER",
    });
  }, [shipment]);

  const amount = useMemo(() => Number(String(form.amount).replace(/[^\d.-]/g, "")), [form.amount]);
  if (!shipment) return null;

  function patch(next: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...next }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!Number.isFinite(amount) || amount <= 0) return;
    onSubmit({
      amount,
      method: form.method,
      carrier: form.carrier.trim() || null,
      trackingCode: form.trackingCode.trim() || null,
      reference: form.reference.trim() || null,
      note: form.note.trim() || null,
      payer: form.payer
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <form onSubmit={submit} className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-950">
            {shipment?.shippingFee
              ? "Cập nhật vận chuyển"
              : "Tạo phí ship & chuyển sang đang giao"}
          </h2>          <p className="mt-1 text-sm text-slate-500">
            Khi lưu, hệ thống sẽ tạo payment phí ship chiều OUT và hoàn tất ngay, sau đó chuyển shipment sang Đang giao.
          </p>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
          <div>
            <FieldLabel>Phí ship</FieldLabel>
            <Input value={form.amount} onChange={(event) => patch({ amount: event.target.value })} placeholder="Ví dụ: 50000" autoFocus />
            <div className="mt-2 text-xs font-semibold text-slate-500">{moneyPreview(form.amount)}</div>
          </div>

          <div>
            <FieldLabel>Phương thức trả phí</FieldLabel>
            <Select value={form.method} onChange={(event) => patch({ method: event.target.value })} options={PAYMENT_METHOD_OPTIONS} />
          </div>

          <div>
            <FieldLabel>Đơn vị vận chuyển</FieldLabel>
            <Select
              value={form.carrier}
              onChange={(event) => patch({ carrier: event.target.value })}
              options={[
                { value: "", label: "Chọn đơn vị vận chuyển" },
                ...SHIPMENT_CARRIER_OPTIONS,
              ]}
            />
          </div>
          <div>
            <FieldLabel>Người chịu phí ship</FieldLabel>
            <Select
              value={form.payer}
              onChange={(event) =>
                patch({ payer: event.target.value as "BUSINESS" | "CUSTOMER" })
              }
              options={[
                { value: "BUSINESS", label: "Doanh nghiệp trả - ghi nhận chi phí" },
                { value: "CUSTOMER", label: "Khách hàng trả - không tạo payment" },
              ]}
            />
          </div>
          <div>
            <FieldLabel>Mã vận đơn</FieldLabel>
            <Input value={form.trackingCode} onChange={(event) => patch({ trackingCode: event.target.value })} placeholder="Tracking code" />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>Mã tham chiếu payment</FieldLabel>
            <Input value={form.reference} onChange={(event) => patch({ reference: event.target.value })} placeholder="Mã giao dịch ngân hàng / biên nhận" />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>Ghi chú</FieldLabel>
            <Textarea value={form.note} onChange={(event) => patch({ note: event.target.value })} placeholder="Ghi chú nội bộ" />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button type="submit" disabled={submitting || !Number.isFinite(amount) || amount <= 0}>
            {submitting ? "Đang lưu..." : "Tạo phí ship & giao"}
          </Button>
        </div>
      </form>
    </div>
  );
}
