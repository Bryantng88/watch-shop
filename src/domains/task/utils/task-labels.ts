import { TaskCompletionMode, TaskDomain, TaskKind, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "Cần làm",
  IN_PROGRESS: "Đang làm",
  DONE: "Đã xong",
  CANCELLED: "Đã hủy",
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
  PERSONAL: "Cá nhân",
  WATCH_CONTENT: "Watch / Content",
  WATCH_IMAGE: "Watch / Hình ảnh",
  WATCH_REVIEW: "Watch / Duyệt",
  ORDER_FOLLOW_UP: "Order",
  PAYMENT_FOLLOW_UP: "Payment",
  SHIPMENT_FOLLOW_UP: "Shipment",
  SHIPMENT_RETURN: "Shipment hoàn",
  SERVICE_FOLLOW_UP: "Service",
  TECHNICAL_ISSUE_FOLLOW_UP: "Technical issue",
  ACQUISITION_FOLLOW_UP: "Acquisition",
  OTHER: "Khác",
};

export function formatTaskDomainLabel(task: {
  watchId?: string | null;
  orderId?: string | null;
  shipmentId?: string | null;
  acquisitionId?: string | null;
  serviceRequestId?: string | null;
  technicalIssueId?: string | null;
  paymentId?: string | null;
}) {
  if (task.watchId) return "Watch";
  if (task.orderId) return "Order";
  if (task.shipmentId) return "Shipment";
  if (task.acquisitionId) return "Acquisition";
  if (task.serviceRequestId) return "Service Request";
  if (task.technicalIssueId) return "Technical Issue";
  if (task.paymentId) return "Payment";
  return "Không gắn domain";
}


export const TASK_DOMAIN_LABEL: Record<TaskDomain, string> = {
  GENERAL: "Chung",
  WATCH: "Watch",
  ORDER: "Order",
  SHIPMENT: "Shipment",
  SERVICE: "Service",
  PAYMENT: "Payment",
  ACQUISITION: "Acquisition",
};

export const TASK_COMPLETION_MODE_LABEL: Record<TaskCompletionMode, string> = {
  MANUAL_CONFIRM: "Người xử lý xác nhận",
  BUSINESS_RULE: "Theo business rule",
};
