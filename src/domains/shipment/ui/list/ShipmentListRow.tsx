"use client";

import Link from "next/link";
import { Banknote, CheckCircle2, MapPin, Pencil, RotateCcw } from "lucide-react";
import { CreditCard, HandCoins } from "lucide-react";
import { OrderSourceIcon } from "@/domains/shared/ui/icons";
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

} from "./helpers";
import { ShipmentProgress } from "../progress";

function ShipmentPaymentMethodIcon({ method }: { method?: string | null }) {
  const key = String(method ?? "").toUpperCase();

  if (key === "COD") {
    return (
      <span
        title="COD"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-50 text-violet-600 ring-1 ring-violet-100"
      >
        <HandCoins className="h-3.5 w-3.5" />
      </span>
    );
  }

  return (
    <span
      title="Thanh toán chuyển khoản / khác"
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
    >
      <CreditCard className="h-3.5 w-3.5" />
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
    <tr className="group relative border-t border-slate-100 align-middle transition hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="break-words font-semibold leading-5 text-slate-950">
            {item.refNo || item.id}
          </div>

          <div className="flex items-center gap-1.5">
            <OrderSourceIcon source={item.Order?.source} />
            <ShipmentPaymentMethodIcon method={item.Order?.paymentMethod} />
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <Link
          href={`/admin/order/${item.orderId}`}
          className="break-words text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
        >
          {item.orderRefNo || item.Order?.refNo || "-"}
        </Link>
      </td>

      <td className="px-5 py-4">
        <div className="font-semibold text-slate-900">{item.customerName || "-"}</div>
        <div className="mt-1 break-words text-xs text-slate-500">{item.shipPhone || "-"}</div>
      </td>

      <td className="px-5 py-4">
        <div className="flex gap-2 text-sm leading-6 text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
          <span className="break-words">{address || "-"}</span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="break-words font-semibold text-slate-900">
          {item.carrier || "-"}
        </div>
        <div className="mt-1 break-words text-xs text-slate-500">
          {item.trackingCode || "Chưa có tracking"}
        </div>
      </td>
      <td className="px-5 py-4">
        <ShipmentProgress status={item.status} compact />
      </td>
      <td className="px-5 py-4 text-right">
        <div className="break-words font-semibold text-slate-950">
          {formatMoney(item.shippingFee, item.currency || "VND")}
        </div>

        {String(item.shippingFeePayer ?? "").toUpperCase() === "CUSTOMER" ? (
          <div className="mt-1 text-xs text-slate-500">Khách trả</div>
        ) : null}
      </td>
      <td className="px-5 py-4">
        <div className="break-words text-sm text-slate-600">
          {formatDateTime(item.updatedAt)}
        </div>
      </td>

      <td className="relative z-50 px-5 py-4 text-right">
        <RowActions
          row={item}
          actions={[
            canCreateShipmentFee(item) &&
            onCreateFee && {
              key: "create-fee",
              label:
                item.shippingFee && Number(item.shippingFee) > 0
                  ? "Cập nhật vận chuyển"
                  : "Tạo phí ship & giao",
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