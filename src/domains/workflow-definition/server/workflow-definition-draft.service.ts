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
  WorkflowDefinitionDraftBlueprintJson,
  WorkflowDefinitionDraft,
} from "./workflow-definition-draft.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function actionKeyFromLabel(label: string | null | undefined, index: number) {
  const key = clean(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return key || `manual-action-${index + 1}`;
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
    transitions: Array.isArray(input.transitions)
      ? input.transitions.map((transition, index) => {
          if (transition.triggerType !== "MANUAL") return transition;

          return {
            ...transition,
            triggerValue:
              clean(transition.triggerValue) ||
              actionKeyFromLabel(transition.manualActionLabel, index),
          };
        })
      : [],
    metadata: input.metadata ?? null,
  };
}

function defaultBlueprintJson(
  definition: WorkflowDefinition,
  sourceRegistryKey: string | null,
): WorkflowDefinitionDraftBlueprintJson {
  const name = clean(definition.title) || "Blueprint Draft";

  return {
    purpose:
      definition.description ??
      "Thiết kế một cách vận hành chuẩn cho Workspace trong tương lai.",
    businessContext: sourceRegistryKey ? "REGISTRY_DRAFT" : "DRAFT",
    typicalUsage:
      "Dùng khi admin cần định nghĩa Blueprint trước khi tạo Workspace.",
    expectedResult:
      "Một Blueprint draft có thể validate và dùng làm nền cho Workspace.",
    ownerLabel: "System Admin",
    workspaceDefinition: {
      defaultName: `${name} Workspace`,
      defaultDescription:
        definition.description ?? `Workspace được tạo từ Blueprint ${name}.`,
      workspaceType: `${name} Workspace`,
      itemLabel: `${name} Items`,
      defaultView: "items",
      enabledCapabilities: {
        workflow: true,
        items: true,
        activity: true,
        discussion: true,
        attachments: false,
        checklist: false,
        dueDate: false,
        assignee: false,
        priority: true,
      },
      instantiationNotes:
        "Ở V1, Workspace lưu ý định định nghĩa này dưới dạng snapshot note.",
    },
  };
}

function normalizeBlueprintJson(
  input: WorkflowDefinitionDraftBlueprintJson | null | undefined,
  definition: WorkflowDefinition,
  sourceRegistryKey: string | null,
) {
  const fallback = defaultBlueprintJson(definition, sourceRegistryKey);
  if (!input) return fallback;

  return {
    ...fallback,
    ...input,
    purpose: clean(input.purpose) || fallback.purpose,
    businessContext: clean(input.businessContext) || fallback.businessContext,
    typicalUsage: clean(input.typicalUsage) || fallback.typicalUsage,
    expectedResult: clean(input.expectedResult) || fallback.expectedResult,
    ownerLabel: clean(input.ownerLabel) || fallback.ownerLabel,
    workspaceDefinition: {
      ...fallback.workspaceDefinition,
      ...input.workspaceDefinition,
      defaultName:
        clean(input.workspaceDefinition?.defaultName) ||
        fallback.workspaceDefinition.defaultName,
      defaultDescription:
        input.workspaceDefinition?.defaultDescription ??
        fallback.workspaceDefinition.defaultDescription,
      workspaceType:
        clean(input.workspaceDefinition?.workspaceType) ||
        fallback.workspaceDefinition.workspaceType,
      itemLabel:
        clean(input.workspaceDefinition?.itemLabel) ||
        fallback.workspaceDefinition.itemLabel,
      defaultView: ["items", "activity", "workflow"].includes(
        clean(input.workspaceDefinition?.defaultView),
      )
        ? input.workspaceDefinition.defaultView
        : fallback.workspaceDefinition.defaultView,
      enabledCapabilities: {
        ...fallback.workspaceDefinition.enabledCapabilities,
        ...input.workspaceDefinition?.enabledCapabilities,
      },
      instantiationNotes:
        input.workspaceDefinition?.instantiationNotes ??
        fallback.workspaceDefinition.instantiationNotes,
    },
  };
}

function blueprintValidationIssues(
  blueprintJson: WorkflowDefinitionDraftBlueprintJson,
) {
  const issues: string[] = [];

  if (!clean(blueprintJson.purpose)) issues.push("Blueprint purpose is required.");
  if (!clean(blueprintJson.workspaceDefinition.defaultName)) {
    issues.push("Default Workspace name is required.");
  }
  if (!clean(blueprintJson.workspaceDefinition.itemLabel)) {
    issues.push("Item label is required.");
  }

  return issues;
}

function mergeBlueprintValidation(
  validation: ReturnType<typeof validateDraftDefinition>,
  blueprintJson: WorkflowDefinitionDraftBlueprintJson,
) {
  const blueprintIssues = blueprintValidationIssues(blueprintJson);
  if (!blueprintIssues.length) return validation;

  return {
    ...validation,
    valid: false,
    issues: [...validation.issues, ...blueprintIssues],
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
  const blueprintJson = normalizeBlueprintJson(
    input.blueprintJson,
    definition,
    sourceRegistryKey || null,
  );
  const validation = mergeBlueprintValidation(
    validateDraftDefinition(definition),
    blueprintJson,
  );

  return createWorkflowDefinitionDraftRecord({
    key: definition.key,
    workspaceTemplateKey: sourceRegistryKey || null,
    workTypeKey: sourceRegistryKey || null,
    name: definition.title,
    description: definition.description,
    blueprintJson,
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

  const definition = normalizeDefinition(
    input.definitionJson ?? existing.definitionJson,
  );
  const blueprintJson = normalizeBlueprintJson(
    input.blueprintJson ?? existing.blueprintJson,
    definition,
    existing.sourceRegistryKey,
  );
  const validation = mergeBlueprintValidation(
    validateDraftDefinition(definition),
    blueprintJson,
  );
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
    blueprintJson,
    definitionJson: definition,
    status,
    validationJson: validation,
    updatedByUserId: input.updatedByUserId ?? existing.updatedByUserId,
  });
}

export async function validateWorkflowDefinitionDraft(id: string) {
  const existing = await getWorkflowDefinitionDraftRecord(id);
  if (!existing) return null;

  const definition = normalizeDefinition(existing.definitionJson);
  const blueprintJson = normalizeBlueprintJson(
    existing.blueprintJson,
    definition,
    existing.sourceRegistryKey,
  );
  const validation = mergeBlueprintValidation(
    validateDraftDefinition(definition),
    blueprintJson,
  );

  return updateWorkflowDefinitionDraftRecord(id, {
    blueprintJson,
    definitionJson: definition,
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
