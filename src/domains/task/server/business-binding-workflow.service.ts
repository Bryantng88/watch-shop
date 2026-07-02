import type { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import {
  getWorkflowDefinition,
  resolveWorkflowDefinition,
} from "@/domains/workflow-definition/server";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server";
import { createSystemActivity } from "./activity";
import { getWorkTypeWorkflowDefinition } from "./work-type.service";
import {
  findBusinessBindingById,
  updateBusinessBindingMetadata,
} from "./business-binding.repo";
import type {
  BusinessBinding,
  QueueItemManualTransitionDTO,
  WorkflowRuntimeState,
} from "./business-binding.types";

export type EventTriggerTransitionSkipReason =
  | "BINDING_NOT_FOUND"
  | "MISSING_BUSINESS_EVENT_LOG_ID"
  | "NO_WORKFLOW_RUNTIME"
  | "WORKFLOW_DEFINITION_MISSING"
  | "ALREADY_APPLIED"
  | "NO_MATCHING_TRANSITION";

export type ApplyEventTriggerToQueueItemInput = {
  bindingId: string;
  eventKey: string;
  businessEventLogId: string;
  actorUserId?: string | null;
  metadataJson?: Prisma.JsonValue | null;
};

export type ApplyEventTriggerToQueueItemResult =
  | {
    applied: true;
    bindingId: string;
    workflowKey: string;
    fromState: string;
    toState: string;
    terminal: boolean;
  }
  | {
    applied: false;
    bindingId: string;
    reason: EventTriggerTransitionSkipReason;
  };

export type ManualTriggerTransitionSkipReason =
  | "BINDING_NOT_FOUND"
  | "NO_WORKFLOW_RUNTIME"
  | "WORKFLOW_DEFINITION_MISSING"
  | "MISSING_ACTOR"
  | "MISSING_TARGET_STATE"
  | "ALREADY_IN_STATE"
  | "NO_MATCHING_TRANSITION";

export type ApplyManualTriggerToQueueItemInput = {
  bindingId: string;
  actionKey?: string | null;
  toState?: string | null;
  transitionKey?: string | null;
  actorUserId?: string | null;
  actorLabel?: string | null;
  note?: string | null;
  metadataJson?: Prisma.JsonValue | null;
};

export type ApplyManualTriggerToQueueItemResult =
  | {
    applied: true;
    bindingId: string;
    taskItemId: string;
    workflowKey: string;
    fromState: string;
    toState: string;
    toStateLabel: string;
    terminal: boolean;
  }
  | {
    applied: false;
    bindingId: string;
    reason: ManualTriggerTransitionSkipReason;
  };

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function toJsonObject(value: unknown): Prisma.JsonObject {
  return { ...asRecord(value) } as Prisma.JsonObject;
}

function nowIso() {
  return new Date().toISOString();
}

function transitionKey(fromState: string, toState: string) {
  return `${fromState}->${toState}`;
}

function manualActionKey(input: {
  fromState: string;
  toState: string;
  triggerValue?: string | null;
}) {
  return clean(input.triggerValue) || transitionKey(input.fromState, input.toState);
}

function getWorkflowRuntimeMetadata(metadataJson: unknown) {
  return asRecord(asRecord(metadataJson).workflowRuntime);
}

function isPublishWorkflow(workflowKey: string) {
  return workflowKey === "watch-publish";
}

function bool(value: unknown) {
  return value === true;
}

function derivePublishRuntimeState(metadata: Record<string, unknown>) {
  if (bool(metadata.contentApproved) && bool(metadata.imageApproved)) {
    return "DONE";
  }

  if (bool(metadata.contentRejected)) return "CONTENT_FEEDBACK";
  if (bool(metadata.imageRejected)) return "IMAGE_FEEDBACK";
  if (bool(metadata.contentSubmitted) && !bool(metadata.contentApproved)) {
    return "CONTENT_REVIEW";
  }
  if (bool(metadata.imageSubmitted) && !bool(metadata.imageApproved)) {
    return "IMAGE_REVIEW";
  }
  if (bool(metadata.contentApproved) && !bool(metadata.imageApproved)) {
    return "WAITING_IMAGE";
  }
  if (bool(metadata.imageApproved) && !bool(metadata.contentApproved)) {
    return "WAITING_CONTENT";
  }

  return "WAITING_CONTENT";
}

function updatePublishRuntimeMetadataForEvent(
  metadata: Record<string, unknown>,
  eventKey: string,
) {
  const next = { ...metadata };

  if (eventKey === "watch.content.submitted") {
    next.contentSubmitted = true;
    next.contentRejected = false;
  }

  if (eventKey === "watch.content.rejected") {
    next.contentSubmitted = true;
    next.contentApproved = false;
    next.contentRejected = true;
  }

  if (eventKey === "watch.content.approved") {
    next.contentSubmitted = true;
    next.contentApproved = true;
    next.contentRejected = false;
  }

  if (eventKey === "watch.image.submitted") {
    next.imageSubmitted = true;
    next.imageRejected = false;
  }

  if (eventKey === "watch.image.rejected") {
    next.imageSubmitted = true;
    next.imageApproved = false;
    next.imageRejected = true;
  }

  if (eventKey === "watch.image.approved") {
    next.imageSubmitted = true;
    next.imageApproved = true;
    next.imageRejected = false;
  }

  return next;
}

export function getQueueItemWorkflowState(
  binding: { metadataJson: unknown },
): WorkflowRuntimeState | null {
  const runtime = getWorkflowRuntimeMetadata(binding.metadataJson);
  const workflowKey = clean(runtime.workflowKey);
  const currentState = clean(runtime.currentState);
  const startedAt = clean(runtime.startedAt);
  const updatedAt = clean(runtime.updatedAt);

  if (!workflowKey || !currentState || !startedAt || !updatedAt) return null;

  return {
    workflowKey,
    currentState,
    startedAt,
    updatedAt,
    completedAt: clean(runtime.completedAt) || null,
    metadata: Object.keys(asRecord(runtime.metadata)).length
      ? toJsonObject(runtime.metadata)
      : null,
  };
}

function getManualTransitionDTOs(
  workflowDefinition: WorkflowDefinition,
  currentState: string,
  options?: { includeDisabled?: boolean },
): QueueItemManualTransitionDTO[] {
  return workflowDefinition.transitions
    .filter(
      (transition) =>
        transition.triggerType === "MANUAL" &&
        (options?.includeDisabled || transition.fromState === currentState) &&
        clean(transition.manualActionLabel),
    )
    .map((transition) => {
      const enabled = transition.fromState === currentState;
      return {
        actionKey: manualActionKey(transition),
        label: clean(transition.manualActionLabel),
        fromState: transition.fromState,
        toState: transition.toState,
        manualActionLabel: clean(transition.manualActionLabel),
        enabled,
        reason: enabled ? null : "Action is not available from the current workflow state.",
        metadata: transition.metadata,
      };
    });
}

function resolveBindingWorkflowDefinition(metadataJson: unknown) {
  const metadata = asRecord(metadataJson);
  const workflowKey = clean(metadata.workflowKey);

  if (workflowKey) {
    const workflowDefinition = getWorkflowDefinition(workflowKey);
    if (!workflowDefinition) {
      throw new Error(`Workflow definition "${workflowKey}" is missing.`);
    }

    return workflowDefinition;
  }

  const workTypeKey = clean(metadata.workTypeKey);
  if (!workTypeKey) return null;

  return getWorkTypeWorkflowDefinition(workTypeKey);
}

export function initializeQueueItemWorkflowState(
  binding: { metadataJson: unknown; createdAt?: Date | string | null },
  workflowDefinition?: WorkflowDefinition | null,
) {
  const metadata = toJsonObject(binding.metadataJson);
  const existingRuntime = getQueueItemWorkflowState(binding);
  if (existingRuntime) return metadata;

  const definition =
    workflowDefinition ?? resolveBindingWorkflowDefinition(binding.metadataJson);
  if (!definition) return metadata;

  const timestamp =
    binding.createdAt instanceof Date
      ? binding.createdAt.toISOString()
      : clean(binding.createdAt) || nowIso();
  const runtime: WorkflowRuntimeState = {
    workflowKey: definition.key,
    currentState: definition.initialState,
    startedAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
    metadata: null,
  };

  return {
    ...metadata,
    workflowKey: clean(metadata.workflowKey) || definition.key,
    workflowRuntime: runtime as unknown as Prisma.JsonObject,
  } satisfies Prisma.JsonObject;
}

export async function ensureQueueItemWorkflowState(
  db: DB,
  binding: BusinessBinding,
) {
  if (getQueueItemWorkflowState(binding)) return binding;

  const metadataJson = initializeQueueItemWorkflowState(binding);
  if (!metadataJson.workflowRuntime) return binding;

  return updateBusinessBindingMetadata(db, binding.id, metadataJson);
}

export async function updateQueueItemWorkflowState(
  db: DB,
  bindingId: string,
  nextState: string,
  metadata?: Prisma.JsonObject | null,
) {
  const binding = await findBusinessBindingById(db, bindingId);
  if (!binding) throw new Error(`BusinessBinding "${bindingId}" was not found.`);

  const runtime = getQueueItemWorkflowState(binding);
  if (!runtime) {
    throw new Error(
      `BusinessBinding "${bindingId}" does not have workflowRuntime initialized.`,
    );
  }

  const workflowDefinition = resolveWorkflowDefinition(runtime.workflowKey);
  if (!workflowDefinition) {
    throw new Error(`Workflow definition "${runtime.workflowKey}" is missing.`);
  }

  const cleanNextState = clean(nextState);
  if (!cleanNextState) throw new Error("Missing next workflow state.");

  const timestamp = nowIso();
  const completedAt = workflowDefinition.terminalStates.includes(cleanNextState)
    ? timestamp
    : null;
  const metadataJson = {
    ...toJsonObject(binding.metadataJson),
    workflowRuntime: {
      ...runtime,
      currentState: cleanNextState,
      updatedAt: timestamp,
      completedAt,
      metadata: metadata ?? runtime.metadata ?? null,
    },
  } satisfies Prisma.JsonObject;

  return updateBusinessBindingMetadata(db, binding.id, metadataJson);
}

export async function applyEventTriggerToQueueItem(
  db: DB,
  input: ApplyEventTriggerToQueueItemInput,
): Promise<ApplyEventTriggerToQueueItemResult> {
  const bindingId = clean(input.bindingId);
  const eventKey = clean(input.eventKey).toLowerCase();
  const businessEventLogId = clean(input.businessEventLogId);

  if (!businessEventLogId) {
    return {
      applied: false,
      bindingId,
      reason: "MISSING_BUSINESS_EVENT_LOG_ID",
    };
  }

  const binding = await findBusinessBindingById(db, bindingId);
  if (!binding) {
    return {
      applied: false,
      bindingId,
      reason: "BINDING_NOT_FOUND",
    };
  }

  const runtime = getQueueItemWorkflowState(binding);
  if (!runtime) {
    return {
      applied: false,
      bindingId,
      reason: "NO_WORKFLOW_RUNTIME",
    };
  }

  const runtimeMetadata = asRecord(runtime.metadata);
  if (clean(runtimeMetadata.lastBusinessEventLogId) === businessEventLogId) {
    return {
      applied: false,
      bindingId,
      reason: "ALREADY_APPLIED",
    };
  }

  const workflowDefinition = resolveWorkflowDefinition(runtime.workflowKey);
  if (!workflowDefinition) {
    return {
      applied: false,
      bindingId,
      reason: "WORKFLOW_DEFINITION_MISSING",
    };
  }

  if (isPublishWorkflow(runtime.workflowKey)) {
    const publishEvents = new Set([
      "watch.content.submitted",
      "watch.content.rejected",
      "watch.content.approved",
      "watch.image.submitted",
      "watch.image.rejected",
      "watch.image.approved",
    ]);

    if (!publishEvents.has(eventKey)) {
      return {
        applied: false,
        bindingId,
        reason: "NO_MATCHING_TRANSITION",
      };
    }

    const timestamp = nowIso();
    const nextMetadata = updatePublishRuntimeMetadataForEvent(
      runtimeMetadata,
      eventKey,
    );
    const nextState = derivePublishRuntimeState(nextMetadata);
    const terminal = workflowDefinition.terminalStates.includes(nextState);
    const nextRuntime: WorkflowRuntimeState = {
      ...runtime,
      currentState: nextState,
      updatedAt: timestamp,
      completedAt: terminal ? timestamp : null,
      metadata: {
        ...nextMetadata,
        lastTriggerType: "EVENT",
        lastTriggerValue: eventKey,
        lastBusinessEventLogId: businessEventLogId,
        ...(input.actorUserId ? { lastActorUserId: input.actorUserId } : {}),
        ...(input.metadataJson ? { lastTriggerMetadata: input.metadataJson } : {}),
      } as Prisma.JsonObject,
    };
    const metadataJson = {
      ...toJsonObject(binding.metadataJson),
      workflowRuntime: nextRuntime as unknown as Prisma.JsonObject,
    } satisfies Prisma.JsonObject;

    await updateBusinessBindingMetadata(db, binding.id, metadataJson);

    return {
      applied: true,
      bindingId: binding.id,
      workflowKey: runtime.workflowKey,
      fromState: runtime.currentState,
      toState: nextState,
      terminal,
    };
  }

  const transition = workflowDefinition.transitions.find(
    (item) =>
      item.fromState === runtime.currentState &&
      item.triggerType === "EVENT" &&
      clean(item.triggerValue).toLowerCase() === eventKey,
  );

  if (!transition) {
    return {
      applied: false,
      bindingId,
      reason: "NO_MATCHING_TRANSITION",
    };
  }

  const timestamp = nowIso();
  const terminal = workflowDefinition.terminalStates.includes(
    transition.toState,
  );
  const nextRuntime: WorkflowRuntimeState = {
    ...runtime,
    currentState: transition.toState,
    updatedAt: timestamp,
    completedAt: terminal ? timestamp : runtime.completedAt ?? null,
    metadata: {
      ...runtimeMetadata,
      lastTriggerType: "EVENT",
      lastTriggerValue: eventKey,
      lastBusinessEventLogId: businessEventLogId,
      ...(input.actorUserId ? { lastActorUserId: input.actorUserId } : {}),
      ...(input.metadataJson ? { lastTriggerMetadata: input.metadataJson } : {}),
    } as Prisma.JsonObject,
  };
  const metadataJson = {
    ...toJsonObject(binding.metadataJson),
    workflowRuntime: nextRuntime as unknown as Prisma.JsonObject,
  } satisfies Prisma.JsonObject;

  await updateBusinessBindingMetadata(db, binding.id, metadataJson);

  return {
    applied: true,
    bindingId: binding.id,
    workflowKey: runtime.workflowKey,
    fromState: runtime.currentState,
    toState: transition.toState,
    terminal,
  };
}

export async function listAvailableManualTransitions(
  db: DB,
  bindingId: string,
): Promise<QueueItemManualTransitionDTO[]> {
  const binding = await findBusinessBindingById(db, bindingId);
  if (!binding) return [];

  const runtime = getQueueItemWorkflowState(binding);
  if (!runtime) return [];

  const workflowDefinition = resolveWorkflowDefinition(runtime.workflowKey);
  if (!workflowDefinition) return [];

  return getManualTransitionDTOs(workflowDefinition, runtime.currentState);
}

export async function listAvailableManualActions(
  db: DB,
  itemId: string,
): Promise<QueueItemManualTransitionDTO[]> {
  const binding = await findBusinessBindingById(db, itemId);
  if (!binding) return [];

  const runtime = getQueueItemWorkflowState(binding);
  if (!runtime) return [];

  const workflowDefinition = resolveWorkflowDefinition(runtime.workflowKey);
  if (!workflowDefinition) return [];

  return getManualTransitionDTOs(workflowDefinition, runtime.currentState, {
    includeDisabled: true,
  });
}

export function listAvailableManualTransitionsForQueueItem(input: {
  workflowDefinition: WorkflowDefinition | null;
  currentState: string | null;
}) {
  if (!input.workflowDefinition || !input.currentState) return [];

  return getManualTransitionDTOs(
    input.workflowDefinition,
    input.currentState,
  );
}

export async function applyManualTriggerToQueueItem(
  db: DB,
  input: ApplyManualTriggerToQueueItemInput,
): Promise<ApplyManualTriggerToQueueItemResult> {
  const bindingId = clean(input.bindingId);
  const actorUserId = clean(input.actorUserId);
  const requestedActionKey = clean(input.actionKey);
  const requestedToState = clean(input.toState);
  const requestedTransitionKey = clean(input.transitionKey);

  if (!actorUserId) {
    return { applied: false, bindingId, reason: "MISSING_ACTOR" };
  }

  if (!requestedActionKey && !requestedToState && !requestedTransitionKey) {
    return { applied: false, bindingId, reason: "MISSING_TARGET_STATE" };
  }

  const binding = await findBusinessBindingById(db, bindingId);
  if (!binding) {
    return { applied: false, bindingId, reason: "BINDING_NOT_FOUND" };
  }

  const runtime = getQueueItemWorkflowState(binding);
  if (!runtime) {
    return { applied: false, bindingId, reason: "NO_WORKFLOW_RUNTIME" };
  }

  const workflowDefinition = resolveWorkflowDefinition(runtime.workflowKey);
  if (!workflowDefinition) {
    return {
      applied: false,
      bindingId,
      reason: "WORKFLOW_DEFINITION_MISSING",
    };
  }

  const transition = workflowDefinition.transitions.find((item) => {
    if (item.triggerType !== "MANUAL") return false;
    if (item.fromState !== runtime.currentState) return false;
    if (requestedActionKey && manualActionKey(item) !== requestedActionKey) return false;
    if (requestedToState && item.toState !== requestedToState) return false;
    if (
      requestedTransitionKey &&
      transitionKey(item.fromState, item.toState) !== requestedTransitionKey
    ) {
      return false;
    }

    return true;
  });

  if (!transition) {
    return { applied: false, bindingId, reason: "NO_MATCHING_TRANSITION" };
  }

  if (runtime.currentState === transition.toState) {
    return { applied: false, bindingId, reason: "ALREADY_IN_STATE" };
  }

  const timestamp = nowIso();
  const terminal = workflowDefinition.terminalStates.includes(
    transition.toState,
  );
  const runtimeMetadata = asRecord(runtime.metadata);
  const nextRuntime: WorkflowRuntimeState = {
    ...runtime,
    currentState: transition.toState,
    updatedAt: timestamp,
    completedAt: terminal ? timestamp : runtime.completedAt ?? null,
    metadata: {
      ...runtimeMetadata,
      lastTriggerType: "MANUAL",
      lastTriggerValue: manualActionKey(transition),
      lastManualActionKey: manualActionKey(transition),
      lastManualActorUserId: actorUserId,
      lastManualNote: clean(input.note) || null,
      lastManualAt: timestamp,
      ...(input.metadataJson ? { lastManualMetadata: input.metadataJson } : {}),
    } as Prisma.JsonObject,
  };
  const metadataJson = {
    ...toJsonObject(binding.metadataJson),
    workflowRuntime: nextRuntime as unknown as Prisma.JsonObject,
  } satisfies Prisma.JsonObject;
  const updated = await updateBusinessBindingMetadata(
    db,
    binding.id,
    metadataJson,
  );
  const toStateLabel = getWorkflowStateLabel(
    workflowDefinition,
    transition.toState,
  ) ?? transition.toState;
  const actorLabel = clean(input.actorLabel) || "User";

  if (updated.taskItemId) {
    await createSystemActivity({
      taskItemId: updated.taskItemId,
      sourceId: `${binding.id}:${timestamp}`,
      title: `${actorLabel} ${clean(transition.manualActionLabel) || `chuyển sang ${toStateLabel}`}`,
      body: clean(input.note) || null,
      actorUserId,
      metadataJson: {
        bindingId: binding.id,
        targetType: binding.targetType,
        targetId: binding.targetId,
        workflowKey: runtime.workflowKey,
        fromState: runtime.currentState,
        toState: transition.toState,
        actionKey: manualActionKey(transition),
        actionLabel: clean(transition.manualActionLabel) || null,
        triggerType: "MANUAL",
      },
    }, db);
  }

  return {
    applied: true,
    bindingId: binding.id,
    taskItemId: updated.taskItemId ?? "",
    workflowKey: runtime.workflowKey,
    fromState: runtime.currentState,
    toState: transition.toState,
    toStateLabel,
    terminal,
  };
}

export const applyManualWorkflowAction = applyManualTriggerToQueueItem;

export function getWorkflowStateLabel(
  workflowDefinition: WorkflowDefinition | null,
  stateKey: string | null,
) {
  if (!workflowDefinition || !stateKey) return null;

  return workflowDefinition.states.find((state) => state.key === stateKey)?.title ??
    stateKey;
}
