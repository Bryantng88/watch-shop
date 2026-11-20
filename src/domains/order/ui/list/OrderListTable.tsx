"use client";

import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";
import styles from "@/domains/shared/ui/admin-design-contract/AdminBusinessTable.module.css";
import { ADMIN_OPERATION_LIST_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminOperationList";
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

      <AdminListFooter total={props.total} unit="đơn" page={props.page} totalPages={props.totalPages}
        previousHref={buildHref(props.pathname, props.searchParams, { page: String(Math.max(1, props.page - 1)) })}
        nextHref={buildHref(props.pathname, props.searchParams, { page: String(Math.min(props.totalPages, props.page + 1)) })} />
    </div>
  );
}
