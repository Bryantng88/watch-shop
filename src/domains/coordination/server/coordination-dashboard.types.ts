import type { CoordinationContext } from "./coordination-cycle.types";
import type {
  BlueprintSource,
  BlueprintWorkspaceDefinition,
  OperationalBlueprintContract,
  OperationalBlueprintValidationResult,
} from "@/domains/blueprint/server";
import type { SpaceViewConfig } from "@/domains/space-management/server/space-view.types";
import type { WorkspaceKind } from "@/domains/space-management/server/space-view.types";

export type CoordinationReportMetricDTO = {
  key: string;
  label: string;
  value: number;
};

export type QueueSummaryDTO = {
  ready: number;
  review: number;
  feedback: number;
  done: number;
};

export type CoordinationWorkTicketSummaryDTO = {
  id: string;
  title: string;
  identityPreview?: {
    targetType: string;
    targetId: string;
    title: string | null;
    ref: string | null;
    imageUrl: string | null;
  } | null;
  ownerLabel: string;
  owner: {
    label: string;
    avatarUrl: string | null;
    isSystem: boolean;
  };
  queueSummary: QueueSummaryDTO;
  paymentSummary?: {
    scope: "TECHNICAL_ISSUE_ROLLUP";
    direction: "IN" | "OUT";
    status: "NONE" | "UNPAID" | "PARTIAL" | "PAID";
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    remainingAmount: number;
    paymentCount: number;
    unpaidIssueCount: number;
  } | null;
  needAttention: boolean;
  feedbackCount: number;
  lastActivity: string | null;
  lastActivityAt: string | null;
  updatedAt: string | null;
  blueprint: {
    key: string;
    source: BlueprintSource;
    isAutoBindingReceiver: boolean;
    workspaceKind: WorkspaceKind | null;
    operationWorkspaceRole: string | null;
    coreFlowKey: string | null;
    flowStageKey: string | null;
    flowStageOrder: number | null;
  } | null;
};

export type CoordinationTechnicalIssueBoardItemDTO = {
  id: string;
  serviceRequestId: string;
  summary: string;
  area: string | null;
  actionMode: string | null;
  vendorId: string | null;
  vendorName: string | null;
  estimatedCost: number | null;
  executionStatus: string;
  isConfirmed: boolean;
  technicalDetailCatalogId: string | null;
  stage: "INSPECT" | "READY" | "PROCESSING" | "DONE";
  actualCost: number | null;
  updatedAt: string | null;
  workspaceTaskItemId: string | null;
  serviceRequest: {
    refNo: string | null;
    productTitle: string | null;
    sku: string | null;
    imageUrl: string | null;
  };
};

export type CoordinationUserSummaryDTO = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export type CoordinationDashboardDTO = {
  context: CoordinationContext;
  contextLabel: string;
  spaceLabel: string;
  spacesLabel: string;
  title: string;
  week: {
    label: string;
    periodKey: string;
    startDate: string;
    endDate: string;
    weekNumber: number;
    year: number;
  };
  cycle: {
    id: string;
    title: string;
    created: boolean;
  };
  viewConfig: SpaceViewConfig;
  filters: {
    selectedDate: string;
    weekOptions: Array<{
      label: string;
      value: string;
      date: string;
    }>;
  };
  report: CoordinationReportMetricDTO[];
  spaceSharing: {
    users: CoordinationUserSummaryDTO[];
    sharedUsers: CoordinationUserSummaryDTO[];
    scopeUserIds: {
      space: string[];
      coreFlows: Record<string, string[]>;
    };
  };
  blueprints: Array<{
    selectionKey: string;
    key: string;
    name: string;
    description: string | null;
    workflowKey: string | null;
    businessContext: CoordinationContext | "DRAFT";
    source: BlueprintSource;
    status: string | null;
    workspaceDefinition: BlueprintWorkspaceDefinition;
    operation: OperationalBlueprintContract | null;
    operationValidation: OperationalBlueprintValidationResult | null;
    snapshotNote: string;
    usage: {
      total: number;
      active: number;
      receiverId: string | null;
      activeWorkspaces: Array<{
        id: string;
        title: string;
        isAutoBindingReceiver: boolean;
      }>;
    };
  }>;
  workTickets: CoordinationWorkTicketSummaryDTO[];
  technicalIssueBoard: {
    items: CoordinationTechnicalIssueBoardItemDTO[];
    vendorOptions: Array<{ id: string; name: string }>;
    technicalDetailCatalogOptions: Array<{
      id: string;
      area: string | null;
      code: string | null;
      name: string | null;
    }>;
  } | null;
};
