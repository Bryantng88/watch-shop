import type {
  OperationalBlueprintAction,
  OperationalBlueprintContract,
} from "./operational-blueprint";

export type OperationAdapterBindingStatus =
  | "EXECUTABLE"
  | "EXTERNAL_ENTRYPOINT"
  | "DECLARED_ONLY";

export type OperationAdapterBinding = {
  actionKey: string;
  label: string;
  command: string;
  workspaceRole: string;
  targetType: string;
  status: OperationAdapterBindingStatus;
  adapterKey: string | null;
  note: string;
};

const SERVICE_OPERATION_WORKSPACE_COMMANDS = new Set([
  "service.createTechnicalIssue",
  "service.confirmTechnicalIssue",
  "service.closeTechnicalIssueNoIssue",
  "service.startTechnicalIssue",
  "service.completeTechnicalIssue",
]);

const PAYMENT_OPERATION_WORKSPACE_COMMANDS = new Set([
  "payment.completePayment",
]);

const EXTERNAL_ENTRYPOINT_COMMANDS = new Set([
  "service.watchIntakeWithInitialIssue",
]);

function bindingForAction(action: OperationalBlueprintAction): OperationAdapterBinding {
  if (SERVICE_OPERATION_WORKSPACE_COMMANDS.has(action.command)) {
    return {
      actionKey: action.key,
      label: action.label,
      command: action.command,
      workspaceRole: action.workspaceRole,
      targetType: action.targetType,
      status: "EXECUTABLE",
      adapterKey: "service-operation-action-adapter",
      note: "Executable through runServiceOperationBlueprintAction.",
    };
  }

  if (PAYMENT_OPERATION_WORKSPACE_COMMANDS.has(action.command)) {
    return {
      actionKey: action.key,
      label: action.label,
      command: action.command,
      workspaceRole: action.workspaceRole,
      targetType: action.targetType,
      status: "EXECUTABLE",
      adapterKey: "payment-operation-action-adapter",
      note: "Executable through runPaymentOperationBlueprintAction.",
    };
  }

  if (EXTERNAL_ENTRYPOINT_COMMANDS.has(action.command)) {
    return {
      actionKey: action.key,
      label: action.label,
      command: action.command,
      workspaceRole: action.workspaceRole,
      targetType: action.targetType,
      status: "EXTERNAL_ENTRYPOINT",
      adapterKey: "service-operation-watch-intake",
      note: "Executed from the Watch List intake/API path, not from Workspace action runtime.",
    };
  }

  return {
    actionKey: action.key,
    label: action.label,
    command: action.command,
    workspaceRole: action.workspaceRole,
    targetType: action.targetType,
    status: "DECLARED_ONLY",
    adapterKey: null,
    note: "Operation contract declares this command, but no executable adapter binding is registered yet.",
  };
}

export function listOperationAdapterBindings(
  contract: OperationalBlueprintContract | null | undefined,
): OperationAdapterBinding[] {
  return (contract?.actions ?? []).map(bindingForAction);
}

export function summarizeOperationAdapterBindings(
  contract: OperationalBlueprintContract | null | undefined,
) {
  const bindings = listOperationAdapterBindings(contract);

  return {
    total: bindings.length,
    executable: bindings.filter((binding) => binding.status === "EXECUTABLE").length,
    externalEntrypoints: bindings.filter(
      (binding) => binding.status === "EXTERNAL_ENTRYPOINT",
    ).length,
    declaredOnly: bindings.filter((binding) => binding.status === "DECLARED_ONLY").length,
  };
}
