import type { TaskKind, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";

export type TaskViewKey = "mine" | "assigned" | "delegated" | "all";

export type TaskListFilters = {
  view?: TaskViewKey;
  q?: string;
  status?: TaskStatus | "OPEN" | "ALL";
  priority?: TaskPriority | "ALL";
  kind?: TaskKind | "ALL";
  taskTypeId?: string | "ALL";
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
  taskTypeId?: string | null;
  description?: string | null;
  source?: TaskSource;
  kind?: TaskKind;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
};

export type UpdateTaskInput = TaskDomainLinksInput & {
  title?: string;
  taskTypeId?: string | null;
  description?: string | null;
  kind?: TaskKind;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
};

export type CompleteRelatedTasksInput = TaskDomainLinksInput & {
  kind: TaskKind;
  completedByUserId?: string | null;
};

export type FindOpenRelatedTasksInput = TaskDomainLinksInput & {
  taskTypeCode?: string | null;
  taskTypeId?: string | null;
  kind?: TaskKind | null;
  limit?: number;
};

export type RelatedTaskSuggestion = {
  id: string;
  title: string;
  description?: string | null;
  dueAt?: Date | string | null;
  priority: TaskPriority;
  status: TaskStatus;
  taskType?: {
    id: string;
    code: string;
    name: string;
  } | null;
  assignedToUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
};
export type TaskTypeOption = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};