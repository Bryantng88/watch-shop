import type { TaskDomain, TaskMode, TaskPriority, TaskSource, TaskStatus } from "@prisma/client";

export type TaskViewKey = "mine" | "assigned" | "delegated" | "all";
export type TaskDueKey = "ALL" | "OVERDUE" | "TODAY" | "THIS_WEEK" | "NO_DUE";

export type TaskListFilters = {
  view?: TaskViewKey;
  q?: string;
  status?: TaskStatus | "OPEN" | "ALL";
  priority?: TaskPriority | "ALL";
  domain?: TaskDomain | "ALL";
  taskTypeId?: string | "ALL" | null;
  taskActionId?: string | "ALL" | null;
  mode?: TaskMode | "ALL";
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
  domain?: TaskDomain;
  taskTypeId?: string | null;
  taskActionId?: string | null;
  mode?: TaskMode;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
};

export type UpdateTaskInput = TaskDomainLinksInput & {
  title?: string;
  description?: string | null;
  domain?: TaskDomain;
  taskTypeId?: string | null;
  taskActionId?: string | null;
  mode?: TaskMode;
  priority?: TaskPriority;
  dueAt?: Date | string | null;
  assignedToUserId?: string | null;
};

export type CompleteRelatedTasksInput = TaskDomainLinksInput & {
  domain?: TaskDomain;
  taskTypeId?: string | null;
  taskTypeCode?: string | null;
  taskActionId?: string | null;
  mode?: TaskMode;
  completedByUserId?: string | null;
};

export type EnsureSystemTaskInput = TaskDomainLinksInput & {
  domain: TaskDomain;
  taskTypeId?: string | null;
  taskActionId?: string | null;
  mode?: TaskMode;
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

export type TaskTypeOption = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};

export type FindOpenRelatedTasksInput = {
  domain?: TaskDomain;
  taskTypeId?: string | null;
  taskTypeCode?: string | null;
  taskActionId?: string | null;
  watchId?: string | null;
  paymentId?: string | null;
  checklistItemId?: string | null;
  limit?: number;
};
export type RelatedTaskSuggestion = {
  id: string;
  title: string;
  description: string | null;
  domain: TaskDomain;
  taskTypeId?: string | null;
  mode: TaskMode;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  taskType?: {
    code: string;
    name: string;
  } | null;
  assignedToUser?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};
