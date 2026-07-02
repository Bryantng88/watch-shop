import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
  type Prisma,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { ensureTaskItemBusinessBinding } from "@/domains/task/server/business-binding.service";
import { applyEventTriggerToQueueItem } from "@/domains/task/server/business-binding-workflow.service";
import { createBusinessEventActivity } from "@/domains/task/server/activity/task-item-activity.service";
import {
  getWorkTypeKeyFromTicketNote,
  resolveCurrentCoordinationCycle,
} from "./coordination-cycle.service";
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
  | "NO_WORK_TICKET";

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
  };

const TARGET_TYPES = new Set<string>(Object.values(TaskExecutionTargetType));

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
    createIfMissing: false,
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

function findWorkTicket(
  task: Awaited<ReturnType<typeof findActiveCoordinationTask>>["task"],
  context: CoordinationContext | null,
  route: CoordinationRoute,
) {
  if (!task || !context) return null;

  const candidates = workTicketCandidates(route, context);
  if (!candidates.size) return null;

  return task.taskItems.find((item) => {
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
  }) ?? null;
}

function formatEventTitle(eventKey: string) {
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

function skipped(
  reason: CoordinationConsumerSkipReason,
  route?: CoordinationRoute | null,
): CoordinationEventConsumerResult {
  return {
    ok: true,
    skipped: true,
    reason,
    route,
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

async function applyWorkflowEventTransition(input: {
  db: DB;
  bindingId: string;
  eventKey: string;
  businessEventLogId: string;
  actorUserId?: string | null;
  metadataJson?: Prisma.JsonValue | null;
}) {
  try {
    return await applyEventTriggerToQueueItem(input.db, {
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

  const { task, context, unsupported } = await findActiveCoordinationTask(db, route);
  if (unsupported) return skipped("UNSUPPORTED_COORDINATION_TYPE", route);
  if (!task) return skipped("NO_ACTIVE_COORDINATION_CYCLE", route);

  const workTicket = findWorkTicket(task, context, route);
  if (!workTicket) return skipped("NO_WORK_TICKET", route);

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
  } satisfies Prisma.InputJsonObject;

  const bindingResult = await ensureTaskItemBusinessBinding(db, {
    taskId: task.id,
    taskItemId: workTicket.id,
    targetType,
    targetId: canonicalTargetId,
    actionType: TaskExecutionActionType.LINKED,
    createdByUserId: input.actorUserId ?? null,
    metadataJson,
  });
  await applyWorkflowEventTransition({
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
    actorUserId: input.actorUserId ?? null,
    metadataJson: {
      eventKey,
      targetType,
      targetId: canonicalTargetId,
      sourceTargetId: targetId,
      routeKey: metadataJson.routeKey,
      coordinationType: route.coordinationType,
      workTypeKey: route.workTypeKey,
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
  };
}
