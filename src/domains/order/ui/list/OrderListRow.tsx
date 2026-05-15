"use client";

import Link from "next/link";
import {
  Building2,
  Eye,
  Globe2,
  Pencil,
  ReceiptText,
  Trash2,
  Watch,
} from "lucide-react";

import RowActions from "@/domains/shared/ui/list/RowActions";

import type { OrderListItem } from "./types";
import {
  formatDateTime,
  formatMoney,
  formatOrderSource,
  orderStatusLabel,
  orderStatusTone,
  sourceTone,
} from "./helpers";

type Props = {
  item: OrderListItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;

  onView?: (row: OrderListItem) => void;
  onEdit?: (row: OrderListItem) => void;
  onDelete?: (row: OrderListItem) => void;
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
  onDelete,
}: Props) {
  const itemsCount = Number(item.itemsCount ?? 0);

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
        <div className="min-w-[220px]">
          <Link
            href={`/admin/orders/${item.id}`}
            className="font-semibold text-slate-950 hover:text-blue-700"
          >
            {item.refNo || item.id}
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span>
              {itemsCount > 0 ? `${itemsCount} sản phẩm` : "Chưa có sản phẩm"}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <SourceIcon source={item.source} />
              {formatOrderSource(item)}
            </span>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[150px]">
          <div className="font-semibold text-slate-900">
            {item.customerName || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {item.customerPhone || "-"}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex min-w-[150px] flex-col items-start gap-1.5">
          <span
            className={[
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
              orderStatusTone(item.status),
            ].join(" ")}
          >
            {orderStatusLabel(item.status)}
          </span>

          {(item.paymentStatus || item.fulfillmentStatus) ? (
            <div className="text-xs text-slate-500">
              {item.paymentStatus ? `Payment: ${item.paymentStatus}` : null}
              {item.paymentStatus && item.fulfillmentStatus ? " • " : null}
              {item.fulfillmentStatus
                ? `Fulfillment: ${item.fulfillmentStatus}`
                : null}
            </div>
          ) : null}
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
        <div className="min-w-[130px] font-semibold text-slate-950">
          {formatMoney(item.totalAmount)}
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
            onEdit && {
              key: "edit",
              label: "Chỉnh sửa",
              icon: <Pencil className="h-4 w-4" />,
              onClick: onEdit,
            },
            onDelete && {
              key: "delete",
              label: "Xóa đơn",
              icon: <Trash2 className="h-4 w-4" />,
              tone: "danger",
              separatorBefore: true,
              onClick: onDelete,
            },
          ]}
        />
      </td>
    </tr>
  );
}