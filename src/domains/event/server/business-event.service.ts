import { dbOrTx, type DB } from "@/server/db/client";
import { consumeBusinessEventForWorkflow } from "@/domains/workflow/server/workflow-event-consumer";
import { consumeBusinessEventForNotification } from "@/domains/notification/server/notification-event-consumer";
import { consumeBusinessEventForTimeline } from "@/domains/shared/timeline/server/timeline-event-consumer";
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
    key: "workflow" | "notification" | "timeline";
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
    // ApprovalConsumer
    // AuditConsumer
    // AnalyticsConsumer
];

function clean(value: unknown) {
    return String(value ?? "").trim();
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
        consumerResults[consumer.key] = await consumer.consume(
            client,
            consumerContext,
        );
    }

    return {
        ok: true,
        eventLog,
        consumers: {
            workflow: consumerResults.workflow,
            notification: consumerResults.notification,
        },
    };
}
