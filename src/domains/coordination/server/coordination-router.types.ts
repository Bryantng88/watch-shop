export type CoordinationRouteMetadata = Record<string, unknown>;

export type CoordinationRoute = {
  eventKey: string;
  targetType: string;
  coordinationType: string;
  workTypeKey: string;
  enabled: boolean;
  metadata?: CoordinationRouteMetadata | null;
};

export type CoordinationBusinessEvent = {
  eventKey: string;
  targetType: string;
  targetId: string;
  actorUserId?: string | null;
  payload?: unknown;
};

export type CoordinationRouteRegistration = CoordinationRoute;

export type CoordinationRouteKey = {
  eventKey: string;
  targetType: string;
};

export type CoordinationWorkTypeResolution = {
  coordinationType: string;
  workTypeKey: string;
  metadata?: CoordinationRouteMetadata | null;
};

export type CoordinationRouteResolution = {
  event: CoordinationBusinessEvent;
  route: CoordinationRoute | null;
  workType: CoordinationWorkTypeResolution | null;
};
