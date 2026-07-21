import type { WorkTypeCoordinationContext } from "@/domains/task/server/work-type.types";

export type OperationalBlueprintCardinality =
  | "SINGLE_PER_ACTIVE_CYCLE"
  | "ONE_PER_BUSINESS_OBJECT"
  | "MANY_PER_ACTIVE_CYCLE";

export type OperationalBlueprintObjectRole = "WORKSPACE_IDENTITY" | "ITEM";

export type OperationalBlueprintWorkspaceKind =
  | "STANDALONE_WORKSPACE"
  | "FLOW_STAGE_WORKSPACE"
  | "CASE_WORKSPACE"
  | "BENCH_WORKSPACE";

export type OperationalBlueprintObjectType = {
  targetType: string;
  label: string;
  role: OperationalBlueprintObjectRole;
  description: string;
};

export type OperationalBlueprintWorkspaceRole = {
  key: string;
  label: string;
  workspaceKind?: OperationalBlueprintWorkspaceKind | null;
  cardinality: OperationalBlueprintCardinality;
  identityTargetType: string | null;
  itemTargetTypes: string[];
  description: string;
};

export type OperationalBlueprintCoreFlowStep = {
  workspaceRole: string;
  label: string;
  description: string;
  isEntry: boolean;
  isTerminal: boolean;
};

export type OperationalBlueprintCoreFlow = {
  key: string;
  label: string;
  description: string;
  steps: OperationalBlueprintCoreFlowStep[];
};

export type OperationalBlueprintEventRoute = {
  eventKey: string;
  targetType: string;
  workspaceRole: string;
  effect: "CREATE_WORKSPACE" | "BIND_ITEM" | "MOVE_ITEM" | "WRITE_ACTIVITY";
  description: string;
};

export type OperationalBlueprintActionField = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "select" | "multiselect" | "money" | "boolean" | "date";
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
};

export type OperationalBlueprintAction = {
  key: string;
  label: string;
  workspaceRole: string;
  targetType: string;
  command: string;
  fields: OperationalBlueprintActionField[];
  emits: string[];
  description: string;
};

export type OperationalBlueprintWorkflow = {
  key: string;
  workspaceRole: string;
  states: string[];
  transitions: Array<{
    from: string;
    to: string;
    actionKey: string;
    eventKey: string;
  }>;
};

export type OperationalBlueprintProjectionSubscription = {
  projectionKey: string;
  eventKeys: string[];
  resolvesToTargetType: string;
  description: string;
};

export type OperationalBlueprintSpaceViewMode = {
  key: string;
  label: string;
  rowModel:
    | "WORKSPACE"
    | "FLOW_STAGE_WORKSPACE"
    | "CASE_WORKSPACE"
    | "BUSINESS_ITEM"
    | "BENCH_WORKSPACE"
    | "STAGE_BUCKET";
  primaryTarget: "workspace" | "businessObject" | "stage";
  coreFlowKey?: string | null;
  workspaceRoles: string[];
  description: string;
};

export type OperationalBlueprintContract = {
  key: string;
  version: number;
  context: WorkTypeCoordinationContext;
  summary: string;
  objectTypes: OperationalBlueprintObjectType[];
  workspaceRoles: OperationalBlueprintWorkspaceRole[];
  coreFlows: OperationalBlueprintCoreFlow[];
  eventRoutes: OperationalBlueprintEventRoute[];
  actions: OperationalBlueprintAction[];
  workflows: OperationalBlueprintWorkflow[];
  projectionSubscriptions: OperationalBlueprintProjectionSubscription[];
  spaceViewModes?: OperationalBlueprintSpaceViewMode[];
};

export type OperationalBlueprintTemplate = {
  key: string;
  label: string;
  description: string;
  contract: OperationalBlueprintContract;
};

export type OperationalBlueprintValidationSeverity = "error" | "warning";

export type OperationalBlueprintValidationIssue = {
  severity: OperationalBlueprintValidationSeverity;
  code: string;
  path: string;
  message: string;
};

export type OperationalBlueprintValidationResult = {
  ok: boolean;
  errors: OperationalBlueprintValidationIssue[];
  warnings: OperationalBlueprintValidationIssue[];
  issueCount: number;
};

export type OperationalBlueprintActionSelectionInput = {
  contract?: OperationalBlueprintContract | null;
  workspaceRole?: string | null;
  targetTypes?: string[] | null;
};

export type OperationalBlueprintCoreFlowSelectionInput = {
  contract?: OperationalBlueprintContract | null;
  workspaceRole?: string | null;
};

function normalizeKey(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function normalizeEvent(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeTarget(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function workspaceKind(value: unknown): OperationalBlueprintWorkspaceKind | null {
  const normalized = normalizeTarget(value);
  if (
    normalized === "STANDALONE_WORKSPACE" ||
    normalized === "FLOW_STAGE_WORKSPACE" ||
    normalized === "CASE_WORKSPACE" ||
    normalized === "BENCH_WORKSPACE"
  ) {
    return normalized;
  }

  return null;
}

function inferredWorkspaceKind(input: {
  role: OperationalBlueprintWorkspaceRole;
  isInCoreFlow: boolean;
}): OperationalBlueprintWorkspaceKind {
  if (input.role.identityTargetType) return "CASE_WORKSPACE";

  if (input.role.workspaceKind) {
    return workspaceKind(input.role.workspaceKind) ?? "STANDALONE_WORKSPACE";
  }

  if (input.role.cardinality === "ONE_PER_BUSINESS_OBJECT") return "CASE_WORKSPACE";
  if (input.isInCoreFlow && input.role.cardinality === "SINGLE_PER_ACTIVE_CYCLE") {
    return "FLOW_STAGE_WORKSPACE";
  }
  if (input.role.cardinality === "MANY_PER_ACTIVE_CYCLE") return "BENCH_WORKSPACE";
  return "STANDALONE_WORKSPACE";
}

function issue(
  severity: OperationalBlueprintValidationSeverity,
  code: string,
  path: string,
  message: string,
): OperationalBlueprintValidationIssue {
  return { severity, code, path, message };
}

function duplicateIssues(input: {
  values: string[];
  path: string;
  label: string;
  normalize?: (value: string) => string;
}) {
  const normalize = input.normalize ?? ((value: string) => value);
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of input.values) {
    const key = normalize(value);
    if (!key) continue;
    if (seen.has(key)) {
      duplicates.add(value);
    }
    seen.add(key);
  }

  return [...duplicates].map((value) =>
    issue(
      "error",
      "duplicate_key",
      input.path,
      `${input.label} '${value}' is duplicated.`,
    ),
  );
}

export function validateOperationalBlueprintContract(
  contract: OperationalBlueprintContract | null | undefined,
): OperationalBlueprintValidationResult {
  if (!contract) {
    return {
      ok: true,
      errors: [],
      warnings: [],
      issueCount: 0,
    };
  }

  const issues: OperationalBlueprintValidationIssue[] = [];
  const objectTypes = new Set(
    contract.objectTypes.map((objectType) => normalizeTarget(objectType.targetType)).filter(Boolean),
  );
  const workspaceRoles = new Set(
    contract.workspaceRoles.map((role) => normalizeTarget(role.key)).filter(Boolean),
  );
  const coreFlowWorkspaceRoles = new Set(
    contract.coreFlows
      .flatMap((flow) => flow.steps.map((step) => step.workspaceRole))
      .map(normalizeTarget)
      .filter(Boolean),
  );
  const actionKeys = new Set(
    contract.actions.map((action) => normalizeKey(action.key)).filter(Boolean),
  );

  if (!contract.objectTypes.length) {
    issues.push(
      issue(
        "error",
        "missing_object_type",
        "objectTypes",
        "Operation must declare at least one business object type before it can create real workspace work.",
      ),
    );
  }

  if (!contract.workspaceRoles.length) {
    issues.push(
      issue(
        "error",
        "missing_workspace_role",
        "workspaceRoles",
        "Operation must declare at least one workspace role before it can create real Spaces.",
      ),
    );
  }

  if (!contract.coreFlows.length) {
    issues.push(
      issue(
        "error",
        "missing_core_flow",
        "coreFlows",
        "Operation must declare at least one core flow so generated workspaces have a usable path.",
      ),
    );
  }

  issues.push(
    ...duplicateIssues({
      values: contract.objectTypes.map((objectType) => objectType.targetType),
      path: "objectTypes",
      label: "Object target type",
      normalize: normalizeTarget,
    }),
    ...duplicateIssues({
      values: contract.workspaceRoles.map((role) => role.key),
      path: "workspaceRoles",
      label: "Workspace role",
      normalize: normalizeTarget,
    }),
    ...duplicateIssues({
      values: contract.coreFlows.map((flow) => flow.key),
      path: "coreFlows",
      label: "Core flow",
      normalize: normalizeKey,
    }),
    ...duplicateIssues({
      values: contract.eventRoutes.map((route) => `${route.eventKey}:${route.targetType}`),
      path: "eventRoutes",
      label: "Event route",
      normalize: normalizeEvent,
    }),
    ...duplicateIssues({
      values: contract.actions.map((action) => action.key),
      path: "actions",
      label: "Action",
      normalize: normalizeKey,
    }),
    ...duplicateIssues({
      values: contract.workflows.map((workflow) => workflow.key),
      path: "workflows",
      label: "Workflow",
      normalize: normalizeKey,
    }),
    ...duplicateIssues({
      values: contract.projectionSubscriptions.map(
        (subscription) => subscription.projectionKey,
      ),
      path: "projectionSubscriptions",
      label: "Projection subscription",
      normalize: normalizeKey,
    }),
  );

  contract.workspaceRoles.forEach((role, roleIndex) => {
    const roleKey = normalizeTarget(role.key);
    const explicitKind = workspaceKind(role.workspaceKind);
    const effectiveKind = inferredWorkspaceKind({
      role,
      isInCoreFlow: coreFlowWorkspaceRoles.has(roleKey),
    });
    const representedTargets = [
      role.identityTargetType,
      ...role.itemTargetTypes,
    ].map(normalizeTarget);

    if (role.workspaceKind && !explicitKind) {
      issues.push(
        issue(
          "error",
          "invalid_workspace_kind",
          `workspaceRoles.${roleIndex}.workspaceKind`,
          `Workspace role '${role.key}' uses unsupported workspaceKind '${role.workspaceKind}'.`,
        ),
      );
    }

    if (!role.workspaceKind) {
      issues.push(
        issue(
          "warning",
          "missing_workspace_kind",
          `workspaceRoles.${roleIndex}.workspaceKind`,
          `Workspace role '${role.key}' should declare workspaceKind explicitly. Current runtime will infer '${effectiveKind}'.`,
        ),
      );
    }

    if (
      coreFlowWorkspaceRoles.has(roleKey) &&
      role.cardinality === "SINGLE_PER_ACTIVE_CYCLE" &&
      effectiveKind !== "FLOW_STAGE_WORKSPACE"
    ) {
      issues.push(
        issue(
          "warning",
          "flow_stage_workspace_kind_mismatch",
          `workspaceRoles.${roleIndex}.workspaceKind`,
          `Workspace role '${role.key}' is a single-cycle core-flow stage and should use workspaceKind FLOW_STAGE_WORKSPACE.`,
        ),
      );
    }

    if (role.cardinality === "ONE_PER_BUSINESS_OBJECT" && effectiveKind !== "CASE_WORKSPACE") {
      issues.push(
        issue(
          "warning",
          "case_workspace_kind_mismatch",
          `workspaceRoles.${roleIndex}.workspaceKind`,
          `Workspace role '${role.key}' creates one Workspace per business object and should use workspaceKind CASE_WORKSPACE.`,
        ),
      );
    }

    if (effectiveKind === "CASE_WORKSPACE" && !normalizeTarget(role.identityTargetType)) {
      issues.push(
        issue(
          "warning",
          "case_workspace_missing_identity",
          `workspaceRoles.${roleIndex}.identityTargetType`,
          `CASE_WORKSPACE role '${role.key}' should declare identityTargetType so the Workspace identity is explicit.`,
        ),
      );
    }

    for (const targetType of representedTargets) {
      if (targetType && !objectTypes.has(targetType)) {
        issues.push(
          issue(
            "error",
            "unknown_object_target",
            `workspaceRoles.${roleIndex}`,
            `Workspace role '${role.key}' references unknown target type '${targetType}'.`,
          ),
        );
      }
    }
  });

  for (const objectType of contract.objectTypes) {
    const targetType = normalizeTarget(objectType.targetType);
    const represented = contract.workspaceRoles.some(
      (role) =>
        normalizeTarget(role.identityTargetType) === targetType ||
        role.itemTargetTypes.some((itemTargetType) => normalizeTarget(itemTargetType) === targetType),
    );

    if (targetType && !represented) {
      issues.push(
        issue(
          "error",
          "unrepresented_object_target",
          "objectTypes",
          `Object target type '${objectType.targetType}' is not represented by any workspace role.`,
        ),
      );
    }
  }

  contract.coreFlows.forEach((flow, flowIndex) => {
    const flowStageRoles = flow.steps
      .map((step) => contract.workspaceRoles.find(
        (role) => normalizeTarget(role.key) === normalizeTarget(step.workspaceRole),
      ))
      .filter((role): role is OperationalBlueprintWorkspaceRole => Boolean(role))
      .filter((role) =>
        inferredWorkspaceKind({
          role,
          isInCoreFlow: true,
        }) === "FLOW_STAGE_WORKSPACE",
      );
    const hasFlowStageViewMode = (contract.spaceViewModes ?? []).some(
      (mode) =>
        mode.rowModel === "FLOW_STAGE_WORKSPACE" &&
        normalizeKey(mode.coreFlowKey) === normalizeKey(flow.key),
    );

    if (flowStageRoles.length && !hasFlowStageViewMode) {
      issues.push(
        issue(
          "warning",
          "missing_flow_stage_space_view_mode",
          `coreFlows.${flowIndex}`,
          `Core flow '${flow.key}' has FLOW_STAGE_WORKSPACE roles but no matching FLOW_STAGE_WORKSPACE Space view mode.`,
        ),
      );
    }

    flow.steps.forEach((step, stepIndex) => {
      const workspaceRole = normalizeTarget(step.workspaceRole);
      if (!workspaceRoles.has(workspaceRole)) {
        issues.push(
          issue(
            "error",
            "missing_workspace_role",
            `coreFlows.${flowIndex}.steps.${stepIndex}`,
            `Core flow '${flow.key}' references missing workspace role '${step.workspaceRole}'.`,
          ),
        );
      }
    });
  });

  contract.eventRoutes.forEach((route, routeIndex) => {
    if (!workspaceRoles.has(normalizeTarget(route.workspaceRole))) {
      issues.push(
        issue(
          "error",
          "missing_workspace_role",
          `eventRoutes.${routeIndex}`,
          `Event route '${route.eventKey}' references missing workspace role '${route.workspaceRole}'.`,
        ),
      );
    }

    if (!objectTypes.has(normalizeTarget(route.targetType))) {
      issues.push(
        issue(
          "error",
          "unknown_object_target",
          `eventRoutes.${routeIndex}`,
          `Event route '${route.eventKey}' references unknown target type '${route.targetType}'.`,
        ),
      );
    }
  });

  contract.actions.forEach((action, actionIndex) => {
    if (!workspaceRoles.has(normalizeTarget(action.workspaceRole))) {
      issues.push(
        issue(
          "error",
          "missing_workspace_role",
          `actions.${actionIndex}`,
          `Action '${action.key}' references missing workspace role '${action.workspaceRole}'.`,
        ),
      );
    }

    if (!objectTypes.has(normalizeTarget(action.targetType))) {
      issues.push(
        issue(
          "error",
          "unknown_object_target",
          `actions.${actionIndex}`,
          `Action '${action.key}' references unknown target type '${action.targetType}'.`,
        ),
      );
    }

    issues.push(
      ...duplicateIssues({
        values: action.fields.map((field) => field.key),
        path: `actions.${actionIndex}.fields`,
        label: `Action '${action.key}' field`,
        normalize: normalizeKey,
      }),
    );

  });

  contract.workflows.forEach((workflow, workflowIndex) => {
    const states = new Set(workflow.states.map(normalizeTarget).filter(Boolean));

    if (!workspaceRoles.has(normalizeTarget(workflow.workspaceRole))) {
      issues.push(
        issue(
          "error",
          "missing_workspace_role",
          `workflows.${workflowIndex}`,
          `Workflow '${workflow.key}' references missing workspace role '${workflow.workspaceRole}'.`,
        ),
      );
    }

    workflow.transitions.forEach((transition, transitionIndex) => {
      if (!states.has(normalizeTarget(transition.from))) {
        issues.push(
          issue(
            "error",
            "unknown_workflow_state",
            `workflows.${workflowIndex}.transitions.${transitionIndex}`,
            `Workflow '${workflow.key}' transition references missing from-state '${transition.from}'.`,
          ),
        );
      }

      if (!states.has(normalizeTarget(transition.to))) {
        issues.push(
          issue(
            "error",
            "unknown_workflow_state",
            `workflows.${workflowIndex}.transitions.${transitionIndex}`,
            `Workflow '${workflow.key}' transition references missing to-state '${transition.to}'.`,
          ),
        );
      }

      if (!actionKeys.has(normalizeKey(transition.actionKey))) {
        issues.push(
          issue(
            "error",
            "missing_action",
            `workflows.${workflowIndex}.transitions.${transitionIndex}`,
            `Workflow '${workflow.key}' transition references missing action '${transition.actionKey}'.`,
          ),
        );
      }
    });
  });

  contract.projectionSubscriptions.forEach((subscription, subscriptionIndex) => {
    if (!clean(subscription.projectionKey)) {
      issues.push(
        issue(
          "error",
          "missing_projection_key",
          `projectionSubscriptions.${subscriptionIndex}`,
          "Projection subscription is missing projectionKey.",
        ),
      );
    }

    if (!subscription.eventKeys.length) {
      issues.push(
        issue(
          "error",
          "empty_projection_events",
          `projectionSubscriptions.${subscriptionIndex}.eventKeys`,
          `Projection subscription '${subscription.projectionKey}' has no event keys.`,
        ),
      );
    }
  });

  const errors = issues.filter((item) => item.severity === "error");
  const warnings = issues.filter((item) => item.severity === "warning");

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    issueCount: issues.length,
  };
}

const SERVICE_OPERATION_CONTRACT: OperationalBlueprintContract = {
  key: "service-operation",
  version: 2,
  context: "TECHNICAL",
  summary:
    "Creates SR case workspaces and routes Technical Issues through Inspect, Processing, and Done/Follow-up operation workspaces.",
  objectTypes: [
    {
      targetType: "SERVICE_REQUEST",
      label: "Service Request",
      role: "WORKSPACE_IDENTITY",
      description:
        "Identifies the SR case workspace. It is not rendered as a queue item inside that workspace.",
    },
    {
      targetType: "TECHNICAL_ISSUE",
      label: "Technical Issue",
      role: "ITEM",
      description:
        "The operational item that moves through Inspect, Processing, and Done/Follow-up.",
    },
    {
      targetType: "PAYMENT",
      label: "Payment",
      role: "ITEM",
      description:
        "Commercial follow-up created after technical work needs customer payment.",
    },
  ],
  workspaceRoles: [
    {
      key: "SR_CASE",
      workspaceKind: "CASE_WORKSPACE",
      label: "SR Case",
      cardinality: "ONE_PER_BUSINESS_OBJECT",
      identityTargetType: "SERVICE_REQUEST",
      itemTargetTypes: ["TECHNICAL_ISSUE", "PAYMENT"],
      description:
        "One workspace per active Service Request. Shows case context and the TI/payment items belonging to that SR.",
    },
    {
      key: "INSPECT",
      workspaceKind: "FLOW_STAGE_WORKSPACE",
      label: "Inspect",
      cardinality: "SINGLE_PER_ACTIVE_CYCLE",
      identityTargetType: null,
      itemTargetTypes: ["TECHNICAL_ISSUE"],
      description:
        "Receives newly created Technical Issues and lets technical staff classify the real work, vendor, estimate, and next step.",
    },
    {
      key: "PROCESSING",
      workspaceKind: "FLOW_STAGE_WORKSPACE",
      label: "Processing",
      cardinality: "SINGLE_PER_ACTIVE_CYCLE",
      identityTargetType: null,
      itemTargetTypes: ["TECHNICAL_ISSUE"],
      description:
        "Owns Ready, In Progress, and Done workflow actions while vendor, cost, and extra TI changes are managed through modals.",
    },
    {
      key: "DONE",
      workspaceKind: "FLOW_STAGE_WORKSPACE",
      label: "Done / Follow-up",
      cardinality: "SINGLE_PER_ACTIVE_CYCLE",
      identityTargetType: null,
      itemTargetTypes: ["TECHNICAL_ISSUE", "PAYMENT"],
      description:
        "Tracks completed technical issues, payment readiness, and SR closure follow-up.",
    },
  ],
  coreFlows: [
    {
      key: "service-operation-core-flow",
      label: "Service Operation Core Flow",
      description:
        "Links Inspect, Processing, and Done/Follow-up workspaces for Technical Issue stage movement. SR case workspaces stay in the separate SR Cases mode.",
      steps: [
        {
          workspaceRole: "INSPECT",
          label: "Inspect",
          description: "Technical inspection and classification workspace.",
          isEntry: true,
          isTerminal: false,
        },
        {
          workspaceRole: "PROCESSING",
          label: "Processing",
          description:
            "Technical processing workspace that owns Ready, In Progress, and completion actions.",
          isEntry: false,
          isTerminal: false,
        },
        {
          workspaceRole: "DONE",
          label: "Done / Follow-up",
          description: "Completion, payment follow-up, and closure workspace.",
          isEntry: false,
          isTerminal: true,
        },
      ],
    },
  ],
  spaceViewModes: [
    {
      key: "service-operation-flow",
      label: "Service Operation Flow",
      rowModel: "FLOW_STAGE_WORKSPACE",
      primaryTarget: "workspace",
      coreFlowKey: "service-operation-core-flow",
      workspaceRoles: ["INSPECT", "PROCESSING", "DONE"],
      description:
        "Renders the ordered Technical Issue operation stages while SR cases can stay in a separate case view.",
    },
    {
      key: "sr-cases",
      label: "SR Cases",
      rowModel: "CASE_WORKSPACE",
      primaryTarget: "workspace",
      workspaceRoles: ["SR_CASE"],
      description:
        "Renders one Workspace row per Service Request case.",
    },
  ],
  eventRoutes: [
    {
      eventKey: "service_request.created",
      targetType: "SERVICE_REQUEST",
      workspaceRole: "SR_CASE",
      effect: "CREATE_WORKSPACE",
      description: "Creates or reuses the SR case workspace for the Service Request.",
    },
    {
      eventKey: "technical_issue.created",
      targetType: "TECHNICAL_ISSUE",
      workspaceRole: "INSPECT",
      effect: "BIND_ITEM",
      description: "Places a new technical suspicion into the Inspect workspace.",
    },
    {
      eventKey: "technical_issue.confirmed",
      targetType: "TECHNICAL_ISSUE",
      workspaceRole: "PROCESSING",
      effect: "MOVE_ITEM",
      description: "Moves a classified issue into Processing as Ready work.",
    },
    {
      eventKey: "technical_issue.started",
      targetType: "TECHNICAL_ISSUE",
      workspaceRole: "PROCESSING",
      effect: "MOVE_ITEM",
      description: "Keeps started technical work in Processing.",
    },
    {
      eventKey: "technical_issue.completed",
      targetType: "TECHNICAL_ISSUE",
      workspaceRole: "DONE",
      effect: "MOVE_ITEM",
      description: "Moves completed technical work to Done/Follow-up.",
    },
    {
      eventKey: "payment.created",
      targetType: "PAYMENT",
      workspaceRole: "DONE",
      effect: "BIND_ITEM",
      description: "Shows payment follow-up created from completed technical work.",
    },
  ],
  actions: [
    {
      key: "watch_intake_with_suspicion",
      label: "Create Service Request",
      workspaceRole: "SR_CASE",
      targetType: "SERVICE_REQUEST",
      command: "service.watchIntakeWithInitialIssue",
      emits: ["service_request.created", "technical_issue.created"],
      description:
        "Creates or opens the active SR case for a watch and requires the first technical suspicion so the SR is not empty.",
      fields: [
        {
          key: "suspicion",
          label: "Technical suspicion",
          kind: "textarea",
          required: true,
        },
      ],
    },
    {
      key: "create_technical_issue",
      label: "Create TI",
      workspaceRole: "SR_CASE",
      targetType: "TECHNICAL_ISSUE",
      command: "service.createTechnicalIssue",
      emits: ["technical_issue.created"],
      description: "Adds another Technical Issue to the SR case.",
      fields: [
        { key: "summary", label: "Summary", kind: "text", required: true },
        { key: "note", label: "Note", kind: "textarea", required: false },
      ],
    },
    {
      key: "classify_technical_issue",
      label: "Phân loại lỗi",
      workspaceRole: "INSPECT",
      targetType: "TECHNICAL_ISSUE",
      command: "service.confirmTechnicalIssue",
      emits: ["technical_issue.confirmed"],
      description:
        "Xác nhận nghi vấn thành lỗi kỹ thuật cần xử lý.",
      fields: [
        { key: "summary", label: "Mo ta loi da chuan hoa", kind: "text", required: true },
        { key: "note", label: "Ghi chu ky thuat", kind: "textarea", required: false },
        {
          key: "technicalArea",
          label: "Nhóm kỹ thuật",
          kind: "select",
          required: true,
          options: [
            { value: "GENERAL", label: "Tổng quát" },
            { value: "MOVEMENT", label: "Máy" },
            { value: "CASE", label: "Vỏ" },
            { value: "CRYSTAL", label: "Kính" },
            { value: "BRACELET", label: "Dây / bracelet" },
            { value: "CROWN", label: "Núm" },
            { value: "HANDS_MARKERS", label: "Kim cọc" },
          ],
        },
        {
          key: "assigneeMode",
          label: "Người xử lý",
          kind: "select",
          required: true,
          options: [
            { value: "INTERNAL", label: "Nội bộ" },
            { value: "VENDOR", label: "Vendor" },
          ],
        },
        { key: "vendorId", label: "Vendor", kind: "select", required: false },
        { key: "estimatedCost", label: "Chi phí dự kiến", kind: "money", required: false },
      ],
    },
    {
      key: "close_no_issue",
      label: "Không có vấn đề",
      workspaceRole: "INSPECT",
      targetType: "TECHNICAL_ISSUE",
      command: "service.closeTechnicalIssueNoIssue",
      emits: ["technical_issue.completed"],
      description:
        "Kết thúc kiểm tra khi không phát hiện lỗi cần xử lý.",
      fields: [
        {
          key: "resolutionNote",
          label: "Ghi chú kiểm tra",
          kind: "textarea",
          required: true,
        },
      ],
    },
    {
      key: "start_processing",
      label: "Bắt đầu xử lý",
      workspaceRole: "PROCESSING",
      targetType: "TECHNICAL_ISSUE",
      command: "service.startTechnicalIssue",
      emits: ["technical_issue.started"],
      description: "Bắt đầu xử lý kỹ thuật và ghi nhận vendor, chi tiết kỹ thuật, chi phí dự kiến.",
      fields: [
        {
          key: "technicalDetailCatalogId",
          label: "Chi tiết kỹ thuật",
          kind: "text",
          required: true,
        },
        {
          key: "replacementPartCodes",
          label: "Linh kiện máy cần thay",
          kind: "multiselect",
          required: true,
          options: [
            { value: "MOVEMENT_COMPLETE", label: "Thay nguyên máy" },
            { value: "MAINSPRING", label: "Thay cót" },
            { value: "GEAR", label: "Thay bánh răng" },
            { value: "BALANCE_WHEEL", label: "Thay vành tóc" },
            { value: "BALANCE_STAFF", label: "Thay trụ tóc" },
            { value: "HAIRSPRING", label: "Thay cả dây tóc" },
          ],
        },
        {
          key: "actionMode",
          label: "Hình thức xử lý",
          kind: "select",
          required: true,
          options: [
            { value: "INTERNAL", label: "Nội bộ" },
            { value: "VENDOR", label: "Vendor" },
          ],
        },
        { key: "vendorId", label: "Vendor", kind: "select", required: false },
        { key: "estimatedCost", label: "Chi phí dự kiến", kind: "money", required: false },
        { key: "startedNote", label: "Ghi chú bắt đầu", kind: "textarea", required: false },
      ],
    },
    {
      key: "complete_processing",
      label: "Hoàn tất xử lý",
      workspaceRole: "PROCESSING",
      targetType: "TECHNICAL_ISSUE",
      command: "service.completeTechnicalIssue",
      emits: ["technical_issue.completed", "payment.created"],
      description:
        "Hoàn tất xử lý kỹ thuật, ghi nhận chi phí thực tế và tạo khoản thanh toán nếu cần.",
      fields: [
        { key: "actualCost", label: "Chi phí thực tế", kind: "money", required: true },
        { key: "resolutionNote", label: "Ghi chú xử lý", kind: "textarea", required: false },
        { key: "createPayment", label: "Tạo khoản thanh toán chưa trả", kind: "boolean", required: false },
      ],
    },
    {
      key: "cancel_processing",
      label: "Hủy xử lý",
      workspaceRole: "PROCESSING",
      targetType: "TECHNICAL_ISSUE",
      command: "service.cancelTechnicalIssue",
      emits: ["technical_issue.canceled"],
      description:
        "Hủy xử lý kỹ thuật, ghi nhận lý do hủy và chuyển hồ sơ sang Done / Follow-up.",
      fields: [
        { key: "cancelReason", label: "Lý do hủy", kind: "textarea", required: true },
      ],
    },
    {
      key: "raise_follow_up_issue",
      label: "Raise follow-up TI",
      workspaceRole: "PROCESSING",
      targetType: "TECHNICAL_ISSUE",
      command: "service.createTechnicalIssue",
      emits: ["technical_issue.created"],
      description:
        "Creates another Technical Issue from work discovered during processing.",
      fields: [
        { key: "summary", label: "Summary", kind: "text", required: true },
        { key: "note", label: "Reason", kind: "textarea", required: false },
      ],
    },
  ],
  workflows: [
    {
      key: "service-operation-technical-bench",
      workspaceRole: "PROCESSING",
      states: ["READY", "IN_PROGRESS", "DONE"],
      transitions: [
        {
          from: "READY",
          to: "IN_PROGRESS",
          actionKey: "start_processing",
          eventKey: "technical_issue.started",
        },
        {
          from: "IN_PROGRESS",
          to: "DONE",
          actionKey: "complete_processing",
          eventKey: "technical_issue.completed",
        },
        {
          from: "IN_PROGRESS",
          to: "DONE",
          actionKey: "cancel_processing",
          eventKey: "technical_issue.canceled",
        },
      ],
    },
  ],
  projectionSubscriptions: [
    {
      projectionKey: "watch-list",
      eventKeys: [
        "service_request.created",
        "service_request.status_changed",
        "technical_issue.created",
        "technical_issue.confirmed",
        "technical_issue.started",
        "technical_issue.completed",
        "technical_issue.canceled",
        "payment.created",
        "payment.status_updated",
      ],
      resolvesToTargetType: "WATCH",
      description:
        "Service Operation events must refresh the Watch List row because service state is visible from Watch.",
    },
  ],
};

const PAYMENT_COLLECTION_CONTRACT: OperationalBlueprintContract = {
  key: "payment-collection",
  version: 1,
  context: "PAYMENT",
  summary:
    "Routes Payment records through collection review, settlement, and exception follow-up without moving payment truth out of the Payment domain.",
  objectTypes: [
    {
      targetType: "PAYMENT",
      label: "Payment",
      role: "ITEM",
      description:
        "The payment domain record that owns amount, method, direction, status, and settlement facts.",
    },
  ],
  workspaceRoles: [
    {
      key: "PAYMENT_REVIEW",
      workspaceKind: "FLOW_STAGE_WORKSPACE",
      label: "Payment Review",
      cardinality: "SINGLE_PER_ACTIVE_CYCLE",
      identityTargetType: null,
      itemTargetTypes: ["PAYMENT"],
      description:
        "Owns verification, method confirmation, and settlement readiness before a payment is marked paid.",
    },
    {
      key: "PAYMENT_SETTLED",
      workspaceKind: "FLOW_STAGE_WORKSPACE",
      label: "Settled / Exception",
      cardinality: "SINGLE_PER_ACTIVE_CYCLE",
      identityTargetType: null,
      itemTargetTypes: ["PAYMENT"],
      description:
        "Tracks paid, canceled, failed, or exception payments for follow-up and downstream closure.",
    },
  ],
  coreFlows: [
    {
      key: "payment-collection-core-flow",
      label: "Payment Collection Core Flow",
      description:
        "Links payment intake, review, and settlement workspaces for the Payment team.",
      steps: [
        {
          workspaceRole: "PAYMENT_REVIEW",
          label: "Cần đối soát",
          description: "Payment team verifies amount, method, and settlement readiness.",
          isEntry: true,
          isTerminal: false,
        },
        {
          workspaceRole: "PAYMENT_SETTLED",
          label: "Settled / Exception",
          description: "Paid and exception payments are kept visible for follow-up.",
          isEntry: false,
          isTerminal: true,
        },
      ],
    },
  ],
  spaceViewModes: [
    {
      key: "payment-collection-flow",
      label: "Payment Collection Flow",
      rowModel: "FLOW_STAGE_WORKSPACE",
      primaryTarget: "workspace",
      coreFlowKey: "payment-collection-core-flow",
      workspaceRoles: ["PAYMENT_REVIEW", "PAYMENT_SETTLED"],
      description:
        "Renders Payment records as items inside ordered collection stage Workspaces.",
    },
  ],
  eventRoutes: [
    {
      eventKey: "payment.created",
      targetType: "PAYMENT",
      workspaceRole: "PAYMENT_REVIEW",
      effect: "BIND_ITEM",
      description:
        "Places a newly created payment directly into Payment Review for reconciliation.",
    },
    {
      eventKey: "payment.paid",
      targetType: "PAYMENT",
      workspaceRole: "PAYMENT_SETTLED",
      effect: "MOVE_ITEM",
      description:
        "Moves paid payment records into Settled / Exception for closure follow-up.",
    },
    {
      eventKey: "payment.exception_marked",
      targetType: "PAYMENT",
      workspaceRole: "PAYMENT_SETTLED",
      effect: "MOVE_ITEM",
      description: "Moves an exception Payment into settlement follow-up without marking it paid.",
    },
  ],
  actions: [
    {
      key: "reconcile_payment",
      label: "Đối soát payment",
      workspaceRole: "PAYMENT_REVIEW",
      targetType: "PAYMENT",
      command: "payment.completePayment",
      emits: ["payment.paid", "payment.status_updated"],
      description:
        "Đối soát đầy đủ chứng từ, số tiền và đối tác trước khi xác nhận khoản Thu/Chi hoàn tất.",
      fields: [
        { key: "reviewedAmount", label: "Số tiền đối soát", kind: "money", required: true },
        { key: "method", label: "Phương thức", kind: "select", required: true, options: [
          { value: "BANK_TRANSFER", label: "Chuyển khoản" },
          { value: "CASH", label: "Tiền mặt" },
          { value: "COD", label: "COD" },
          { value: "CREDIT_CARD", label: "Thẻ" },
          { value: "MOMO", label: "MoMo" },
          { value: "PAYPAL", label: "PayPal" },
        ] },
        { key: "occurredAt", label: "Ngày dự kiến / ngày giao dịch", kind: "date", required: true },
        { key: "transactionReference", label: "Mã giao dịch / chứng từ", kind: "text", required: false },
        { key: "counterparty", label: "Người / đơn vị giao nhận tiền", kind: "text", required: true },
        { key: "contact", label: "Thông tin liên hệ", kind: "text", required: false },
        { key: "reconciliationResult", label: "Kết quả đối soát", kind: "select", required: true, options: [
          { value: "MATCHED", label: "Khớp đủ" },
          { value: "PARTIAL", label: "Thiếu / một phần" },
          { value: "OVERPAID", label: "Thừa tiền" },
          { value: "PENDING_EVIDENCE", label: "Chờ chứng từ" },
          { value: "DISPUTED", label: "Có tranh chấp" },
        ] },
        { key: "evidenceReference", label: "Link / mã chứng từ đối soát", kind: "text", required: false },
        { key: "followUpDueAt", label: "Hạn cần hối", kind: "date", required: false },
        { key: "reviewNote", label: "Ghi chú đối soát", kind: "textarea", required: false },
      ],
    },
    {
      key: "mark_payment_exception",
      label: "Mark exception",
      workspaceRole: "PAYMENT_REVIEW",
      targetType: "PAYMENT",
      command: "payment.markException",
      emits: ["payment.exception_marked"],
      description:
        "Moves a payment into exception follow-up when settlement cannot be completed normally.",
      fields: [
        { key: "reason", label: "Reason", kind: "textarea", required: true },
      ],
    },
  ],
  workflows: [
    {
      key: "payment-collection-workflow",
      workspaceRole: "PAYMENT_REVIEW",
      states: ["READY", "PAID", "EXCEPTION"],
      transitions: [
        {
          from: "READY",
          to: "PAID",
          actionKey: "reconcile_payment",
          eventKey: "payment.paid",
        },
        {
          from: "READY",
          to: "EXCEPTION",
          actionKey: "mark_payment_exception",
          eventKey: "payment.exception_marked",
        },
      ],
    },
  ],
  projectionSubscriptions: [
    {
      projectionKey: "payment-owner-summary",
      eventKeys: ["payment.created", "payment.status_updated", "payment.paid", "payment.refunded", "payment.exception_marked"],
      resolvesToTargetType: "PAYMENT_OWNER",
      description: "Payment owns settlement totals and publishes owner summaries for downstream domains.",
    },
  ],
};

const BLANK_OPERATION_CONTRACT: OperationalBlueprintContract = {
  key: "blank-operation",
  version: 1,
  context: "DRAFT",
  summary: "A minimal editable operation model shell for a new Blueprint draft.",
  objectTypes: [],
  workspaceRoles: [],
  coreFlows: [],
  eventRoutes: [],
  actions: [],
  workflows: [],
  projectionSubscriptions: [],
};

function cloneContract(
  contract: OperationalBlueprintContract,
): OperationalBlueprintContract {
  return JSON.parse(JSON.stringify(contract)) as OperationalBlueprintContract;
}

export function listOperationalBlueprintTemplates(): OperationalBlueprintTemplate[] {
  return [
    {
      key: "service-operation",
      label: "Service Operation",
      description:
        "Start from the Technical Service Operation model with SR case, Inspect, Processing, and Done/Follow-up roles.",
      contract: cloneContract(SERVICE_OPERATION_CONTRACT),
    },
    {
      key: "payment-collection",
      label: "Payment Collection",
      description:
        "Start from the Payment Collection proof with inbox, review, and settled/exception roles.",
      contract: cloneContract(PAYMENT_COLLECTION_CONTRACT),
    },
    {
      key: "blank-operation",
      label: "Blank Operation",
      description:
        "Start with an empty operation shell and add roles, events, actions, and workflows manually.",
      contract: cloneContract(BLANK_OPERATION_CONTRACT),
    },
  ];
}

export function operationalBlueprintTemplateByKey(
  key: string,
): OperationalBlueprintTemplate | null {
  return (
    listOperationalBlueprintTemplates().find(
      (template) => normalizeKey(template.key) === normalizeKey(key),
    ) ?? null
  );
}

export function operationalBlueprintForWorkType(input: {
  workTypeKey: string;
  coordinationContext: WorkTypeCoordinationContext | "DRAFT";
}): OperationalBlueprintContract | null {
  if (
    input.coordinationContext === "TECHNICAL" &&
    normalizeKey(input.workTypeKey) === "service-operation"
  ) {
    return SERVICE_OPERATION_CONTRACT;
  }

  if (
    input.coordinationContext === "PAYMENT" &&
    normalizeKey(input.workTypeKey) === "payment"
  ) {
    return PAYMENT_COLLECTION_CONTRACT;
  }

  return null;
}

export function operationalEventRouteForWorkType(input: {
  workTypeKey: string;
  coordinationContext: WorkTypeCoordinationContext | "DRAFT";
  eventKey: string;
  targetType: string;
}): OperationalBlueprintEventRoute | null {
  const contract = operationalBlueprintForWorkType({
    workTypeKey: input.workTypeKey,
    coordinationContext: input.coordinationContext,
  });

  if (!contract) return null;

  return (
    contract.eventRoutes.find(
      (route) =>
        normalizeEvent(route.eventKey) === normalizeEvent(input.eventKey) &&
        normalizeTarget(route.targetType) === normalizeTarget(input.targetType),
    ) ?? null
  );
}

export function operationalWorkspaceRoleExists(input: {
  workTypeKey: string;
  coordinationContext: WorkTypeCoordinationContext | "DRAFT";
  workspaceRole: string;
}) {
  const contract = operationalBlueprintForWorkType({
    workTypeKey: input.workTypeKey,
    coordinationContext: input.coordinationContext,
  });

  if (!contract) return false;

  return contract.workspaceRoles.some(
    (role) => normalizeTarget(role.key) === normalizeTarget(input.workspaceRole),
  );
}

export function operationalCoreFlowsForWorkspaceRole(input: {
  workTypeKey: string;
  coordinationContext: WorkTypeCoordinationContext | "DRAFT";
  workspaceRole: string;
}): OperationalBlueprintCoreFlow[] {
  const contract = operationalBlueprintForWorkType({
    workTypeKey: input.workTypeKey,
    coordinationContext: input.coordinationContext,
  });

  if (!contract) return [];

  return contract.coreFlows.filter((flow) =>
    flow.steps.some(
      (step) =>
        normalizeTarget(step.workspaceRole) === normalizeTarget(input.workspaceRole),
    ),
  );
}

export function selectOperationalActionsForWorkspaceRole(
  input: OperationalBlueprintActionSelectionInput,
): OperationalBlueprintAction[] {
  const workspaceRole = normalizeTarget(input.workspaceRole);
  if (!input.contract || !workspaceRole) return [];

  const targetTypes = new Set(
    (input.targetTypes ?? []).map((targetType) => normalizeTarget(targetType)).filter(Boolean),
  );

  return input.contract.actions.filter((action) => {
    if (normalizeTarget(action.workspaceRole) !== workspaceRole) return false;
    if (!targetTypes.size) return true;
    return targetTypes.has(normalizeTarget(action.targetType));
  });
}

export function selectOperationalCoreFlowForWorkspaceRole(
  input: OperationalBlueprintCoreFlowSelectionInput,
): OperationalBlueprintCoreFlow | null {
  const workspaceRole = normalizeTarget(input.workspaceRole);
  if (!input.contract || !workspaceRole) return null;

  const role = input.contract.workspaceRoles.find(
    (item) => normalizeTarget(item.key) === workspaceRole,
  );
  const matchingCoreFlow = input.contract.coreFlows.find((flow) =>
    flow.steps.some(
      (step) => normalizeTarget(step.workspaceRole) === workspaceRole,
    ),
  );
  if (!matchingCoreFlow || !role) return null;
  if (
    inferredWorkspaceKind({
      role,
      isInCoreFlow: true,
    }) !== "FLOW_STAGE_WORKSPACE"
  ) {
    return null;
  }

  return matchingCoreFlow;
}

export function serviceOperationWorkspaceRoleForStage(stage: string) {
  if (stage === "INSPECT") return "INSPECT";
  if (stage === "DONE") return "DONE";
  return "PROCESSING";
}
