export const PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "CASH", label: "Tiền mặt" },
  { value: "COD", label: "COD" },
] as const;

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Chưa thu",
  COLLECTED: "COD đã thu / chờ đối soát",
  PAID: "Đã nhận tiền",
  CANCELED: "Đã hủy",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_PURPOSE_LABEL: Record<string, string> = {
  ORDER_FULL: "Thanh toán toàn bộ",
  ORDER_DEPOSIT: "Cọc đơn hàng",
  ORDER_REMAIN: "Phần còn lại",
};
