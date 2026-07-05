export const CORE_WORKSPACE_FLOW_ORDER: Record<string, number> = {
  photography: 10,
  "media-processing": 20,
  publish: 30,

  order: 110,
  shipment: 120,

  quotation: 210,
  pricing: 220,
  negotiation: 230,
  marketing: 240,

  inspection: 310,
  repair: 320,
  warranty: 330,
  technical: 340,

  payment: 410,
};

const CORE_WORKSPACE_BLUEPRINT_KEYS = new Set(
  Object.keys(CORE_WORKSPACE_FLOW_ORDER),
);

export function normalizeWorkspaceFlowKey(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

export function isCoreWorkspaceBlueprint(input?: {
  key?: string | null;
  source?: string | null;
} | null) {
  return Boolean(
    input &&
    String(input.source ?? "").toUpperCase() === "REGISTRY" &&
    CORE_WORKSPACE_BLUEPRINT_KEYS.has(normalizeWorkspaceFlowKey(input.key)),
  );
}

export function workspaceFlowOrder(input?: { key?: string | null } | null) {
  return (
    CORE_WORKSPACE_FLOW_ORDER[normalizeWorkspaceFlowKey(input?.key)] ??
    Number.MAX_SAFE_INTEGER
  );
}
