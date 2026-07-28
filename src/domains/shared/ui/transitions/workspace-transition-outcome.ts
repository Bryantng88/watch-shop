export const WORKSPACE_TRANSITION_APPLIED = "workspace-transition-applied";

export type WorkspaceTransitionOutcome = {
  type: typeof WORKSPACE_TRANSITION_APPLIED;
  bindingId: string;
  actionKey: string;
  fromStageKey?: string;
  toStageKey?: string;
};

export function isWorkspaceTransitionOutcome(
  value: unknown,
): value is WorkspaceTransitionOutcome {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.type === WORKSPACE_TRANSITION_APPLIED &&
    typeof candidate.bindingId === "string" &&
    Boolean(candidate.bindingId.trim()) &&
    typeof candidate.actionKey === "string" &&
    Boolean(candidate.actionKey.trim())
  );
}

export function notifyParentOfWorkspaceTransition(
  outcome: Omit<WorkspaceTransitionOutcome, "type">,
) {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(
    { type: WORKSPACE_TRANSITION_APPLIED, ...outcome },
    window.location.origin,
  );
}
