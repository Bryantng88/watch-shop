import { consumeBusinessEventForWorkflow } from "@/domains/workflow/server/workflow-event-consumer";
import { consumeBusinessEventForNotification } from "@/domains/notification/server/notification-event-consumer";
import { consumeBusinessEventForTimeline } from "@/domains/shared/timeline/server/timeline-event-consumer";
import { consumeBusinessEventForCoordination } from "@/domains/coordination/server";
import type { BusinessEventConsumer } from "@/domains/event/dispatcher/business-event-consumer.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function businessEventLogForCoordination(eventLog: unknown) {
  const row = asRecord(eventLog);

  return {
    id: clean(row.id) || null,
    metadataJson: row.metadataJson ?? null,
    createdAt:
      row.createdAt instanceof Date || typeof row.createdAt === "string"
        ? row.createdAt
        : null,
  };
}

export function listBusinessEventConsumers(): BusinessEventConsumer[] {
  return [
    {
      key: "workflow",
      timeoutMs: 15000,
      consume: (client, context) =>
        consumeBusinessEventForWorkflow(client, context),
    },
    {
      key: "notification",
      timeoutMs: 10000,
      consume: (client, context) =>
        consumeBusinessEventForNotification(client, context.eventLog),
    },
    {
      key: "timeline",
      timeoutMs: 15000,
      consume: (client, context) =>
        consumeBusinessEventForTimeline(client, context.eventLog),
    },
    {
      key: "coordination",
      timeoutMs: 15000,
      consume: (client, context) =>
        consumeBusinessEventForCoordination(client, {
          ...businessEventLogForCoordination(context.eventLog),
          eventKey: context.eventKey,
          targetType: context.targetType,
          targetId: context.targetId,
          actorUserId: context.actorUserId ?? null,
          targetAliasIds: context.targetAliasIds ?? [],
        }),
    },
  ];
}
