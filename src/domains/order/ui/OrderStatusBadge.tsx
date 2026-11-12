import { orderStatusMeta, cx } from "./order-ui.helpers";

export default function OrderStatusBadge({ status, compact = false }: { status?: string | null; compact?: boolean }) {
  const meta = orderStatusMeta(status);
  return (
    <span title={meta.label} className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", meta.badgeClass, compact && "shrink-0 px-2 py-0.5 text-[10px]")}>
      {compact && status === "DRAFT" ? "Nháp" : meta.label}
    </span>
  );
}
