import type { WorkflowDefinition } from "@/domains/workflow-definition/server";
import type { WorkspaceKind } from "@/domains/space-management/server/space-view.types";
import type { WorkspaceEventBinding } from "./event-bindings";
import type { OperationalBlueprintContract } from "./operational-blueprint";
import type { WorkspaceProvisioningPolicy } from "./workspace-provisioning";

export type WorkspaceCapabilities = {
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

export type WorkspaceDefinitionSnapshot = {
  blueprintKey?: string;
  blueprintName?: string;
  blueprintSource?: string;
  workTypeKey?: string;
  workflowKey?: string | null;
  itemLabel?: string;
  defaultView?: string;
  workspaceType?: string;
  instantiationNotes?: string | null;
  snapshotAt?: string;
  eventBindings?: WorkspaceEventBinding[];
  provisioning?: WorkspaceProvisioningPolicy;
  operation?: OperationalBlueprintContract | null;
  operationWorkspaceRole?: string;
  workspaceKind?: WorkspaceKind;
  coreFlowKey?: string | null;
  flowStageKey?: string | null;
  flowStageOrder?: number | null;
  appliedWorkflowSnapshot?: WorkflowDefinition | null;
  workspaceDefinition?: {
    defaultName?: string;
    defaultDescription?: string | null;
    workspaceType?: string;
    itemLabel?: string;
    defaultView?: string;
    instantiationNotes?: string | null;
    provisioning?: WorkspaceProvisioningPolicy;
    eventBindings?: WorkspaceEventBinding[];
    enabledCapabilities?: Partial<WorkspaceCapabilities>;
  };
  enabledCapabilities?: Partial<WorkspaceCapabilities>;
};

const DEFAULT_WORKSPACE_CAPABILITIES: WorkspaceCapabilities = {
  workflow: true,
  items: true,
  activity: true,
  discussion: true,
  attachments: false,
  checklist: true,
  dueDate: true,
  assignee: true,
  priority: true,
};

export function parseWorkspaceDefinitionSnapshot(
  note?: string | null,
): WorkspaceDefinitionSnapshot | null {
  const snapshotLine = String(note ?? "")
    .split(/\r?\n/)
    .find((line) => /^blueprintSnapshot:\s*/i.test(line.trim()));
  if (!snapshotLine) return null;

  const json = snapshotLine.replace(/^blueprintSnapshot:\s*/i, "").trim();
  if (!json) return null;

  try {
    const value = JSON.parse(json) as unknown;
    return value && typeof value === "object"
      ? (value as WorkspaceDefinitionSnapshot)
      : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export function createAppliedWorkflowSnapshot(
  definition: WorkflowDefinition | null | undefined,
): WorkflowDefinition | null {
  if (!definition) return null;

  return JSON.parse(JSON.stringify(definition)) as WorkflowDefinition;
}

export function resolveAppliedWorkflowSnapshot(input: {
  note?: string | null;
  snapshot?: WorkspaceDefinitionSnapshot | null;
  metadataJson?: unknown;
}): WorkflowDefinition | null {
  const metadata = isRecord(input.metadataJson) ? input.metadataJson : {};
  const metadataSnapshot = metadata.appliedWorkflowSnapshot;
  if (isWorkflowDefinitionLike(metadataSnapshot)) {
    return metadataSnapshot;
  }

  const workspaceSnapshot =
    input.snapshot ?? parseWorkspaceDefinitionSnapshot(input.note) ?? null;
  const appliedSnapshot = workspaceSnapshot?.appliedWorkflowSnapshot;
  if (isWorkflowDefinitionLike(appliedSnapshot)) return appliedSnapshot;

  return null;
}

function isWorkflowDefinitionLike(
  value: unknown,
): value is WorkflowDefinition {
  if (!isRecord(value)) return false;

  return Boolean(
    clean(value.key) &&
      clean(value.initialState) &&
      Array.isArray(value.states) &&
      Array.isArray(value.transitions) &&
      Array.isArray(value.terminalStates),
  );
}

export function resolveWorkspaceCapabilities(input: {
  note?: string | null;
  snapshot?: WorkspaceDefinitionSnapshot | null;
}): WorkspaceCapabilities {
  const snapshot =
    input.snapshot ?? parseWorkspaceDefinitionSnapshot(input.note) ?? null;
  const enabled =
    snapshot?.workspaceDefinition?.enabledCapabilities ??
    snapshot?.enabledCapabilities ??
    null;

  return normalizeWorkspaceCapabilities({
    ...DEFAULT_WORKSPACE_CAPABILITIES,
    ...(enabled ?? {}),
  });
}

export function normalizeWorkspaceCapabilities(
  capabilities: Partial<WorkspaceCapabilities>,
): WorkspaceCapabilities {
  const normalized = {
    ...DEFAULT_WORKSPACE_CAPABILITIES,
    ...capabilities,
  };

  if (!normalized.items) {
    normalized.workflow = false;
  }

  return normalized;
}
