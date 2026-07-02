import { dbOrTx, type DB } from "@/server/db/client";
import { consumeBusinessEventForWorkflow } from "@/domains/workflow/server/workflow-event-consumer";
import { consumeBusinessEventForNotification } from "@/domains/notification/server/notification-event-consumer";
import { consumeBusinessEventForTimeline } from "@/domains/shared/timeline/server/timeline-event-consumer";
import { consumeBusinessEventForCoordination } from "@/domains/coordination/server";
export type BusinessEventEffect = "ASSERT" | "REVOKE";

export type BusinessEventInput = {
    eventKey: string;
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    payload?: unknown;

    effect?: BusinessEventEffect;
    revokeEventKey?: string | null;
    targetAliasIds?: string[];
};

type BusinessEventConsumerContext = {
    eventLog: unknown;
    eventKey: string;
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    effect: BusinessEventEffect;
    revokeEventKey?: string | null;
    targetAliasIds?: string[];
};

type BusinessEventConsumer = {
    key: "workflow" | "notification" | "timeline" | "coordination";
    consume: (
        client: DB,
        context: BusinessEventConsumerContext,
    ) => Promise<unknown>;
};

const consumers: BusinessEventConsumer[] = [
    {
        key: "workflow",
        consume: (client, context) =>
            consumeBusinessEventForWorkflow(client, context),
    },
    {
        key: "notification",
        consume: (client, context) =>
            consumeBusinessEventForNotification(client, context.eventLog),
    },
    {
        key: "timeline",
        consume: (client, context) =>
            consumeBusinessEventForTimeline(client, context.eventLog),
    },
    {
        key: "coordination",
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
    // ApprovalConsumer
    // AuditConsumer
    // AnalyticsConsumer
];

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
        createdAt: row.createdAt instanceof Date || typeof row.createdAt === "string"
            ? row.createdAt
            : null,
    };
}

export async function recordBusinessEvent(db: DB, input: BusinessEventInput) {
    const client = dbOrTx(db);

    const eventKey = clean(input.eventKey);
    const targetType = clean(input.targetType);
    const targetId = clean(input.targetId);
    const effect: BusinessEventEffect = input.effect ?? "ASSERT";
    const revokeEventKey = clean(input.revokeEventKey);

    if (!eventKey) throw new Error("Missing eventKey");
    if (!targetType) throw new Error("Missing targetType");
    if (!targetId) throw new Error("Missing targetId");

    if (effect === "REVOKE" && !revokeEventKey) {
        throw new Error("Missing revokeEventKey");
    }

    const metadataJson = {
        ...((input.payload ?? {}) as Record<string, unknown>),
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
    };

    const eventLog = await client.businessEventLog.upsert({
        where: {
            eventKey_targetType_targetId: {
                eventKey,
                targetType,
                targetId,
            },
        },
        update: {
            actorUserId: input.actorUserId ?? null,
            metadataJson,
        },
        create: {
            eventKey,
            targetType,
            targetId,
            actorUserId: input.actorUserId ?? null,
            metadataJson,
        },
    });

    const consumerContext: BusinessEventConsumerContext = {
        eventLog,
        eventKey,
        targetType,
        targetId,
        actorUserId: input.actorUserId ?? null,
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
    };

    const consumerResults: Record<string, unknown> = {};

    for (const consumer of consumers) {
        try {
            consumerResults[consumer.key] = await consumer.consume(
                client,
                consumerContext,
            );
        } catch (error) {
            if (consumer.key !== "coordination") throw error;

            console.error("[coordination] BusinessEvent consumer failed", {
                eventKey,
                targetType,
                targetId,
                error,
            });

            consumerResults[consumer.key] = {
                ok: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    return {
        ok: true,
        eventLog,
        consumers: {
            workflow: consumerResults.workflow,
            notification: consumerResults.notification,
            timeline: consumerResults.timeline,
            coordination: consumerResults.coordination,
        },
    };
}
