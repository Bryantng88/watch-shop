"use client";

import Link from "next/link";
import { Eye, Pencil, Send, Truck, WalletCards, XCircle, ClipboardPlus } from "lucide-react";

import RowActions from "@/domains/shared/ui/list/RowActions";
import { PaymentAmountSummary, PaymentStatusSignal } from "@/domains/payment/ui/signals";
import { ShipmentLiveRouteSignal } from "@/domains/shipment/ui/progress";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

import type { OrderListItem } from "./types";
import {
  canCancelOrder,
  canPostOrder,
  formatDateTime,
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

function canCreateShipment(item: OrderListItem) {
  return !item.hasShipment && !["DRAFT", "CANCELLED", "CANCELED", "RETURNED"]
    .includes(String(item.status ?? "").toUpperCase());
}

function OrderPreview({ item }: { item: OrderListItem }) {
  const images = item.previewImageUrls?.length
    ? item.previewImageUrls
    : item.previewImageUrl
      ? [item.previewImageUrl]
      : [];
  return (
    <div className="relative h-16 w-[76px] shrink-0">
      {(images.length ? images.slice(0, 3) : [null]).map((url, index) => {
        const src = url ? resolveMediaPreviewSrc(url) ?? url : null;
        return (
          <div
            key={`${url ?? "empty"}:${index}`}
            className="absolute top-0 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-slate-200"
            style={{ left: index * 6, zIndex: 3 - index }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : "O"}
          </div>
        );
      })}
    </div>
  );
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
  onCancel,
  isCancelledOrder,
}: Props) {
  const itemsCount = Number(item.itemsCount ?? 0);
  const cancelled = isCancelledOrder(item.status);
  const remainingAmount = cancelled ? 0 : Number(item.remainingAmount ?? 0);
  return (
    <tr className="border-t border-slate-100 align-middle hover:bg-slate-50/40">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex min-w-[340px] items-center gap-3">
          <OrderPreview item={item} />
          <div className="min-w-0">
          <Link
            href={`/admin/orders/${item.id}`}
            className="line-clamp-2 text-[15px] font-semibold text-slate-900 hover:text-blue-700"
          >
            {item.refNo || item.id}
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
            <span>{itemsCount} sản phẩm</span>
            <span>{item.sourceLabel || item.source || "Nội bộ"}</span>

            {false ? (
              <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
                Đã xác minh
              </span>
            ) : null}
          </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="min-w-[150px]">
          <div className="font-semibold text-slate-900">
            {item.customerName || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {item.customerPhone || item.shipPhone || "-"}
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex min-w-[145px] items-center">
          <PaymentStatusSignal
            status={cancelled ? "CANCELED" : item.paymentStatus}
            totalAmount={item.totalAmount}
            remainingAmount={cancelled ? 0 : item.remainingAmount}
            paidAmount={cancelled ? 0 : item.paidAmount ?? item.collectedAmount}
          />
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="min-w-[160px]">
          <ShipmentLiveRouteSignal
            noShipment={!item.hasShipment}
            status={resolveShipmentProgressStatus(item)}
          />
        </div>
      </td>

      <td className="px-4 py-3">
        <div
          className="line-clamp-2 min-w-[180px] whitespace-pre-line text-sm leading-5 text-slate-600"
          title={item.notes?.trim() || undefined}
        >
          {item.notes?.trim() || "-"}
        </div>
      </td>

      <td className="px-5 py-3 text-right">
        <PaymentAmountSummary
          className="min-w-[140px]"
          totalAmount={item.totalAmount}
          remainingAmount={remainingAmount}
          cancelled={cancelled}
        />
      </td>

      <td className="px-4 py-3">
        <div className="min-w-[120px] text-sm text-slate-600">
          {formatDateTime(item.updatedAt)}
        </div>
      </td>

      <td className="px-4 py-3 text-right">
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
            (item.hasShipment || canCreateShipment(item)) &&
            onManageShipment && {
              key: "manage-shipment",
              label: item.hasShipment ? "Quản lý giao hàng" : "Tạo shipment",
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
