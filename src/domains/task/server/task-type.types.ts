import type { TaskCompletionMode, TaskDomain, TaskPriority } from "@prisma/client";

export type TaskTypeListFilters = {
  q?: string;
  domain?: TaskDomain | "ALL";
  isActive?: "ACTIVE" | "INACTIVE" | "ALL";
};

export type TaskTypeOption = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  domain: TaskDomain;
  defaultPriority: TaskPriority;
  completionMode: TaskCompletionMode;
  completionRuleKey?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type UpsertTaskTypeInput = {
  code: string;
  name: string;
  description?: string | null;
  domain: TaskDomain;
  defaultPriority?: TaskPriority;
  completionMode?: TaskCompletionMode;
  completionRuleKey?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};
