import type {
  OperationalBlueprintContract,
  OperationalBlueprintCoreFlow,
  OperationalBlueprintCoreFlowStep,
  OperationalBlueprintWorkspaceRole,
} from "./operational-blueprint";
import type { WorkspaceKind } from "@/domains/space-management/server/space-view.types";
import {
  validateOperationalBlueprintContract,
  type OperationalBlueprintValidationResult,
} from "./operational-blueprint";

export type OperationBlueprintSource = "REGISTRY" | "DRAFT";

export type OperationPlanWorkspaceDefinition = {
  defaultName: string;
  defaultDescription: string | null;
  workspaceType: string;
  itemLabel: string;
  defaultView: string;
  enabledCapabilities: unknown;
  provisioning?: unknown;
  eventBindings?: unknown;
  instantiationNotes: string | null;
};

export type OperationWorkspacePlanDisposition =
  | "CREATE_INITIAL_WORKSPACE"
  | "DEFER_UNTIL_BUSINESS_OBJECT"
  | "MANUAL_CAPACITY";

export type OperationWorkspaceCreationPlanItem = {
  workspaceRole: string;
  workspaceKind: WorkspaceKind;
  coreFlowKey: string | null;
  flowStageKey: string | null;
  flowStageOrder: number | null;
  label: string;
  title: string;
  description: string | null;
  disposition: OperationWorkspacePlanDisposition;
  reason: string;
  snapshotNote: string;
};

export type OperationSpaceCreationPlan = {
  ok: boolean;
  blueprintKey: string;
  blueprintName: string;
  blueprintSource: OperationBlueprintSource;
  spaceTitle: string;
  validation: OperationalBlueprintValidationResult;
  initialWorkspaces: OperationWorkspaceCreationPlanItem[];
  deferredWorkspaces: OperationWorkspaceCreationPlanItem[];
  manualWorkspaces: OperationWorkspaceCreationPlanItem[];
  itemCount: number;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeRoleKey(value: unknown) {
  return clean(value).toLowerCase().replace(/[_\s]+/g, "-");
}

function normalizeTarget(value: unknown) {
  return clean(value).toUpperCase();
}

function roleFlowStage(input: {
  operation: OperationalBlueprintContract;
  role: OperationalBlueprintWorkspaceRole;
}): {
  flow: OperationalBlueprintCoreFlow;
  step: OperationalBlueprintCoreFlowStep;
  order: number;
} | null {
  const roleKey = normalizeTarget(input.role.key);

  for (const flow of input.operation.coreFlows) {
    const stepIndex = flow.steps.findIndex(
      (step) => normalizeTarget(step.workspaceRole) === roleKey,
    );

    if (stepIndex >= 0) {
      return {
        flow,
        step: flow.steps[stepIndex],
        order: (stepIndex + 1) * 10,
      };
    }
  }

  return null;
}

function roleWorkspaceMetadata(input: {
  operation: OperationalBlueprintContract;
  role: OperationalBlueprintWorkspaceRole;
}): {
  workspaceKind: WorkspaceKind;
  coreFlowKey: string | null;
  flowStageKey: string | null;
  flowStageOrder: number | null;
} {
  const stage = roleFlowStage(input);
  const explicitWorkspaceKind = input.role.workspaceKind ?? null;

  if (explicitWorkspaceKind) {
    return {
      workspaceKind: explicitWorkspaceKind,
      coreFlowKey: explicitWorkspaceKind === "FLOW_STAGE_WORKSPACE"
        ? stage?.flow.key ?? null
        : null,
      flowStageKey: explicitWorkspaceKind === "FLOW_STAGE_WORKSPACE" && stage
        ? normalizeRoleKey(stage.step.workspaceRole)
        : null,
      flowStageOrder: explicitWorkspaceKind === "FLOW_STAGE_WORKSPACE"
        ? stage?.order ?? null
        : null,
    };
  }

  if (input.role.cardinality === "ONE_PER_BUSINESS_OBJECT") {
    return {
      workspaceKind: "CASE_WORKSPACE",
      coreFlowKey: stage?.flow.key ?? null,
      flowStageKey: stage ? normalizeRoleKey(stage.step.workspaceRole) : null,
      flowStageOrder: stage?.order ?? null,
    };
  }

  if (stage && input.role.cardinality === "SINGLE_PER_ACTIVE_CYCLE") {
    return {
      workspaceKind: "FLOW_STAGE_WORKSPACE",
      coreFlowKey: stage.flow.key,
      flowStageKey: normalizeRoleKey(stage.step.workspaceRole),
      flowStageOrder: stage.order,
    };
  }

  if (input.role.cardinality === "MANY_PER_ACTIVE_CYCLE") {
    return {
      workspaceKind: "BENCH_WORKSPACE",
      coreFlowKey: stage?.flow.key ?? null,
      flowStageKey: stage ? normalizeRoleKey(stage.step.workspaceRole) : null,
      flowStageOrder: stage?.order ?? null,
    };
  }

  return {
    workspaceKind: "STANDALONE_WORKSPACE",
    coreFlowKey: null,
    flowStageKey: null,
    flowStageOrder: null,
  };
}

function roleDisposition(role: OperationalBlueprintWorkspaceRole): {
  disposition: OperationWorkspacePlanDisposition;
  reason: string;
} {
  if (role.cardinality === "SINGLE_PER_ACTIVE_CYCLE") {
    return {
      disposition: "CREATE_INITIAL_WORKSPACE",
      reason: "Single receiver workspace for the active operation cycle.",
    };
  }

  if (role.cardinality === "ONE_PER_BUSINESS_OBJECT") {
    return {
      disposition: "DEFER_UNTIL_BUSINESS_OBJECT",
      reason:
        "Workspace identity depends on a business object and should be created by event routes.",
    };
  }

  return {
    disposition: "MANUAL_CAPACITY",
    reason:
      "This role can have multiple workspaces in an active cycle and needs an explicit capacity decision.",
  };
}

function buildRoleSnapshotNote(input: {
  blueprintKey: string;
  blueprintName: string;
  blueprintSource: OperationBlueprintSource;
  workspaceDefinition: OperationPlanWorkspaceDefinition;
  operation: OperationalBlueprintContract;
  role: OperationalBlueprintWorkspaceRole;
}) {
  const roleMetadata = roleWorkspaceMetadata({
    operation: input.operation,
    role: input.role,
  });
  const snapshot = {
    blueprintKey: input.blueprintKey,
    blueprintName: input.blueprintName,
    blueprintSource: input.blueprintSource,
    operation: input.operation,
    operationWorkspaceRole: input.role.key,
    ...roleMetadata,
    workspaceRole: input.role,
    workspaceDefinition: input.workspaceDefinition,
    itemLabel: input.workspaceDefinition.itemLabel,
    defaultView: input.workspaceDefinition.defaultView,
    workspaceType: input.workspaceDefinition.workspaceType,
    instantiationNotes: input.workspaceDefinition.instantiationNotes,
    snapshotAt: new Date().toISOString(),
  };

  return [
    `blueprintKey: ${input.blueprintKey}`,
    `blueprintSource: ${input.blueprintSource}`,
    `operationKey: ${input.operation.key}`,
    `operationWorkspaceRole: ${input.role.key}`,
    `workspaceKind: ${roleMetadata.workspaceKind}`,
    roleMetadata.coreFlowKey ? `coreFlowKey: ${roleMetadata.coreFlowKey}` : null,
    roleMetadata.flowStageKey ? `flowStageKey: ${roleMetadata.flowStageKey}` : null,
    roleMetadata.flowStageOrder !== null
      ? `flowStageOrder: ${roleMetadata.flowStageOrder}`
      : null,
    `workspaceType: ${input.workspaceDefinition.workspaceType}`,
    `itemLabel: ${input.workspaceDefinition.itemLabel}`,
    `defaultView: ${input.workspaceDefinition.defaultView}`,
    input.workspaceDefinition.instantiationNotes
      ? `instantiationNotes: ${input.workspaceDefinition.instantiationNotes}`
      : null,
    `blueprintSnapshot: ${JSON.stringify(snapshot)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildOperationSpaceCreationPlan(input: {
  blueprintKey: string;
  blueprintName: string;
  blueprintSource: OperationBlueprintSource;
  workspaceDefinition: OperationPlanWorkspaceDefinition;
  operation: OperationalBlueprintContract | null | undefined;
  spaceTitle?: string | null;
}): OperationSpaceCreationPlan {
  const operation = input.operation ?? null;
  const validation = validateOperationalBlueprintContract(operation);
  const spaceTitle =
    clean(input.spaceTitle) ||
    clean(input.workspaceDefinition.defaultName) ||
    input.blueprintName;
  const base: OperationSpaceCreationPlan = {
    ok: Boolean(operation) && validation.ok,
    blueprintKey: input.blueprintKey,
    blueprintName: input.blueprintName,
    blueprintSource: input.blueprintSource,
    spaceTitle,
    validation,
    initialWorkspaces: [],
    deferredWorkspaces: [],
    manualWorkspaces: [],
    itemCount: 0,
  };

  if (!operation || !validation.ok) return base;

  for (const role of operation.workspaceRoles) {
    const { disposition, reason } = roleDisposition(role);
    const roleMetadata = roleWorkspaceMetadata({ operation, role });
    const item: OperationWorkspaceCreationPlanItem = {
      workspaceRole: role.key,
      ...roleMetadata,
      label: role.label,
      title: `${spaceTitle} - ${role.label}`,
      description: role.description || input.workspaceDefinition.defaultDescription,
      disposition,
      reason,
      snapshotNote: buildRoleSnapshotNote({
        blueprintKey: input.blueprintKey,
        blueprintName: input.blueprintName,
        blueprintSource: input.blueprintSource,
        workspaceDefinition: input.workspaceDefinition,
        operation,
        role,
      }),
    };

    if (disposition === "CREATE_INITIAL_WORKSPACE") {
      base.initialWorkspaces.push(item);
    } else if (disposition === "DEFER_UNTIL_BUSINESS_OBJECT") {
      base.deferredWorkspaces.push(item);
    } else {
      base.manualWorkspaces.push(item);
    }
  }

  return {
    ...base,
    itemCount:
      base.initialWorkspaces.length +
      base.deferredWorkspaces.length +
      base.manualWorkspaces.length,
  };
}
