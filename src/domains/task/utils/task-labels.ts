import { TaskKind, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";
import type { TaskDueKey } from "../server/task.types";

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

export const TASK_DUE_LABEL: Record<TaskDueKey, string> = {
  ALL: "Mọi hạn",
  OVERDUE: "Quá hạn",
  TODAY: "Hôm nay",
  THIS_WEEK: "Tuần này",
  NO_DUE: "Chưa có hạn",
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

export function getTaskDueState(value?: Date | string | null) {
  if (!value) return "none" as const;
  const due = new Date(value);
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next3Days = new Date(now);
  next3Days.setDate(next3Days.getDate() + 3);

  if (due < today) return "overdue" as const;
  if (due < tomorrow) return "today" as const;
  if (due <= next3Days) return "soon" as const;
  return "normal" as const;
}
