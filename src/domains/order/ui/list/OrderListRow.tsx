"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import RowActions from "@/domains/shared/ui/list/RowActions";
import OrderStatusBadge from "@/domains/order/ui/OrderStatusBadge";
import type { OrderListItem } from "./types";
import {
  fmtDate,
  fmtMoney,
  isOrderSelectable,
  sourceLabel,
  verificationLabel,
} from "./helpers";

type Props = {
  order: OrderListItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onView?: (row: OrderListItem) => void;
  onEdit?: (row: OrderListItem) => void;
};

export default function OrderListRow({
  order,
  checked,
  onCheckedChange,
  onView,
  onEdit,
}: Props) {
  const selectable = isOrderSelectable(order);

  return (
    <tr className="hover:bg-slate-50/70">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          disabled={!selectable}
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
        />
      </td>

      <td className="px-4 py-4">
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-semibold text-slate-950 hover:underline"
        >
          {order.refNo || "Chưa có mã"}
        </Link>

        <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-slate-500">
          <span>{order.itemCount} dòng</span>

          {order.hasShipment ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
              Shipment
            </span>
          ) : null}

          {order.reserveType ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
              {order.reserveType}
            </span>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="font-medium text-slate-900">
          {order.customerName || "-"}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {order.shipPhone || "-"}
        </div>
      </td>

      <td className="px-4 py-4">
        <OrderStatusBadge status={order.status} />
      </td>

      <td className="px-4 py-4">
        <div className="text-slate-700">{sourceLabel(order.source)}</div>
        <div className="mt-1 text-xs text-slate-500">
          {verificationLabel(order.verificationStatus)}
        </div>
      </td>

      <td className="px-4 py-4 text-right font-semibold text-slate-950">
        {fmtMoney(order.subtotal, order.currency)}
      </td>

      <td className="px-4 py-4 text-slate-500">
        {fmtDate(order.updatedAt)}
      </td>

      <td className="px-4 py-4 text-right">
        <RowActions
          row={order}
          actions={[
            onView
              ? {
                key: "view",
                label: "Chi tiết",
                icon: <Eye className="h-4 w-4" />,
                onClick: onView,
              }
              : null,
            onEdit
              ? {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <Pencil className="h-4 w-4" />,
                onClick: onEdit,
              }
              : null,
          ]}
        />
      </td>
    </tr>
  );
}
