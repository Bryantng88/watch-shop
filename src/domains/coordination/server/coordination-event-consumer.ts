import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
  type Prisma,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  ensureTaskItemBusinessBinding,
  findTaskItemBusinessBinding,
} from "@/domains/task/server/business-binding.service";
import { processEventWorkspaceWorkflowTransition } from "@/domains/task/server/workspace-workflow-processor";
import { createBusinessEventActivity } from "@/domains/task/server/activity/task-item-activity.service";
import {
  getWorkTypeKeyFromTicketNote,
  resolveCurrentCoordinationCycle,
} from "./coordination-cycle.service";
import {
  parseWorkspaceDefinitionSnapshot,
} from "@/domains/blueprint/shared/workspace-capabilities";
import {
  normalizeEventKey,
  normalizeTargetType,
  type WorkspaceEventBinding,
} from "@/domains/blueprint/shared/event-bindings";
import {
  operationalEventRouteForWorkType,
  operationalWorkspaceRoleExists,
} from "@/domains/blueprint/shared/operational-blueprint";
import {
  ensureDeferredWorkspaceFromPublishedBlueprintEvent,
} from "@/domains/blueprint/server";
import {
  getTimelineBody,
  getTimelineTitle,
} from "@/domains/shared/timeline/server/timeline-event-consumer";
import { getWorkTypeDefinition } from "@/domains/task/server/work-type.service";
import { getCoordinationRoute } from "./coordination-router.registry";
import { routeBusinessEvent } from "./coordination-router.service";
import type { CoordinationContext } from "./coordination-cycle.types";
import type {
  CoordinationBusinessEvent,
  CoordinationRoute,
} from "./coordination-router.types";

export type CoordinationConsumerSkipReason =
  | "NO_ROUTE"
  | "ROUTE_DISABLED"
  | "UNSUPPORTED_COORDINATION_TYPE"
  | "UNSUPPORTED_TARGET_TYPE"
  | "MISSING_BUSINESS_EVENT_LOG_ID"
  | "MISSING_TARGET_ID"
  | "NO_ACTIVE_COORDINATION_CYCLE"
  | "NO_ACTIVE_BINDING_SCOPE"
  | "NO_WORK_TICKET"
  | "NO_ACTIVE_SCOPE_ITEM"
  | "NO_BLUEPRINT_EVENT_BINDING"
  | "NO_EXISTING_WORKSPACE_ITEM"
  | "DUPLICATE_BLUEPRINT_EVENT_BINDING";

export type CoordinationEventConsumerInput = CoordinationBusinessEvent & {
  id?: string | null;
  businessEventLogId?: string | null;
  metadataJson?: Prisma.JsonValue | null;
  createdAt?: Date | string | null;
  targetAliasIds?: string[];
};

export type CoordinationEventConsumerResult =
  | {
    ok: true;
    skipped: true;
    reason: CoordinationConsumerSkipReason;
    route?: CoordinationRoute | null;
    scope?: CoordinationBindingScope | null;
  }
  | {
    ok: true;
    skipped: false;
    route: CoordinationRoute;
    taskId: string;
    taskItemId: string;
    bindingId: string;
    bindingCreated: boolean;
    activityId: string;
    scope: CoordinationBindingScope;
      workflow: unknown;
    };

export type CoordinationEventDiagnosticResult =
  | {
    ok: true;
    skipped: true;
    reason: CoordinationConsumerSkipReason;
    route?: CoordinationRoute | null;
    scope?: CoordinationBindingScope | null;
  }
  | {
    ok: true;
    skipped: false;
    route: CoordinationRoute;
    scope: CoordinationBindingScope;
    taskId: string;
    taskItemId: string;
    targetType: string;
    targetId: string;
    canonicalTargetId: string;
    bindingId: string | null;
    bindingExists: boolean;
    bindingMode: string;
    eventBindingStatus: string;
    eventBindingSource: WorkTicketResolution["source"];
  };

const TARGET_TYPES = new Set<string>(Object.values(TaskExecutionTargetType));

type CoordinationBindingScope = {
  scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE" | "PUBLISHED_BLUEPRINT_SPACE";
  context: CoordinationContext;
  coordinationType: string;
  workTypeKey: string;
  taskId?: string;
  taskItemId?: string;
};

type WorkTicketResolution = {
  item: NonNullable<
    Awaited<ReturnType<typeof findActiveCoordinationTask>>["task"]
  >["taskItems"][number];
  eventBinding: WorkspaceEventBinding;
  source: "BLUEPRINT_SNAPSHOT";
};

type ServiceOperationWorkspaceRole = "INSPECT" | "PROCESSING" | "DONE";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function normalizeMatchKey(value: unknown) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function metadataStringArray(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  if (Array.isArray(value)) return value.map(clean).filter(Boolean);
  const text = clean(value);
  return text ? [text] : [];
}

function formatDateMetadata(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function coordinationTypeToContext(
  coordinationType: string,
): CoordinationContext | null {
  const normalized = clean(coordinationType).toLowerCase();

  if (normalized === "operation") return "OPERATION";
  if (normalized === "sales") return "SALES";
  if (normalized === "technical" || normalized === "service") {
    return "TECHNICAL";
  }
  if (normalized === "media") return "MEDIA";
  if (normalized === "payment" || normalized === "payments") return "PAYMENT";
  if (normalized === "general" || normalized === "business") return "GENERAL";

  return null;
}

function isSupportedTargetType(
  targetType: string,
): targetType is TaskExecutionTargetType {
  return TARGET_TYPES.has(targetType);
}

async function findActiveCoordinationTask(
  db: DB,
  route: CoordinationRoute,
) {
  const context = coordinationTypeToContext(route.coordinationType);
  if (!context) return { task: null, context: null, unsupported: true };

  const cycle = await resolveCurrentCoordinationCycle(db, {
    context,
    createIfMissing: true,
  });

  if (!cycle) return { task: null, context, unsupported: false };

  const task = await dbOrTx(db).task.findFirst({
    where: {
      id: cycle.task.id,
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    },
    select: {
      id: true,
      taskItems: {
        where: {
          status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
        },
        select: {
          id: true,
          title: true,
          note: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
    orderBy: [{ createdAt: "asc" }],
  });

  return { task, context, unsupported: false };
}

function routeScope(route: CoordinationRoute, context: CoordinationContext): CoordinationBindingScope {
  return {
    scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
    context,
    coordinationType: route.coordinationType,
    workTypeKey: route.workTypeKey,
  };
}

function workTicketCandidates(route: CoordinationRoute, context: CoordinationContext) {
  const metadata = asRecord(route.metadata);
  const workType = getWorkTypeDefinition(context, route.workTypeKey);
  const values = [
    route.workTypeKey,
    workType?.key,
    workType?.title,
    ...(workType?.routingKeys ?? []),
    ...metadataStringArray(metadata, "workTypeAliases"),
    ...metadataStringArray(metadata, "workTypeTitles"),
    ...metadataStringArray(metadata, "taskItemTitles"),
  ];

  return new Set(values.map(normalizeMatchKey).filter(Boolean));
}

function eventBindingsFromNote(note: string | null | undefined) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const bindings =
    snapshot?.eventBindings ??
    snapshot?.workspaceDefinition?.eventBindings ??
    [];

  return Array.isArray(bindings) ? bindings : [];
}

function isAutoBindingReceiverNote(note: string | null | undefined) {
  return /^blueprintAutoBindingReceiver:\s*true\s*$/im.test(String(note ?? ""));
}

function serviceOperationWorkspaceRoleFromNote(
  note: string | null | undefined,
): ServiceOperationWorkspaceRole | null {
  const value = String(note ?? "")
    .match(/^serviceOperationWorkspaceRole:\s*(INSPECT|PROCESSING|DONE)\s*$/im)?.[1]
    ?.toUpperCase();

  if (
    value === "INSPECT" ||
    value === "PROCESSING" ||
    value === "DONE"
  ) {
    return value;
  }

  return null;
}

function serviceOperationWorkspaceRoleValue(
  value: unknown,
): ServiceOperationWorkspaceRole | null {
  const normalized = clean(value).toUpperCase();

  if (
    normalized === "INSPECT" ||
    normalized === "PROCESSING" ||
    normalized === "DONE"
  ) {
    return normalized;
  }

  return null;
}

function isServiceOperationTechnicalRoute(input: {
  route: CoordinationRoute;
  targetType: string;
}) {
  return (
    normalizeMatchKey(input.route.workTypeKey) === "service operation" &&
    normalizeTargetType(input.targetType) === "TECHNICAL_ISSUE"
  );
}

function scopeServiceOperationWorkspaceTickets<T extends { item: { note: string | null } }>(
  tickets: T[],
  input: {
    route: CoordinationRoute;
    targetType: string;
    workspaceRole?: ServiceOperationWorkspaceRole | null;
  },
) {
  if (!input.workspaceRole || !isServiceOperationTechnicalRoute(input)) {
    return tickets;
  }

  const hasRoleReceivers = tickets.some((ticket) =>
    serviceOperationWorkspaceRoleFromNote(ticket.item.note),
  );

  if (!hasRoleReceivers) return tickets;

  return tickets.filter(
    (ticket) => serviceOperationWorkspaceRoleFromNote(ticket.item.note) === input.workspaceRole,
  );
}

function workTypeKeyFromWorkspaceSnapshot(note: string | null | undefined) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  return clean(
    snapshot?.workspaceDefinition?.workTypeKey ??
      snapshot?.workTypeKey ??
      getWorkTypeKeyFromTicketNote(note),
  );
}

function effectiveReceiverEventBinding(input: {
  eventKey: string;
  targetType: string;
  context: CoordinationContext;
  route: CoordinationRoute;
}): WorkspaceEventBinding {
  const metadata = asRecord(input.route.metadata);
  const mode = clean(metadata.bindingMode).toUpperCase() === "PROGRESS"
    ? "PROGRESS"
    : "INTAKE";

  return {
    eventKey: input.eventKey,
    targetType: normalizeTargetType(input.targetType),
    consumer: "coordination",
    scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
    scopeContext: input.context,
    workTypeKey: input.route.workTypeKey,
    mode,
    effects: ["AUTO_BIND", "APPLY_WORKFLOW", "WRITE_ACTIVITY"],
    status: "ACTIVE",
    source: "BLUEPRINT",
  };
}

function eventBindingWithEffectiveRouteMode(input: {
  binding: WorkspaceEventBinding;
  eventKey: string;
  targetType: string;
  context: CoordinationContext;
  route: CoordinationRoute;
}): WorkspaceEventBinding {
  const effective = effectiveReceiverEventBinding({
    eventKey: input.eventKey,
    targetType: input.targetType,
    context: input.context,
    route: input.route,
  });

  return {
    ...input.binding,
    mode: effective.mode,
  };
}

function eventBindingMatches(input: {
  binding: WorkspaceEventBinding;
  eventKey: string;
  targetType: string;
  context: CoordinationContext;
  route: CoordinationRoute;
}) {
  return (
    input.binding.status === "ACTIVE" &&
    input.binding.consumer === "coordination" &&
    normalizeEventKey(input.binding.eventKey) === input.eventKey &&
    normalizeTargetType(input.binding.targetType) === input.targetType &&
    input.binding.scopeType === "CURRENT_ACTIVE_WEEKLY_SPACE" &&
    input.binding.scopeContext === input.context &&
    normalizeMatchKey(input.binding.workTypeKey) ===
      normalizeMatchKey(input.route.workTypeKey)
  );
}

function eventBindingMatchesCurrentRoute(input: {
  binding: WorkspaceEventBinding;
  eventKey: string;
  targetType: string;
  context: CoordinationContext;
  route: CoordinationRoute;
}) {
  return (
    input.binding.consumer === "coordination" &&
    normalizeEventKey(input.binding.eventKey) === input.eventKey &&
    normalizeTargetType(input.binding.targetType) === input.targetType &&
    input.binding.scopeType === "CURRENT_ACTIVE_WEEKLY_SPACE" &&
    input.binding.scopeContext === input.context &&
    normalizeMatchKey(input.binding.workTypeKey) ===
      normalizeMatchKey(input.route.workTypeKey)
  );
}

function findWorkTicket(
  task: Awaited<ReturnType<typeof findActiveCoordinationTask>>["task"],
  context: CoordinationContext | null,
  route: CoordinationRoute,
  input: {
    eventKey: string;
    targetType: string;
    workspaceRole?: ServiceOperationWorkspaceRole | null;
  },
):
  | WorkTicketResolution
  | "DUPLICATE_BLUEPRINT_EVENT_BINDING"
  | "NO_BLUEPRINT_EVENT_BINDING"
  | null {
  if (!task || !context) return null;

  const candidates = workTicketCandidates(route, context);
  if (!candidates.size) return null;

  const matchingSnapshotTickets = task.taskItems.flatMap((item) =>
    eventBindingsFromNote(item.note)
      .filter((binding) =>
        eventBindingMatches({
          binding,
          eventKey: input.eventKey,
          targetType: input.targetType,
          context,
          route,
        }),
      )
      .map((eventBinding) => ({
        item,
        eventBinding: eventBindingWithEffectiveRouteMode({
          binding: eventBinding,
          eventKey: input.eventKey,
          targetType: input.targetType,
          context,
          route,
        }),
        source: "BLUEPRINT_SNAPSHOT" as const,
      })),
  );

  const scopedMatchingSnapshotTickets = scopeServiceOperationWorkspaceTickets(
    matchingSnapshotTickets,
    {
      route,
      targetType: input.targetType,
      workspaceRole: input.workspaceRole,
    },
  );

  if (scopedMatchingSnapshotTickets.length > 1) {
    const selectedReceivers = scopedMatchingSnapshotTickets.filter((ticket) =>
      isAutoBindingReceiverNote(ticket.item.note),
    );

    if (selectedReceivers.length === 1) return selectedReceivers[0];

    return "DUPLICATE_BLUEPRINT_EVENT_BINDING";
  }

  if (scopedMatchingSnapshotTickets.length === 1) {
    return scopedMatchingSnapshotTickets[0];
  }

  const selectedReceiverTickets = task.taskItems
    .filter((item) => isAutoBindingReceiverNote(item.note))
    .filter(
      (item) =>
        normalizeMatchKey(workTypeKeyFromWorkspaceSnapshot(item.note)) ===
        normalizeMatchKey(route.workTypeKey),
    )
    .map((item) => ({
      item,
      eventBinding: effectiveReceiverEventBinding({
        eventKey: input.eventKey,
        targetType: input.targetType,
        context,
        route,
      }),
      source: "BLUEPRINT_SNAPSHOT" as const,
    }));

  const scopedSelectedReceiverTickets = scopeServiceOperationWorkspaceTickets(
    selectedReceiverTickets,
    {
      route,
      targetType: input.targetType,
      workspaceRole: input.workspaceRole,
    },
  );

  if (scopedSelectedReceiverTickets.length > 1) {
    return "DUPLICATE_BLUEPRINT_EVENT_BINDING";
  }

  if (scopedSelectedReceiverTickets.length === 1) return scopedSelectedReceiverTickets[0];

  const currentRouteSnapshotTickets = task.taskItems.flatMap((item) =>
    eventBindingsFromNote(item.note)
      .filter((binding) =>
        eventBindingMatchesCurrentRoute({
          binding,
          eventKey: input.eventKey,
          targetType: input.targetType,
          context,
          route,
        }),
      )
      .map((eventBinding) => ({
        item,
        eventBinding: eventBinding.status === "ACTIVE"
          ? eventBindingWithEffectiveRouteMode({
            binding: eventBinding,
            eventKey: input.eventKey,
            targetType: input.targetType,
            context,
            route,
          })
          : effectiveReceiverEventBinding({
            eventKey: input.eventKey,
            targetType: input.targetType,
            context,
            route,
          }),
        source: "BLUEPRINT_SNAPSHOT" as const,
      })),
  );

  const scopedCurrentRouteSnapshotTickets = scopeServiceOperationWorkspaceTickets(
    currentRouteSnapshotTickets,
    {
      route,
      targetType: input.targetType,
      workspaceRole: input.workspaceRole,
    },
  );

  if (scopedCurrentRouteSnapshotTickets.length > 1) {
    return "DUPLICATE_BLUEPRINT_EVENT_BINDING";
  }

  if (scopedCurrentRouteSnapshotTickets.length === 1) {
    return scopedCurrentRouteSnapshotTickets[0];
  }

  const legacyCandidate = task.taskItems.find((item) => {
    const title = normalizeMatchKey(item.title);
    const workTypeKey = getWorkTypeKeyFromTicketNote(item.note);
    const note = normalizeMatchKey(item.note);

    return (
      candidates.has(title) ||
      (workTypeKey ? candidates.has(normalizeMatchKey(workTypeKey)) : false) ||
      Array.from(candidates).some((candidate) =>
        note.includes(candidate),
      )
    );
  });

  return legacyCandidate ? "NO_BLUEPRINT_EVENT_BINDING" : null;
}

function formatEventTitle(eventKey: string) {
  const title = getTimelineTitle(eventKey);
  if (title) return title;

  return clean(eventKey)
    .split(".")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractTargetAliasIds(input: CoordinationEventConsumerInput) {
  const metadata = asRecord(input.metadataJson);
  const fromInput = input.targetAliasIds ?? [];
  const fromMetadata = Array.isArray(metadata.targetAliasIds)
    ? metadata.targetAliasIds
    : [];

  return Array.from(
    new Set([...fromInput, ...fromMetadata].map(clean).filter(Boolean)),
  );
}

function extractFeedbackMetadata(metadataJson: unknown) {
  const metadata = asRecord(metadataJson);
  const feedback = asRecord(metadata.feedback);
  const feedbackId = clean(metadata.feedbackId) || clean(feedback.id);
  const feedbackMessage =
    clean(metadata.feedbackMessage) ||
    clean(metadata.feedbackText) ||
    clean(feedback.message);

  return {
    ...(feedbackId ? { feedbackId } : {}),
    ...(feedbackMessage ? { feedbackMessage } : {}),
  };
}

function extractQueueSeedMetadata(metadataJson: unknown): Prisma.InputJsonObject {
  const metadata = asRecord(metadataJson);
  const mediaWorkProgress = asRecord(metadata.mediaWorkProgress);
  const mediaAssetAttachedAt = clean(metadata.mediaAssetAttachedAt);

  return {
    ...(Object.keys(mediaWorkProgress).length
      ? { mediaWorkProgress: mediaWorkProgress as Prisma.InputJsonObject }
      : {}),
    ...(mediaAssetAttachedAt ? { mediaAssetAttachedAt } : {}),
  };
}

function skipped(
  reason: CoordinationConsumerSkipReason,
  route?: CoordinationRoute | null,
  scope?: CoordinationBindingScope | null,
): CoordinationEventConsumerResult {
  return {
    ok: true,
    skipped: true,
    reason,
    route,
    scope,
  };
}

function canonicalTargetIdForCoordination(input: {
  targetType: string;
  targetId: string;
  metadataJson?: Prisma.JsonValue | null;
}) {
  const metadata = asRecord(input.metadataJson);
  const eventKey = clean(metadata.eventKey).toLowerCase();
  const watchId = clean(metadata.watchId);

  if (
    input.targetType === "WATCH" &&
    watchId &&
    (
      eventKey.startsWith("watch.content.") ||
      eventKey.startsWith("watch.image.") ||
      clean(metadata.reviewTargetType)
    )
  ) {
    return watchId;
  }

  return input.targetId;
}

async function resolveServiceOperationWorkspaceRole(input: {
  db: DB;
  route: CoordinationRoute;
  eventKey: string;
  targetType: string;
  targetId: string;
  metadataJson?: Prisma.JsonValue | null;
}): Promise<ServiceOperationWorkspaceRole | null> {
  if (!isServiceOperationTechnicalRoute(input)) return null;

  const context = coordinationTypeToContext(input.route.coordinationType);
  if (!context) return null;

  const operationRoute = operationalEventRouteForWorkType({
    workTypeKey: input.route.workTypeKey,
    coordinationContext: context,
    eventKey: input.eventKey,
    targetType: input.targetType,
  });

  if (!operationRoute) return null;

  const metadata = asRecord(input.metadataJson);
  const explicitRole = serviceOperationWorkspaceRoleValue(
    metadata.serviceOperationWorkspaceRole || metadata.workspaceRole,
  );

  if (
    explicitRole &&
    explicitRole === operationRoute.workspaceRole &&
    operationalWorkspaceRoleExists({
      workTypeKey: input.route.workTypeKey,
      coordinationContext: context,
      workspaceRole: explicitRole,
    })
  ) {
    return explicitRole;
  }

  const routedRole = serviceOperationWorkspaceRoleValue(operationRoute.workspaceRole);
  return routedRole;
}

function isServiceRequestWorkspaceIntake(input: {
  route: CoordinationRoute;
  eventKey: string;
  targetType: string;
}) {
  return (
    normalizeMatchKey(input.route.workTypeKey) === "service operation" &&
    input.eventKey === "service_request.created" &&
    normalizeTargetType(input.targetType) === "SERVICE_REQUEST"
  );
}

async function ensureServiceRequestWorkspace(input: {
  db: DB;
  taskId: string;
  serviceRequestId: string;
  actorUserId?: string | null;
  eventBinding: WorkspaceEventBinding;
  metadataJson: Prisma.InputJsonObject;
}) {
  const client = dbOrTx(input.db);
  const existing = await client.taskExecution.findFirst({
    where: {
      taskId: input.taskId,
      targetType: TaskExecutionTargetType.SERVICE_REQUEST,
      targetId: input.serviceRequestId,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: {
      id: true,
      taskItemId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing?.taskItemId) {
    return {
      taskItemId: existing.taskItemId,
      bindingId: existing.id,
      created: false,
    };
  }

  const sr = await client.serviceRequest.findUnique({
    where: { id: input.serviceRequestId },
    select: {
      id: true,
      refNo: true,
      skuSnapshot: true,
      product: {
        select: {
          title: true,
          sku: true,
        },
      },
    },
  });

  const title = sr?.refNo
    ? `Service Operation - ${sr.refNo}`
    : `Service Operation - ${input.serviceRequestId.slice(0, 8)}`;
  const watchLabel = sr?.product?.title ?? sr?.skuSnapshot ?? sr?.product?.sku ?? null;

  const taskItem = await client.taskItem.create({
    data: {
      taskId: input.taskId,
      title,
      note: [
        "workTypeKey: service-operation",
        "ownerType: SYSTEM",
        "serviceOperationWorkspaceRole: SR_CASE",
        `serviceRequestId: ${input.serviceRequestId}`,
        "blueprintKey: service-operation",
        "blueprintSource: EVENT",
      ].join("\n"),
      status: TaskStatus.TODO,
      priority: "MEDIUM",
      sortOrder: 56,
    },
    select: {
      id: true,
    },
  });

  const bindingResult = await ensureTaskItemBusinessBinding(input.db, {
    taskId: input.taskId,
    taskItemId: taskItem.id,
    targetType: TaskExecutionTargetType.SERVICE_REQUEST,
    targetId: input.serviceRequestId,
    actionType: TaskExecutionActionType.LINKED,
    createdByUserId: input.actorUserId ?? null,
    metadataJson: {
      ...input.metadataJson,
      source: "AUTO",
      eventBinding: input.eventBinding,
      targetTitle: title,
      targetRefNo: sr?.refNo ?? null,
      watchLabel,
      serviceOperationWorkspaceRole: "SR_CASE",
    },
  });

  return {
    taskItemId: taskItem.id,
    bindingId: bindingResult.binding.id,
    created: true,
  };
}

async function moveExistingServiceOperationBindingToTechnicalWorkspace(input: {
  db: DB;
  taskId: string;
  taskItemId: string;
  targetType: string;
  targetId: string;
  metadataJson: Prisma.InputJsonObject;
}) {
  if (normalizeTargetType(input.targetType) !== "TECHNICAL_ISSUE") return null;

  const client = dbOrTx(input.db);
  const existingInWorkspace = await findTaskItemBusinessBinding(input.db, {
    taskId: input.taskId,
    taskItemId: input.taskItemId,
    targetType: input.targetType,
    targetId: input.targetId,
    actionType: TaskExecutionActionType.LINKED,
    metadataJson: input.metadataJson,
  });

  if (existingInWorkspace) return existingInWorkspace;

  const existingElsewhere = await client.taskExecution.findFirst({
    where: {
      taskId: input.taskId,
      targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
      targetId: input.targetId,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: {
      id: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!existingElsewhere) return null;

  await client.taskExecution.update({
    where: { id: existingElsewhere.id },
    data: {
      taskItemId: input.taskItemId,
    },
  });

  return findTaskItemBusinessBinding(input.db, {
    taskId: input.taskId,
    taskItemId: input.taskItemId,
    targetType: input.targetType,
    targetId: input.targetId,
    actionType: TaskExecutionActionType.LINKED,
    metadataJson: input.metadataJson,
  });
}

async function applyWorkflowEventTransition(input: {
  db: DB;
  bindingId: string;
  eventKey: string;
  businessEventLogId: string;
  actorUserId?: string | null;
  metadataJson?: Prisma.JsonValue | null;
}) {
  try {
    return await processEventWorkspaceWorkflowTransition(input.db, {
      bindingId: input.bindingId,
      eventKey: input.eventKey,
      businessEventLogId: input.businessEventLogId,
      actorUserId: input.actorUserId ?? null,
      metadataJson: input.metadataJson ?? null,
    });
  } catch (error) {
    console.error("[coordination] workflow event transition failed", {
      bindingId: input.bindingId,
      eventKey: input.eventKey,
      businessEventLogId: input.businessEventLogId,
      error,
    });

    return null;
  }
}

export async function consumeBusinessEventForCoordination(
  db: DB,
  input: CoordinationEventConsumerInput,
): Promise<CoordinationEventConsumerResult> {
  const eventKey = clean(input.eventKey).toLowerCase();
  const targetType = clean(input.targetType).toUpperCase();
  const targetId = clean(input.targetId);
  const canonicalTargetId = canonicalTargetIdForCoordination({
    targetType,
    targetId,
    metadataJson: input.metadataJson ?? null,
  });
  const businessEventLogId = clean(input.businessEventLogId) || clean(input.id);
  const rawRoute = getCoordinationRoute({ eventKey, targetType });

  if (!rawRoute) return skipped("NO_ROUTE");
  if (!rawRoute.enabled) return skipped("ROUTE_DISABLED", rawRoute);
  if (!businessEventLogId) return skipped("MISSING_BUSINESS_EVENT_LOG_ID", rawRoute);
  if (!targetId) return skipped("MISSING_TARGET_ID", rawRoute);
  if (!isSupportedTargetType(targetType)) {
    return skipped("UNSUPPORTED_TARGET_TYPE", rawRoute);
  }

  const resolution = routeBusinessEvent({
    eventKey,
    targetType,
    targetId: canonicalTargetId,
    actorUserId: input.actorUserId ?? null,
    payload: input.metadataJson ?? input.payload ?? null,
  });
  const route = resolution.route;

  if (!route) return skipped("NO_ROUTE", rawRoute);

  const contextForPublishedSpace = coordinationTypeToContext(route.coordinationType);
  const publishedDeferredWorkspace =
    contextForPublishedSpace
      ? await ensureDeferredWorkspaceFromPublishedBlueprintEvent({
          db,
          eventKey,
          targetType,
          targetId: canonicalTargetId,
          workTypeKey: route.workTypeKey,
        })
      : null;

  if (publishedDeferredWorkspace && contextForPublishedSpace) {
    const eventBinding = effectiveReceiverEventBinding({
      eventKey,
      targetType,
      context: contextForPublishedSpace,
      route,
    });
    const resolvedScope: CoordinationBindingScope = {
      scopeType: "PUBLISHED_BLUEPRINT_SPACE",
      context: contextForPublishedSpace,
      coordinationType: route.coordinationType,
      workTypeKey: route.workTypeKey,
      taskId: publishedDeferredWorkspace.taskId,
      taskItemId: publishedDeferredWorkspace.taskItemId,
    };
    const metadataJson = {
      source: "AUTO",
      routeKey: `${route.targetType}:${route.eventKey}`,
      eventKey: route.eventKey,
      coordinationType: route.coordinationType,
      workTypeKey: route.workTypeKey,
      businessEventLogId,
      businessEventCreatedAt: formatDateMetadata(input.createdAt),
      sourceTargetId: targetId,
      targetAliasIds: extractTargetAliasIds(input),
      eventBindingSource: "PUBLISHED_BLUEPRINT_VERSION",
      eventBinding,
      publishedBlueprintVersionId: publishedDeferredWorkspace.publishedVersion.id,
      publishedBlueprintVersion: publishedDeferredWorkspace.publishedVersion.version,
      operationWorkspaceRole: publishedDeferredWorkspace.workspaceRole,
    } satisfies Prisma.InputJsonObject;
    const bindingResult = await ensureTaskItemBusinessBinding(db, {
      taskId: publishedDeferredWorkspace.taskId,
      taskItemId: publishedDeferredWorkspace.taskItemId,
      targetType,
      targetId: canonicalTargetId,
      actionType: TaskExecutionActionType.LINKED,
      createdByUserId: input.actorUserId ?? null,
      metadataJson,
    });
    const workflowResult = await applyWorkflowEventTransition({
      db,
      bindingId: bindingResult.binding.id,
      eventKey,
      businessEventLogId,
      actorUserId: input.actorUserId ?? null,
      metadataJson: input.metadataJson ?? null,
    });
    const activity = await createBusinessEventActivity({
      taskItemId: publishedDeferredWorkspace.taskItemId,
      sourceId: businessEventLogId,
      title: formatEventTitle(eventKey),
      body: getTimelineBody(input.metadataJson),
      actorUserId: input.actorUserId ?? null,
      metadataJson: {
        eventKey,
        targetType,
        targetId: canonicalTargetId,
        sourceTargetId: targetId,
        routeKey: metadataJson.routeKey,
        coordinationType: route.coordinationType,
        workTypeKey: route.workTypeKey,
        bindingScope: resolvedScope,
        eventBindingSource: "PUBLISHED_BLUEPRINT_VERSION",
        eventBinding,
        businessEventLogId,
        businessEventCreatedAt: metadataJson.businessEventCreatedAt,
        targetAliasIds: metadataJson.targetAliasIds,
        publishedBlueprintVersionId:
          publishedDeferredWorkspace.publishedVersion.id,
        publishedBlueprintVersion:
          publishedDeferredWorkspace.publishedVersion.version,
        operationWorkspaceRole: publishedDeferredWorkspace.workspaceRole,
      },
    }, db);

    return {
      ok: true,
      skipped: false,
      route,
      taskId: publishedDeferredWorkspace.taskId,
      taskItemId: publishedDeferredWorkspace.taskItemId,
      bindingId: bindingResult.binding.id,
      bindingCreated: bindingResult.created,
      activityId: activity.id,
      scope: resolvedScope,
      workflow: workflowResult,
    };
  }

  const { task, context, unsupported } = await findActiveCoordinationTask(db, route);
  if (unsupported) return skipped("UNSUPPORTED_COORDINATION_TYPE", route);
  const scope = context ? routeScope(route, context) : null;
  if (!task) return skipped("NO_ACTIVE_BINDING_SCOPE", route, scope);

  if (context && isServiceRequestWorkspaceIntake({ route, eventKey, targetType })) {
    const eventBinding = effectiveReceiverEventBinding({
      eventKey,
      targetType,
      context,
      route,
    });
    const resolvedScopeBase: CoordinationBindingScope = {
      ...(scope as CoordinationBindingScope),
      taskId: task.id,
    };
    const metadataJson = {
      source: "AUTO",
      routeKey: `${route.targetType}:${route.eventKey}`,
      eventKey: route.eventKey,
      coordinationType: route.coordinationType,
      workTypeKey: route.workTypeKey,
      businessEventLogId,
      businessEventCreatedAt: formatDateMetadata(input.createdAt),
      sourceTargetId: targetId,
      targetAliasIds: extractTargetAliasIds(input),
      eventBindingSource: "BLUEPRINT_SNAPSHOT",
      eventBinding,
      serviceOperationWorkspaceRole: "SR_CASE",
    } satisfies Prisma.InputJsonObject;
    const workspace = await ensureServiceRequestWorkspace({
      db,
      taskId: task.id,
      serviceRequestId: canonicalTargetId,
      actorUserId: input.actorUserId ?? null,
      eventBinding,
      metadataJson,
    });
    const resolvedScope: CoordinationBindingScope = {
      ...resolvedScopeBase,
      taskItemId: workspace.taskItemId,
    };
    const activity = await createBusinessEventActivity({
      taskItemId: workspace.taskItemId,
      sourceId: businessEventLogId,
      title: formatEventTitle(eventKey),
      body: getTimelineBody(input.metadataJson),
      actorUserId: input.actorUserId ?? null,
      metadataJson: {
        eventKey,
        targetType,
        targetId: canonicalTargetId,
        sourceTargetId: targetId,
        routeKey: metadataJson.routeKey,
        coordinationType: route.coordinationType,
        workTypeKey: route.workTypeKey,
        bindingScope: resolvedScope,
        eventBindingSource: "BLUEPRINT_SNAPSHOT",
        eventBinding,
        businessEventLogId,
        businessEventCreatedAt: metadataJson.businessEventCreatedAt,
        targetAliasIds: metadataJson.targetAliasIds,
        serviceOperationWorkspaceRole: "SR_CASE",
      },
    }, db);

    return {
      ok: true,
      skipped: false,
      route,
      taskId: task.id,
      taskItemId: workspace.taskItemId,
      bindingId: workspace.bindingId,
      bindingCreated: workspace.created,
      activityId: activity.id,
      scope: resolvedScope,
      workflow: null,
    };
  }

  const workspaceRole = await resolveServiceOperationWorkspaceRole({
    db,
    route,
    eventKey,
    targetType,
    targetId: canonicalTargetId,
    metadataJson: input.metadataJson ?? null,
  });
  const workTicketResolution = findWorkTicket(task, context, route, {
    eventKey,
    targetType,
    workspaceRole,
  });
  if (workTicketResolution === "DUPLICATE_BLUEPRINT_EVENT_BINDING") {
    return skipped("DUPLICATE_BLUEPRINT_EVENT_BINDING", route, scope);
  }
  if (workTicketResolution === "NO_BLUEPRINT_EVENT_BINDING") {
    return skipped("NO_BLUEPRINT_EVENT_BINDING", route, scope);
  }
  if (!workTicketResolution) return skipped("NO_ACTIVE_SCOPE_ITEM", route, scope);

  const workTicket = workTicketResolution.item;

  const resolvedScope: CoordinationBindingScope = {
    ...(scope as CoordinationBindingScope),
    taskId: task.id,
    taskItemId: workTicket.id,
  };

  const metadataJson = {
    source: "AUTO",
    routeKey: `${route.targetType}:${route.eventKey}`,
    eventKey: route.eventKey,
    coordinationType: route.coordinationType,
    workTypeKey: route.workTypeKey,
    businessEventLogId,
    businessEventCreatedAt: formatDateMetadata(input.createdAt),
    sourceTargetId: targetId,
    targetAliasIds: extractTargetAliasIds(input),
    eventBindingSource: workTicketResolution.source,
    eventBinding: workTicketResolution.eventBinding,
    ...extractQueueSeedMetadata(input.metadataJson),
  } satisfies Prisma.InputJsonObject;

  if (
    workTicketResolution.eventBinding.mode !== "PROGRESS" &&
    isServiceOperationTechnicalRoute({ route, targetType })
  ) {
    await moveExistingServiceOperationBindingToTechnicalWorkspace({
      db,
      taskId: task.id,
      taskItemId: workTicket.id,
      targetType,
      targetId: canonicalTargetId,
      metadataJson,
    });
  }

  if (workTicketResolution.eventBinding.mode === "PROGRESS") {
    const existingBinding =
      isServiceOperationTechnicalRoute({ route, targetType })
        ? await moveExistingServiceOperationBindingToTechnicalWorkspace({
            db,
            taskId: task.id,
            taskItemId: workTicket.id,
            targetType,
            targetId: canonicalTargetId,
            metadataJson,
          })
        : await findTaskItemBusinessBinding(db, {
            taskId: task.id,
            taskItemId: workTicket.id,
            targetType,
            targetId: canonicalTargetId,
            actionType: TaskExecutionActionType.LINKED,
            createdByUserId: input.actorUserId ?? null,
            metadataJson,
          });

    if (!existingBinding) {
      return skipped("NO_EXISTING_WORKSPACE_ITEM", route, resolvedScope);
    }
  }

  const bindingResult = await ensureTaskItemBusinessBinding(db, {
    taskId: task.id,
    taskItemId: workTicket.id,
    targetType,
    targetId: canonicalTargetId,
    actionType: TaskExecutionActionType.LINKED,
    createdByUserId: input.actorUserId ?? null,
    metadataJson,
  });
  const workflowResult = await applyWorkflowEventTransition({
    db,
    bindingId: bindingResult.binding.id,
    eventKey,
    businessEventLogId,
    actorUserId: input.actorUserId ?? null,
    metadataJson: input.metadataJson ?? null,
  });

  const activity = await createBusinessEventActivity({
    taskItemId: workTicket.id,
    sourceId: businessEventLogId,
    title: formatEventTitle(eventKey),
    body: getTimelineBody(input.metadataJson),
    actorUserId: input.actorUserId ?? null,
    metadataJson: {
      eventKey,
      targetType,
      targetId: canonicalTargetId,
      sourceTargetId: targetId,
      routeKey: metadataJson.routeKey,
      coordinationType: route.coordinationType,
      workTypeKey: route.workTypeKey,
      bindingScope: resolvedScope,
      eventBindingSource: workTicketResolution.source,
      eventBinding: workTicketResolution.eventBinding,
      businessEventLogId,
      businessEventCreatedAt: metadataJson.businessEventCreatedAt,
      targetAliasIds: metadataJson.targetAliasIds,
      ...extractFeedbackMetadata(input.metadataJson),
    },
  }, db);

  return {
    ok: true,
    skipped: false,
    route,
    taskId: task.id,
    taskItemId: workTicket.id,
    bindingId: bindingResult.binding.id,
    bindingCreated: bindingResult.created,
    activityId: activity.id,
    scope: resolvedScope,
    workflow: workflowResult,
  };
}

export async function diagnoseBusinessEventForCoordination(
  db: DB,
  input: CoordinationEventConsumerInput,
): Promise<CoordinationEventDiagnosticResult> {
  const eventKey = clean(input.eventKey).toLowerCase();
  const targetType = clean(input.targetType).toUpperCase();
  const targetId = clean(input.targetId);
  const canonicalTargetId = canonicalTargetIdForCoordination({
    targetType,
    targetId,
    metadataJson: input.metadataJson ?? null,
  });
  const businessEventLogId = clean(input.businessEventLogId) || clean(input.id) || "diagnostic";
  const rawRoute = getCoordinationRoute({ eventKey, targetType });

  if (!rawRoute) return skipped("NO_ROUTE");
  if (!rawRoute.enabled) return skipped("ROUTE_DISABLED", rawRoute);
  if (!businessEventLogId) return skipped("MISSING_BUSINESS_EVENT_LOG_ID", rawRoute);
  if (!targetId) return skipped("MISSING_TARGET_ID", rawRoute);
  if (!isSupportedTargetType(targetType)) {
    return skipped("UNSUPPORTED_TARGET_TYPE", rawRoute);
  }

  const resolution = routeBusinessEvent({
    eventKey,
    targetType,
    targetId: canonicalTargetId,
    actorUserId: input.actorUserId ?? null,
    payload: input.metadataJson ?? input.payload ?? null,
  });
  const route = resolution.route;

  if (!route) return skipped("NO_ROUTE", rawRoute);

  const { task, context, unsupported } = await findActiveCoordinationTask(db, route);
  if (unsupported) return skipped("UNSUPPORTED_COORDINATION_TYPE", route);
  const scope = context ? routeScope(route, context) : null;
  if (!task) return skipped("NO_ACTIVE_BINDING_SCOPE", route, scope);

  if (context && isServiceRequestWorkspaceIntake({ route, eventKey, targetType })) {
    const existingBinding = await dbOrTx(db).taskExecution.findFirst({
      where: {
        taskId: task.id,
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        targetId: canonicalTargetId,
        actionType: { not: TaskExecutionActionType.CANCELLED },
        taskItemId: { not: null },
      },
      select: {
        id: true,
        taskItemId: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const resolvedScope: CoordinationBindingScope = {
      ...(scope as CoordinationBindingScope),
      taskId: task.id,
      taskItemId: existingBinding?.taskItemId ?? undefined,
    };

    return {
      ok: true,
      skipped: false,
      route,
      scope: resolvedScope,
      taskId: task.id,
      taskItemId: existingBinding?.taskItemId ?? "",
      targetType,
      targetId,
      canonicalTargetId,
      bindingId: existingBinding?.id ?? null,
      bindingExists: Boolean(existingBinding),
      bindingMode: "INTAKE",
      eventBindingStatus: "ACTIVE",
      eventBindingSource: "BLUEPRINT_SNAPSHOT",
    };
  }

  const workspaceRole = await resolveServiceOperationWorkspaceRole({
    db,
    route,
    eventKey,
    targetType,
    targetId: canonicalTargetId,
    metadataJson: input.metadataJson ?? null,
  });
  const workTicketResolution = findWorkTicket(task, context, route, {
    eventKey,
    targetType,
    workspaceRole,
  });
  if (workTicketResolution === "DUPLICATE_BLUEPRINT_EVENT_BINDING") {
    return skipped("DUPLICATE_BLUEPRINT_EVENT_BINDING", route, scope);
  }
  if (workTicketResolution === "NO_BLUEPRINT_EVENT_BINDING") {
    return skipped("NO_BLUEPRINT_EVENT_BINDING", route, scope);
  }
  if (!workTicketResolution) return skipped("NO_ACTIVE_SCOPE_ITEM", route, scope);

  const workTicket = workTicketResolution.item;
  const resolvedScope: CoordinationBindingScope = {
    ...(scope as CoordinationBindingScope),
    taskId: task.id,
    taskItemId: workTicket.id,
  };
  const existingBinding = await findTaskItemBusinessBinding(db, {
    taskId: task.id,
    taskItemId: workTicket.id,
    targetType,
    targetId: canonicalTargetId,
    actionType: TaskExecutionActionType.LINKED,
    createdByUserId: input.actorUserId ?? null,
    metadataJson: {},
  });
  const existingBindingElsewhere =
    existingBinding || !isServiceOperationTechnicalRoute({ route, targetType })
      ? null
      : await dbOrTx(db).taskExecution.findFirst({
        where: {
          taskId: task.id,
          targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
          targetId: canonicalTargetId,
          actionType: { not: TaskExecutionActionType.CANCELLED },
          taskItemId: { not: null },
        },
        select: {
          id: true,
        },
        orderBy: { createdAt: "desc" },
      });

  return {
    ok: true,
    skipped: false,
    route,
    scope: resolvedScope,
    taskId: task.id,
    taskItemId: workTicket.id,
    targetType,
    targetId,
    canonicalTargetId,
    bindingId: existingBinding?.id ?? existingBindingElsewhere?.id ?? null,
    bindingExists: Boolean(existingBinding || existingBindingElsewhere),
    bindingMode: workTicketResolution.eventBinding.mode,
    eventBindingStatus: workTicketResolution.eventBinding.status,
    eventBindingSource: workTicketResolution.source,
  };
}
