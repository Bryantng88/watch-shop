import type {
  WorkflowDefinition,
} from "./workflow-definition.types";
import type {
  WorkflowDefinitionValidationResult,
} from "./workflow-definition.validation";
import type {
  BlueprintWorkspaceDefinition,
} from "@/domains/blueprint/server/blueprint.types";
import type {
  OperationalBlueprintContract,
} from "@/domains/blueprint/shared/operational-blueprint";

export type WorkflowDefinitionDraftStatus =
  | "DRAFT"
  | "VALIDATED"
  | "ARCHIVED";

export type WorkflowDefinitionDraftBlueprintJson = {
  purpose: string;
  businessContext: string;
  typicalUsage: string;
  expectedResult: string;
  ownerLabel: string | null;
  workspaceDefinition: BlueprintWorkspaceDefinition;
  operation?: OperationalBlueprintContract | null;
};

export type WorkflowDefinitionDraft = {
  id: string;
  key: string;
  workspaceTemplateKey: string | null;
  workTypeKey: string | null;
  name: string;
  description: string | null;
  blueprintJson: WorkflowDefinitionDraftBlueprintJson | null;
  definitionJson: WorkflowDefinition;
  status: WorkflowDefinitionDraftStatus;
  validationJson: WorkflowDefinitionValidationResult | null;
  sourceRegistryKey: string | null;
  createdByUserId: string | null;
  updatedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkflowDefinitionDraftInput = {
  sourceRegistryKey?: string | null;
  definitionJson?: WorkflowDefinition | null;
  blueprintJson?: WorkflowDefinitionDraftBlueprintJson | null;
  createdByUserId?: string | null;
};

export type UpdateWorkflowDefinitionDraftInput = {
  key?: string;
  workspaceTemplateKey?: string | null;
  workTypeKey?: string | null;
  name?: string;
  description?: string | null;
  blueprintJson?: WorkflowDefinitionDraftBlueprintJson | null;
  definitionJson?: WorkflowDefinition;
  updatedByUserId?: string | null;
};
