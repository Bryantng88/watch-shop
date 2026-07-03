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
  workspaceDefinition?: {
    defaultName?: string;
    defaultDescription?: string | null;
    workspaceType?: string;
    itemLabel?: string;
    defaultView?: string;
    instantiationNotes?: string | null;
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

  return {
    ...DEFAULT_WORKSPACE_CAPABILITIES,
    ...(enabled ?? {}),
  };
}
