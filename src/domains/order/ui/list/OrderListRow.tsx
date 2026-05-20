"use client";

import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Eye,
  Pencil,
  Send,
  Truck,
  XCircle,
} from "lucide-react";
import { PaymentStateIcon } from "@/domains/payment/ui/icon"; import {
  OrderReserveTypeIcon,
  OrderSourceIcon,
  ProductCountIcon,
} from "@/domains/shared/ui/icons";
import RowActions from "@/domains/shared/ui/list/RowActions";
import { ShipmentProgress } from "@/domains/shipment/ui/progress";

import type { OrderListItem } from "./types";
import {
  canCancelOrder,
  canCreatePayment,
  canMarkPaymentPaid,
  canMarkShipmentDelivered,
  canPostOrder,
  formatDateTime,
  formatMoney,
  paymentDisplayLabel,
  paymentDisplayTone,
} from "./helpers";

type Props = {
  item: OrderListItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;

  onView?: (row: OrderListItem) => void;
  onEdit?: (row: OrderListItem) => void;
  onPost?: (row: OrderListItem) => void;
  onCreatePayment?: (row: OrderListItem) => void;
  onMarkPaymentPaid?: (row: OrderListItem) => void;
  onMarkShipmentDelivered?: (row: OrderListItem) => void;
  onCancel?: (row: OrderListItem) => void;
};

function StatusBadge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
        tone,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function resolveShipmentProgressStatus(item: OrderListItem) {
  const direct =
    (item as any).shipmentStatus ||
    (item as any).shippingStatus ||
    (item as any).deliveryStatus ||
    (item as any).shipment?.status ||
    (item as any).shipments?.[0]?.status;

  if (direct) return direct;

  // fallback theo trạng thái order/list hiện tại
  if (String(item.status ?? "").toUpperCase() === "SHIPPED") {
    return "SHIPPED";
  }

  if (String(item.status ?? "").toUpperCase() === "COMPLETED") {
    return "DELIVERED";
  }

  if (!item.hasShipment) return "DELIVERED";

  return "READY";
}
export default function OrderListRow({
  item,
  checked,
  onCheckedChange,
  onView,
  onEdit,
  onPost,
  onCreatePayment,
  onMarkPaymentPaid,
  onMarkShipmentDelivered,
  onCancel,
}: Props) {
  const itemsCount = Number(item.itemsCount ?? 0);
  const remainingAmount = Number(item.remainingAmount ?? 0);
  const collectedAmount = Number(item.collectedAmount ?? 0);

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
            <ProductCountIcon count={itemsCount} />
            <OrderSourceIcon source={item.source} />
            <OrderReserveTypeIcon reserveType={item.reserveType} />

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
        <div className="flex min-w-[150px] items-center gap-2">
          <PaymentStateIcon
            status={item.paymentStatus}
            totalAmount={item.totalAmount}
            remainingAmount={item.remainingAmount}
            collectedAmount={item.collectedAmount}
          />


        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[160px]">
          <ShipmentProgress
            status={resolveShipmentProgressStatus(item)}
            compact
          />
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

          {collectedAmount > 0 ? (
            <div className="mt-1 text-xs text-amber-700">
              COD chờ đối soát: {formatMoney(collectedAmount)}
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

            canCreatePayment(item) &&
            onCreatePayment && {
              key: "create-payment",
              label: "Tạo payment",
              icon: <Banknote className="h-4 w-4" />,
              onClick: onCreatePayment,
            },

            canMarkPaymentPaid(item) &&
            onMarkPaymentPaid && {
              key: "mark-payment-paid",
              label: "Hoàn tất payment",
              icon: <CheckCircle2 className="h-4 w-4" />,
              onClick: onMarkPaymentPaid,
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