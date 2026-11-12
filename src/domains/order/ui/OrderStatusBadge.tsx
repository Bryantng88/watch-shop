import { orderStatusMeta, cx } from "./order-ui.helpers";

export default function OrderStatusBadge({ status }: { status?: string | null }) {
  const meta = orderStatusMeta(status);
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", meta.badgeClass)}>
      {meta.label}
    </span>
  );
}
