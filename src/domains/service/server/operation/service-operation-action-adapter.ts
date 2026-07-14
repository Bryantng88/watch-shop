import type { DB } from "@/server/db/client";
import type { TechnicalActionMode } from "@prisma/client";
import {
  findBusinessBindingById,
  findBusinessBindingsByTaskItem,
} from "@/domains/task/server/business-binding.repo";
import type { ApplyManualTriggerToQueueItemResult } from "@/domains/task/server/business-binding-workflow.service";
import {
  operationalBlueprintForWorkType,
  selectOperationalActionsForWorkspaceRole,
} from "@/domains/blueprint/shared/operational-blueprint";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import {
  closeTechnicalIssueNoIssue,
  completeTechnicalIssue,
  confirmTechnicalIssue,
  createTechnicalIssue,
  startTechnicalIssue,
} from "@/domains/service/server/issue-board/service-issue-board.service";

export type ServiceOperationActionAdapterResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  actionKey?: string;
  technicalIssueId?: string;
  result?: unknown;
};

export type ServiceOperationBlueprintActionAdapterInput = {
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

function serviceOperationWorkspaceRoleFromNote(note?: string | null) {
  return noteValue(note, "serviceOperationWorkspaceRole")?.toUpperCase() ?? null;
}

function workTypeKeyFromNote(note?: string | null) {
  return noteValue(note, "workTypeKey") ?? null;
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
  const workspaceRole = serviceOperationWorkspaceRoleFromNote(taskItem.note);
  const contract =
    snapshot?.operation ??
    (workTypeKey
      ? operationalBlueprintForWorkType({
          workTypeKey,
          coordinationContext: "TECHNICAL",
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

function requiredField(fields: Record<string, unknown>, key: string) {
  const value = clean(fields[key]);
  if (!value) throw new Error(`Missing ${key}`);
  return value;
}

function optionalField(fields: Record<string, unknown>, key: string) {
  return clean(fields[key]) || null;
}

function booleanField(fields: Record<string, unknown>, key: string, fallback = false) {
  const value = fields[key];
  if (typeof value === "boolean") return value;
  const text = clean(value).toLowerCase();
  if (!text) return fallback;
  return text === "true" || text === "1" || text === "yes" || text === "on";
}

function moneyField(fields: Record<string, unknown>, key: string, required: boolean) {
  const text = clean(fields[key]);
  if (!text) {
    if (required) throw new Error(`Missing ${key}`);
    return null;
  }

  const normalized = text.replace(/,/g, "");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid ${key}`);
  }

  return value;
}

function actionModeField(fields: Record<string, unknown>, required: boolean) {
  const value = optionalField(fields, "actionMode");
  if (!value) {
    if (required) throw new Error("Missing actionMode");
    return null;
  }

  const upper = value.toUpperCase();
  if (upper !== "NONE" && upper !== "INTERNAL" && upper !== "VENDOR") {
    throw new Error("Invalid actionMode");
  }

  return upper as TechnicalActionMode;
}

function serviceRequestIdFromContext(input: Awaited<ReturnType<typeof loadWorkspaceActionContext>>) {
  return (
    noteValue(input.taskItem.note, "serviceRequestId") ??
    input.bindings.find((binding) => binding.targetType === "SERVICE_REQUEST")?.targetId ??
    null
  );
}

async function serviceRequestIdForTechnicalIssue(db: DB, technicalIssueId: string) {
  const issue = await db.technicalIssue.findUnique({
    where: { id: technicalIssueId },
    select: { serviceRequestId: true },
  });

  return clean(issue?.serviceRequestId) || null;
}

async function loadTechnicalIssueCompletionInput(db: DB, technicalIssueId: string) {
  const issue = await db.technicalIssue.findUnique({
    where: { id: technicalIssueId },
    select: {
      id: true,
      actualCost: true,
      resolutionNote: true,
      supplyCatalogId: true,
      mechanicalPartCatalogId: true,
    },
  });

  if (!issue) throw new Error("Technical issue was not found.");

  return {
    actualCost: issue.actualCost,
    resolutionNote: issue.resolutionNote ?? null,
    supplyCatalogId: issue.supplyCatalogId ?? null,
    mechanicalPartCatalogId: issue.mechanicalPartCatalogId ?? null,
  };
}

export async function runServiceOperationManualAction(
  db: DB,
  input: {
    bindingId: string;
    transition: ApplyManualTriggerToQueueItemResult;
    actorUserId?: string | null;
    actorName?: string | null;
    note?: string | null;
  },
): Promise<ServiceOperationActionAdapterResult> {
  if (!input.transition.applied) {
    return { ok: true, skipped: true, reason: "WORKFLOW_TRANSITION_NOT_APPLIED" };
  }

  if (input.transition.workflowKey !== "service-operation-technical-bench") {
    return { ok: true, skipped: true, reason: "NOT_SERVICE_OPERATION_WORKFLOW" };
  }

  const binding = await findBusinessBindingById(db, input.bindingId);
  if (!binding) return { ok: false, error: "BINDING_NOT_FOUND" };
  if (binding.targetType !== "TECHNICAL_ISSUE") {
    return { ok: true, skipped: true, reason: "TARGET_NOT_TECHNICAL_ISSUE" };
  }

  const actionKey = clean(input.transition.actionKey);
  const technicalIssueId = clean(binding.targetId);

  try {
    if (actionKey === "confirm-issue") {
      const result = await confirmTechnicalIssue({
        id: technicalIssueId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
      });
      return { ok: true, actionKey, technicalIssueId, result };
    }

    if (actionKey === "close-no-issue") {
      const result = await closeTechnicalIssueNoIssue({
        id: technicalIssueId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
        resolutionNote: input.note ?? null,
      });
      return { ok: true, actionKey, technicalIssueId, result };
    }

    if (actionKey === "start-work") {
      const result = await startTechnicalIssue({
        id: technicalIssueId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
      });
      return { ok: true, actionKey, technicalIssueId, result };
    }

    if (actionKey === "mark-done") {
      const completionInput = await loadTechnicalIssueCompletionInput(
        db,
        technicalIssueId,
      );
      const result = await completeTechnicalIssue({
        id: technicalIssueId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
        ...completionInput,
      });
      return { ok: true, actionKey, technicalIssueId, result };
    }

    return {
      ok: true,
      skipped: true,
      reason: "UNMAPPED_SERVICE_OPERATION_ACTION",
      actionKey,
      technicalIssueId,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "SERVICE_OPERATION_ACTION_FAILED",
      actionKey,
      technicalIssueId,
    };
  }
}

export async function runServiceOperationBlueprintAction(
  db: DB,
  input: ServiceOperationBlueprintActionAdapterInput,
): Promise<ServiceOperationActionAdapterResult> {
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

  const fields = input.fields ?? {};

  try {
    if (action.command === "service.createTechnicalIssue") {
      const serviceRequestId =
        targetType === "TECHNICAL_ISSUE" && targetId
          ? await serviceRequestIdForTechnicalIssue(db, targetId)
          : serviceRequestIdFromContext(context);
      if (!serviceRequestId) {
        return { ok: false, actionKey, error: "SERVICE_REQUEST_NOT_FOUND" };
      }

      const result = await createTechnicalIssue({
        serviceRequestId,
        summary: requiredField(fields, "summary"),
        note: optionalField(fields, "note"),
        area: optionalField(fields, "technicalArea") ?? "GENERAL",
        issueType: "CHECK",
        actionMode: optionalField(fields, "actionMode") ?? "INTERNAL",
        estimatedCost: optionalField(fields, "estimatedCost"),
        vendorId: optionalField(fields, "vendorId"),
      });

      return {
        ok: true,
        actionKey,
        technicalIssueId: result.id,
        result,
      };
    }

    if (action.command === "service.confirmTechnicalIssue") {
      if (targetType !== "TECHNICAL_ISSUE" || !targetId) {
        return { ok: false, actionKey, error: "TECHNICAL_ISSUE_TARGET_REQUIRED" };
      }

      const technicalArea =
        actionKey === "classify_technical_issue"
          ? requiredField(fields, "technicalArea")
          : optionalField(fields, "technicalArea");
      const actionModeFields = {
        ...fields,
        actionMode: fields.actionMode ?? fields.assigneeMode,
      };
      const actionMode =
        actionKey === "classify_technical_issue"
          ? actionModeField(actionModeFields, true)
          : actionModeField(actionModeFields, false);
      const vendorId = optionalField(fields, "vendorId");
      const estimatedCost = moneyField(fields, "estimatedCost", false);

      if (actionMode === "VENDOR" && !vendorId) {
        throw new Error("Missing vendorId");
      }

      if (technicalArea || actionMode || vendorId || estimatedCost != null) {
        const nextVendorId =
          actionKey === "classify_technical_issue" && actionMode !== "VENDOR"
            ? null
            : vendorId ?? undefined;
        const nextVendorName =
          nextVendorId === null
            ? null
            : nextVendorId
              ? (
                  await db.vendor.findUnique({
                    where: { id: nextVendorId },
                    select: { name: true },
                  })
                )?.name ?? null
              : undefined;

        await db.technicalIssue.update({
          where: { id: targetId },
          data: {
            area: technicalArea ?? undefined,
            actionMode: actionMode ?? undefined,
            vendorId: nextVendorId,
            vendorNameSnap: nextVendorName,
            estimatedCost: estimatedCost ?? undefined,
            updatedAt: new Date(),
          },
        });
      }

      const result = await confirmTechnicalIssue({
        id: targetId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
      });

      return {
        ok: true,
        actionKey,
        technicalIssueId: targetId,
        result,
      };
    }

    if (action.command === "service.closeTechnicalIssueNoIssue") {
      if (targetType !== "TECHNICAL_ISSUE" || !targetId) {
        return { ok: false, actionKey, error: "TECHNICAL_ISSUE_TARGET_REQUIRED" };
      }

      const result = await closeTechnicalIssueNoIssue({
        id: targetId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
        resolutionNote: requiredField(fields, "resolutionNote"),
      });

      return {
        ok: true,
        actionKey,
        technicalIssueId: targetId,
        result,
      };
    }

    if (action.command === "service.startTechnicalIssue") {
      if (targetType !== "TECHNICAL_ISSUE" || !targetId) {
        return { ok: false, actionKey, error: "TECHNICAL_ISSUE_TARGET_REQUIRED" };
      }

      const result = await startTechnicalIssue({
        id: targetId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
        technicalDetailCatalogId: requiredField(fields, "technicalDetailCatalogId"),
        actionMode: actionModeField(fields, true) ?? "INTERNAL",
        vendorId: optionalField(fields, "vendorId"),
      });

      return {
        ok: true,
        actionKey,
        technicalIssueId: targetId,
        result,
      };
    }

    if (action.command === "service.completeTechnicalIssue") {
      if (targetType !== "TECHNICAL_ISSUE" || !targetId) {
        return { ok: false, actionKey, error: "TECHNICAL_ISSUE_TARGET_REQUIRED" };
      }

      const result = await completeTechnicalIssue({
        id: targetId,
        actorId: input.actorUserId ?? null,
        actorName: input.actorName ?? null,
        actualCost: moneyField(fields, "actualCost", true),
        resolutionNote: optionalField(fields, "resolutionNote"),
        createPayment: booleanField(fields, "createPayment", false),
      });

      return {
        ok: true,
        actionKey,
        technicalIssueId: targetId,
        result,
      };
    }

    return {
      ok: true,
      skipped: true,
      reason: "BLUEPRINT_ACTION_ADAPTER_NOT_IMPLEMENTED",
      actionKey,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "SERVICE_OPERATION_BLUEPRINT_ACTION_FAILED",
      actionKey,
    };
  }
}
