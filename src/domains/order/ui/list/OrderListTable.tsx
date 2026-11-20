"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/domains/shared/ui/admin-design-contract/AdminBusinessTable.module.css";
import { ADMIN_OPERATION_LIST_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminOperationList";
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
    <div className={styles.list} style={ADMIN_OPERATION_LIST_STYLE}>
      <div className={styles.scroll}>
        <table className={styles.table}>
                    <caption className="sr-only">Danh sách đơn hàng</caption>
          <colgroup><col style={{ width: 40 }} /><col style={{ width: 240 }} /><col style={{ width: 150 }} /><col style={{ width: 140 }} /><col style={{ width: 150 }} /><col style={{ width: 160 }} /><col style={{ width: 160 }} /><col style={{ width: 116 }} /><col style={{ width: 44 }} /></colgroup>
          <thead>
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox" aria-label="Chọn tất cả dòng có thể xử lý"
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
              <th className="px-4 py-3">Ghi chú</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3">Cập nhật</th>
              <th className="sticky right-0 z-10 bg-slate-50 px-3 py-3 text-right"><span className="sr-only">Thao tác</span></th>
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
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
                  Chưa có đơn hàng nào khớp bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div>
          Tổng: <b className="text-slate-900">{props.total}</b> đơn · Trang {props.page}/{props.totalPages}
        </div>
        <div className="flex gap-2">
          <Link
            aria-label="Trang trước"
            aria-disabled={props.page <= 1}
            href={buildHref(props.pathname, props.searchParams, {
              page: String(Math.max(1, props.page - 1)),
            })}
            className={cn(
              styles.pageLink,
              props.page <= 1 && "pointer-events-none opacity-40",
            )}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Link>
          <Link
            aria-label="Trang sau"
            aria-disabled={props.page >= props.totalPages}
            href={buildHref(props.pathname, props.searchParams, {
              page: String(Math.min(props.totalPages, props.page + 1)),
            })}
            className={cn(
              styles.pageLink,
              props.page >= props.totalPages && "pointer-events-none opacity-40",
            )}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
