import type { DB } from "@/server/db/client";
import {
  operationalBlueprintForWorkType,
  selectOperationalActionsForWorkspaceRole,
} from "@/domains/blueprint/shared/operational-blueprint";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import { findBusinessBindingsByTaskItem } from "@/domains/task/server/business-binding.repo";
import { completePayment } from "./payment.core";

export type PaymentOperationActionAdapterResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  actionKey?: string;
  paymentId?: string;
  result?: unknown;
};

export type PaymentOperationBlueprintActionAdapterInput = {
  taskItemId: string;
  actionKey: string;
  targetType?: string | null;
  targetId?: string | null;
  fields?: Record<string, unknown>;
  actorUserId?: string | null;
  actorName?: string | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function noteValue(note: string | null | undefined, key: string) {
  return (
    String(note ?? "")
      .match(new RegExp(`^${key}:\\s*([^\\r\\n]+)\\s*$`, "im"))?.[1]
      ?.trim() ?? null
  );
}

function paymentCollectionWorkspaceRoleFromNote(note?: string | null) {
  return noteValue(note, "paymentCollectionWorkspaceRole")?.toUpperCase() ?? null;
}

function workTypeKeyFromNote(note?: string | null) {
  return noteValue(note, "workTypeKey") ?? null;
}

function optionalField(fields: Record<string, unknown>, key: string) {
  return clean(fields[key]) || null;
}

async function loadWorkspaceActionContext(
  db: DB,
  taskItemId: string,
) {
  const taskItem = await db.taskItem.findUnique({
    where: { id: taskItemId },
    select: {
      id: true,
      note: true,
    },
  });

  if (!taskItem) throw new Error("Workspace was not found.");

  const snapshot = parseWorkspaceDefinitionSnapshot(taskItem.note);
  const workTypeKey = snapshot?.workTypeKey ?? workTypeKeyFromNote(taskItem.note);
  const workspaceRole = paymentCollectionWorkspaceRoleFromNote(taskItem.note);
  const contract =
    snapshot?.operation ??
    (workTypeKey
      ? operationalBlueprintForWorkType({
          workTypeKey,
          coordinationContext: "PAYMENT",
        })
      : null);
  const bindings = await findBusinessBindingsByTaskItem(db, taskItemId);

  return {
    taskItem,
    snapshot,
    workTypeKey,
    workspaceRole,
    contract,
    bindings,
  };
}

export async function runPaymentOperationBlueprintAction(
  db: DB,
  input: PaymentOperationBlueprintActionAdapterInput,
): Promise<PaymentOperationActionAdapterResult> {
  const taskItemId = clean(input.taskItemId);
  const actionKey = clean(input.actionKey);
  const targetType = clean(input.targetType).toUpperCase();
  const targetId = clean(input.targetId);
  if (!taskItemId) return { ok: false, error: "MISSING_TASK_ITEM_ID" };
  if (!actionKey) return { ok: false, error: "MISSING_ACTION_KEY" };

  const context = await loadWorkspaceActionContext(db, taskItemId);
  if (!context.contract) {
    return { ok: false, actionKey, error: "OPERATION_CONTRACT_NOT_FOUND" };
  }
  if (!context.workspaceRole) {
    return { ok: false, actionKey, error: "WORKSPACE_ROLE_NOT_FOUND" };
  }

  const action = selectOperationalActionsForWorkspaceRole({
    contract: context.contract,
    workspaceRole: context.workspaceRole,
  }).find((candidate) => candidate.key === actionKey);
  if (!action) {
    return { ok: false, actionKey, error: "ACTION_NOT_AVAILABLE_FOR_WORKSPACE" };
  }

  if (action.command !== "payment.completePayment") {
    return {
      ok: false,
      actionKey,
      error: "PAYMENT_OPERATION_ACTION_NOT_EXECUTABLE",
    };
  }

  if (targetType !== "PAYMENT" || !targetId) {
    return { ok: false, actionKey, error: "PAYMENT_TARGET_REQUIRED" };
  }

  try {
    const fields = input.fields ?? {};
    const result = await completePayment({
      paymentId: targetId,
      paidAt: optionalField(fields, "paidAt"),
      reference: optionalField(fields, "reference"),
      note: optionalField(fields, "settlementNote"),
    });

    return { ok: true, actionKey, paymentId: targetId, result };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "PAYMENT_OPERATION_ACTION_FAILED",
      actionKey,
      paymentId: targetId,
    };
  }
}
