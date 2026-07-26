import {
  operationalBlueprintForWorkType,
  selectOperationalActionsForWorkspaceRole,
} from "@/domains/blueprint/shared/operational-blueprint";
import {
  createShipmentFeeAndShipApplication,
  markShipmentDeliveredApplication,
  markShipmentReturnedApplication,
  receiveShipmentReturnApplication,
} from "@/domains/shipment/application";
import type { DB } from "@/server/db/client";

export type ShipmentOperationBlueprintActionInput = {
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
  return String(note ?? "").match(new RegExp(`^${key}:\\s*([^\\r\\n]+)\\s*$`, "im"))?.[1]?.trim() ?? null;
}

export async function runShipmentOperationBlueprintAction(
  db: DB,
  input: ShipmentOperationBlueprintActionInput,
) {
  const taskItemId = clean(input.taskItemId);
  const actionKey = clean(input.actionKey);
  const targetId = clean(input.targetId);
  const targetType = clean(input.targetType).toUpperCase();
  if (!taskItemId || !actionKey) return { ok: false, error: "MISSING_ACTION_CONTEXT" };
  if (targetType !== "SHIPMENT" || !targetId) {
    return { ok: false, actionKey, error: "SHIPMENT_TARGET_REQUIRED" };
  }
  const workspace = await db.taskItem.findUnique({
    where: { id: taskItemId },
    select: { note: true },
  });
  const workspaceRole = noteValue(workspace?.note, "operationWorkspaceRole")?.toUpperCase();
  const contract = operationalBlueprintForWorkType({
    workTypeKey: noteValue(workspace?.note, "workTypeKey") ?? "shipment",
    coordinationContext: "OPERATION",
  });
  const action = contract && workspaceRole
    ? selectOperationalActionsForWorkspaceRole({ contract, workspaceRole })
        .find((candidate) => candidate.key === actionKey)
    : null;
  if (!action) return { ok: false, actionKey, error: "ACTION_NOT_AVAILABLE_FOR_WORKSPACE" };

  try {
    const fields = input.fields ?? {};
    if (action.command === "shipment.dispatch") {
      const amount = Number(fields.amount ?? 0);
      if (!Number.isFinite(amount) || amount < 0) {
        return { ok: false, actionKey, error: "INVALID_SHIPMENT_FEE" };
      }
      const result = await createShipmentFeeAndShipApplication({
        shipmentId: targetId,
        amount,
        payer: clean(fields.payer) || "BUSINESS",
        method: clean(fields.method) || "BANK_TRANSFER",
        carrier: clean(fields.carrier) || null,
        trackingCode: clean(fields.trackingCode) || null,
        reference: clean(fields.reference) || null,
        note: clean(fields.note) || null,
        paidAt: clean(fields.paidAt) || null,
      });
      return { ok: true, actionKey, shipmentId: targetId, result };
    }
    if (action.command === "shipment.markDelivered") {
      const result = await markShipmentDeliveredApplication({
        shipmentId: targetId,
        note: clean(fields.note) || null,
      });
      return { ok: true, actionKey, shipmentId: targetId, result };
    }
    if (action.command === "shipment.markReturning") {
      const note = clean(fields.note);
      if (!note) return { ok: false, actionKey, error: "RETURN_REASON_REQUIRED" };
      const result = await markShipmentReturnedApplication({ shipmentId: targetId, note });
      return { ok: true, actionKey, shipmentId: targetId, result };
    }
    if (action.command === "shipment.receiveReturn") {
      const amount = Number(fields.amount ?? 0);
      if (!Number.isFinite(amount) || amount < 0) {
        return { ok: false, actionKey, error: "INVALID_RETURN_FEE" };
      }
      const result = await receiveShipmentReturnApplication({
        shipmentId: targetId,
        amount,
        method: clean(fields.method) || "BANK_TRANSFER",
        reference: clean(fields.reference) || null,
        note: clean(fields.note) || null,
        paidAt: clean(fields.paidAt) || null,
      });
      return { ok: true, actionKey, shipmentId: targetId, result };
    }
    return { ok: false, actionKey, error: "SHIPMENT_ACTION_NOT_EXECUTABLE" };
  } catch (error) {
    return {
      ok: false,
      actionKey,
      shipmentId: targetId,
      error: error instanceof Error ? error.message : "SHIPMENT_ACTION_FAILED",
    };
  }
}
