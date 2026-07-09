import type { ServiceOperationTechnicalIssueStage } from "@/domains/service/server/shared/service-request.rules";

export type ServiceOperationAttention =
  | "NONE"
  | "COST_APPROVAL"
  | "VENDOR_HOLDING"
  | "PAYMENT"
  | "OVERDUE";

export type ServiceOperationOwnerKind =
  | "INTERNAL"
  | "VENDOR"
  | "PARTS"
  | "UNKNOWN";

export type ServiceOperationSrCaseRow = {
  id: string;
  refNo: string | null;
  status: string;
  attention: ServiceOperationAttention;
  watch: {
    productId: string | null;
    title: string | null;
    sku: string | null;
    imageUrl: string | null;
  };
  technicalProgress: {
    total: number;
    open: number;
    inProgress: number;
    done: number;
    completed: boolean;
  };
  commercial: {
    estimatedTotal: number;
    actualTotal: number;
    paid: number;
    unpaid: number;
    remaining: number;
  };
  creator: {
    kind: "SYSTEM" | "USER" | "UNKNOWN";
    name: string | null;
  };
  updatedAt: Date;
};

export type ServiceOperationTiStageItem = {
  id: string;
  serviceRequestId: string;
  stage: ServiceOperationTechnicalIssueStage;
  summary: string;
  area: string | null;
  ownerKind: ServiceOperationOwnerKind;
  vendorName: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  priority: string | null;
  updatedAt: Date;
  workspaceBinding: {
    bindingId: string;
    taskItemId: string | null;
  } | null;
  serviceRequest: {
    refNo: string | null;
    status: string | null;
    productTitle: string | null;
    sku: string | null;
    imageUrl: string | null;
  };
};

export type ServiceOperationCounters = {
  activeSr: number;
  waitingApproval: number;
  hasOpenTi: number;
  completedSr: number;
  waitingPayment: number;
  openTi: number;
  inspect: number;
  ready: number;
  inProgress: number;
  done: number;
};

export type ServiceOperationRange = "ALL_ACTIVE" | "CURRENT_WEEK";

export type ServiceOperationScope = {
  range: ServiceOperationRange;
  anchorDate: Date;
  from: Date | null;
  to: Date | null;
  label: string;
};

export type ServiceOperationListInput = {
  q?: string | null;
  page?: number;
  pageSize?: number;
  range?: ServiceOperationRange | string | null;
  anchorDate?: string | Date | null;
};

export type ServiceOperationTiListInput = ServiceOperationListInput & {
  serviceRequestId?: string | null;
  stage?: ServiceOperationTechnicalIssueStage | "ALL" | null;
};
