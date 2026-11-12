"use client";

import Link from "next/link";
import OrderStatusBadge from "../OrderStatusBadge";
import { Eye, MessageSquare, Package2, Pencil, Send, Truck, WalletCards, XCircle, ClipboardPlus } from "lucide-react";

import RowActions from "@/domains/shared/ui/list/RowActions";
import { useAdHocWorkRowAction } from "@/domains/task/ui/ad-hoc-work/AdHocWorkRowAction";
import { PaymentAmountSummary, PaymentStatusSignal } from "@/domains/payment/ui/signals";
import { ShipmentLiveRouteSignal } from "@/domains/shipment/ui/progress";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

import type { OrderListItem } from "./types";
import {
  canCancelOrder,
  canPostOrder,
  formatDateTime,
  formatOrderSource,
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
    <div className="relative h-10 w-[48px] shrink-0">
      {(images.length ? images.slice(0, 3) : [null]).map((url, index) => {
        const src = url ? resolveMediaPreviewSrc(url) ?? url : null;
        return (
          <div
            key={`${url ?? "empty"}:${index}`}
            className="absolute top-0 flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-slate-200"
            style={{ left: index * 6, zIndex: 3 - index }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : <Package2 className="h-4 w-4 text-slate-400" />}
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
  const adHocWork = useAdHocWorkRowAction<OrderListItem>((row) => ({
    targetType: "ORDER",
    targetId: row.id,
    title: row.refNo || "Đơn hàng",
    ref: row.refNo,
    imageUrl: row.previewImageUrl,
    href: `/admin/orders/${row.id}`,
  }));
  const itemsCount = Number(item.itemsCount ?? 0);
  const cancelled = isCancelledOrder(item.status);
  const remainingAmount = cancelled ? 0 : Number(item.remainingAmount ?? 0);
  return (
    <>
    <tr className="border-t border-slate-100 align-middle hover:bg-slate-50/40">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          aria-label={`Chọn đơn ${item.refNo || item.id}`} className="h-4 w-4 rounded border-slate-300"
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <OrderPreview item={item} />
          <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1">
            <Link href={`/admin/orders/${item.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 hover:text-blue-700">{item.refNo || item.id}</Link>
            {item.notes?.trim() && <span tabIndex={0} title={item.notes.trim()} aria-label={`Ghi chú: ${item.notes.trim()}`} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded focus-visible:ring-2 focus-visible:ring-blue-200"><MessageSquare className="h-3.5 w-3.5" /></span>}
          </div>
          <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
            <OrderStatusBadge status={item.status} compact />
            <span className="shrink-0">{itemsCount} SP</span>
            <span className="min-w-0 truncate" title={formatOrderSource(item)}>{item.source === "ADMIN" ? "Admin" : item.source === "WEB" ? "Web" : formatOrderSource(item)}</span>
            <span tabIndex={0} aria-label={`Cập nhật ${formatDateTime(item.updatedAt)}`} title={`Cập nhật ${formatDateTime(item.updatedAt)}`} className="shrink-0 rounded tabular-nums text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-200">{formatDateTime(item.updatedAt).split(" ")[0].replace(",", "")}</span>
          </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="min-w-0">
          <div title={item.customerName || undefined} className="truncate font-semibold text-slate-900">
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



      <td className="px-5 py-3 text-right">
        <PaymentAmountSummary
          className="min-w-[140px] tabular-nums"
          totalAmount={item.totalAmount}
          remainingAmount={remainingAmount}
          cancelled={cancelled}
        />
      </td>



      <td className="sticky right-0 z-[1] bg-white px-3 py-3 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">
        <RowActions
          row={item}
          triggerLabel={`Thao tác đơn ${item.refNo || item.id}`}
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
            adHocWork.action,
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
    {adHocWork.modal}
    </>
  );
}
