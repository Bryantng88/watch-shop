import type {
  OperationalBlueprintAction,
  OperationalBlueprintContract,
  OperationalBlueprintEventRoute,
  OperationalBlueprintProjectionSubscription,
  OperationalBlueprintWorkflow,
} from "./operational-blueprint";

export type OperationPreviewWorkspaceNode = {
  roleKey: string;
  label: string;
  cardinality: string;
  identityTargetType: string | null;
  itemTargetTypes: string[];
  coreFlowLabels: string[];
  incomingRoutes: OperationalBlueprintEventRoute[];
  actions: OperationalBlueprintAction[];
  workflows: OperationalBlueprintWorkflow[];
};

export type OperationPreviewFlowStep = {
  workspaceRole: string;
  label: string;
  isEntry: boolean;
  isTerminal: boolean;
};

export type OperationPreviewFlow = {
  key: string;
  label: string;
  steps: OperationPreviewFlowStep[];
};

export type OperationPreviewMap = {
  operationKey: string;
  context: string;
  workspaceNodes: OperationPreviewWorkspaceNode[];
  flows: OperationPreviewFlow[];
  unplacedRoutes: OperationalBlueprintEventRoute[];
  unplacedActions: OperationalBlueprintAction[];
  projectionSubscriptions: OperationalBlueprintProjectionSubscription[];
};

function normalizeRole(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export function generateOperationPreviewMap(
  contract: OperationalBlueprintContract | null | undefined,
): OperationPreviewMap | null {
  if (!contract) return null;

  const roleKeys = new Set(
    contract.workspaceRoles.map((role) => normalizeRole(role.key)).filter(Boolean),
  );

  const flows: OperationPreviewFlow[] = contract.coreFlows.map((flow) => ({
    key: flow.key,
    label: flow.label,
    steps: flow.steps.map((step) => ({
      workspaceRole: step.workspaceRole,
      label: step.label,
      isEntry: step.isEntry,
      isTerminal: step.isTerminal,
    })),
  }));

  const workspaceNodes = contract.workspaceRoles.map((role) => {
    const roleKey = normalizeRole(role.key);

    return {
      roleKey: role.key,
      label: role.label,
      cardinality: role.cardinality,
      identityTargetType: role.identityTargetType,
      itemTargetTypes: role.itemTargetTypes,
      coreFlowLabels: contract.coreFlows
        .filter((flow) =>
          flow.steps.some((step) => normalizeRole(step.workspaceRole) === roleKey),
        )
        .map((flow) => flow.label),
      incomingRoutes: contract.eventRoutes.filter(
        (route) => normalizeRole(route.workspaceRole) === roleKey,
      ),
      actions: contract.actions.filter(
        (action) => normalizeRole(action.workspaceRole) === roleKey,
      ),
      workflows: contract.workflows.filter(
        (workflow) => normalizeRole(workflow.workspaceRole) === roleKey,
      ),
    };
  });

  return {
    operationKey: contract.key,
    context: contract.context,
    workspaceNodes,
    flows,
    unplacedRoutes: contract.eventRoutes.filter(
      (route) => !roleKeys.has(normalizeRole(route.workspaceRole)),
    ),
    unplacedActions: contract.actions.filter(
      (action) => !roleKeys.has(normalizeRole(action.workspaceRole)),
    ),
    projectionSubscriptions: contract.projectionSubscriptions,
  };
}
