export type BoardColumnKey = "PENDING_CONFIRM" | "READY" | "IN_PROGRESS" | "DONE";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TechnicalDetailCatalogOption = {
  id: string;
  area?: string | null;
  code?: string | null;
  name?: string | null;
  sortOrder?: number | null;
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
  technicalDetailCatalog?: {
    id: string;
    area?: string | null;
    code?: string | null;
    name?: string | null;
  } | null;
  serviceCatalog?: { id: string; code?: string | null; name?: string | null } | null;
  supplyCatalog?: { id: string; code?: string | null; name?: string | null } | null;
  mechanicalPartCatalog?: { id: string; code?: string | null; name?: string | null } | null;
};


export type IssueBoardCatalogs = {
  technicalDetailCatalogOptions?: TechnicalDetailCatalogOption[];
  // giữ các field cũ nếu có
};