import type { CoordinationContext } from "@/domains/coordination/server/coordination-cycle.types";

export type SpaceViewRowModel =
  | "WORKSPACE"
  | "FLOW_STAGE_WORKSPACE"
  | "CASE_WORKSPACE"
  | "BUSINESS_ITEM"
  | "BENCH_WORKSPACE"
  | "WORKSPACE_BUCKET"
  | "STAGE_BUCKET";

export type WorkspaceKind =
  | "STANDALONE_WORKSPACE"
  | "FLOW_STAGE_WORKSPACE"
  | "CASE_WORKSPACE"
  | "BENCH_WORKSPACE";

export type SpaceViewPrimaryTarget =
  | "workspace"
  | "businessItem"
  | "stage";

export type SpaceViewColumnKind =
  | "title"
  | "owner"
  | "queueSummary"
  | "attention"
  | "feedback"
  | "updatedAt"
  | "lastActivity";

export type SpaceViewColumnConfig = {
  key: SpaceViewColumnKind;
  label: string;
};

export type SpaceViewModeConfig = {
  key: string;
  label: string;
  description: string;
  rowModel: SpaceViewRowModel;
  primaryTarget: SpaceViewPrimaryTarget;
  coreFlowKey?: string;
  allowedWorkspaceKinds?: WorkspaceKind[];
  columns: SpaceViewColumnConfig[];
};

export type SpaceViewFlowStageConfig = {
  key: string;
  label: string;
  workspaceKey: string;
  sortOrder: number;
  itemTargetType: string;
  evidenceEvents: string[];
};

export type SpaceViewCoreFlowConfig = {
  key: string;
  label: string;
  description: string;
  rowModel: Extract<SpaceViewRowModel, "FLOW_STAGE_WORKSPACE">;
  primaryTarget: Extract<SpaceViewPrimaryTarget, "workspace">;
  itemTargetType: string;
  stages: SpaceViewFlowStageConfig[];
};

export type SpaceViewCarryoverPolicy = {
  enabled: boolean;
  actionLabel: string;
  source: "PREVIOUS_CYCLE";
  onlyProcessingItems: boolean;
  processingRule: string;
  terminalStatesByTargetType?: Record<string, string[]>;
};

export type SpaceViewCreateWorkspacePolicy = {
  enabled: boolean;
  actionLabel: string;
  defaultTitlePlaceholder: string;
};

export type SpaceViewConfig = {
  key: string;
  context: CoordinationContext;
  label: string;
  description: string;
  defaultModeKey: string;
  defaultCoreFlowKey?: string;
  modes: SpaceViewModeConfig[];
  coreFlows?: SpaceViewCoreFlowConfig[];
  carryover: SpaceViewCarryoverPolicy;
  createWorkspace: SpaceViewCreateWorkspacePolicy;
  emptyState: string;
};
