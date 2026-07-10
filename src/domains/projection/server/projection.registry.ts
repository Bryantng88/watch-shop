import type { ProjectionBuilder } from "./projection.types";
import { watchMediaQueueProjectionBuilder } from "./watch-media-queue.projection";
import { watchListProjectionBuilder } from "./watch-list";
import { hasOperationalProjectionSubscriptionForEvent } from "./operation-projection-subscriptions";

const PROJECTION_BUILDERS: ProjectionBuilder[] = [
  watchMediaQueueProjectionBuilder,
  watchListProjectionBuilder,
];

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeKey(value: unknown) {
  return clean(value).toLowerCase();
}

export function listProjectionBuilders() {
  return PROJECTION_BUILDERS;
}

export function getProjectionBuilder(key: unknown) {
  const normalized = normalizeKey(key);
  if (!normalized) return null;

  return (
    PROJECTION_BUILDERS.find((builder) => normalizeKey(builder.key) === normalized) ??
    null
  );
}

export function listProjectionBuildersForEvent(input: {
  eventKey: unknown;
  targetType: unknown;
}) {
  const eventKey = normalizeKey(input.eventKey);
  const targetType = clean(input.targetType).toUpperCase();

  return PROJECTION_BUILDERS.filter((builder) => {
    const subscriptionMatches = hasOperationalProjectionSubscriptionForEvent({
      projectionKey: builder.key,
      eventKey,
    });
    const eventMatches =
      subscriptionMatches ||
      !builder.sourceEvents?.length ||
      builder.sourceEvents.map(normalizeKey).includes(eventKey);
    const targetMatches =
      subscriptionMatches ||
      !builder.targetTypes?.length ||
      builder.targetTypes.map((item) => clean(item).toUpperCase()).includes(targetType);

    return eventMatches && targetMatches;
  });
}
