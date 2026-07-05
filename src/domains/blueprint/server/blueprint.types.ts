import type { WorkflowDefinitionValidationResult } from "@/domains/workflow-definition/server";
import type { WorkTypeCoordinationContext } from "@/domains/task/server/work-type.types";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server/workflow-definition.types";
import type { WorkspaceEventBinding } from "@/domains/blueprint/shared/event-bindings";
import type { WorkspaceProvisioningPolicy } from "@/domains/blueprint/shared/workspace-provisioning";

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

export type BlueprintWorkspaceDefinitionDefaultView =
  | "items"
  | "activity"
  | "workflow"
  | "discussion"
  | "attachments"
  | "checklist"
  | "priority"
  | "info";

export type BlueprintWorkspaceDefinitionCapabilities = {
  workflow: boolean;
  items: boolean;
  activity: boolean;
  discussion: boolean;
  attachments: boolean;
  checklist: boolean;
  dueDate: boolean;
  assignee: boolean;
  priority: boolean;
};

export type BlueprintEventBinding = WorkspaceEventBinding;

export type BlueprintWorkspaceDefinition = {
  defaultName: string;
  defaultDescription: string | null;
  workspaceType: string;
  itemLabel: string;
  defaultView: BlueprintWorkspaceDefinitionDefaultView;
  enabledCapabilities: BlueprintWorkspaceDefinitionCapabilities;
  provisioning: WorkspaceProvisioningPolicy;
  eventBindings: BlueprintEventBinding[];
  instantiationNotes: string | null;
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
  workspaceDefinition: BlueprintWorkspaceDefinition;
  workflow: BlueprintWorkflowCapability;
  metadata: Record<string, unknown> | null;
};

export type WorkspaceInstantiationBlueprintOption = {
  selectionKey: string;
  key: string;
  name: string;
  description: string | null;
  workflowKey: string | null;
  businessContext: WorkTypeCoordinationContext | "DRAFT";
  source: BlueprintSource;
  status: string | null;
  workspaceDefinition: BlueprintWorkspaceDefinition;
  snapshotNote: string;
};
