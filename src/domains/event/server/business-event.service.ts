import { dbOrTx, type DB } from "@/server/db/client";
import { consumeBusinessEventForWorkflow } from "@/domains/workflow/server/workflow-event-consumer";
import { consumeBusinessEventForNotification } from "@/domains/notification/server/notification-event-consumer";
import { consumeBusinessEventForTimeline } from "@/domains/shared/timeline/server/timeline-event-consumer";
import { consumeBusinessEventForCoordination } from "@/domains/coordination/server";
import { perfLog, perfNow } from "@/lib/server-perf";
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

const DEFAULT_CONSUMER_TIMEOUT_MS = 5000;

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

function businessEventConsumerTimeoutMs() {
    const configured = Number(process.env.BUSINESS_EVENT_CONSUMER_TIMEOUT_MS);
    if (Number.isFinite(configured) && configured > 0) return configured;
    return DEFAULT_CONSUMER_TIMEOUT_MS;
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    message: string,
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    try {
        return await Promise.race([
            promise,
            new Promise<never>((_, reject) => {
                timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
            }),
        ]);
    } finally {
        if (timeout) clearTimeout(timeout);
    }
}

export async function recordBusinessEvent(db: DB, input: BusinessEventInput) {
    const totalStartedAt = perfNow();
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

    const upsertStartedAt = perfNow();
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
    perfLog("business-event", `${eventKey}:upsert`, upsertStartedAt);

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

    const consumerTimeoutMs = businessEventConsumerTimeoutMs();
    const consumerEntries = await Promise.all(consumers.map(async (consumer) => {
        const consumerStartedAt = perfNow();
        try {
            const result = await withTimeout(
                consumer.consume(client, consumerContext),
                consumerTimeoutMs,
                `BusinessEvent consumer ${consumer.key} timed out after ${consumerTimeoutMs}ms`,
            );

            return [consumer.key, result] as const;
        } catch (error) {
            console.error("[business-event] consumer failed", {
                consumer: consumer.key,
                eventKey,
                targetType,
                targetId,
                error: errorMessage(error),
            });

            return [consumer.key, {
                ok: false,
                error: errorMessage(error),
            }] as const;
        } finally {
            perfLog(
                "business-event",
                `${eventKey}:consumer:${consumer.key}`,
                consumerStartedAt,
            );
        }
    }));

    for (const [consumerKey, result] of consumerEntries) {
        consumerResults[consumerKey] = result;
    }
    perfLog("business-event", `${eventKey}:total`, totalStartedAt);

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
