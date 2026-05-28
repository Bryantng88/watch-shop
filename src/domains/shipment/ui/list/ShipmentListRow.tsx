"use client";

import Link from "next/link";
import { Banknote, CheckCircle2, Eye, MapPin, PackageCheck, Pencil, RotateCcw } from "lucide-react";

import {
  OrderSourceSignalIcon,
  ReserveTypeSignalIcon,
  ShipmentStatusSignalIcon,
} from "@/domains/shared/ui/icons";
import RowActions from "@/domains/shared/ui/list/RowActions";

import type { ShipmentListItem } from "./types";
import {
  canCreateShipmentFee,
  canEditShipment,
  canMarkDelivered,
  canMarkReturned,
  canReceiveReturn,
  formatDateTime,
  formatMoney,
  fullAddress,
  isCodShipment,
} from "./helpers";

function ShipmentPaymentMethodIcon({ method }: { method?: string | null }) {
  const key = String(method ?? "").toUpperCase();
  return <ReserveTypeSignalIcon reserveType={key === "COD" ? "COD" : "FULL"} />;
}

export default function ShipmentListRow({
  item,
  onEdit,
  onCreateFee,
  onDelivered,
  onReturned,
  onReceiveReturn,
}: {
  item: ShipmentListItem;
  onEdit?: (row: ShipmentListItem) => void;
  onCreateFee?: (row: ShipmentListItem) => void;
  onDelivered?: (row: ShipmentListItem) => void;
  onReturned?: (row: ShipmentListItem) => void;
  onReceiveReturn?: (row: ShipmentListItem) => void;
}) {
  const cod = isCodShipment(item);
  const address = fullAddress(item);
  const order = item.order ?? null;
  const shippingAmount = Number(item.shippingAmount ?? 0);

  const isCustomerPaidShipping =
    shippingAmount > 0 &&
    String(item.shippingFeePayer ?? "").toUpperCase() === "CUSTOMER";

  const sourceForIcon = order?.quickFromProductId ? "WATCH_QUICK_ORDER" : order?.source;

  return (
    <tr className="group relative border-t border-slate-100 align-middle transition hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="break-words font-semibold leading-5 text-slate-950">
            {item.refNo || item.id}
          </div>

          <div className="flex items-center gap-1.5">
            <OrderSourceSignalIcon source={sourceForIcon} />
            <ShipmentPaymentMethodIcon method={order?.paymentMethod} />
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <Link
          href={`/admin/order/${item.orderId}`}
          className="break-words text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
        >
          {item.orderRefNo || order?.refNo || "-"}
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
        <div className="break-words font-semibold text-slate-900">{item.carrier || "-"}</div>
        <div className="mt-1 break-words text-xs text-slate-500">
          {item.trackingCode || "Chưa có tracking"}
        </div>
      </td>

      <td className="px-5 py-4">
        <ShipmentStatusSignalIcon status={item.status} />
      </td>

      <td className="px-5 py-4 text-right">
        <div className="break-words font-semibold text-slate-950">
          {formatMoney(item.shippingAmount, item.currency || "VND")}
        </div>

        {isCustomerPaidShipping ? (
          <div className="mt-1 text-xs text-slate-500">Khách trả</div>
        ) : null}
      </td>

      <td className="px-5 py-4">
        <div className="break-words text-sm text-slate-600">{formatDateTime(item.updatedAt)}</div>
      </td>

      <td className="relative px-5 py-4 text-right">
        <RowActions
          row={item}
          actions={[
            canCreateShipmentFee(item) &&
            onCreateFee && {
              key: "create-fee",
              label: item.shippingAmount && Number(item.shippingAmount) > 0 ? "Cập nhật vận chuyển" : "Tạo phí ship & giao",
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
              key: "returning",
              label: "Hoàn trả",
              icon: <RotateCcw className="h-4 w-4" />,
              tone: "danger",
              onClick: onReturned,
            },
            canReceiveReturn(item) &&
            onReceiveReturn && {
              key: "receive-return",
              label: "Nhận hàng hoàn",
              icon: <PackageCheck className="h-4 w-4" />,
              onClick: onReceiveReturn,
            },
            onEdit && {
              key: "view",
              label: canEditShipment(item) ? "Chỉnh shipment" : "Xem shipment",
              icon: canEditShipment(item) ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />,
              separatorBefore: true,
              onClick: onEdit,
            },
          ]}
        />
      </td>
    </tr>
  );
}
