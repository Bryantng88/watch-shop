"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  Globe2,
  Package,
  PackageOpen,
  Pencil,
  Send,
  Truck,
  WalletCards,
  Watch,
  XCircle,
} from "lucide-react";
import { ReserveType } from "@prisma/client";

import RowActions from "@/domains/shared/ui/list/RowActions";
import { normalizeReserveType } from "@/domains/order/shared/order-reserve-type";

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
  paymentDisplayLabel,
  paymentDisplayTone,
  shipmentDisplayLabel,
  shipmentDisplayTone,
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

function ProductCountIcon({ count }: { count: number }) {
  if (count > 1) return <PackageOpen className="h-3.5 w-3.5" />;
  return <Package className="h-3.5 w-3.5" />;
}

function getPaymentKind(item: OrderListItem) {
  const type = normalizeReserveType(item.reserveType);

  if (type === ReserveType.COD) {
    return {
      label: "COD",
      title: "Thanh toán COD",
      tone: "bg-violet-50 text-violet-700 ring-violet-200",
      icon: <Truck className="h-3.5 w-3.5" />,
    };
  }

  if (type === ReserveType.DEPOSIT) {
    return {
      label: "Deposit",
      title: "Đơn có cọc",
      tone: "bg-amber-50 text-amber-700 ring-amber-200",
      icon: <WalletCards className="h-3.5 w-3.5" />,
    };
  }

  return {
    label: "Thanh toán full",
    title: "Thanh toán full",
    tone: "bg-slate-50 text-slate-700 ring-slate-200",
    icon: <CreditCard className="h-3.5 w-3.5" />,
  };
}

function MiniIconBadge({
  children,
  title,
  tone = "bg-slate-50 text-slate-500 ring-slate-200",
}: {
  children: ReactNode;
  title: string;
  tone?: string;
}) {
  return (
    <span
      title={title}
      className={[
        "inline-flex h-5 w-5 items-center justify-center rounded-full ring-1",
        tone,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function CleanBadge({ label, tone }: { label: string; tone: string }) {
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

  const paymentKind = getPaymentKind(item);
  const paymentLabel = paymentDisplayLabel(item);
  const shipmentLabel = shipmentDisplayLabel(item);

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
        <div className="min-w-[250px]">
          <Link
            href={`/admin/orders/${item.id}`}
            className="font-semibold text-slate-950 hover:text-blue-700"
          >
            {item.refNo || item.id}
          </Link>

          <div className="mt-1 text-xs text-slate-500">
            {itemsCount > 0 ? `${itemsCount} sản phẩm` : "Chưa có sản phẩm"}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <MiniIconBadge
              title={itemsCount > 1 ? "Nhiều sản phẩm" : "Một sản phẩm"}
            >
              <ProductCountIcon count={itemsCount} />
            </MiniIconBadge>

            <MiniIconBadge title={formatOrderSource(item)}>
              <SourceIcon source={item.source} />
            </MiniIconBadge>

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
        <div className="min-w-[150px]">
          <span
            title={paymentKind.title}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
              paymentKind.tone,
            ].join(" ")}
          >
            {paymentKind.icon}
            {paymentKind.label}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[130px]">
          <CleanBadge label={paymentLabel} tone={paymentDisplayTone(item)} />
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="min-w-[120px]">
          <CleanBadge label={shipmentLabel} tone={shipmentDisplayTone(item)} />
        </div>
      </td>

      <td className="px-4 py-4 text-right">
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
