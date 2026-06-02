export type ServiceRequestDetailViewModel = {
  serviceRequest: {
    id: string;
    refNo?: string | null;
    status?: string | null;
    scope?: string | null;
    priority?: string | null;
    priorityReason?: string | null;
    productId?: string | null;
    productTitle?: string | null;
    skuSnapshot?: string | null;
    primaryImageUrl?: string | null;
    ref?: string | null;
    model?: string | null;
    movement?: string | null;
    technicianNameSnap?: string | null;
    vendorNameSnap?: string | null;
    customerItemNote?: string | null;
    serviceName?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
  technicalSummary?: {
    issueCount?: number | null;
    openIssueCount?: number | null;
    activeAssessment?: unknown;
  } | null;
  technicalIssues?: Array<{
    id: string;
    area?: string | null;
    summary?: string | null;
    note?: string | null;
    actionMode?: string | null;
    executionStatus?: string | null;
    actualCost?: number | null;
    estimatedCost?: number | null;
    resolutionNote?: string | null;
    serviceCatalog?: { id: string; code?: string | null; name?: string | null } | null;
    supplyCatalog?: { id: string; code?: string | null; name?: string | null } | null;
    mechanicalPartCatalog?: { id: string; code?: string | null; name?: string | null } | null;
  }>;
  technicalAssessment?: {
    id?: string | null;
    status?: string | null;
    movementStatus?: string | null;
    conclusion?: string | null;
  } | null;
  assessment?: {
    id?: string | null;
    status?: string | null;
    movementStatus?: string | null;
    conclusion?: string | null;
  } | null;
  appearanceSummary?: { score?: number | null } | null;
  financialSummary?: { totalCost?: number | null } | null;
};
