export const ORDER_STATUS = {
  DRAFT: "DRAFT",
  RESERVED: "RESERVED",
  POSTED: "POSTED",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  RETURNING: "RETURNING",
  RETURNED: "RETURNED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Business mới: order vừa được tạo, kể cả DRAFT, cũng phải giữ watch.
// Chỉ CANCELLED mới release/restore watch; COMPLETED sẽ chuyển watch sang SOLD.
// RETURNING/RETURNED vẫn HOLD cho tới khi user quyết định close/release hoặc tạo shipment mới xử lý tiếp.
export const ORDER_ACTIVE_HOLD_STATUSES = [
  ORDER_STATUS.DRAFT,
  ORDER_STATUS.RESERVED,
  ORDER_STATUS.POSTED,
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.RETURNING,
  ORDER_STATUS.RETURNED,
] as const;

// Watch chỉ SOLD khi order thật sự completed.
export const ORDER_ACTIVE_SOLD_STATUSES = [ORDER_STATUS.COMPLETED] as const;

export const ORDER_INACTIVE_STATUSES = [ORDER_STATUS.CANCELLED] as const;

export function normalizeOrderStatus(value?: string | null): OrderStatusValue {
  const status = String(value ?? "").trim().toUpperCase();

  if (status === ORDER_STATUS.RESERVED) return ORDER_STATUS.RESERVED;
  if (status === ORDER_STATUS.POSTED) return ORDER_STATUS.POSTED;
  if (status === ORDER_STATUS.PAID) return ORDER_STATUS.PAID;
  if (status === ORDER_STATUS.PROCESSING) return ORDER_STATUS.PROCESSING;
  if (status === ORDER_STATUS.SHIPPED) return ORDER_STATUS.SHIPPED;
  if (status === ORDER_STATUS.RETURNING) return ORDER_STATUS.RETURNING;
  if (status === ORDER_STATUS.RETURNED) return ORDER_STATUS.RETURNED;
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
      return "Nháp / đang giữ watch";
    case ORDER_STATUS.RESERVED:
      return "Đang giữ";
    case ORDER_STATUS.POSTED:
      return "Đang xử lý";
    case ORDER_STATUS.PAID:
      return "Đã thu đủ";
    case ORDER_STATUS.PROCESSING:
      return "Đang xử lý";
    case ORDER_STATUS.SHIPPED:
      return "Đã gửi hàng";
    case ORDER_STATUS.RETURNING:
      return "Đang hoàn";
    case ORDER_STATUS.RETURNED:
      return "Đã hoàn";
    case ORDER_STATUS.COMPLETED:
      return "Hoàn tất";
    case ORDER_STATUS.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
}

export function getOrderStatusTone(value?: string | null) {
  const status = normalizeOrderStatus(value);
  const effect = getOrderInventoryEffect(value);

  if (status === ORDER_STATUS.RETURNING) return "warning" as const;
  if (status === ORDER_STATUS.RETURNED) return "info" as const;
  if (effect === "SOLD") return "danger" as const;
  if (effect === "HOLD") return "warning" as const;
  return "info" as const;
}
