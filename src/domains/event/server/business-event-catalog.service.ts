import {
  BUSINESS_EVENTS,
  getBusinessEventDefinition as getRegisteredBusinessEventDefinition,
} from "@/domains/event/registry/business-event-registry";
import { listCoordinationRoutes } from "@/domains/coordination/server";
import { listWorkflowDefinitions } from "@/domains/workflow-definition/server";

export type BusinessEventCatalogItem = {
  eventKey: string;
  targetType: string;
  label: string;
  description: string | null;
  status: string;
  businessMeaning: string | null;
  producer: string | null;
  emitPoint: string | null;
  targetIdPolicy: string | null;
  targetAliasPolicy: string | null;
  payloadContract: string | null;
  knownConsumers: string[];
  autoBindingScope: string | null;
  samplePayload: Record<string, unknown> | null;
  emittedFrom: string | null;
  routeStatus: string;
  workflowUsageCount: number;
};

export function listBusinessEventCatalog(): BusinessEventCatalogItem[] {
  const routes = listCoordinationRoutes();
  const workflowDefinitions = listWorkflowDefinitions();

  return BUSINESS_EVENTS.map((event) => {
    const route = routes.find(
      (item) =>
        item.eventKey === event.key &&
        item.targetType.toUpperCase() === event.targetType,
    );

    const workflowUsageCount = workflowDefinitions.reduce((count, workflow) => {
      return (
        count +
        workflow.transitions.filter(
          (transition) =>
            transition.triggerType === "EVENT" &&
            transition.triggerValue === event.key,
        ).length
      );
    }, 0);

    return {
      eventKey: event.key,
      targetType: event.targetType,
      label: event.label,
      description: event.description ?? null,
      status: event.status ?? "ACTIVE",
      businessMeaning: event.businessMeaning ?? event.description ?? null,
      producer: event.producer ?? null,
      emitPoint: event.emitPoint ?? null,
      targetIdPolicy: event.targetIdPolicy ?? null,
      targetAliasPolicy: event.targetAliasPolicy ?? null,
      payloadContract: event.payloadContract ?? null,
      knownConsumers: event.knownConsumers ?? [],
      autoBindingScope: event.autoBindingScope ?? null,
      samplePayload: null,
      emittedFrom: event.group,
      routeStatus: route ? (route.enabled ? "ROUTED" : "ROUTE_DISABLED") : "NOT_ROUTED",
      workflowUsageCount,
    };
  });
}

export function getBusinessEventDefinition(eventKey: string) {
  const normalized = getRegisteredBusinessEventDefinition(eventKey);
  if (!normalized) return null;

  return (
    listBusinessEventCatalog().find(
      (event) => event.eventKey === normalized.key,
    ) ?? null
  );
}
