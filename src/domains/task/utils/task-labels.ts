import { TaskKind, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "Cần làm",
  IN_PROGRESS: "Đang làm",
  DONE: "Đã xong",
  CANCELLED: "Đã huỷ",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "Vừa",
  HIGH: "Cao",
  URGENT: "Gấp",
};

export const TASK_SOURCE_LABEL: Record<TaskSource, string> = {
  MANUAL: "Thủ công",
  SYSTEM: "Hệ thống",
};

export const TASK_KIND_LABEL: Record<TaskKind, string> = {
  BUSINESS: "Kinh doanh",
  OPERATION: "Vận hành",
  SERVICE: "Kỹ thuật",
  PERSONAL: "Cá nhân",
  FREE: "Tự do",
};

export const TASK_DOMAIN_LABEL: Record<string, string> = {
  GENERAL: "Chung",
  WATCH: "Watch",
  ORDER: "Order",
  SHIPMENT: "Shipment",
  PAYMENT: "Payment",
  SERVICE_REQUEST: "Service",
  TECHNICAL_ISSUE: "Technical issue",
  CUSTOMER: "Khach hang",
};

export const TASK_COMPLETION_MODE_LABEL: Record<string, string> = {
  MANUAL_CONFIRM: "Xac nhan thu cong",
  BUSINESS_RULE: "Theo business rule",
};

export function taskPeriodLabel(periodType?: string | null, periodKey?: string | null) {
  if (!periodType || !periodKey) return "—";

  if (periodType === "WEEKLY") {
    const match = String(periodKey).match(/^(\d{4})-W(\d{1,2})$/);
    if (match) return `Tuần ${Number(match[2])}/${match[1]}`;
  }

  if (periodType === "DAILY") return `Ngày ${periodKey}`;
  if (periodType === "MONTHLY") return `Tháng ${periodKey}`;

  return periodKey;
}
