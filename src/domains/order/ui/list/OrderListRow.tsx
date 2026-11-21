"use client";

import { AdminListDateTime } from "@/domains/shared/ui/admin-design-contract/AdminListDateTime";
import Link from "next/link";
import { Eye, Pencil, Send, Truck, WalletCards, XCircle, ClipboardPlus } from "lucide-react";

import RowActions from "@/domains/shared/ui/list/RowActions";
import { useAdHocWorkRowAction } from "@/domains/task/ui/ad-hoc-work/AdHocWorkRowAction";
import { PaymentAmountSummary, PaymentStatusSignal } from "@/domains/payment/ui/signals";
import { ShipmentLiveRouteSignal } from "@/domains/shipment/ui/progress";
import { AdminListThumbnail } from "@/domains/shared/ui/admin-design-contract/AdminListThumbnail";

import type { OrderListItem } from "./types";
import {
  canCancelOrder,
  canPostOrder,
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
  return <AdminListThumbnail src={item.previewImageUrl || item.previewImageUrls?.[0]} label={item.refNo || item.id} />;
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
          type="checkbox" aria-label={`Chọn ${item.refNo || item.id}`}
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <OrderPreview item={item} />
          <div className="min-w-0">
          <Link
            href={`/admin/orders/${item.id}`}
            className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-blue-700"
          >
            {item.refNo || item.id}
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
            <span>{itemsCount} sản phẩm</span>
            <span>{formatOrderSource(item)}</span>

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
        <div className="min-w-0">
          <div className="font-semibold text-slate-900">
            {item.customerName || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {item.customerPhone || item.shipPhone || "-"}
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center">
          <PaymentStatusSignal variant="inline"
            status={cancelled ? "CANCELED" : item.paymentStatus}
            totalAmount={item.totalAmount}
            remainingAmount={cancelled ? 0 : item.remainingAmount}
            paidAmount={cancelled ? 0 : item.paidAmount ?? item.collectedAmount}
          />
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="min-w-0">
          <ShipmentLiveRouteSignal variant="progress"
            noShipment={!item.hasShipment}
            status={resolveShipmentProgressStatus(item)}
          />
        </div>
      </td>

      <td className="px-4 py-3">
        <div
          className="line-clamp-2 min-w-0 whitespace-pre-line text-sm leading-5 text-slate-600"
          title={item.notes?.trim() || undefined}
        >
          {item.notes?.trim() || "-"}
        </div>
      </td>

      <td className="px-5 py-3 text-right">
        <PaymentAmountSummary variant="inline" kind="receivable"
          className="min-w-0"
          totalAmount={item.totalAmount}
          remainingAmount={remainingAmount}
          cancelled={cancelled}
        />
      </td>

      <td className="px-4 py-3">
        <AdminListDateTime value={item.updatedAt} />
      </td>

      <td className="sticky right-0 z-[1] bg-white px-3 py-3 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">
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
