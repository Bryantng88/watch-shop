import type { OperationalBlueprintContract } from "./operational-blueprint";
import { validateOperationalBlueprintContract } from "./operational-blueprint";
import {
  summarizeOperationAdapterBindings,
} from "./operation-adapter-bindings";
import type {
  OperationSpaceCreationPlan,
} from "./operation-space-plan";

export type OperationPublishReadinessIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
};

export type OperationPublishPlan = {
  ok: boolean;
  operationKey: string | null;
  currentVersion: number | null;
  proposedVersion: number | null;
  snapshotMode: "NEW_WORKSPACES_ONLY";
  validationIssueCount: number;
  adapterSummary: ReturnType<typeof summarizeOperationAdapterBindings>;
  creationPlanReady: boolean;
  issues: OperationPublishReadinessIssue[];
};

export function buildOperationPublishPlan(input: {
  operation: OperationalBlueprintContract | null | undefined;
  creationPlan?: OperationSpaceCreationPlan | null;
  latestPublishedVersion?: number | null;
}): OperationPublishPlan {
  const operation = input.operation ?? null;
  const validation = validateOperationalBlueprintContract(operation);
  const adapterSummary = summarizeOperationAdapterBindings(operation);
  const issues: OperationPublishReadinessIssue[] = [];

  if (!operation) {
    issues.push({
      severity: "error",
      code: "missing_operation",
      message: "Operation Model is required before publishing can be planned.",
    });
  }

  if (!validation.ok) {
    issues.push({
      severity: "error",
      code: "operation_validation_failed",
      message: "Operation validation must pass before a publish candidate exists.",
    });
  }

  if (adapterSummary.declaredOnly > 0) {
    issues.push({
      severity: "warning",
      code: "declared_only_adapters",
      message:
        "Some actions are declared but do not have executable adapter bindings yet.",
    });
  }

  if (input.creationPlan && !input.creationPlan.ok) {
    issues.push({
      severity: "error",
      code: "creation_plan_blocked",
      message: "Create Space dry-run must be ready before publish can proceed.",
    });
  }

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    operationKey: operation?.key ?? null,
    currentVersion: operation?.version ?? null,
    proposedVersion: operation
      ? (input.latestPublishedVersion ?? operation.version) + 1
      : null,
    snapshotMode: "NEW_WORKSPACES_ONLY",
    validationIssueCount: validation.issueCount,
    adapterSummary,
    creationPlanReady: input.creationPlan?.ok ?? false,
    issues,
  };
}
