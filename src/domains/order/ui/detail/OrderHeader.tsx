"use client";

import Link from "next/link";
import { CalendarClock, ChevronRight, CreditCard, PackageCheck, Pencil, UserRound } from "lucide-react";
import OrderStatusBadge from "@/domains/order/ui/OrderStatusBadge";
import {
  fmtDate,
  fmtMoney,
  InventoryEffectBadge,
  orderDisplayCode,
  orderTotal,
  type OrderDetailData,
} from "./shared";

export default function OrderHeader({ data }: { data: OrderDetailData }) {
  const currency = data.currency || "VND";
  const total = orderTotal(data);
  const paid = Number(data.depositPaid || 0);
  const remaining = Math.max(total - paid, 0);

  return (
    <>
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/admin/orders" className="hover:text-violet-700">Danh sách Order</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-slate-800">{orderDisplayCode(data)}</span>
      </nav>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between lg:p-7">
          <div className="flex min-w-0 gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">
              <PackageCheck className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">{data.source || "ORDER"}</span>
                <OrderStatusBadge status={data.status} />
                <InventoryEffectBadge status={data.status} />
              </div>
              <h1 className="mt-3 truncate text-3xl font-bold tracking-[-0.04em] text-slate-950">{orderDisplayCode(data)}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{data.customerName || "Khách chưa đặt tên"}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" />{fmtDate(data.updatedAt)}</span>
                <span className="font-mono text-[10px]">{data.id}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href={`/admin/orders/${data.id}/edit`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <Pencil className="h-4 w-4" /> Chỉnh thông tin
            </Link>
            <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white">
              <CreditCard className="h-4 w-4" /> {data.paymentMethod || "Payment"}
            </span>
          </div>
        </div>

        <div className="grid border-t border-slate-100 sm:grid-cols-3">
          {[
            ["Tổng đơn", fmtMoney(total, currency), "text-slate-950"],
            ["Đã nhận", fmtMoney(paid, currency), "text-emerald-700"],
            ["Còn phải thu", fmtMoney(remaining, currency), remaining > 0 ? "text-amber-700" : "text-emerald-700"],
          ].map(([label, value, tone], index) => (
            <div key={label} className={`px-5 py-4 ${index ? "border-t border-slate-100 sm:border-l sm:border-t-0" : ""}`}>
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</div>
              <div className={`mt-1 text-lg font-bold tracking-[-0.02em] ${tone}`}>{value}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
