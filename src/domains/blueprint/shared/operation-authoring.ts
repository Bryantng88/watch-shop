import type {
  OperationalBlueprintAction,
  OperationalBlueprintActionField,
  OperationalBlueprintContract,
  OperationalBlueprintCoreFlow,
  OperationalBlueprintEventRoute,
  OperationalBlueprintObjectType,
  OperationalBlueprintProjectionSubscription,
  OperationalBlueprintWorkspaceRole,
  OperationalBlueprintWorkflow,
} from "./operational-blueprint";
import {
  DEFAULT_OPERATION_TARGET_TYPE,
  operationTargetTypeOption,
} from "./operation-target-types";

export type OperationalBlueprintListSection =
  | "objectTypes"
  | "workspaceRoles"
  | "coreFlows"
  | "eventRoutes"
  | "actions"
  | "workflows"
  | "projectionSubscriptions";

type OperationalBlueprintListItemMap = {
  objectTypes: OperationalBlueprintObjectType;
  workspaceRoles: OperationalBlueprintWorkspaceRole;
  coreFlows: OperationalBlueprintCoreFlow;
  eventRoutes: OperationalBlueprintEventRoute;
  actions: OperationalBlueprintAction;
  workflows: OperationalBlueprintWorkflow;
  projectionSubscriptions: OperationalBlueprintProjectionSubscription;
};

export function cloneOperationalBlueprintContract(
  contract: OperationalBlueprintContract,
): OperationalBlueprintContract {
  return JSON.parse(JSON.stringify(contract)) as OperationalBlueprintContract;
}

export function patchOperationRoot(
  contract: OperationalBlueprintContract,
  patch: Partial<
    Pick<OperationalBlueprintContract, "key" | "version" | "context" | "summary">
  >,
): OperationalBlueprintContract {
  return {
    ...contract,
    ...patch,
  };
}

export function patchOperationListItem<
  TSection extends OperationalBlueprintListSection,
>(
  contract: OperationalBlueprintContract,
  section: TSection,
  index: number,
  patch: Partial<OperationalBlueprintListItemMap[TSection]>,
): OperationalBlueprintContract {
  const items = contract[section] as OperationalBlueprintListItemMap[TSection][];

  return {
    ...contract,
    [section]: items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    ),
  };
}

export function appendOperationListItem<
  TSection extends OperationalBlueprintListSection,
>(
  contract: OperationalBlueprintContract,
  section: TSection,
  item: OperationalBlueprintListItemMap[TSection],
): OperationalBlueprintContract {
  const items = contract[section] as OperationalBlueprintListItemMap[TSection][];

  return {
    ...contract,
    [section]: [...items, item],
  };
}

export function removeOperationListItem(
  contract: OperationalBlueprintContract,
  section: OperationalBlueprintListSection,
  index: number,
): OperationalBlueprintContract {
  const items = contract[section];

  return {
    ...contract,
    [section]: items.filter((_, itemIndex) => itemIndex !== index),
  };
}

export function patchOperationActionField(
  contract: OperationalBlueprintContract,
  actionIndex: number,
  fieldIndex: number,
  patch: Partial<OperationalBlueprintActionField>,
): OperationalBlueprintContract {
  return {
    ...contract,
    actions: contract.actions.map((action, index) => {
      if (index !== actionIndex) return action;

      return {
        ...action,
        fields: action.fields.map((field, nestedIndex) =>
          nestedIndex === fieldIndex ? { ...field, ...patch } : field,
        ),
      };
    }),
  };
}

export function appendOperationActionField(
  contract: OperationalBlueprintContract,
  actionIndex: number,
  field: OperationalBlueprintActionField,
): OperationalBlueprintContract {
  return {
    ...contract,
    actions: contract.actions.map((action, index) => {
      if (index !== actionIndex) return action;

      return {
        ...action,
        fields: [...action.fields, field],
      };
    }),
  };
}

export function removeOperationActionField(
  contract: OperationalBlueprintContract,
  actionIndex: number,
  fieldIndex: number,
): OperationalBlueprintContract {
  return {
    ...contract,
    actions: contract.actions.map((action, index) => {
      if (index !== actionIndex) return action;

      return {
        ...action,
        fields: action.fields.filter((_, nestedIndex) => nestedIndex !== fieldIndex),
      };
    }),
  };
}

export function retargetOperationObjectType(
  contract: OperationalBlueprintContract,
  objectTypeIndex: number,
  nextTargetType: string,
): OperationalBlueprintContract {
  const currentObjectType = contract.objectTypes[objectTypeIndex];
  const currentTargetType = currentObjectType?.targetType?.trim();
  const targetOption = operationTargetTypeOption(nextTargetType);
  const normalizedNextTargetType = targetOption?.value ?? nextTargetType.trim();

  if (!currentObjectType || !normalizedNextTargetType) return contract;

  const replaceTarget = (targetType: string | null | undefined) =>
    currentTargetType && targetType === currentTargetType
      ? normalizedNextTargetType
      : targetType;

  return {
    ...contract,
    objectTypes: contract.objectTypes.map((objectType, index) =>
      index === objectTypeIndex
        ? {
            ...objectType,
            targetType: normalizedNextTargetType,
            label: targetOption?.label ?? objectType.label,
            description: targetOption?.description ?? objectType.description,
          }
        : objectType,
    ),
    workspaceRoles: contract.workspaceRoles.map((role) => ({
      ...role,
      identityTargetType: replaceTarget(role.identityTargetType) ?? null,
      itemTargetTypes: role.itemTargetTypes.map((targetType) =>
        replaceTarget(targetType) ?? targetType,
      ),
    })),
    eventRoutes: contract.eventRoutes.map((route) => ({
      ...route,
      eventKey:
        currentTargetType && route.targetType === currentTargetType && targetOption
          ? targetOption.defaultEventKey
          : route.eventKey,
      targetType: replaceTarget(route.targetType) ?? route.targetType,
    })),
    actions: contract.actions.map((action) => ({
      ...action,
      key:
        currentTargetType && action.targetType === currentTargetType && targetOption
          ? targetOption.defaultActionKey
          : action.key,
      targetType: replaceTarget(action.targetType) ?? action.targetType,
      command:
        currentTargetType && action.targetType === currentTargetType && targetOption
          ? targetOption.defaultCommand
          : action.command,
      emits: action.emits.map((eventKey) =>
        targetOption &&
        contract.eventRoutes.some(
          (route) => route.targetType === currentTargetType && route.eventKey === eventKey,
        )
          ? targetOption.defaultEventKey
          : eventKey,
      ),
    })),
    workflows: contract.workflows.map((workflow) => ({
      ...workflow,
      transitions: workflow.transitions.map((transition) => ({
        ...transition,
        actionKey:
          targetOption &&
          contract.actions.some(
            (action) =>
              action.targetType === currentTargetType &&
              action.key === transition.actionKey,
          )
            ? targetOption.defaultActionKey
            : transition.actionKey,
        eventKey:
          targetOption &&
          contract.eventRoutes.some(
            (route) =>
              route.targetType === currentTargetType &&
              route.eventKey === transition.eventKey,
          )
            ? targetOption.defaultEventKey
            : transition.eventKey,
      })),
    })),
    projectionSubscriptions: contract.projectionSubscriptions.map((subscription) => ({
      ...subscription,
      eventKeys: subscription.eventKeys.map((eventKey) =>
        targetOption &&
        contract.eventRoutes.some(
          (route) => route.targetType === currentTargetType && route.eventKey === eventKey,
        )
          ? targetOption.defaultEventKey
          : eventKey,
      ),
      resolvesToTargetType:
        replaceTarget(subscription.resolvesToTargetType) ??
        subscription.resolvesToTargetType,
    })),
  };
}

export function buildStarterOperationalBlueprintContract(
  operation: OperationalBlueprintContract,
): OperationalBlueprintContract {
  const rawTargetType = operation.objectTypes[0]?.targetType?.trim();
  const hasPlaceholderTarget =
    !rawTargetType ||
    rawTargetType === "BUSINESS_OBJECT" ||
    rawTargetType === "OBJECT" ||
    rawTargetType.startsWith("OBJECT_");
  const targetType = hasPlaceholderTarget ? DEFAULT_OPERATION_TARGET_TYPE : rawTargetType;
  const targetOption = operationTargetTypeOption(targetType);
  const workspaceRole = operation.workspaceRoles[0]?.key?.trim() || "WORKSPACE";
  const eventKey =
    (hasPlaceholderTarget ? "" : operation.eventRoutes[0]?.eventKey?.trim()) ||
    targetOption?.defaultEventKey ||
    "domain.object_created";
  const actionKey =
    (hasPlaceholderTarget ? "" : operation.actions[0]?.key?.trim()) ||
    targetOption?.defaultActionKey ||
    "review_item";

  return {
    ...operation,
    summary:
      operation.summary?.trim() ||
      "A simple operation model with one workspace, one business object, one intake event, and one manual action.",
    objectTypes: [
      {
        targetType,
        label:
          (hasPlaceholderTarget ? "" : operation.objectTypes[0]?.label?.trim()) ||
          targetOption?.label ||
          "Item",
        role: operation.objectTypes[0]?.role ?? "ITEM",
        description:
          (hasPlaceholderTarget ? "" : operation.objectTypes[0]?.description?.trim()) ||
          targetOption?.description ||
          "The business object this operation tracks as workspace work.",
      },
    ],
    workspaceRoles: [
      {
        key: workspaceRole,
        label: operation.workspaceRoles[0]?.label?.trim() || "Workspace chính",
        cardinality:
          operation.workspaceRoles[0]?.cardinality ?? "SINGLE_PER_ACTIVE_CYCLE",
        identityTargetType: operation.workspaceRoles[0]?.identityTargetType ?? null,
        itemTargetTypes: [targetType],
        description:
          operation.workspaceRoles[0]?.description?.trim() ||
          "The primary workspace where the operation receives and works on items.",
      },
    ],
    eventRoutes: [
      {
        eventKey,
        targetType,
        workspaceRole,
        effect: operation.eventRoutes[0]?.effect ?? "BIND_ITEM",
        description:
          operation.eventRoutes[0]?.description?.trim() ||
          "Bind the business object into the main workspace when the event arrives.",
      },
    ],
    coreFlows: [
      {
        key: operation.coreFlows[0]?.key?.trim() || "main_flow",
        label: operation.coreFlows[0]?.label?.trim() || "Main flow",
        description:
          operation.coreFlows[0]?.description?.trim() ||
          "A single-step flow through the main workspace.",
        steps: [
          {
            workspaceRole,
            label: "Workspace chính",
            description: "Điểm bắt đầu và kết thúc của operation này.",
            isEntry: true,
            isTerminal: true,
          },
        ],
      },
    ],
    actions: [
      {
        key: actionKey,
        label: operation.actions[0]?.label?.trim() || "Review item",
        workspaceRole,
        targetType,
        command:
          (hasPlaceholderTarget ? "" : operation.actions[0]?.command?.trim()) ||
          targetOption?.defaultCommand ||
          "domain.reviewItem",
        fields: operation.actions[0]?.fields ?? [],
        emits: operation.actions[0]?.emits?.length
          ? operation.actions[0].emits
          : [eventKey],
        description:
          operation.actions[0]?.description?.trim() ||
          "A manual action that delegates the real business command to the domain adapter.",
      },
    ],
    workflows: [
      {
        key: operation.workflows[0]?.key?.trim() || "main_workflow",
        workspaceRole,
        states: operation.workflows[0]?.states?.length
          ? operation.workflows[0].states
          : ["READY", "DONE"],
        transitions: operation.workflows[0]?.transitions?.length
          ? operation.workflows[0].transitions.map((transition) => ({
              ...transition,
              actionKey: transition.actionKey || actionKey,
              eventKey: transition.eventKey || eventKey,
            }))
          : [
              {
                from: "READY",
                to: "DONE",
                actionKey,
                eventKey,
              },
            ],
      },
    ],
    projectionSubscriptions: operation.projectionSubscriptions.map(
      (subscription) => ({
        ...subscription,
        eventKeys: subscription.eventKeys.length
          ? subscription.eventKeys
          : [eventKey],
        resolvesToTargetType: subscription.resolvesToTargetType || targetType,
      }),
    ),
  };
}
