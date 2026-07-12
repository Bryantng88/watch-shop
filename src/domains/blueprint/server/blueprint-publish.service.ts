import type { WorkflowDefinitionDraft } from "@/domains/workflow-definition/server";
import {
  getWorkflowDefinitionDraft,
} from "@/domains/workflow-definition/server/workflow-definition-draft.service";
import {
  validateOperationalBlueprintContract,
  type OperationalBlueprintContract,
} from "@/domains/blueprint/shared/operational-blueprint";
import {
  buildOperationPublishPlan,
} from "@/domains/blueprint/shared/operation-publish-plan";
import {
  buildOperationSpaceCreationPlan,
  type OperationBlueprintSource,
} from "@/domains/blueprint/shared/operation-space-plan";
import {
  appendBlueprintPublishedVersionRecord,
  getLatestBlueprintPublishedVersionRecord,
  listBlueprintPublishedVersionRecords,
  listBlueprintPublishedVersionRecordsForBlueprint,
  type BlueprintPublishedVersionStoreOptions,
} from "./blueprint-published-version.store";
import type { BlueprintWorkspaceDefinition } from "./blueprint.types";
import type {
  BlueprintPublishedVersion,
  BlueprintPublishedVersionSource,
} from "./blueprint-published-version.types";
import type {
  WorkflowDefinition,
  WorkflowDefinitionValidationResult,
} from "@/domains/workflow-definition/server";

export type PublishBlueprintVersionCandidateInput = {
  blueprintKey: string;
  blueprintName: string;
  source: BlueprintPublishedVersionSource;
  sourceDraftId?: string | null;
  sourceRegistryKey?: string | null;
  workflowDefinition: WorkflowDefinition;
  workspaceDefinition: BlueprintWorkspaceDefinition;
  workflowValidation?: WorkflowDefinitionValidationResult | null;
  operation: OperationalBlueprintContract | null | undefined;
  publishedByUserId?: string | null;
  store?: BlueprintPublishedVersionStoreOptions;
};

export type PublishBlueprintVersionResult =
  | {
      ok: true;
      version: BlueprintPublishedVersion;
    }
  | {
      ok: false;
      error: string;
      publishPlan?: ReturnType<typeof buildOperationPublishPlan>;
    };

function blueprintSourceForCreationPlan(
  source: BlueprintPublishedVersionSource,
): OperationBlueprintSource {
  return source === "REGISTRY" ? "REGISTRY" : "DRAFT";
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function listBlueprintPublishedVersions(
  options?: BlueprintPublishedVersionStoreOptions,
) {
  return listBlueprintPublishedVersionRecords(options);
}

export async function listBlueprintPublishedVersionsForBlueprint(
  blueprintKey: string,
  options?: BlueprintPublishedVersionStoreOptions,
) {
  return listBlueprintPublishedVersionRecordsForBlueprint(blueprintKey, options);
}

export async function getLatestBlueprintPublishedVersion(
  blueprintKey: string,
  options?: BlueprintPublishedVersionStoreOptions,
) {
  return getLatestBlueprintPublishedVersionRecord(blueprintKey, options);
}

export async function publishBlueprintVersionCandidate(
  input: PublishBlueprintVersionCandidateInput,
): Promise<PublishBlueprintVersionResult> {
  const blueprintKey = clean(input.blueprintKey);
  const blueprintName = clean(input.blueprintName) || blueprintKey;

  if (!blueprintKey) {
    return { ok: false, error: "Blueprint key is required." };
  }

  if (input.workflowValidation && !input.workflowValidation.valid) {
    return { ok: false, error: "Workflow definition validation failed." };
  }

  const latest = await getLatestBlueprintPublishedVersionRecord(
    blueprintKey,
    input.store,
  );
  const creationPlan = buildOperationSpaceCreationPlan({
    blueprintKey,
    blueprintName,
    blueprintSource: blueprintSourceForCreationPlan(input.source),
    workspaceDefinition: input.workspaceDefinition,
    operation: input.operation,
  });
  const publishPlan = buildOperationPublishPlan({
    operation: input.operation,
    creationPlan,
    latestPublishedVersion: latest?.version ?? null,
  });

  if (!publishPlan.ok || !input.operation || !publishPlan.proposedVersion) {
    return {
      ok: false,
      error: "Blueprint publish readiness failed.",
      publishPlan,
    };
  }

  const operation: OperationalBlueprintContract = {
    ...input.operation,
    version: publishPlan.proposedVersion,
  };
  const operationValidation = validateOperationalBlueprintContract(operation);
  const publishedCreationPlan = buildOperationSpaceCreationPlan({
    blueprintKey,
    blueprintName,
    blueprintSource: blueprintSourceForCreationPlan(input.source),
    workspaceDefinition: input.workspaceDefinition,
    operation,
  });

  if (!operationValidation.ok) {
    return {
      ok: false,
      error: "Published operation snapshot failed validation.",
      publishPlan,
    };
  }

  const version = await appendBlueprintPublishedVersionRecord(
    {
      blueprintKey,
      blueprintName,
      source: input.source,
      sourceDraftId: input.sourceDraftId ?? null,
      sourceRegistryKey: input.sourceRegistryKey ?? null,
      version: publishPlan.proposedVersion,
      operationKey: operation.key,
      operationVersion: operation.version,
      snapshotMode: publishPlan.snapshotMode,
      publishedByUserId: input.publishedByUserId ?? null,
      workflowDefinition: input.workflowDefinition,
      workspaceDefinition: input.workspaceDefinition,
      workflowValidation: input.workflowValidation ?? null,
      operation,
      operationValidation,
      creationPlan: publishedCreationPlan,
      publishPlan,
    },
    input.store,
  );

  return { ok: true, version };
}

export async function publishWorkflowDefinitionDraftBlueprint(input: {
  draftId: string;
  publishedByUserId?: string | null;
  store?: BlueprintPublishedVersionStoreOptions;
}): Promise<PublishBlueprintVersionResult> {
  const draft = await getWorkflowDefinitionDraft(input.draftId);

  if (!draft) {
    return { ok: false, error: "Workflow definition draft was not found." };
  }

  if (!draft.blueprintJson) {
    return { ok: false, error: "Workflow definition draft has no Blueprint JSON." };
  }

  return publishBlueprintVersionCandidate({
    blueprintKey: draft.key,
    blueprintName: draft.name,
    source: "DRAFT",
    sourceDraftId: draft.id,
    sourceRegistryKey: draft.sourceRegistryKey,
    workflowDefinition: draft.definitionJson,
    workspaceDefinition: draft.blueprintJson.workspaceDefinition,
    workflowValidation: draft.validationJson,
    operation: draft.blueprintJson.operation,
    publishedByUserId: input.publishedByUserId,
    store: input.store,
  });
}

export function canDraftBePublished(draft: WorkflowDefinitionDraft) {
  return Boolean(draft.blueprintJson?.operation && draft.validationJson?.valid);
}
