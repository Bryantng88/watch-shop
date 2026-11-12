"use client";

import { ImageIcon, Trash2 } from "lucide-react";
import { Input, Textarea } from "@/domains/shared/ui/form/fields";
import { ADMIN_DOMAIN_TONE } from "@/domains/shared/ui/admin-design-contract";
import { fmtMoney } from "@/domains/order/ui/order-ui.helpers";
import OrderFormField from "./OrderFormField";
import { numberValue } from "./helpers";
import type { OrderFormItem } from "./types";

type Props = { item: OrderFormItem; disabled?: boolean; onChange: (patch: Partial<OrderFormItem>) => void; onRemove: () => void };
export default function OrderItemCard({ item, disabled, onChange, onRemove }: Props) {
  const watch = item.kind === "PRODUCT" && item.source === "WATCH_QUICK_ORDER";
  const service = item.kind === "SERVICE";
  return <div className="min-w-0 py-3">
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_32px] items-start gap-3 lg:grid-cols-[minmax(220px,1fr)_72px_150px_150px_32px]">
      <div className="flex min-w-0 items-start gap-3">
        {!service && <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100 text-slate-400">
          {item.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
          ) : <ImageIcon className="h-5 w-5" />}
        </div>}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className={`rounded px-1.5 py-0.5 ${service ? ADMIN_DOMAIN_TONE.TECHNICAL.soft : ADMIN_DOMAIN_TONE.ORDER.soft}`}>{service ? "Dịch vụ" : "Sản phẩm"}</span>
            {item.sku && <span>{item.sku}</span>}
            {item.productStatus && <span>{item.productStatus}</span>}
            {item.availabilityStatus && <span>{item.availabilityStatus}</span>}
          </div>
          <Input aria-label={`Tên dòng ${item.title}`} className="font-semibold" value={item.title} onChange={event => onChange({ title: event.target.value })} disabled={disabled || !service} />
        </div>
      </div>
      <button type="button" aria-label={`Bỏ dòng ${item.title}`} disabled={disabled} onClick={onRemove} className="col-start-2 row-start-1 grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 lg:col-start-5"><Trash2 className="h-4 w-4" /></button>
      <div className="col-span-2 grid min-w-0 grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)] gap-3 lg:contents">
        <OrderFormField label="Số lượng"><Input aria-label={`Số lượng ${item.title}`} inputMode="numeric" value={watch || service ? "1" : String(item.quantity)} onChange={event => onChange({ quantity: numberValue(event.target.value) || 1 })} disabled={disabled || watch || service} className="text-right tabular-nums" /></OrderFormField>
        <OrderFormField label="Niêm yết · ₫"><Input aria-label={`Giá niêm yết ${item.title}`} inputMode="numeric" value={String(item.listPrice)} onChange={event => onChange({ listPrice: numberValue(event.target.value) })} disabled={disabled} className="text-right tabular-nums" title={fmtMoney(item.listPrice)} /></OrderFormField>
        <OrderFormField label="Giá chốt · ₫"><Input aria-label={`Giá chốt ${item.title}`} inputMode="numeric" value={String(item.unitPriceAgreed)} onChange={event => onChange({ unitPriceAgreed: numberValue(event.target.value) })} disabled={disabled} className="text-right tabular-nums" title={fmtMoney(item.unitPriceAgreed)} /></OrderFormField>
      </div>
    </div>
    {service && <div className="mt-2">
      <OrderFormField label="Đồng hồ & yêu cầu dịch vụ"><Textarea rows={2} aria-label={`Ghi chú dịch vụ ${item.title}`} value={item.customerItemNote ?? ""} onChange={event => onChange({ customerItemNote: event.target.value })} disabled={disabled} placeholder="Mô tả từng chiếc để kỹ thuật nhận đúng đồng hồ và yêu cầu." className="!min-h-16" /></OrderFormField>
    </div>}
  </div>;
}
