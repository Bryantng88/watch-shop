"use client";

import Link from "next/link";
import { Banknote, CheckCircle2, MapPin, Pencil, RotateCcw } from "lucide-react";

import { OrderReserveTypeIcon, OrderSourceIcon } from "@/domains/shared/ui/icons";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { ShipmentListItem } from "./types";
import {
  canCreateShipmentFee,
  canEditShipment,
  canMarkDelivered,
  canMarkReturned,
  formatDateTime,
  formatMoney,
  fullAddress,
  isCodShipment,
  shipmentStatusLabel,
  shipmentStatusTone,
} from "./helpers";

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

export default function ShipmentListRow({
  item,
  onEdit,
  onCreateFee,
  onDelivered,
  onReturned,
}: {
  item: ShipmentListItem;
  onEdit?: (row: ShipmentListItem) => void;
  onCreateFee?: (row: ShipmentListItem) => void;
  onDelivered?: (row: ShipmentListItem) => void;
  onReturned?: (row: ShipmentListItem) => void;
}) {
  const cod = isCodShipment(item);
  const address = fullAddress(item);

  return (
    <tr className="group border-t border-slate-100 align-middle transition hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <div className="min-w-[180px]">
          <div className="font-semibold text-slate-950">
            {item.refNo || item.id}
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <OrderSourceIcon source={item.Order?.source} />
            <OrderReserveTypeIcon
              reserveType={item.Order?.reserveType || item.Order?.paymentMethod}
            />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="min-w-[120px]">
          <Link
            href={`/admin/order/${item.orderId}`}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            {item.orderRefNo || item.Order?.refNo || "-"}
          </Link>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-[170px]">
          <div className="font-semibold text-slate-900">
            {item.customerName || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {item.shipPhone || "-"}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-[280px] text-sm leading-6 text-slate-600">
          <div className="flex gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
            <span>{address || "-"}</span>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-[150px]">
          <div className="font-semibold text-slate-900">
            {item.carrier || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {item.trackingCode || "Chưa có tracking"}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-[130px]">
          <StatusBadge
            label={shipmentStatusLabel(item.status)}
            tone={shipmentStatusTone(item.status)}
          />
        </div>
      </td>

      <td className="px-5 py-4 text-right">
        <div className="min-w-[130px] font-semibold text-slate-950">
          {formatMoney(item.shippingFee, item.currency || "VND")}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="min-w-[120px] text-sm text-slate-600">
          {formatDateTime(item.updatedAt)}
        </div>
      </td>

      <td className="px-5 py-4 text-right">
        <RowActions
          row={item}
          actions={[
            canCreateShipmentFee(item) &&
            onCreateFee && {
              key: "create-fee",
              label: "Tạo phí ship & giao",
              icon: <Banknote className="h-4 w-4" />,
              onClick: onCreateFee,
            },
            canMarkDelivered(item) &&
            onDelivered && {
              key: "delivered",
              label: cod ? "Đã giao COD" : "Đã giao hàng",
              icon: <CheckCircle2 className="h-4 w-4" />,
              onClick: onDelivered,
            },
            canMarkReturned(item) &&
            onReturned && {
              key: "returned",
              label: "Hoàn trả",
              icon: <RotateCcw className="h-4 w-4" />,
              tone: "danger",
              onClick: onReturned,
            },
            canEditShipment(item) &&
            onEdit && {
              key: "edit",
              label: "Chỉnh shipment",
              icon: <Pencil className="h-4 w-4" />,
              separatorBefore: true,
              onClick: onEdit,
            },
          ]}
        />
      </td>
    </tr>
  );
}