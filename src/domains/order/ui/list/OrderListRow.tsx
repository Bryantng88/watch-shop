"use client";

import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  Globe2,
  Pencil,
  Send,
  Truck,
  Watch,
  XCircle,
} from "lucide-react";

import RowActions from "@/domains/shared/ui/list/RowActions";

import type { OrderListItem } from "./types";
import {
  canCancelOrder,
  canCreatePayment,
  canMarkPaymentPaid,
  canMarkShipmentDelivered,
  canPostOrder,
  formatDateTime,
  formatMoney,
  formatOrderSource,
  formatPaymentMethod,
  orderOperationLabel,
  orderOperationTone,
  orderPaymentFlowTone,
  sourceTone,
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

function SourceIcon({ source }: { source?: string | null }) {
  const value = String(source ?? "").toUpperCase();

  if (value === "WEB") return <Globe2 className="h-3.5 w-3.5" />;
  if (value === "WATCH_QUICK_ORDER") return <Watch className="h-3.5 w-3.5" />;

  return <Building2 className="h-3.5 w-3.5" />;
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
  const depositRequired = Number(item.depositRequired ?? 0);
  const collectedAmount = Number(item.collectedAmount ?? 0);
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
        <div className="min-w-[240px]">
          <Link
            href={`/admin/orders/${item.id}`}
            className="font-semibold text-slate-950 hover:text-blue-700"
          >
            {item.refNo || item.id}
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span>
              {itemsCount > 0
                ? `${itemsCount} sản phẩm`
                : "Chưa có sản phẩm"}
            </span>

            <span>•</span>

            <span className="inline-flex items-center gap-1">
              <SourceIcon source={item.source} />
              {formatOrderSource(item)}
            </span>

            {isWebVerified ? (
              <>
                <span>•</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700 ring-1 ring-blue-200">
                  Đã xác minh
                </span>
              </>
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
        <div className="min-w-[160px] space-y-1.5">
          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
              orderPaymentFlowTone(item),
            ].join(" ")}
          >
            {item.paymentFlowLabel || "Không cọc"}
          </span>

          <div className="text-xs leading-5 text-slate-500">
            <div>{formatPaymentMethod(item.paymentMethod)}</div>

            {depositRequired > 0 ? (
              <div>Cọc: {formatMoney(depositRequired)}</div>
            ) : null}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[180px] space-y-1.5">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {String(item.status ?? "").toUpperCase() === "POSTED"
              ? "Đang xử lý"
              : orderOperationLabel(item)}
          </span>

          <div className="text-xs leading-5 text-slate-500">
            <div>Payment: {item.paymentStatus || "-"}</div>
            <div>Shipment: {item.fulfillmentStatus || "-"}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[150px]">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
              sourceTone(item),
            ].join(" ")}
          >
            <SourceIcon source={item.source} />
            {formatOrderSource(item)}
          </span>

          {item.createdByName ? (
            <div className="mt-1 text-xs text-slate-500">
              bởi {item.createdByName}
            </div>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[130px]">
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
              icon: <CreditCard className="h-4 w-4" />,
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