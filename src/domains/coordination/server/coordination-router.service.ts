import {
  getCoordinationRoute,
  listCoordinationRoutes,
} from "./coordination-router.registry";
import type {
  CoordinationBusinessEvent,
  CoordinationRoute,
  CoordinationRouteResolution,
  CoordinationWorkTypeResolution,
} from "./coordination-router.types";

function normalizeEventKey(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeTargetType(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeBusinessEvent(
  event: CoordinationBusinessEvent,
): CoordinationBusinessEvent {
  const eventKey = normalizeEventKey(event.eventKey);
  const targetType = normalizeTargetType(event.targetType);
  const targetId = String(event.targetId ?? "").trim();

  if (!eventKey) throw new Error("Missing coordination eventKey");
  if (!targetType) throw new Error("Missing coordination targetType");
  if (!targetId) throw new Error("Missing coordination targetId");

  return {
    ...event,
    eventKey,
    targetType,
    targetId,
    actorUserId: event.actorUserId ?? null,
  };
}

function payloadRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function applyMediaPipelineRoute(
  event: CoordinationBusinessEvent,
  route: CoordinationRoute,
): CoordinationRoute {
  const payload = payloadRecord(event.payload);
  if (
    event.eventKey === "watch.media.photoshoot.completed" &&
    payload.mediaPipelineKey === "WOMEN_LITE"
  ) {
    return {
      ...route,
      workTypeKey: "publish",
      metadata: {
        ...(route.metadata ?? {}),
        pipelineKey: "WOMEN_LITE",
        pipelineBypass: ["media-processing"],
        note: "WOMEN_LITE routes Photography directly to Publish.",
      },
    };
  }
  return route;
}

export function resolveRoute(
  event: CoordinationBusinessEvent,
): CoordinationRoute | null {
  const normalizedEvent = normalizeBusinessEvent(event);
  const route = getCoordinationRoute({
    eventKey: normalizedEvent.eventKey,
    targetType: normalizedEvent.targetType,
  });

  if (!route?.enabled) return null;

  return applyMediaPipelineRoute(normalizedEvent, route);
}

export function resolveWorkType(
  route: CoordinationRoute | null,
): CoordinationWorkTypeResolution | null {
  if (!route?.enabled) return null;

  return {
    coordinationType: route.coordinationType,
    workTypeKey: route.workTypeKey,
    metadata: route.metadata ?? null,
  };
}

export function routeBusinessEvent(
  event: CoordinationBusinessEvent,
): CoordinationRouteResolution {
  const normalizedEvent = normalizeBusinessEvent(event);
  const route = resolveRoute(normalizedEvent);

  return {
    event: normalizedEvent,
    route,
    workType: resolveWorkType(route),
  };
}

export function listRegisteredCoordinationRoutes() {
  return listCoordinationRoutes();
}
