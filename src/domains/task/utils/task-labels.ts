import { TaskKind, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";
import { getTaskCompletionRuleLabel } from "../server/task-rule-keys";

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
  PERSONAL: "Cá nhân",
  BUSINESS: "Công việc",
};