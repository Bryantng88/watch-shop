import type { DB } from "@/server/db/client";
import {
  completeWatchMediaProcessingFromQueueItem,
  completeWatchPhotoshootFromQueueItem,
  recallWatchMediaFromPublishQueueItem,
} from "@/domains/watch/server/media-work";
import type {
  ApplyEventTriggerToQueueItemInput,
  ApplyEventTriggerToQueueItemResult,
  ApplyManualTriggerToQueueItemResult,
} from "./business-binding-workflow.service";
import { applyEventTriggerToQueueItem } from "./business-binding-workflow.service";

type ProcessorEffectType =
  | "watch-photoshoot-completed"
  | "watch-media-ready-for-publish"
  | "watch-media-recalled";

type ProcessorEffectStatus = "applied" | "skipped" | "failed";

type ProcessorEffect = {
  type: ProcessorEffectType;
  status: ProcessorEffectStatus;
  reason?: string;
  productId?: string | null;
  result?: unknown;
};

export type WorkspaceWorkflowProcessorResult = {
  status: ProcessorEffectStatus;
  reason?: string;
  bindingId: string;
  workflowKey?: string;
  nextState?: string;
  effects: ProcessorEffect[];
  affectedProductIds: string[];
  mediaProcessingResult?: Awaited<
    ReturnType<typeof completeWatchMediaProcessingFromQueueItem>
  > | null;
};

type ManualProcessorInput = {
  transition: ApplyManualTriggerToQueueItemResult;
  bindingId: string;
  actorUserId?: string | null;
  actorLabel?: string | null;
  note?: string | null;
};

export type WorkspaceWorkflowEventProcessorResult = {
  applied: boolean;
  status: ProcessorEffectStatus;
  reason?: string;
  bindingId: string;
  workflowKey?: string;
  fromState?: string;
  toState?: string;
  nextState?: string;
  terminal?: boolean;
  eventTransitionResult: ApplyEventTriggerToQueueItemResult;
  effects: ProcessorEffect[];
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function productIdFromResult(result: unknown) {
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const productId = clean((result as Record<string, unknown>).productId);
  return productId || null;
}

function resultSkippedReason(result: unknown) {
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const record = result as Record<string, unknown>;
  if (record.skipped !== true) return null;
  return clean(record.reason) || "SKIPPED";
}

function resultFailureReason(result: unknown) {
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const record = result as Record<string, unknown>;
  if (record.ok !== false || record.skipped === true) return null;
  return clean(record.reason) || clean(record.error) || "FAILED";
}

function effectFromResult(input: {
  type: ProcessorEffectType;
  result: unknown;
}): ProcessorEffect {
  const failureReason = resultFailureReason(input.result);
  const reason = resultSkippedReason(input.result);
  const productId = productIdFromResult(input.result);

  return {
    type: input.type,
    status: failureReason ? "failed" : reason ? "skipped" : "applied",
    reason: failureReason ?? reason ?? undefined,
    productId,
    result: input.result,
  };
}

function summarizeEffects(input: {
  bindingId: string;
  transition: ApplyManualTriggerToQueueItemResult;
  effects: ProcessorEffect[];
  mediaProcessingResult?: WorkspaceWorkflowProcessorResult["mediaProcessingResult"];
}): WorkspaceWorkflowProcessorResult {
  const affectedProductIds = Array.from(
    new Set(
      input.effects
        .map((effect) => clean(effect.productId))
        .filter(Boolean),
    ),
  );

  const failed = input.effects.find((effect) => effect.status === "failed");
  const applied = input.effects.find((effect) => effect.status === "applied");
  const status: ProcessorEffectStatus = failed
    ? "failed"
    : applied
      ? "applied"
      : "skipped";

  return {
    status,
    reason:
      failed?.reason ??
      (status === "skipped" ? "NO_WORKSPACE_WORKFLOW_EFFECT" : undefined),
    bindingId: input.bindingId,
    workflowKey: input.transition.applied
      ? input.transition.workflowKey
      : undefined,
    nextState: input.transition.applied ? input.transition.toState : undefined,
    effects: input.effects,
    affectedProductIds,
    mediaProcessingResult: input.mediaProcessingResult ?? null,
  };
}

export async function processManualWorkspaceWorkflowTransition(
  db: DB,
  input: ManualProcessorInput,
): Promise<WorkspaceWorkflowProcessorResult> {
  const effects: ProcessorEffect[] = [];
  let mediaProcessingResult: WorkspaceWorkflowProcessorResult["mediaProcessingResult"] =
    null;

  if (!input.transition.applied) {
    return summarizeEffects({
      bindingId: input.bindingId,
      transition: input.transition,
      effects,
    });
  }

  const commonInput = {
    bindingId: input.bindingId,
    actorUserId: input.actorUserId ?? null,
    note: input.note ?? null,
  };

  if (
    input.transition.workflowKey === "watch-publish" &&
    input.transition.toState === "RECALLED"
  ) {
    const result = await recallWatchMediaFromPublishQueueItem(commonInput, db);
    effects.push(effectFromResult({ type: "watch-media-recalled", result }));
  }

  if (input.transition.toState === "DONE") {
    if (input.transition.workflowKey === "watch-photography") {
      const result = await completeWatchPhotoshootFromQueueItem(commonInput, db);
      effects.push(
        effectFromResult({ type: "watch-photoshoot-completed", result }),
      );
    }

    if (input.transition.workflowKey === "watch-media-processing") {
      mediaProcessingResult = await completeWatchMediaProcessingFromQueueItem(
        commonInput,
        db,
      );
      effects.push(
        effectFromResult({
          type: "watch-media-ready-for-publish",
          result: mediaProcessingResult,
        }),
      );
    }
  }

  return summarizeEffects({
    bindingId: input.bindingId,
    transition: input.transition,
    effects,
    mediaProcessingResult,
  });
}

export async function processEventWorkspaceWorkflowTransition(
  db: DB,
  input: ApplyEventTriggerToQueueItemInput,
): Promise<WorkspaceWorkflowEventProcessorResult> {
  const eventTransitionResult = await applyEventTriggerToQueueItem(db, input);

  if (!eventTransitionResult.applied) {
    return {
      applied: false,
      status: "skipped",
      reason: eventTransitionResult.reason,
      bindingId: input.bindingId,
      eventTransitionResult,
      effects: [],
    };
  }

  return {
    applied: true,
    status: "applied",
    bindingId: eventTransitionResult.bindingId,
    workflowKey: eventTransitionResult.workflowKey,
    fromState: eventTransitionResult.fromState,
    toState: eventTransitionResult.toState,
    nextState: eventTransitionResult.toState,
    terminal: eventTransitionResult.terminal,
    eventTransitionResult,
    effects: [],
  };
}
