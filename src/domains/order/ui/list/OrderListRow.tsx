"use client";

import Link from "next/link";
import { Eye, Pencil, Send, Truck, WalletCards, XCircle, ClipboardPlus } from "lucide-react";

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
  onCreateWorkCase?: (row: OrderListItem) => void;
  onView?: (row: OrderListItem) => void;
  onEdit?: (row: OrderListItem) => void;
  onPost?: (row: OrderListItem) => void;
  onManagePayments?: (row: OrderListItem) => void;
  onManageShipment?: (row: OrderListItem) => void;
  onMarkShipmentDelivered?: (row: OrderListItem) => void;
  onCancel?: (row: OrderListItem) => void;
  isCancelledOrder: (status: OrderListItem["status"]) => boolean;
};

function resolveShipmentProgressStatus(item: OrderListItem) {
  const orderStatus = String(item.status ?? "").toUpperCase();

  if (["CANCELLED", "CANCELED"].includes(orderStatus)) {
    return "CANCELLED";
  }

  if (!item.hasShipment) return "DELIVERED";

  const direct = item.shipmentStatus || item.fulfillmentStatus;
  if (direct) return direct;

  if (orderStatus === "RETURNING") return "RETURNING";
  if (orderStatus === "RETURNED") return "RETURNED";
  if (orderStatus === "SHIPPED") return "SHIPPED";
  if (orderStatus === "COMPLETED") return "DELIVERED";

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
  onCreateWorkCase,
  onManageShipment,
  onMarkShipmentDelivered,
  onCancel,
  isCancelledOrder,
}: Props) {
  const itemsCount = Number(item.itemsCount ?? 0);
  const cancelled = isCancelledOrder(item.status);
  const remainingAmount = cancelled ? 0 : Number(item.remainingAmount ?? 0);
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
            status={cancelled ? "CANCELED" : item.paymentStatus}
            totalAmount={item.totalAmount}
            remainingAmount={cancelled ? 0 : item.remainingAmount}
            collectedAmount={cancelled ? 0 : item.collectedAmount}
          />
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[160px]">
          {!item.hasShipment ? (
            <ShipmentStateSignalIcon status="DELIVERED" />
          ) : (
            <ShipmentProgress
              status={resolveShipmentProgressStatus(item)}
              events={item.shipmentProgressEvents}
              compact
            />
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
              Còn {formatMoney(remainingAmount)}
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
            onCreateWorkCase && {
              key: "create-work-case",
              label: "Tạo phiếu xử lý",
              icon: <ClipboardPlus className="h-4 w-4" />,
              onClick: onCreateWorkCase,
            },
            !cancelled &&
            canPostOrder(item) &&
            onPost && {
              key: "post",
              label: "Post đơn hàng",
              icon: <Send className="h-4 w-4" />,
              onClick: onPost,
            },
            !cancelled &&
            onManagePayments && {
              key: "manage-payments",
              label: "Quản lý payment",
              icon: <WalletCards className="h-4 w-4" />,
              onClick: onManagePayments,
            },
            !cancelled &&
            item.hasShipment &&
            onManageShipment && {
              key: "manage-shipment",
              label: "Quản lý giao hàng",
              icon: <Truck className="h-4 w-4" />,
              onClick: onManageShipment,
            },

            !cancelled &&
            onEdit && {
              key: "edit",
              label: "Chỉnh sửa",
              icon: <Pencil className="h-4 w-4" />,
              onClick: onEdit,
            },
            !cancelled &&
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