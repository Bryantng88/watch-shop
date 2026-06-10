import { TaskPriority, WorkCaseScope, WorkCaseStatus } from "@prisma/client";

export const WORK_CASE_SCOPE_LABEL: Record<WorkCaseScope, string> = {
  BUSINESS: "Business",
  SERVICE: "Service",
  PAYMENT: "Payment",
  LOGISTIC: "Logistic",
  OTHER: "Khác",
};

export const WORK_CASE_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "Vừa",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

export const WORK_CASE_STATUS_LABEL: Record<WorkCaseStatus, string> = {
  NEW: "Chưa có hướng xử lý",
  TRIAGED: "Đã có hướng xử lý",
  IN_PROGRESS: "Đang theo dõi",
  RESOLVED: "Đã giải quyết",
  CANCELLED: "Đã hủy",
};

export function workCaseStatusTone(status: WorkCaseStatus) {
  if (status === WorkCaseStatus.RESOLVED) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (status === WorkCaseStatus.CANCELLED) {
    return "bg-slate-50 text-slate-500 ring-slate-200";
  }

  if (status === WorkCaseStatus.IN_PROGRESS) {
    return "bg-blue-50 text-blue-700 ring-blue-100";
  }

  if (status === WorkCaseStatus.TRIAGED) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  return "bg-rose-50 text-rose-700 ring-rose-100";
}

export function workCasePriorityTone(priority: TaskPriority) {
  if (priority === TaskPriority.URGENT) {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }

  if (priority === TaskPriority.HIGH) {
    return "bg-orange-50 text-orange-700 ring-orange-100";
  }

  if (priority === TaskPriority.LOW) {
    return "bg-slate-50 text-slate-500 ring-slate-200";
  }

  return "bg-blue-50 text-blue-700 ring-blue-100";
}

export function getWorkCaseEffectiveStatus(input: {
  status: WorkCaseStatus;
  taskCount?: number;
  openTaskCount?: number;
  serviceRequestCount?: number;
  openServiceRequestCount?: number;
}) {
  if (
    input.status === WorkCaseStatus.RESOLVED ||
    input.status === WorkCaseStatus.CANCELLED
  ) {
    return input.status;
  }

  const totalOutputs =
    Number(input.taskCount ?? 0) +
    Number(input.serviceRequestCount ?? 0);

  const openOutputs =
    Number(input.openTaskCount ?? 0) +
    Number(input.openServiceRequestCount ?? 0);

  if (totalOutputs <= 0) {
    return WorkCaseStatus.NEW;
  }

  if (openOutputs > 0) {
    return WorkCaseStatus.IN_PROGRESS;
  }

  return WorkCaseStatus.TRIAGED;
}