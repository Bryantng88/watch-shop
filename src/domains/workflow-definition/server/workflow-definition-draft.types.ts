import type {
  WorkflowDefinition,
} from "./workflow-definition.types";
import type {
  WorkflowDefinitionValidationResult,
} from "./workflow-definition.validation";

export type WorkflowDefinitionDraftStatus =
  | "DRAFT"
  | "VALIDATED"
  | "ARCHIVED";

export type WorkflowDefinitionDraft = {
  id: string;
  key: string;
  workspaceTemplateKey: string | null;
  workTypeKey: string | null;
  name: string;
  description: string | null;
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
  createdByUserId?: string | null;
};

export type UpdateWorkflowDefinitionDraftInput = {
  key?: string;
  workspaceTemplateKey?: string | null;
  workTypeKey?: string | null;
  name?: string;
  description?: string | null;
  definitionJson?: WorkflowDefinition;
  updatedByUserId?: string | null;
};
