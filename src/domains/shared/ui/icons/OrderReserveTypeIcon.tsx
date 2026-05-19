"use client";

import { CreditCard, Truck, WalletCards } from "lucide-react";
import { ReserveType } from "@prisma/client";

import { normalizeReserveType } from "@/domains/order/shared/order-reserve-type";
import { cn } from "@/lib/utils";

export type OrderReserveTypeIconSize = "sm" | "md";

type Props = {
  reserveType?: string | null;
  withLabel?: boolean;
  size?: OrderReserveTypeIconSize;
  className?: string;
};

export function getOrderReserveTypeIconConfig(reserveType?: string | null) {
  const type = normalizeReserveType(reserveType);

  if (type === ReserveType.COD) {
    return {
      type,
      label: "COD",
      title: "COD - có cọc, phần còn lại thu khi giao hàng",
      Icon: Truck,
      className: "bg-violet-50 text-violet-700 ring-violet-200",
    };
  }

  if (type === ReserveType.DEPOSIT) {
    return {
      type,
      label: "Deposit",
      title: "Deposit - có cọc, phần còn lại thu bằng payment",
      Icon: WalletCards,
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    };
  }

  return {
    type,
    label: "Thanh toán full",
    title: "Thanh toán full",
    Icon: CreditCard,
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200"
  };
}

export default function OrderReserveTypeIcon({
  reserveType,
  withLabel = false,
  size = "sm",
  className,
}: Props) {
  const config = getOrderReserveTypeIconConfig(reserveType);
  const Icon = config.Icon;

  return (
    <span
      title={config.title}
      aria-label={config.title}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold ring-1",
        size === "sm" ? "h-5 min-w-5 px-1 text-[11px]" : "h-7 px-2.5 text-xs",
        withLabel ? "gap-1.5" : "w-5",
        config.className,
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {withLabel ? <span>{config.label}</span> : null}
    </span>
  );
}
