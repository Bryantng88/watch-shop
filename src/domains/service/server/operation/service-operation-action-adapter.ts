import type { DB } from "@/server/db/client";
import { findBusinessBindingById } from "@/domains/task/server/business-binding.repo";
import type { ApplyManualTriggerToQueueItemResult } from "@/domains/task/server/business-binding-workflow.service";
import {
  completeTechnicalIssue,
  confirmTechnicalIssue,
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

function clean(value: unknown) {
  return String(value ?? "").trim();
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

    if (actionKey === "start-work") {
      const result = await startTechnicalIssue({
        id: technicalIssueId,
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
