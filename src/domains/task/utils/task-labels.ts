import { TaskCompletionMode, TaskDomain, TaskMode, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";
import { getTaskCompletionRuleLabel } from "../server/task-rule-keys";

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

export const TASK_DOMAIN_LABEL: Record<TaskDomain, string> = {
  GENERAL: "Chung",
  WATCH: "Watch",
  ORDER: "Order",
  SHIPMENT: "Shipment",
  SERVICE: "Service",
  TECHNICAL_ISSUE: "Technical issue",
  PAYMENT: "Payment",
  ACQUISITION: "Acquisition",
  WORK_CASE: "Phiếu xử lý",
};

export const TASK_MODE_LABEL: Record<TaskMode, string> = {
  NORMAL: "Thông thường",
  APPROVAL: "Duyệt",
  EXCEPTION: "Ngoại lệ",
  FOLLOW_UP: "Theo dõi",
  INVESTIGATION: "Kiểm tra",
};

export const TASK_COMPLETION_MODE_LABEL: Record<TaskCompletionMode, string> = {
  MANUAL_CONFIRM: "Người xử lý xác nhận",
  BUSINESS_RULE: "Theo business rule",
};

export { getTaskCompletionRuleLabel };

export function formatTaskDomainLabel(task: {
  domain?: TaskDomain | null;
  watchId?: string | null;
  orderId?: string | null;
  shipmentId?: string | null;
  acquisitionId?: string | null;
  serviceRequestId?: string | null;
  technicalIssueId?: string | null;
  paymentId?: string | null;
  workCaseId?: string | null;
}) {
  if (task.domain && task.domain !== "GENERAL") return TASK_DOMAIN_LABEL[task.domain];
  if (task.watchId) return "Watch";
  if (task.orderId) return "Order";
  if (task.shipmentId) return "Shipment";
  if (task.acquisitionId) return "Acquisition";
  if (task.serviceRequestId) return "Service Request";
  if (task.technicalIssueId) return "Technical Issue";
  if (task.paymentId) return "Payment";
  if (task.workCaseId) return "Phiếu xử lý";
  return "Không gắn domain";
}
