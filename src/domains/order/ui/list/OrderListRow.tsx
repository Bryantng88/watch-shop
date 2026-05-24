"use client";

import Link from "next/link";
import { Eye, Pencil, Send, Truck, WalletCards, XCircle } from "lucide-react";

import {
  ReserveTypeSignalIcon,
  OrderSourceSignalIcon,
  PaymentStateSignalIcon,
  ProductCountSignalIcon,
  ShipmentStateSignalIcon,
} from "@/domains/shared/ui/icons";
import RowActions from "@/domains/shared/ui/list/RowActions";
import { ShipmentProgress } from "@/domains/shipment/ui/progress";

import type { OrderListItem } from "./types";
import {
  canCancelOrder,
  canMarkShipmentDelivered,
  canPostOrder,
  formatDateTime,
  formatMoney,
} from "./helpers";

type Props = {
  item: OrderListItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;

  onView?: (row: OrderListItem) => void;
  onEdit?: (row: OrderListItem) => void;
  onPost?: (row: OrderListItem) => void;
  onManagePayments?: (row: OrderListItem) => void;
  onMarkShipmentDelivered?: (row: OrderListItem) => void;
  onCancel?: (row: OrderListItem) => void;
};

function resolveShipmentProgressStatus(item: OrderListItem) {
  if (!item.hasShipment) return "DELIVERED";

  const direct = item.shipmentStatus || item.fulfillmentStatus;
  if (direct) return direct;

  const status = String(item.status ?? "").toUpperCase();
  if (status === "RETURNING") return "RETURNING";
  if (status === "RETURNED") return "RETURNED";
  if (status === "SHIPPED") return "SHIPPED";
  if (status === "COMPLETED") return "DELIVERED";

  return "READY";
}

export default function OrderListRow({
  item,
  checked,
  onCheckedChange,
  onView,
  onEdit,
  onPost,
  onManagePayments,
  onMarkShipmentDelivered,
  onCancel,
}: Props) {
  const itemsCount = Number(item.itemsCount ?? 0);
  const remainingAmount = Number(item.remainingAmount ?? 0);

  const isWebVerified =
    String(item.source ?? "").toUpperCase() === "WEB" &&
    String(item.verificationStatus ?? "").toUpperCase() === "VERIFIED";

  return (
    <tr className="border-t border-slate-100 align-middle hover:bg-slate-50/50">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[260px]">
          <Link
            href={`/admin/orders/${item.id}`}
            className="font-semibold text-slate-950 hover:text-blue-700"
          >
            {item.refNo || item.id}
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <ProductCountSignalIcon count={itemsCount} />
            <OrderSourceSignalIcon source={item.source} />
            <ReserveTypeSignalIcon reserveType={item.reserveType} />

            {isWebVerified ? (
              <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
                Đã xác minh
              </span>
            ) : null}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[150px]">
          <div className="font-semibold text-slate-900">
            {item.customerName || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {item.customerPhone || item.shipPhone || "-"}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex min-w-[90px] items-center">
          <PaymentStateSignalIcon
            status={item.paymentStatus}
            totalAmount={item.totalAmount}
            remainingAmount={item.remainingAmount}
            collectedAmount={item.collectedAmount}
          />
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[160px]">
          {!item.hasShipment ? (
            <ShipmentStateSignalIcon status="DELIVERED" />
          ) : (
            <ShipmentProgress status={resolveShipmentProgressStatus(item)} compact />
          )}
        </div>
      </td>

      <td className="px-4 py-4 text-right">
        <div className="min-w-[140px]">
          <div className="font-semibold text-slate-950">
            {formatMoney(item.totalAmount)}
          </div>

          {remainingAmount > 0 ? (
            <div className="mt-1 text-xs text-rose-600">
              Còn thu: {formatMoney(remainingAmount)}
            </div>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[120px] text-sm text-slate-600">
          {formatDateTime(item.updatedAt)}
        </div>
      </td>

      <td className="px-4 py-4 text-right">
        <RowActions
          row={item}
          actions={[
            onView && {
              key: "view",
              label: "Xem đơn",
              icon: <Eye className="h-4 w-4" />,
              onClick: onView,
            },
            canPostOrder(item) &&
            onPost && {
              key: "post",
              label: "Post đơn hàng",
              icon: <Send className="h-4 w-4" />,
              onClick: onPost,
            },
            onManagePayments && {
              key: "manage-payments",
              label: "Quản lý payment",
              icon: <WalletCards className="h-4 w-4" />,
              onClick: onManagePayments,
            },
            canMarkShipmentDelivered(item) &&
            onMarkShipmentDelivered && {
              key: "mark-shipment-delivered",
              label: "Đã giao hàng",
              icon: <Truck className="h-4 w-4" />,
              onClick: onMarkShipmentDelivered,
            },
            onEdit && {
              key: "edit",
              label: "Chỉnh sửa",
              icon: <Pencil className="h-4 w-4" />,
              onClick: onEdit,
            },
            canCancelOrder(item) &&
            onCancel && {
              key: "cancel",
              label: "Hủy đơn hàng",
              icon: <XCircle className="h-4 w-4" />,
              tone: "danger",
              separatorBefore: true,
              onClick: onCancel,
            },
          ]}
        />
      </td>
    </tr>
  );
}