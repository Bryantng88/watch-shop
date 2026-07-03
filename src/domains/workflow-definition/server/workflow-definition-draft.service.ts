import { listBusinessEventCatalog } from "@/domains/event/server/business-event-catalog.service";
import {
  getWorkflowDefinition,
  validateWorkflowDefinition,
} from "./workflow-definition.service";
import type { WorkflowDefinition } from "./workflow-definition.types";
import {
  createWorkflowDefinitionDraftRecord,
  getWorkflowDefinitionDraftRecord,
  listWorkflowDefinitionDraftRecords,
  updateWorkflowDefinitionDraftRecord,
} from "./workflow-definition-draft.store";
import type {
  CreateWorkflowDefinitionDraftInput,
  UpdateWorkflowDefinitionDraftInput,
  WorkflowDefinitionDraft,
} from "./workflow-definition-draft.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function emptyDefinition(): WorkflowDefinition {
  return {
    key: "new-workflow-draft",
    title: "New Workflow Draft",
    description: null,
    initialState: "NEW",
    terminalStates: ["DONE"],
    metadata: null,
    states: [
      {
        key: "NEW",
        title: "New",
        description: null,
        color: "gray",
        icon: "circle",
        sortOrder: 10,
      },
      {
        key: "DONE",
        title: "Done",
        description: null,
        color: "zinc",
        icon: "check-circle",
        sortOrder: 20,
      },
    ],
    transitions: [],
  };
}

function knownEventKeys() {
  return listBusinessEventCatalog().map((event) => event.eventKey);
}

function validateDraftDefinition(definition: WorkflowDefinition) {
  return validateWorkflowDefinition(definition, {
    knownEventKeys: knownEventKeys(),
    strictTerminalStates: true,
  });
}

function normalizeDefinition(input: WorkflowDefinition): WorkflowDefinition {
  return {
    ...input,
    key: clean(input.key),
    title: clean(input.title) || clean(input.key) || "Untitled Workflow Draft",
    description: input.description ?? null,
    terminalStates: Array.isArray(input.terminalStates)
      ? input.terminalStates
      : [],
    states: Array.isArray(input.states) ? input.states : [],
    transitions: Array.isArray(input.transitions) ? input.transitions : [],
    metadata: input.metadata ?? null,
  };
}

export async function listWorkflowDefinitionDrafts() {
  return listWorkflowDefinitionDraftRecords();
}

export async function getWorkflowDefinitionDraft(id: string) {
  return getWorkflowDefinitionDraftRecord(id);
}

export async function createWorkflowDefinitionDraft(
  input: CreateWorkflowDefinitionDraftInput,
) {
  const sourceRegistryKey = clean(input.sourceRegistryKey);
  const sourceDefinition = sourceRegistryKey
    ? getWorkflowDefinition(sourceRegistryKey)
    : null;
  const definition = normalizeDefinition(
    input.definitionJson ?? sourceDefinition ?? emptyDefinition(),
  );
  const validation = validateDraftDefinition(definition);

  return createWorkflowDefinitionDraftRecord({
    key: definition.key,
    workspaceTemplateKey: sourceRegistryKey || null,
    workTypeKey: sourceRegistryKey || null,
    name: definition.title,
    description: definition.description,
    definitionJson: definition,
    status: validation.valid ? "VALIDATED" : "DRAFT",
    validationJson: validation,
    sourceRegistryKey: sourceRegistryKey || null,
    createdByUserId: input.createdByUserId ?? null,
    updatedByUserId: input.createdByUserId ?? null,
  });
}

export async function updateWorkflowDefinitionDraft(
  id: string,
  input: UpdateWorkflowDefinitionDraftInput,
) {
  const existing = await getWorkflowDefinitionDraftRecord(id);
  if (!existing) return null;

  const definition = input.definitionJson
    ? normalizeDefinition(input.definitionJson)
    : existing.definitionJson;
  const validation = validateDraftDefinition(definition);
  const status: WorkflowDefinitionDraft["status"] =
    existing.status === "ARCHIVED"
      ? "ARCHIVED"
      : validation.valid
        ? "VALIDATED"
        : "DRAFT";

  return updateWorkflowDefinitionDraftRecord(id, {
    key: input.key ?? definition.key,
    workspaceTemplateKey:
      input.workspaceTemplateKey ?? existing.workspaceTemplateKey,
    workTypeKey: input.workTypeKey ?? existing.workTypeKey,
    name: input.name ?? definition.title,
    description: input.description ?? definition.description,
    definitionJson: definition,
    status,
    validationJson: validation,
    updatedByUserId: input.updatedByUserId ?? existing.updatedByUserId,
  });
}

export async function validateWorkflowDefinitionDraft(id: string) {
  const existing = await getWorkflowDefinitionDraftRecord(id);
  if (!existing) return null;

  const validation = validateDraftDefinition(existing.definitionJson);

  return updateWorkflowDefinitionDraftRecord(id, {
    validationJson: validation,
    status:
      existing.status === "ARCHIVED"
        ? "ARCHIVED"
        : validation.valid
          ? "VALIDATED"
          : "DRAFT",
  });
}

export async function archiveWorkflowDefinitionDraft(
  id: string,
  updatedByUserId?: string | null,
) {
  return updateWorkflowDefinitionDraftRecord(id, {
    status: "ARCHIVED",
    updatedByUserId: updatedByUserId ?? null,
  });
}
