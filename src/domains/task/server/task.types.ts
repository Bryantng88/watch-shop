import type {
  TaskKind,
  TaskPriority,
  TaskSource,
  TaskStatus,
} from "@prisma/client";

export type TaskViewKey = "mine" | "assigned" | "delegated" | "all";
export type TaskDueKey = "ALL" | "OVERDUE" | "TODAY" | "THIS_WEEK" | "NO_DUE";

export type TaskListFilters = {
  view?: TaskViewKey;
  q?: string;
  status?: TaskStatus | "OPEN" | "ALL";
  priority?: TaskPriority | "ALL";
  kind?: TaskKind | "ALL";
  due?: TaskDueKey;
  page?: number;
  pageSize?: number;
};

export type TaskDomainLinksInput = {
  watchId?: string | null;
  orderId?: string | null;
  shipmentId?: string | null;
  acquisitionId?: string | null;
  serviceRequestId?: string | null;
  technicalIssueId?: string | null;
  paymentId?: string | null;
  workCaseId?: string | null;
};

export type CreateTaskInput = TaskDomainLinksInput & {
  title: string;
  description?: string | null;
  source?: TaskSource;
  kind?: TaskKind;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
};

export type UpdateTaskInput = TaskDomainLinksInput & {
  title?: string;
  description?: string | null;
  kind?: TaskKind;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
};

export type CompleteRelatedTasksInput = TaskDomainLinksInput & {
  kind?: TaskKind;
  completedByUserId?: string | null;
};

export type EnsureSystemTaskInput = TaskDomainLinksInput & {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
  createdByUserId?: string | null;
};

export type EnsureSystemTaskResult = {
  id: string;
  created: boolean;
  reopened: boolean;
};

export type FindOpenRelatedTasksInput = TaskDomainLinksInput & {
  kind?: TaskKind;
  taskItemId?: string | null;
  limit?: number;
};

export type RelatedTaskSuggestion = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  assignedToUser?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export type CreateTaskItemInput = {
  taskId: string;
  title: string;
  note?: string | null;
  assignedToUserId?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
};

export type UpdateTaskItemInput = {
  title?: string;
  note?: string | null;
  assignedToUserId?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  status?: TaskStatus;
};

export type CreateTaskItemChecklistInput = {
  taskItemId: string;
  title: string;
  note?: string | null;
  dueAt?: Date | string | null;
};

export type UpdateTaskItemChecklistInput = {
  title?: string;
  note?: string | null;
  dueAt?: Date | string | null;
  isDone?: boolean;
};
