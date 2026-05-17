export const ORDER_STATUS = {
  DRAFT: "DRAFT",
  RESERVED: "RESERVED",
  POSTED: "POSTED",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// DRAFT chỉ là nháp, tuyệt đối không HOLD watch / inventory.
// POSTED/RESERVED là trạng thái đã xác nhận đơn và cần giữ watch.
export const ORDER_ACTIVE_HOLD_STATUSES = [
  ORDER_STATUS.POSTED,
  ORDER_STATUS.RESERVED,
] as const;

// Chỉ khi đã thanh toán đủ hoặc bước vận hành sau thanh toán thì watch mới SOLD.
export const ORDER_ACTIVE_SOLD_STATUSES = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.COMPLETED,
] as const;

export const ORDER_INACTIVE_STATUSES = [ORDER_STATUS.CANCELLED] as const;

export function normalizeOrderStatus(value?: string | null): OrderStatusValue {
  const status = String(value ?? "").trim().toUpperCase();

  if (status === ORDER_STATUS.RESERVED) return ORDER_STATUS.RESERVED;
  if (status === ORDER_STATUS.POSTED) return ORDER_STATUS.POSTED;
  if (status === ORDER_STATUS.PAID) return ORDER_STATUS.PAID;
  if (status === ORDER_STATUS.PROCESSING) return ORDER_STATUS.PROCESSING;
  if (status === ORDER_STATUS.SHIPPED) return ORDER_STATUS.SHIPPED;
  if (status === ORDER_STATUS.COMPLETED) return ORDER_STATUS.COMPLETED;
  if (status === ORDER_STATUS.CANCELLED) return ORDER_STATUS.CANCELLED;

  return ORDER_STATUS.DRAFT;
}

export function getOrderInventoryEffect(value?: string | null) {
  const status = normalizeOrderStatus(value);

  if ((ORDER_ACTIVE_SOLD_STATUSES as readonly string[]).includes(status)) {
    return "SOLD" as const;
  }

  if ((ORDER_ACTIVE_HOLD_STATUSES as readonly string[]).includes(status)) {
    return "HOLD" as const;
  }

  return "NONE" as const;
}

export function getOrderStatusLabel(value?: string | null) {
  const status = normalizeOrderStatus(value);

  switch (status) {
    case ORDER_STATUS.DRAFT:
      return "Nháp";
    case ORDER_STATUS.RESERVED:
      return "Đang giữ";
    case ORDER_STATUS.POSTED:
      return "Đã xác nhận";
    case ORDER_STATUS.PAID:
      return "Đã thanh toán đủ";
    case ORDER_STATUS.PROCESSING:
      return "Đang xử lý";
    case ORDER_STATUS.SHIPPED:
      return "Đã gửi hàng";
    case ORDER_STATUS.COMPLETED:
      return "Hoàn tất";
    case ORDER_STATUS.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
}

export function getOrderStatusTone(value?: string | null) {
  const effect = getOrderInventoryEffect(value);

  if (effect === "SOLD") return "danger" as const;
  if (effect === "HOLD") return "warning" as const;
  return "info" as const;
}
