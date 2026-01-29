import type { BadgeTone } from "./Badge";

export type StatusMeta = { label: string; tone: BadgeTone };

// Order status
export const ORDER_STATUS: Record<string, StatusMeta> = {
    DRAFT: { label: "DRAFT", tone: "amber" },
    RESERVED: { label: "RESERVED", tone: "blue" },
    POSTED: { label: "POSTED", tone: "green" },
    PAID: { label: "PAID", tone: "green" },
    CANCELLED: { label: "CANCELLED", tone: "red" },
    SHIPPED: { label: "SHIPPED", tone: "blue" },
};

// Verification
export const VERIFICATION_STATUS: Record<string, StatusMeta> = {
    PENDING: { label: "PENDING", tone: "amber" },
    VERIFIED: { label: "VERIFIED", tone: "green" },
    REJECTED: { label: "REJECTED", tone: "red" },
    EXPIRED: { label: "EXPIRED", tone: "gray" },
};

// Source (WEB/ADMIN)
export const ORDER_SOURCE: Record<string, StatusMeta> = {
    WEB: { label: "WEB", tone: "blue" },
    ADMIN: { label: "ADMIN", tone: "gray" },
};

// Shipment status (ví dụ)
export const SHIPMENT_STATUS: Record<string, StatusMeta> = {
    DRAFT: { label: "DRAFT", tone: "amber" },
    READY: { label: "READY", tone: "green" },
    SHIPPED: { label: "SHIPPED", tone: "blue" },
    DELIVERED: { label: "DELIVERED", tone: "gray" },
    CANCELLED: { label: "CANCELLED", tone: "red" },
};
export const RESERVE_TYPE: Record<string, StatusMeta> = {
    NONE: { label: "NORMAL", tone: "gray" },
    HOLD: { label: "Giữ hàng", tone: "blue" },
    DEPOSIT_HOLD: { label: "DEPOSIT", tone: "amber" },
    COD_HOLD: { label: "COD", tone: "amber" },
};

// (tuỳ bạn) payment method hiển thị cho dễ hiểu
export const PAYMENT_METHOD: Record<string, StatusMeta> = {
    COD: { label: "COD", tone: "amber" },
    BANK_TRANSFER: { label: "Chuyển khoản", tone: "blue" },
    CARD: { label: "Thẻ", tone: "purple" },
};