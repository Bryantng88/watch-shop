import { TaskDomain } from "@prisma/client";

export type TaskCompletionRuleKey =
  | "WATCH_PRICE_UPDATED"
  | "WATCH_SAVED"
  | "WATCH_PRICE_UPDATED_AND_SAVED"
  | "ORDER_POSTED"
  | "ORDER_COMPLETED"
  | "PAYMENT_PAID"
  | "SHIPMENT_CREATED"
  | "SHIPMENT_DELIVERED"
  | "SERVICE_COMPLETED";

export type TaskBusinessEventKey = TaskCompletionRuleKey | "PAYMENT_CREATED";

export type TaskCompletionRuleDefinition = {
  key: TaskCompletionRuleKey;
  label: string;
  description: string;
  domain: TaskDomain;
  requiredEvents: TaskBusinessEventKey[];
};

export const TASK_COMPLETION_RULES: TaskCompletionRuleDefinition[] = [
  {
    key: "WATCH_PRICE_UPDATED",
    label: "Watch price updated",
    description: "Hoàn tất system task khi giá bán/list price của watch được cập nhật.",
    domain: TaskDomain.WATCH,
    requiredEvents: ["WATCH_PRICE_UPDATED"],
  },
  {
    key: "WATCH_SAVED",
    label: "Watch saved",
    description: "Hoàn tất system task khi thông tin watch được lưu.",
    domain: TaskDomain.WATCH,
    requiredEvents: ["WATCH_SAVED"],
  },
  {
    key: "WATCH_PRICE_UPDATED_AND_SAVED",
    label: "Watch price updated + saved",
    description: "Hoàn tất system task khi đã cập nhật giá và đã lưu watch. Dùng cho rule chain kiểu PRICE_UPDATED → WATCH_SAVED → DONE.",
    domain: TaskDomain.WATCH,
    requiredEvents: ["WATCH_PRICE_UPDATED", "WATCH_SAVED"],
  },
  {
    key: "ORDER_POSTED",
    label: "Order posted",
    description: "Hoàn tất system task khi order liên quan được post/duyệt.",
    domain: TaskDomain.ORDER,
    requiredEvents: ["ORDER_POSTED"],
  },
  {
    key: "ORDER_COMPLETED",
    label: "Order completed",
    description: "Hoàn tất system task khi order liên quan hoàn tất.",
    domain: TaskDomain.ORDER,
    requiredEvents: ["ORDER_COMPLETED"],
  },
  {
    key: "PAYMENT_PAID",
    label: "Payment paid",
    description: "Hoàn tất system task khi payment liên quan được thanh toán.",
    domain: TaskDomain.PAYMENT,
    requiredEvents: ["PAYMENT_PAID"],
  },
  {
    key: "SHIPMENT_CREATED",
    label: "Shipment created",
    description: "Hoàn tất system task khi shipment liên quan được tạo.",
    domain: TaskDomain.SHIPMENT,
    requiredEvents: ["SHIPMENT_CREATED"],
  },
  {
    key: "SHIPMENT_DELIVERED",
    label: "Shipment delivered",
    description: "Hoàn tất system task khi shipment liên quan giao thành công.",
    domain: TaskDomain.SHIPMENT,
    requiredEvents: ["SHIPMENT_DELIVERED"],
  },
  {
    key: "SERVICE_COMPLETED",
    label: "Service completed",
    description: "Hoàn tất system task khi service request hoặc technical issue liên quan hoàn tất.",
    domain: TaskDomain.SERVICE,
    requiredEvents: ["SERVICE_COMPLETED"],
  },
];

export function normalizeTaskCompletionRuleKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getTaskCompletionRuleDefinition(value: unknown) {
  const key = normalizeTaskCompletionRuleKey(value);
  return TASK_COMPLETION_RULES.find((item) => item.key === key) ?? null;
}

export function getTaskCompletionRuleLabel(value?: string | null) {
  if (!value) return "-";
  return getTaskCompletionRuleDefinition(value)?.label ?? value;
}

export function listTaskCompletionRuleOptions(domain?: TaskDomain | null) {
  return TASK_COMPLETION_RULES.filter((item) => !domain || item.domain === domain);
}
