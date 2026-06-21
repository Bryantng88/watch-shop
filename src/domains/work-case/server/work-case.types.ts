import type { TaskPriority, WorkCaseScope, WorkCaseStatus } from "@prisma/client";

export type WorkCaseViewKey = "mine" | "raised" | "assigned" | "all";

export type WorkCaseListFilters = {
  view?: WorkCaseViewKey;
  q?: string;
  scope?: WorkCaseScope | "ALL";
  status?: WorkCaseStatus | "OPEN" | "ALL";
  priority?: TaskPriority | "ALL";
  page?: number;
  pageSize?: number;
};

export type CreateWorkCaseInput = {
  title: string;
  description?: string | null;
  scope: WorkCaseScope;
  priority?: TaskPriority;
  watchId?: string | null;
  categoryId?: string | null;
  assignedToUserId?: string | null;
  orderId?: string | null;
  shipmentId?: string | null;
  serviceRequestId?: string | null;
};
export type UpdateWorkCaseInput = {
  title?: string;
  description?: string | null;
  scope?: WorkCaseScope;
  status?: WorkCaseStatus;
  priority?: TaskPriority;
  categoryId?: string | null;
  assignedToUserId?: string | null;
};

export type CreateWorkCaseCategoryInput = {
  code: string;
  name: string;
  description?: string | null;
  scope: WorkCaseScope;
  isActive?: boolean;
  sortOrder?: number;
};

export type UpdateWorkCaseCategoryInput = Partial<CreateWorkCaseCategoryInput>;
