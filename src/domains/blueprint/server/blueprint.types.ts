import type { WorkflowDefinitionValidationResult } from "@/domains/workflow-definition/server";
import type { WorkTypeCoordinationContext } from "@/domains/task/server/work-type.types";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server/workflow-definition.types";

export type BlueprintSource = "REGISTRY" | "DRAFT";

export type BlueprintCapabilityStatus = "ACTIVE" | "FUTURE";

export type BlueprintCapability = {
  key: string;
  label: string;
  status: BlueprintCapabilityStatus;
  description: string;
  summary: string | null;
};

export type BlueprintWorkspacePreview = {
  workspaceType: string;
  itemLabel: string;
  activityLabel: string;
  discussionLabel: string;
  steps: string[];
};

export type BlueprintExperience = {
  purpose: string;
  ownerLabel: string | null;
  typicalUsage: string;
  expectedResult: string;
  workspaceType: string;
  workspacePreview: BlueprintWorkspacePreview;
  capabilities: BlueprintCapability[];
};

export type BlueprintWorkflowCapability = {
  workflowKey: string | null;
  definition: WorkflowDefinition | null;
  validation: WorkflowDefinitionValidationResult | null;
  stateCount: number;
  transitionCount: number;
  manualActionCount: number;
  eventTriggerCount: number;
  conditionCount: number;
};

export type BlueprintLibraryItem = {
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string;
  businessContext: WorkTypeCoordinationContext | "DRAFT";
  source: BlueprintSource;
  registrySource: string | null;
  experience: BlueprintExperience;
  workflow: BlueprintWorkflowCapability;
  metadata: Record<string, unknown> | null;
};

export type WorkspaceInstantiationBlueprintOption = {
  key: string;
  name: string;
  description: string | null;
  workflowKey: string | null;
  businessContext: WorkTypeCoordinationContext;
  snapshotNote: string;
};
