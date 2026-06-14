import type {
  TaskCompletionMode,
  TaskDomain,
  TaskExecutionTargetType,
  TechnicalActionMode,
} from "@prisma/client";

export type TaskActionListFilters = {
  q?: string;
  taskTypeId?: string | "ALL" | null;
  domain?: TaskDomain | "ALL" | null;
  isActive?: "ACTIVE" | "INACTIVE" | "ALL";
};

export type TaskActionOption = {
  id: string;
  taskTypeId: string;
  code: string;
  name: string;
  description?: string | null;
  completionMode: TaskCompletionMode;
  completionRuleKey?: string | null;
  targetType?: TaskExecutionTargetType | null;
  serviceCatalogId?: string | null;
  technicalDetailCatalogId?: string | null;
  supplyCatalogId?: string | null;
  mechanicalPartCatalogId?: string | null;
  technicalActionMode?: TechnicalActionMode | null;
  defaultTitleTemplate?: string | null;
  defaultDescriptionTemplate?: string | null;
  metadataJson?: any;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type UpsertTaskActionInput = {
  taskTypeId: string;
  code: string;
  name: string;
  description?: string | null;
  completionMode?: TaskCompletionMode;
  completionRuleKey?: string | null;
  targetType?: TaskExecutionTargetType | null;
  serviceCatalogId?: string | null;
  technicalDetailCatalogId?: string | null;
  supplyCatalogId?: string | null;
  mechanicalPartCatalogId?: string | null;
  technicalActionMode?: TechnicalActionMode | null;
  defaultTitleTemplate?: string | null;
  defaultDescriptionTemplate?: string | null;
  metadataJson?: any;
  isActive?: boolean;
  sortOrder?: number;
};
