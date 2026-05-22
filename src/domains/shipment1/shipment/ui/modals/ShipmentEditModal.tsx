"use client";

import { useEffect, useState } from "react";
import { Button, FieldLabel, Input, Textarea } from "@/domains/shared/ui/form/fields";
import type { ShipmentListItem } from "../list";

type FormState = {
  shipPhone: string;
  shipAddress: string;
  shipCity: string;
  shipDistrict: string;
  shipWard: string;
  carrier: string;
  trackingCode: string;
  notes: string;
};

export default function ShipmentEditModal({
  shipment,
  submitting,
  onClose,
  onSubmit,
}: {
  shipment: ShipmentListItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: Partial<FormState>) => void | Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    shipPhone: "",
    shipAddress: "",
    shipCity: "",
    shipDistrict: "",
    shipWard: "",
    carrier: "",
    trackingCode: "",
    notes: "",
  });

  useEffect(() => {
    if (!shipment) return;
    setForm({
      shipPhone: shipment.shipPhone ?? "",
      shipAddress: shipment.shipAddress ?? "",
      shipCity: shipment.shipCity ?? "",
      shipDistrict: shipment.shipDistrict ?? "",
      shipWard: shipment.shipWard ?? "",
      carrier: shipment.carrier ?? "",
      trackingCode: shipment.trackingCode ?? "",
      notes: shipment.notes ?? "",
    });
  }, [shipment]);

  if (!shipment) return null;

  function patch(next: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...next }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({
      shipPhone: form.shipPhone.trim() || null as any,
      shipAddress: form.shipAddress.trim() || null as any,
      shipCity: form.shipCity.trim() || null as any,
      shipDistrict: form.shipDistrict.trim() || null as any,
      shipWard: form.shipWard.trim() || null as any,
      carrier: form.carrier.trim() || null as any,
      trackingCode: form.trackingCode.trim() || null as any,
      notes: form.notes.trim() || null as any,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <form onSubmit={submit} className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Chỉnh shipment</h2>
          <p className="mt-1 text-sm text-slate-500">Shipment READY/SHIPPED vẫn được chỉnh địa chỉ, đơn vị vận chuyển và tracking.</p>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
          <div>
            <FieldLabel>Số điện thoại nhận hàng</FieldLabel>
            <Input value={form.shipPhone} onChange={(event) => patch({ shipPhone: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Tỉnh / thành</FieldLabel>
            <Input value={form.shipCity} onChange={(event) => patch({ shipCity: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Quận / huyện</FieldLabel>
            <Input value={form.shipDistrict} onChange={(event) => patch({ shipDistrict: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Phường / xã</FieldLabel>
            <Input value={form.shipWard} onChange={(event) => patch({ shipWard: event.target.value })} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Địa chỉ</FieldLabel>
            <Input value={form.shipAddress} onChange={(event) => patch({ shipAddress: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Đơn vị vận chuyển</FieldLabel>
            <Input value={form.carrier} onChange={(event) => patch({ carrier: event.target.value })} />
          </div>
          <div>
            <FieldLabel>Mã vận đơn</FieldLabel>
            <Input value={form.trackingCode} onChange={(event) => patch({ trackingCode: event.target.value })} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Ghi chú</FieldLabel>
            <Textarea value={form.notes} onChange={(event) => patch({ notes: event.target.value })} />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Đang lưu..." : "Lưu shipment"}</Button>
        </div>
      </form>
    </div>
  );
}
