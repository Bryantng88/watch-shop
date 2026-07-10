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
    eventKey: "service_request.created",
    targetType: "SERVICE_REQUEST",
    coordinationType: "technical",
    workTypeKey: "service-operation",
    enabled: true,
    metadata: {
      note: "Create one SR workspace in Service Operation when Service domain creates a ServiceRequest.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "TECHNICAL",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "watch.media.photoshoot.requested",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "photography",
    enabled: true,
    metadata: {
      note: "Intake Watch into Photoshoot when Media requests shooting.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "watch.media.photoshoot.completed",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Intake Watch into Media Processing after Photoshoot is done.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "watch.media.asset.attached",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Intake or progress Media Processing after NAS assets are attached through Watch domain.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "watch.content.submitted",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch content review event to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.content.rejected",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch content review event to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.content.approved",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch content review event to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.content.unapproved",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch content approval recall to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.image.submitted",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch image review event to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.image.rejected",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch image review event to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.image.approved",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch image review event to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.image.unapproved",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Route Watch image approval recall to the media processing work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "watch.media.ready_for_publish",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Intake approved Watch media into Publish work ticket.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "watch.media.recalled",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "media-processing",
    enabled: true,
    metadata: {
      note: "Recall Watch from Publish back into Media Processing.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "watch.publish.assets.downloaded",
    targetType: "WATCH",
    coordinationType: "media",
    workTypeKey: "publish",
    enabled: true,
    metadata: {
      note: "Progress Publish after assets/content are downloaded from Watch domain.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "MEDIA",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "technical_issue.created",
    targetType: "TECHNICAL_ISSUE",
    coordinationType: "technical",
    workTypeKey: "service-operation",
    enabled: true,
    metadata: {
      note: "Intake TechnicalIssue into Service Operation when the Service domain creates it.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "TECHNICAL",
      bindingMode: "INTAKE",
    },
  },
  {
    eventKey: "technical_issue.confirmed",
    targetType: "TECHNICAL_ISSUE",
    coordinationType: "technical",
    workTypeKey: "service-operation",
    enabled: true,
    metadata: {
      note: "Progress Service Operation item when TechnicalIssue is confirmed.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "TECHNICAL",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "technical_issue.started",
    targetType: "TECHNICAL_ISSUE",
    coordinationType: "technical",
    workTypeKey: "service-operation",
    enabled: true,
    metadata: {
      note: "Progress Service Operation item when TechnicalIssue work starts.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "TECHNICAL",
      bindingMode: "PROGRESS",
    },
  },
  {
    eventKey: "technical_issue.completed",
    targetType: "TECHNICAL_ISSUE",
    coordinationType: "technical",
    workTypeKey: "service-operation",
    enabled: true,
    metadata: {
      note: "Progress Service Operation item when TechnicalIssue work is completed.",
      scopeType: "CURRENT_ACTIVE_WEEKLY_SPACE",
      scopeContext: "TECHNICAL",
      bindingMode: "PROGRESS",
    },
  },
]);
