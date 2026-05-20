"use client";

import Link from "next/link";
import { CalendarClock, CreditCard, PackageCheck, Pencil, UserRound } from "lucide-react";
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            href="/admin/orders"
            className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Danh sách đơn hàng
          </Link>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
              <PackageCheck className="h-8 w-8 text-slate-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-950">
                  {orderDisplayCode(data)}
                </h1>
                <OrderStatusBadge status={data.status} />
                <InventoryEffectBadge status={data.status} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" />
                  <span className="font-medium text-slate-700">{data.customerName || "Khách chưa đặt tên"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4" />
                  Updated: <span className="font-medium text-slate-700">{fmtDate(data.updatedAt)}</span>
                </span>
                <span>
                  ID: <span className="font-mono text-xs font-medium text-slate-700">{data.id}</span>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Tổng đơn</div>
                  <div className="mt-1 text-sm font-semibold text-slate-950">{fmtMoney(total, currency)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Đã nhận</div>
                  <div className="mt-1 text-sm font-semibold text-slate-950">{fmtMoney(paid, currency)}</div>
                </div>
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/55">Còn phải thu</div>
                  <div className="mt-1 text-sm font-semibold">{fmtMoney(remaining, currency)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={`/admin/orders/${data.id}/edit`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
          <div className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white">
            <CreditCard className="mr-2 h-4 w-4" />
            {data.paymentMethod || "Payment"}
          </div>
        </div>
      </div>
    </div>
  );
}
