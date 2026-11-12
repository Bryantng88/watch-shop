"use client";

import { Truck } from "lucide-react";
import { Input } from "@/domains/shared/ui/form/fields";
import OrderSection from "../OrderSection";
import OrderFormField from "./OrderFormField";
import type { OrderFormValues } from "./types";

export default function OrderShipmentSection({ values, disabled, onChange }: { values: OrderFormValues; disabled?: boolean; onChange: (patch: Partial<OrderFormValues>) => void }) {
  return <OrderSection icon={<Truck className="h-4 w-4" />} title="Giao hàng" actions={
    <label className="inline-flex min-h-8 cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={values.hasShipment} disabled={disabled} onChange={event => onChange({ hasShipment: event.target.checked })} />Có giao hàng</label>
  }>
    {values.hasShipment && <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <OrderFormField label="Địa chỉ"><Input value={values.shipAddress} onChange={event => onChange({ shipAddress: event.target.value })} disabled={disabled} /></OrderFormField>
      <OrderFormField label="Tỉnh / thành"><Input value={values.shipCity} onChange={event => onChange({ shipCity: event.target.value })} disabled={disabled} /></OrderFormField>
      <OrderFormField label="Quận / huyện"><Input value={values.shipDistrict} onChange={event => onChange({ shipDistrict: event.target.value })} disabled={disabled} /></OrderFormField>
      <OrderFormField label="Phường / xã"><Input value={values.shipWard} onChange={event => onChange({ shipWard: event.target.value })} disabled={disabled} /></OrderFormField>
    </div>}
  </OrderSection>;
}
