"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminPageHeader, ADMIN_DOMAIN_TONE } from "@/domains/shared/ui/admin-design-contract";
import OrderStatusBadge from "../OrderStatusBadge";
import { fmtDate, fmtMoney, InventoryEffectBadge, orderDisplayCode, orderTotal, type OrderDetailData } from "./shared";

export default function OrderHeader({ data }: { data: OrderDetailData }) {
  return <div className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <Link href="/admin/orders" className="inline-flex h-8 items-center rounded-md px-2 text-slate-500 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-200">← Danh sách đơn hàng</Link>
      <Link href={`/admin/orders/${data.id}/edit`} className="inline-flex h-8 items-center gap-2 rounded-md px-2 font-semibold text-slate-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-200"><Pencil className="h-3.5 w-3.5" />Chỉnh thông tin</Link>
    </div>
    <AdminPageHeader eyebrow="BÁN HÀNG / ĐƠN HÀNG" title={orderDisplayCode(data)} description={`${data.customerName || "Chưa có tên khách"} · Cập nhật ${fmtDate(data.updatedAt)}`}
      meta={<span className="text-sm tabular-nums text-slate-500">Tổng đơn <strong className="text-slate-950">{fmtMoney(orderTotal(data), data.currency || "VND")}</strong></span>} />
    <div className="flex flex-wrap items-center gap-2"><OrderStatusBadge status={data.status} /><InventoryEffectBadge status={data.status} /><span className={`rounded-md px-2 py-1 text-xs ${ADMIN_DOMAIN_TONE.ORDER.soft}`}>{data.source || "ORDER"}</span></div>
  </div>;
}
