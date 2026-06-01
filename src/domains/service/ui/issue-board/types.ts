export type BoardColumnKey = "PENDING_CONFIRM" | "READY" | "IN_PROGRESS" | "DONE";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type IssueCatalogOption = {
  id: string;
  code?: string | null;
  name: string;
  categoryKey?: string | null;
  category?: string | null;
  group?: string | null;
};

export type IssueConclusionOptions = {
  serviceCatalogs: IssueCatalogOption[];
  supplyCatalogs: IssueCatalogOption[];
  mechanicalPartCatalogs: IssueCatalogOption[];
};

export type IssueItem = {
  id: string;
  summary?: string | null;
  note?: string | null;
  area?: string | null;
  issueType?: string | null;
  actionMode?: string | null;
  executionStatus?: string | null;
  isConfirmed?: boolean | null;
  confirmedAt?: string | null;
  openedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  canceledAt?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  resolutionNote?: string | null;
  vendorId?: string | null;
  vendorNameSnap?: string | null;
  boardColumn: BoardColumnKey;
  serviceRequestReadyToClose?: boolean;
  serviceRequestClosed?: boolean;
  isLastDoneIssueOfServiceRequest?: boolean;
  priority?: PriorityLevel | string | null;
  serviceRequest?: {
    id: string;
    refNo?: string | null;
    status?: string | null;
    scope?: string | null;
    technicianNameSnap?: string | null;
    vendorNameSnap?: string | null;
    productTitle?: string | null;
    primaryImageUrl?: string | null;
    movement?: string | null;
    model?: string | null;
    ref?: string | null;
    priority?: PriorityLevel | string | null;
    priorityReason?: string | null;
    prioritySource?: string | null;
    priorityMarkedAt?: string | null;
  } | null;
  assessment?: {
    id: string;
    status?: string | null;
  } | null;
  serviceCatalog?: { id: string; code?: string | null; name?: string | null } | null;
  supplyCatalog?: { id: string; code?: string | null; name?: string | null } | null;
  mechanicalPartCatalog?: { id: string; code?: string | null; name?: string | null } | null;
};
