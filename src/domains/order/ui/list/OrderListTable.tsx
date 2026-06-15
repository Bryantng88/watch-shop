"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { buildHref, isOrderSelectable } from "./helpers";
import OrderListRow from "./OrderListRow";
import type { OrderListItem } from "./types";

type Props = {
  items: OrderListItem[];
  total: number;
  page: number;
  totalPages: number;
  pathname: string;
  searchParams: URLSearchParams;

  selectedIds: string[];
  onToggleOne: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;

  onView?: (row: OrderListItem) => void;
  onEdit?: (row: OrderListItem) => void;
  onPost?: (row: OrderListItem) => void;
  isCancelledOrder: (status?: string | null) => boolean;
  onMarkShipmentDelivered?: (row: OrderListItem) => void;
  onCancel?: (row: OrderListItem) => void;
  onManagePayments?: (row: OrderListItem) => void;
  onManageShipment?: (row: OrderListItem) => void;
  onCreateWorkCase?: (row: OrderListItem) => void;
};

export default function OrderListTable({
  items,
  total,
  page,
  totalPages,
  pathname,
  searchParams,
  selectedIds,
  onToggleOne,
  onToggleAll,
  onView,
  onEdit,
  onPost,
  isCancelledOrder,
  onMarkShipmentDelivered,
  onCancel,
  onManagePayments,
  onManageShipment,
  onCreateWorkCase
}: Props) {
  const selectableIds = items.filter(isOrderSelectable).map((item) => item.id);

  const allChecked =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedIds.includes(id));

  const someChecked =
    selectableIds.some((id) => selectedIds.includes(id)) && !allChecked;

  return (
    <div className="relative overflow-visible rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-950">
            Danh sách dữ liệu
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            {total} đơn
          </span>
        </div>
      </div>

      <div className="relative overflow-visible">
        <table className="w-full table-fixed text-sm">

          <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="w-[5%] px-4 py-4">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(element) => {
                    if (element) element.indeterminate = someChecked;
                  }}
                  disabled={!selectableIds.length}
                  onChange={(event) => onToggleAll(event.target.checked)}
                />
              </th>
              <th className="w-[11%] px-5 py-4">Đơn hàng</th>
              <th className="w-[11%] px-5 py-4">Khách hàng</th>
              <th className="w-[7%] px-5 py-4">Thanh toán</th>
              <th className="w-[11%] px-5 py-4">Giao hàng</th>
              <th className="w-[11%] px-5 py-4 text-right">Tổng tiền</th>
              <th className="w-[7%] px-5 py-4">Cập nhật</th>
              <th className="w-[7%] px-1 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((order) => (
              <OrderListRow
                key={order.id}
                item={order}
                checked={selectedIds.includes(order.id)}
                onCheckedChange={(checked) => onToggleOne(order.id, checked)}
                onView={onView}
                onEdit={onEdit}
                onPost={onPost}
                onMarkShipmentDelivered={onMarkShipmentDelivered}
                onCancel={onCancel}
                onManagePayments={onManagePayments}
                onManageShipment={onManageShipment}
                isCancelledOrder={isCancelledOrder}
                onCreateWorkCase={onCreateWorkCase}
              />
            ))}

            {!items.length ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  Không có đơn hàng phù hợp.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
        <div>
          Tổng: <b className="text-slate-900">{total}</b> đơn · Trang {page}/
          {totalPages}
        </div>

        <div className="flex gap-2">
          <Link
            aria-disabled={page <= 1}
            href={buildHref(pathname, searchParams, {
              page: String(Math.max(1, page - 1)),
            })}
            className={cn(
              "rounded-xl border border-slate-200 px-3 py-2",
              page <= 1 && "pointer-events-none opacity-40",
            )}
          >
            Trước
          </Link>

          <Link
            aria-disabled={page >= totalPages}
            href={buildHref(pathname, searchParams, {
              page: String(Math.min(totalPages, page + 1)),
            })}
            className={cn(
              "rounded-xl border border-slate-200 px-3 py-2",
              page >= totalPages && "pointer-events-none opacity-40",
            )}
          >
            Sau
          </Link>
        </div>
      </div>
    </div>
  );
}
