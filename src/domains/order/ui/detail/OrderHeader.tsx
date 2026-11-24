"use client";
import { AdminAnchorAction, AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import { ADMIN_DETAIL as detail } from "@/domains/shared/ui/admin-design-contract/AdminDetail";
import Link from "next/link";
import { CalendarClock, ChevronRight, Pencil, UserRound, Package, Users, Wallet, ListChecks, History } from "lucide-react";
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
      <nav className={`${detail.headerActions} ${detail.orderHeaderActions}`} aria-label="Các phần chi tiết">
        <AdminLinkAction variant="quiet" density="compact" iconOnly title="Chỉnh thông tin" aria-label="Chỉnh thông tin" href={`/admin/orders/${data.id}/edit`}><Pencil className="h-4 w-4"/></AdminLinkAction>
        {[{href:"#order-items",label:"Sản phẩm / dịch vụ",icon:Package},{href:"#order-customer",label:"Khách hàng",icon:Users},{href:"#order-payment",label:"Thanh toán",icon:Wallet},{href:"#order-actions",label:"Thao tác",icon:ListChecks},{href:"#order-history",label:"Lịch sử",icon:History}].map(({href,label,icon:Icon})=><AdminAnchorAction key={href} href={href} variant="quiet" density="compact" iconOnly title={label} aria-label={label}><Icon className="h-4 w-4"/></AdminAnchorAction>)}
      </nav>
    </header>
  </>;
}
