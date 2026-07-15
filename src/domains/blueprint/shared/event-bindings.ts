import type { WorkTypeCoordinationContext } from "@/domains/task/server/work-type.types";

export type WorkspaceEventBindingConsumer =
  | "coordination"
  | "workflow"
  | "timeline"
  | "notification";

export type WorkspaceEventBindingEffect =
  | "AUTO_BIND"
  | "APPLY_WORKFLOW"
  | "WRITE_ACTIVITY";

export type WorkspaceEventBindingStatus = "ACTIVE" | "DRAFT" | "DEPRECATED";

export type WorkspaceEventBindingMode = "INTAKE" | "PROGRESS";

export type WorkspaceEventBindingScopeType = "CURRENT_ACTIVE_WEEKLY_SPACE";

export type WorkspaceEventBindingSource = "BLUEPRINT";

export type WorkspaceEventBinding = {
  eventKey: string;
  targetType: string;
  consumer: WorkspaceEventBindingConsumer;
  scopeType: WorkspaceEventBindingScopeType;
  scopeContext: WorkTypeCoordinationContext;
  workTypeKey: string;
  mode: WorkspaceEventBindingMode;
  effects: WorkspaceEventBindingEffect[];
  status: WorkspaceEventBindingStatus;
  source: WorkspaceEventBindingSource;
};

const WATCH_MEDIA_PIPELINE_BINDINGS: Array<{
  eventKey: string;
  workTypeKey: string;
  mode: WorkspaceEventBindingMode;
  status?: WorkspaceEventBindingStatus;
}> = [
  {
    eventKey: "watch.media.photoshoot.requested",
    workTypeKey: "photography",
    mode: "INTAKE",
  },
  {
    eventKey: "watch.media.photoshoot.completed",
    workTypeKey: "media-processing",
    mode: "INTAKE",
  },
  {
    eventKey: "watch.media.asset.attached",
    workTypeKey: "media-processing",
    mode: "INTAKE",
  },
  {
    eventKey: "watch.content.submitted",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.content.rejected",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.content.approved",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.content.unapproved",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.image.submitted",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.image.rejected",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.image.approved",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.image.unapproved",
    workTypeKey: "media-processing",
    mode: "PROGRESS",
  },
  {
    eventKey: "watch.media.ready_for_publish",
    workTypeKey: "publish",
    mode: "INTAKE",
  },
  {
    eventKey: "watch.media.recalled",
    workTypeKey: "media-processing",
    mode: "INTAKE",
  },
  {
    eventKey: "watch.publish.assets.downloaded",
    workTypeKey: "publish",
    mode: "PROGRESS",
  },
];

const SERVICE_OPERATION_BINDINGS: Array<{
  eventKey: string;
  targetType: "SERVICE_REQUEST" | "TECHNICAL_ISSUE" | "PAYMENT";
  mode: WorkspaceEventBindingMode;
  effects: WorkspaceEventBindingEffect[];
  status?: WorkspaceEventBindingStatus;
}> = [
  {
    eventKey: "service_request.created",
    targetType: "SERVICE_REQUEST",
    mode: "INTAKE",
    effects: ["AUTO_BIND", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "service_request.status_changed",
    targetType: "SERVICE_REQUEST",
    mode: "PROGRESS",
    effects: ["WRITE_ACTIVITY"],
  },
  {
    eventKey: "technical_issue.created",
    targetType: "TECHNICAL_ISSUE",
    mode: "INTAKE",
    effects: ["AUTO_BIND", "APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "technical_issue.confirmed",
    targetType: "TECHNICAL_ISSUE",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "technical_issue.started",
    targetType: "TECHNICAL_ISSUE",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "technical_issue.stage_changed",
    targetType: "TECHNICAL_ISSUE",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
  },
  {
    eventKey: "technical_issue.completed",
    targetType: "TECHNICAL_ISSUE",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "technical_issue.reopened",
    targetType: "TECHNICAL_ISSUE",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
  },
  {
    eventKey: "payment.created",
    targetType: "PAYMENT",
    mode: "PROGRESS",
    effects: ["WRITE_ACTIVITY"],
  },
  {
    eventKey: "payment.status_updated",
    targetType: "PAYMENT",
    mode: "PROGRESS",
    effects: ["WRITE_ACTIVITY"],
  },
];

const PAYMENT_COLLECTION_BINDINGS: Array<{
  eventKey: string;
  mode: WorkspaceEventBindingMode;
  effects: WorkspaceEventBindingEffect[];
  status?: WorkspaceEventBindingStatus;
}> = [
  {
    eventKey: "payment.created",
    mode: "INTAKE",
    effects: ["AUTO_BIND", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "payment.status_updated",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
  {
    eventKey: "payment.paid",
    mode: "PROGRESS",
    effects: ["APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
  },
];

export function eventBindingsForWorkType(input: {
  workTypeKey: string;
  coordinationContext: WorkTypeCoordinationContext | "DRAFT";
}): WorkspaceEventBinding[] {
  if (
    input.coordinationContext === "TECHNICAL" &&
    input.workTypeKey === "service-operation"
  ) {
    return SERVICE_OPERATION_BINDINGS.map((binding) => ({
      eventKey: binding.eventKey,
      targetType: binding.targetType,
      consumer: "coordination",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "TECHNICAL",
      workTypeKey: "service-operation",
      mode: binding.mode,
      effects: binding.effects,
      status: binding.status ?? "DRAFT",
      source: "BLUEPRINT",
    }));
  }

  if (
    input.coordinationContext === "PAYMENT" &&
    input.workTypeKey === "payment"
  ) {
    return PAYMENT_COLLECTION_BINDINGS.map((binding) => ({
      eventKey: binding.eventKey,
      targetType: "PAYMENT",
      consumer: "coordination",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "PAYMENT",
      workTypeKey: "payment",
      mode: binding.mode,
      effects: binding.effects,
      status: binding.status ?? "DRAFT",
      source: "BLUEPRINT",
    }));
  }

  if (input.coordinationContext !== "MEDIA") {
    return [];
  }

  return WATCH_MEDIA_PIPELINE_BINDINGS
    .filter((binding) => binding.workTypeKey === input.workTypeKey)
    .map((binding) => ({
      eventKey: binding.eventKey,
      targetType: "WATCH",
      consumer: "coordination",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      workTypeKey: binding.workTypeKey,
      mode: binding.mode,
      effects: ["AUTO_BIND", "APPLY_WORKFLOW", "WRITE_ACTIVITY"],
      status: binding.status ?? "ACTIVE",
      source: "BLUEPRINT",
    }));
}

export function normalizeEventKey(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function normalizeTargetType(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export function eventBindingConflictKey(binding: Pick<
  WorkspaceEventBinding,
  "eventKey" | "targetType" | "consumer" | "scopeType" | "scopeContext"
>) {
  return [
    normalizeEventKey(binding.eventKey),
    normalizeTargetType(binding.targetType),
    binding.consumer,
    binding.scopeType,
    binding.scopeContext,
  ].join("::");
}
