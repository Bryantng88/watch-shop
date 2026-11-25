"use client";
import { AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminRowActionMenu } from "@/domains/shared/ui/admin-design-contract/AdminRowActionMenu";
import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import { ADMIN_DETAIL as detail } from "@/domains/shared/ui/admin-design-contract/AdminDetail";
import Link from "next/link";
import { CalendarClock, ChevronRight, Pencil, UserRound } from "lucide-react";
import { sourceLabel } from "@/domains/order/ui/order-ui.helpers";
import OrderStatusBadge from "@/domains/order/ui/OrderStatusBadge";
import { fmtDate, InventoryEffectBadge, orderDisplayCode, type OrderDetailData } from "./shared";
export default function OrderHeader({ data }: { data: OrderDetailData }) {
  return <>
    <nav className={detail.breadcrumb} aria-label="Breadcrumb"><Link href="/admin/orders">Đơn hàng</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true"/><span>{orderDisplayCode(data)}</span></nav>
    <header className={detail.recordHeader}>
      <div className={detail.identityText}>
        <div className={detail.tags}><span className="text-slate-500">{sourceLabel(data.source)}</span><OrderStatusBadge status={data.status}/><InventoryEffectBadge status={data.status}/></div>
        <h1 className={detail.recordTitle}>{orderDisplayCode(data)}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" aria-hidden="true"/>{data.customerName || "Khách chưa đặt tên"}</span><span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" aria-hidden="true"/>{fmtDate(data.updatedAt)}</span><span>{data.paymentMethod || "Chưa có phương thức thanh toán"}</span></div>
        <details className={detail.metadata}><AdminDisclosureSummary className="cursor-pointer">Mã hệ thống</AdminDisclosureSummary><span className="break-all">{data.id}</span></details>
      </div>
      <div className={detail.headerActions} role="group" aria-label="Thao tác với đơn hàng">
        <AdminLinkAction variant="quiet" density="compact" iconOnly title="Chỉnh thông tin" aria-label="Chỉnh thông tin" href={`/admin/orders/${data.id}/edit`}><Pencil className="h-4 w-4"/></AdminLinkAction>
        <AdminRowActionMenu label="Xem thêm" status={null} iconOnly actions={[
          {key:"order-items",label:"Sản phẩm / dịch vụ"},
          {key:"order-customer",label:"Khách hàng"},
          {key:"order-payment",label:"Thanh toán"},
          {key:"order-actions",label:"Thao tác"},
          {key:"order-history",label:"Lịch sử"},
        ].map(({key,label})=>({key,label,onSelect:()=>{window.location.hash=key;}}))}/>
      </div>
    </header>
  </>;
}
