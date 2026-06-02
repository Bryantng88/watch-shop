export type BoardColumnKey = "PENDING_CONFIRM" | "READY" | "IN_PROGRESS" | "DONE";
export type PriorityLevel = "LOW" | "MEDIUM" | "NORMAL" | "HIGH" | "URGENT";

export type IssueBoardCatalogOption = {
  id: string;
  code?: string | null;
  name?: string | null;
  category?: string | null;
  group?: string | null;
  unit?: string | null;
  defaultCost?: number | null;
  internalCost?: number | null;
  vendorPrice?: number | null;
  customerPrice?: number | null;
};

export type IssueBoardCatalogs = {
  serviceCatalogs: IssueBoardCatalogOption[];
  supplyCatalogs: IssueBoardCatalogOption[];
  mechanicalPartCatalogs: IssueBoardCatalogOption[];
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
    priority?: string | null;
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
