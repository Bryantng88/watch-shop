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

export default function OrderListTable(props: Props) {
  const selectableIds = props.items.filter(isOrderSelectable).map((item) => item.id);
  const allChecked =
    selectableIds.length > 0 &&
    selectableIds.every((id) => props.selectedIds.includes(id));
  const someChecked =
    selectableIds.some((id) => props.selectedIds.includes(id)) && !allChecked;

  return (
    <div className="relative overflow-visible rounded-b-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035)]">
      <div className="relative w-full overflow-x-auto">
        <table className="w-full min-w-[1240px] table-fixed text-sm">
          <colgroup>
            <col className="w-[48px]" />
            <col className="w-[360px]" />
            <col className="w-[190px]" />
            <col className="w-[180px]" />
            <col className="w-[210px]" />
            <col className="w-[160px]" />
            <col className="w-[140px]" />
            <col className="w-[80px]" />
          </colgroup>
          <thead className="bg-slate-50/80 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(element) => {
                    if (element) element.indeterminate = someChecked;
                  }}
                  disabled={!selectableIds.length}
                  onChange={(event) => props.onToggleAll(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </th>
              <th className="px-4 py-3">Đơn hàng</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Thanh toán</th>
              <th className="px-4 py-3">Giao hàng</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3">Cập nhật</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {props.items.length ? props.items.map((order) => (
              <OrderListRow
                key={order.id}
                item={order}
                checked={props.selectedIds.includes(order.id)}
                onCheckedChange={(checked) => props.onToggleOne(order.id, checked)}
                onView={props.onView}
                onEdit={props.onEdit}
                onPost={props.onPost}
                onMarkShipmentDelivered={props.onMarkShipmentDelivered}
                onCancel={props.onCancel}
                onManagePayments={props.onManagePayments}
                onManageShipment={props.onManageShipment}
                isCancelledOrder={props.isCancelledOrder}
                onCreateWorkCase={props.onCreateWorkCase}
              />
            )) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                  Chưa có đơn hàng nào khớp bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
        <div>
          Tổng: <b className="text-slate-900">{props.total}</b> đơn · Trang {props.page}/{props.totalPages}
        </div>
        <div className="flex gap-2">
          <Link
            aria-disabled={props.page <= 1}
            href={buildHref(props.pathname, props.searchParams, {
              page: String(Math.max(1, props.page - 1)),
            })}
            className={cn(
              "rounded-xl border border-slate-200 px-3 py-2",
              props.page <= 1 && "pointer-events-none opacity-40",
            )}
          >
            Trước
          </Link>
          <Link
            aria-disabled={props.page >= props.totalPages}
            href={buildHref(props.pathname, props.searchParams, {
              page: String(Math.min(props.totalPages, props.page + 1)),
            })}
            className={cn(
              "rounded-xl border border-slate-200 px-3 py-2",
              props.page >= props.totalPages && "pointer-events-none opacity-40",
            )}
          >
            Sau
          </Link>
        </div>
      </div>
    </div>
  );
}
