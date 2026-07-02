import type {
  CoordinationRoute,
  CoordinationRouteKey,
  CoordinationRouteRegistration,
} from "./coordination-router.types";

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function routeKey(input: CoordinationRouteKey) {
  return `${normalize(input.targetType).toUpperCase()}::${normalize(input.eventKey).toLowerCase()}`;
}

const routeRegistry = new Map<string, CoordinationRoute>();

export function registerCoordinationRoute(route: CoordinationRouteRegistration) {
  const eventKey = normalize(route.eventKey).toLowerCase();
  const targetType = normalize(route.targetType).toUpperCase();
  const coordinationType = normalize(route.coordinationType).toLowerCase();
  const workTypeKey = normalize(route.workTypeKey).toLowerCase();

  if (!eventKey) throw new Error("Missing coordination route eventKey");
  if (!targetType) throw new Error("Missing coordination route targetType");
  if (!coordinationType) {
    throw new Error("Missing coordination route coordinationType");
  }
  if (!workTypeKey) throw new Error("Missing coordination route workTypeKey");

  const normalizedRoute: CoordinationRoute = {
    eventKey,
    targetType,
    coordinationType,
    workTypeKey,
    enabled: route.enabled,
    metadata: route.metadata ?? null,
  };

  routeRegistry.set(routeKey(normalizedRoute), normalizedRoute);

  return normalizedRoute;
}

export function registerCoordinationRoutes(
  routes: CoordinationRouteRegistration[],
) {
  return routes.map(registerCoordinationRoute);
}

export function getCoordinationRoute(input: CoordinationRouteKey) {
  return routeRegistry.get(routeKey(input)) ?? null;
}

export function listCoordinationRoutes() {
  return Array.from(routeRegistry.values());
}

registerCoordinationRoutes([
  {
    eventKey: "watch.content.submitted",
    targetType: "WATCH",
    coordinationType: "operation",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Auto-bind Watch content review event to the publish work ticket.",
    },
  },
  {
    eventKey: "watch.content.rejected",
    targetType: "WATCH",
    coordinationType: "operation",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Auto-bind Watch content review event to the publish work ticket.",
    },
  },
  {
    eventKey: "watch.content.approved",
    targetType: "WATCH",
    coordinationType: "operation",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Auto-bind Watch content review event to the publish work ticket.",
    },
  },
  {
    eventKey: "watch.image.submitted",
    targetType: "WATCH",
    coordinationType: "operation",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Auto-bind Watch image review event to the publish work ticket.",
    },
  },
  {
    eventKey: "watch.image.rejected",
    targetType: "WATCH",
    coordinationType: "operation",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Auto-bind Watch image review event to the publish work ticket.",
    },
  },
  {
    eventKey: "watch.image.approved",
    targetType: "WATCH",
    coordinationType: "operation",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Auto-bind Watch image review event to the publish work ticket.",
    },
  },
]);
