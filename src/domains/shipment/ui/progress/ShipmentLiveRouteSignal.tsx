import type { CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "@/domains/shared/ui/admin-design-contract/admin-ui.foundation";
import styles from "./ShipmentLiveRouteSignal.module.css";
import { VisualStatusSignal } from "@/domains/shared/ui/signals/VisualStatusSignal";
import {
  Ban,
  Check,
  Package,
  PackageX,
  RotateCcw,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  variant?: "default" | "inline" | "compact" | "progress";
  status?: string | null;
  noShipment?: boolean;
  className?: string;
};

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export default function ShipmentLiveRouteSignal({
  status,
  noShipment = false,
  className,
  variant,
}: Props) {
  const normalized = normalizeStatus(status);

  if (variant === "progress" && (noShipment || ["CANCELLED", "CANCELED", "RETURNING", "RETURNED"].includes(normalized))) {
    const cancelled = ["CANCELLED", "CANCELED"].includes(normalized);
    const returned = normalized === "RETURNED";
    const label = noShipment ? "Không giao hàng" : cancelled ? "Đã hủy" : returned ? "Đã hoàn" : "Đang hoàn";
    const Icon = noShipment ? PackageX : cancelled ? Ban : returned ? Check : RotateCcw;
    const tone = noShipment ? F.colors.tertiary : cancelled ? F.colors.danger : F.colors.attention;
    return <span role="img" tabIndex={0} aria-label={`Giao hàng: ${label}`} title={label} className={cn(styles.iconStatus, className)} style={{ color: tone }}><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>;
  }
  if (variant === "compact") {
    const cancelled = ["CANCELLED", "CANCELED"].includes(normalized);
    const returned = normalized === "RETURNED";
    const returning = normalized === "RETURNING";
    const delivered = ["DELIVERED", "COMPLETED", "DONE"].includes(normalized);
    const shipping = ["SHIPPED", "IN_TRANSIT", "PROCESSING"].includes(normalized);
    const label = noShipment ? "Không giao hàng" : cancelled ? "Đã hủy" : returned ? "Đã hoàn" : returning ? "Đang hoàn" : delivered ? "Đã đến nơi" : shipping ? "Đang trên đường" : "Chờ xuất phát";
    const state = noShipment ? "none" : cancelled ? "cancelled" : returned ? "returned" : returning ? "returning" : delivered ? "delivered" : shipping ? "shipping" : "waiting";
    const Marker = noShipment ? PackageX : cancelled ? Ban : delivered || returned ? Check : shipping || returning ? Truck : Package;
    const style = { "--route-tone": noShipment ? F.colors.tertiary : cancelled ? F.colors.danger : returning || returned ? F.colors.attention : delivered ? F.colors.success : F.colors.link, fontFamily: F.fontFamily, color: F.colors.body } as CSSProperties;
    return <span role="img" aria-label={`Giao hàng: ${label}`} title={label} data-state={state} style={style} className={cn(styles.compact, className)}>
      <span className={styles.marker} aria-hidden="true"><Marker size={16} strokeWidth={1.7} /></span>
      <span className={styles.label} aria-hidden="true">{label}</span>
    </span>;
  }
  if (variant === "inline") {
    const cancelled = ["CANCELLED", "CANCELED"].includes(normalized);
    const returned = normalized === "RETURNED";
    const returning = normalized === "RETURNING";
    const delivered = ["DELIVERED", "COMPLETED", "DONE"].includes(normalized);
    const shipping = ["SHIPPED", "IN_TRANSIT", "PROCESSING"].includes(normalized);
    return <VisualStatusSignal variant="inline" className={className} label={noShipment ? "Không giao hàng" : cancelled ? "Đã hủy" : returned ? "Đã hoàn" : returning ? "Đang hoàn" : delivered ? "Đã đến nơi" : shipping ? "Đang trên đường" : "Chờ xuất phát"} tone={noShipment ? "slate" : cancelled ? "rose" : returned || returning ? "amber" : delivered ? "emerald" : "violet"} icon={cancelled ? "warning" : delivered ? "success" : "neutral"} />;
  }
  if (noShipment) {
    return (
      <span
        title="Không giao hàng"
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-500",
          className,
        )}
      >
        <PackageX className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.7} />
        Không giao hàng
      </span>
    );
  }

  if (["CANCELLED", "CANCELED"].includes(normalized)) {
    return (
      <span
        title="Shipment đã hủy"
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-2.5 text-[11px] font-semibold text-rose-600",
          className,
        )}
      >
        <Ban className="h-3.5 w-3.5" strokeWidth={1.7} />
        Đã hủy
      </span>
    );
  }

  if (normalized === "RETURNING" || normalized === "RETURNED") {
    const returned = normalized === "RETURNED";
    return (
      <span
        title={returned ? "Đã nhận hàng hoàn" : "Đang chuyển hoàn"}
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-2.5 text-[11px] font-semibold text-amber-700",
          className,
        )}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-amber-600 ring-1 ring-amber-200">
          {returned
            ? <Check className="h-3 w-3" strokeWidth={2} />
            : <RotateCcw className="h-3 w-3" strokeWidth={1.8} />}
        </span>
        {returned ? "Đã hoàn" : "Đang hoàn"}
      </span>
    );
  }

  const delivered = ["DELIVERED", "COMPLETED", "DONE"].includes(normalized);
  const shipping = ["SHIPPED", "IN_TRANSIT", "PROCESSING"].includes(normalized);
  const MarkerIcon = delivered ? Check : shipping ? Truck : Package;
  const label = delivered ? "Đã đến nơi" : shipping ? "Đang trên đường" : "Chờ xuất phát";

  return (
    <div
      title={label}
      aria-label={`Giao hàng: ${label}`}
      role={variant === "progress" ? "img" : undefined}
      tabIndex={variant === "progress" ? 0 : undefined}
      className={cn("inline-flex flex-col", variant === "progress" && styles.progress, className)}
    >
      <div className={variant === "progress" ? "relative h-7 w-28" : "relative h-8 w-36"}>
        <div className="absolute inset-x-2 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-blue-300 to-emerald-300 transition-[width] duration-300",
              delivered ? "w-full" : shipping ? "w-1/2" : "w-0",
            )}
          />
        </div>
        <span className="absolute left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-blue-300 ring-1 ring-blue-200" />
        <span
          className={cn(
            "absolute right-1.5 top-1/2 grid h-3.5 w-3.5 -translate-y-1/2 place-items-center rounded-full border-2 border-white ring-1",
            delivered
              ? "bg-emerald-400 ring-emerald-200"
              : "bg-slate-200 ring-slate-200",
          )}
        >
          {delivered ? <Check className="h-2 w-2 text-white" strokeWidth={2.4} /> : null}
        </span>
        <span
          className={cn(
            "absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full border-2 border-white transition-all duration-300",
            delivered && variant === "progress" ? "h-5 w-5" : "h-7 w-7 shadow-[0_3px_9px_rgba(15,23,42,0.14)]",
            delivered
              ? "right-0.5 bg-emerald-500 text-white"
              : shipping
                ? "left-1/2 -translate-x-1/2 bg-blue-600 text-white"
                : "left-0.5 bg-violet-100 text-violet-700",
          )}
        >
          <MarkerIcon className={delivered && variant === "progress" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={1.9} />
        </span>
      </div>
      <div
        className={cn(
          variant === "progress" ? "sr-only" : "mt-0.5 text-center text-[10px] font-semibold",
          delivered ? "text-emerald-600" : "text-violet-600",
        )}
      >
        {label}
      </div>
    </div>
  );
}
