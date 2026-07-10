import {
  operationalBlueprintForWorkType,
  type OperationalBlueprintProjectionSubscription,
} from "@/domains/blueprint/shared/operational-blueprint";

export type OperationalProjectionSubscriptionMatch =
  OperationalBlueprintProjectionSubscription & {
    operationKey: string;
  };

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalize(value: unknown) {
  return clean(value).toLowerCase();
}

function operationContracts() {
  return [
    operationalBlueprintForWorkType({
      workTypeKey: "service-operation",
      coordinationContext: "TECHNICAL",
    }),
  ].filter(Boolean);
}

export function listOperationalProjectionSubscriptionsForEvent(input: {
  projectionKey?: string | null;
  eventKey?: string | null;
}) {
  const projectionKey = normalize(input.projectionKey);
  const eventKey = normalize(input.eventKey);
  if (!projectionKey || !eventKey) return [];

  const matches: OperationalProjectionSubscriptionMatch[] = [];

  for (const contract of operationContracts()) {
    for (const subscription of contract.projectionSubscriptions) {
      if (normalize(subscription.projectionKey) !== projectionKey) continue;
      if (!subscription.eventKeys.map(normalize).includes(eventKey)) continue;

      matches.push({
        ...subscription,
        operationKey: contract.key,
      });
    }
  }

  return matches;
}

export function listOperationalProjectionSubscriptions(input: {
  projectionKey?: string | null;
} = {}) {
  const projectionKey = normalize(input.projectionKey);
  const matches: OperationalProjectionSubscriptionMatch[] = [];

  for (const contract of operationContracts()) {
    for (const subscription of contract.projectionSubscriptions) {
      if (projectionKey && normalize(subscription.projectionKey) !== projectionKey) {
        continue;
      }

      matches.push({
        ...subscription,
        operationKey: contract.key,
      });
    }
  }

  return matches;
}

export function hasOperationalProjectionSubscriptionForEvent(input: {
  projectionKey?: string | null;
  eventKey?: string | null;
}) {
  return listOperationalProjectionSubscriptionsForEvent(input).length > 0;
}
