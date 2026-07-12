import type {
  WorkflowDefinition,
  WorkflowDefinitionValidationResult,
} from "@/domains/workflow-definition/server";
import type { BlueprintWorkspaceDefinition } from "./blueprint.types";
import type {
  OperationalBlueprintContract,
  OperationalBlueprintValidationResult,
} from "@/domains/blueprint/shared/operational-blueprint";
import type {
  OperationPublishPlan,
} from "@/domains/blueprint/shared/operation-publish-plan";
import type {
  OperationSpaceCreationPlan,
} from "@/domains/blueprint/shared/operation-space-plan";

export type BlueprintPublishedVersionSource = "DRAFT" | "REGISTRY";

export type BlueprintPublishedVersion = {
  id: string;
  blueprintKey: string;
  blueprintName: string;
  source: BlueprintPublishedVersionSource;
  sourceDraftId: string | null;
  sourceRegistryKey: string | null;
  version: number;
  operationKey: string;
  operationVersion: number;
  snapshotMode: OperationPublishPlan["snapshotMode"];
  publishedByUserId: string | null;
  publishedAt: string;
  workflowDefinition: WorkflowDefinition;
  workspaceDefinition: BlueprintWorkspaceDefinition;
  workflowValidation: WorkflowDefinitionValidationResult | null;
  operation: OperationalBlueprintContract;
  operationValidation: OperationalBlueprintValidationResult;
  creationPlan: OperationSpaceCreationPlan;
  publishPlan: OperationPublishPlan;
};

