import type { CoordinationContext } from "@/domains/coordination/server/coordination-cycle.types";

export type SpaceViewRowModel =
  | "WORKSPACE"
  | "BUSINESS_ITEM"
  | "WORKSPACE_BUCKET"
  | "STAGE_BUCKET";

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
  columns: SpaceViewColumnConfig[];
};

export type SpaceViewCarryoverPolicy = {
  enabled: boolean;
  actionLabel: string;
  source: "PREVIOUS_CYCLE";
  onlyProcessingItems: boolean;
  processingRule: string;
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
  modes: SpaceViewModeConfig[];
  carryover: SpaceViewCarryoverPolicy;
  createWorkspace: SpaceViewCreateWorkspacePolicy;
  emptyState: string;
};
