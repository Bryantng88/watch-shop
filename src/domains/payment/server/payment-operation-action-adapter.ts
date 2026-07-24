import type { DB } from "@/server/db/client";
import { PaymentMethod } from "@prisma/client";
import {
  operationalBlueprintForWorkType,
  selectOperationalActionsForWorkspaceRole,
} from "@/domains/blueprint/shared/operational-blueprint";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import { findBusinessBindingsByTaskItem } from "@/domains/task/server/business-binding.repo";
import { completePayment, splitPayment } from "./payment.core";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";

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
  return (
    noteValue(note, "operationWorkspaceRole") ??
    noteValue(note, "paymentCollectionWorkspaceRole")
  )?.toUpperCase() ?? null;
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

  if (action.command === "payment.reviewPayment") {
    if (targetType !== "PAYMENT" || !targetId) {
      return { ok: false, actionKey, error: "PAYMENT_TARGET_REQUIRED" };
    }
    try {
      const reviewFields = input.fields ?? {};
      const method = optionalField(reviewFields, "method");
      const transactionReference = optionalField(reviewFields, "transactionReference");
      await db.payment.update({
        where: { id: targetId },
        data: {
          method: method ? (method as PaymentMethod) : undefined,
          reference: transactionReference ?? undefined,
          updatedAt: new Date(),
        },
      });
      await recordBusinessEvent(db, {
        eventKey: "payment.status_updated",
        targetType: "PAYMENT",
        targetId,
        actorUserId: input.actorUserId ?? null,
        payload: {
          status: "IN_REVIEW",
          reviewedAmount: optionalField(reviewFields, "reviewedAmount"),
          method,
          occurredAt: optionalField(reviewFields, "occurredAt"),
          transactionReference,
          counterparty: optionalField(reviewFields, "counterparty"),
          contact: optionalField(reviewFields, "contact"),
          reconciliationResult: optionalField(reviewFields, "reconciliationResult"),
          evidenceReference: optionalField(reviewFields, "evidenceReference"),
          followUpDueAt: optionalField(reviewFields, "followUpDueAt"),
          reviewNote: optionalField(reviewFields, "reviewNote"),
          sourceId: `${targetId}:payment.status_updated:IN_REVIEW`,
        },
      });
      return { ok: true, actionKey, paymentId: targetId };
    } catch (error) {
      return { ok: false, actionKey, paymentId: targetId, error: error instanceof Error ? error.message : "PAYMENT_REVIEW_FAILED" };
    }
  }

  if (action.command === "payment.markException") {
    if (targetType !== "PAYMENT" || !targetId) {
      return { ok: false, actionKey, error: "PAYMENT_TARGET_REQUIRED" };
    }
    const reason = optionalField(input.fields ?? {}, "reason");
    if (!reason) return { ok: false, actionKey, paymentId: targetId, error: "PAYMENT_EXCEPTION_REASON_REQUIRED" };
    try {
      await db.payment.update({
        where: { id: targetId },
        data: { note: reason, updatedAt: new Date() },
      });
      await recordBusinessEvent(db, {
        eventKey: "payment.exception_marked",
        targetType: "PAYMENT",
        targetId,
        actorUserId: input.actorUserId ?? null,
        payload: {
          status: "EXCEPTION",
          reason,
          sourceId: `${targetId}:payment.exception_marked:${Date.now()}`,
        },
      });
      return { ok: true, actionKey, paymentId: targetId, result: { exception: true } };
    } catch (error) {
      return { ok: false, actionKey, paymentId: targetId, error: error instanceof Error ? error.message : "PAYMENT_EXCEPTION_FAILED" };
    }
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
    const isReconciliation = action.key === "reconcile_payment";
    if (isReconciliation) {
      const reviewedAmount = Number(fields.reviewedAmount);
      const reviewedMethod = optionalField(fields, "method");
      const counterparty = optionalField(fields, "counterparty");
      const payment = await db.payment.findUnique({ where: { id: targetId }, select: { amount: true } });
      if (!payment || !Number.isFinite(reviewedAmount) || reviewedAmount < 0 || !reviewedMethod || !counterparty) {
        return { ok: false, actionKey, paymentId: targetId, error: "INVALID_RECONCILIATION_AMOUNT" };
      }
      const reconciliationResult = optionalField(fields, "reconciliationResult");
      if (reviewedAmount !== Number(payment.amount) && reconciliationResult === "MATCHED") {
        return { ok: false, actionKey, paymentId: targetId, error: "PAYMENT_RECONCILIATION_NOT_MATCHED" };
      }
      if (
        reconciliationResult === "PARTIAL" &&
        reviewedAmount > 0 &&
        reviewedAmount < Number(payment.amount)
      ) {
        const split = await splitPayment({
          paymentId: targetId,
          paidAmount: reviewedAmount,
          paidAt: optionalField(fields, "occurredAt"),
          method: reviewedMethod,
          reference: optionalField(fields, "transactionReference"),
          note: optionalField(fields, "reviewNote"),
        });
        await recordBusinessEvent(db, {
          eventKey: "payment.status_updated",
          targetType: "PAYMENT",
          targetId,
          actorUserId: input.actorUserId ?? null,
          payload: {
            status: "RECONCILED_SPLIT",
            expectedAmount: Number(payment.amount),
            reviewedAmount,
            remainderAmount: split.remainderAmount,
            remainderPaymentId: split.remainderPaymentId,
            method: reviewedMethod,
            occurredAt: optionalField(fields, "occurredAt"),
            transactionReference: optionalField(fields, "transactionReference"),
            counterparty,
            contact: optionalField(fields, "contact"),
            reviewNote: optionalField(fields, "reviewNote"),
            sourceId: `${targetId}:payment.status_updated:RECONCILED_SPLIT`,
          },
        });
        return {
          ok: true,
          actionKey,
          paymentId: targetId,
          result: {
            reconciliationResult,
            settled: true,
            split,
            settlement: split.summary,
          },
        };
      }
      if (reconciliationResult !== "MATCHED") {
        await db.payment.update({
          where: { id: targetId },
          data: {
            method: reviewedMethod as PaymentMethod,
            reference: optionalField(fields, "transactionReference") ?? undefined,
            updatedAt: new Date(),
          },
        });
        await recordBusinessEvent(db, {
          eventKey: "payment.status_updated",
          targetType: "PAYMENT",
          targetId,
          actorUserId: input.actorUserId ?? null,
          payload: {
            status: "REVIEW_FOLLOW_UP",
            reviewedAmount: optionalField(fields, "reviewedAmount"),
            method: optionalField(fields, "method"),
            occurredAt: optionalField(fields, "occurredAt"),
            transactionReference: optionalField(fields, "transactionReference"),
            counterparty: optionalField(fields, "counterparty"),
            contact: optionalField(fields, "contact"),
            reconciliationResult,
            evidenceReference: optionalField(fields, "evidenceReference"),
            followUpDueAt: optionalField(fields, "followUpDueAt"),
            reviewNote: optionalField(fields, "reviewNote"),
            sourceId: `${targetId}:payment.status_updated:REVIEW_FOLLOW_UP:${Date.now()}`,
          },
        });
        return { ok: true, actionKey, paymentId: targetId, result: { reconciliationResult, settled: false } };
      }
      await recordBusinessEvent(db, {
        eventKey: "payment.status_updated",
        targetType: "PAYMENT",
        targetId,
        actorUserId: input.actorUserId ?? null,
        payload: {
          status: "RECONCILED",
          reviewedAmount: optionalField(fields, "reviewedAmount"),
          method: optionalField(fields, "method"),
          occurredAt: optionalField(fields, "occurredAt"),
          transactionReference: optionalField(fields, "transactionReference"),
          counterparty: optionalField(fields, "counterparty"),
          contact: optionalField(fields, "contact"),
          reconciliationResult: optionalField(fields, "reconciliationResult"),
          evidenceReference: optionalField(fields, "evidenceReference"),
          followUpDueAt: optionalField(fields, "followUpDueAt"),
          reviewNote: optionalField(fields, "reviewNote"),
          sourceId: `${targetId}:payment.status_updated:RECONCILED:${Date.now()}`,
        },
      });
    }
    const result = await completePayment({
      paymentId: targetId,
      paidAt: optionalField(fields, isReconciliation ? "occurredAt" : "paidAt"),
      method: optionalField(fields, "method"),
      reference: optionalField(fields, isReconciliation ? "transactionReference" : "reference"),
      note: optionalField(fields, isReconciliation ? "reviewNote" : "settlementNote"),
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
