import { dbOrTx, prisma, type DB } from "@/server/db/client";
import { validateBusinessEventInput } from "@/domains/event/validator/business-event-validator";
import { dispatchBusinessEvent } from "@/domains/event/dispatcher/business-event-dispatcher";
import type {
    BusinessEventDispatchContext,
    BusinessEventEffect,
} from "@/domains/event/dispatcher/business-event-consumer.types";
import { perfLog, perfNow } from "@/lib/server-perf";
import { randomUUID } from "node:crypto";
import { enqueueProjectionDelivery } from "@/domains/projection/server/projection-delivery.repo";
import { markProjectionDeliveryReady } from "@/domains/projection/server/projection-delivery.repo";
import { processProjectionDelivery } from "@/domains/projection/server/projection-delivery.service";
import { getBusinessEventContract } from "@/domains/event/catalog/business-event-catalog";
export type { BusinessEventEffect };

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

export type BusinessEventDispatchOptions = {
    deferConsumers?: (work: () => Promise<void>) => void;
};

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as Record<string, unknown>;
}

function eventInstanceIdFromPayload(payload: Record<string, unknown>) {
    return clean(payload.eventInstanceId) || clean(payload.sourceId) || null;
}

function failedProjectionBarrier(
    eventKey: string,
    results: Awaited<ReturnType<typeof dispatchBusinessEvent>>,
) {
    const consumers = getBusinessEventContract(eventKey)?.knownConsumers ?? [];
    const barrierKeys = ["coordination", "workflow"] as const;
    return barrierKeys
        .filter((key) => consumers.includes(key))
        .map((key) => results[key])
        .find((result) => result?.ok === false);
}

function formatValidationErrors(
    result: ReturnType<typeof validateBusinessEventInput>,
) {
    return result.issues
        .filter((issue) => issue.severity === "error")
        .map((issue) => issue.message)
        .join(" ");
}

export async function recordBusinessEvent(
    db: DB,
    input: BusinessEventInput,
    options?: BusinessEventDispatchOptions,
) {
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

    const validation = validateBusinessEventInput({
        eventKey,
        targetType,
        targetId,
        payload: input.payload,
    });

    if (!validation.ok) {
        throw new Error(formatValidationErrors(validation));
    }

    const payload = asRecord(input.payload);
    const eventInstanceId = eventInstanceIdFromPayload(payload);
    const idempotencyKey = [
        eventKey,
        targetType,
        targetId,
        eventInstanceId,
    ].filter(Boolean).join(":");

    const metadataJson = {
        ...payload,
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
        eventInstanceId,
        idempotencyKey,
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
    const projectionDeliveryKey = eventInstanceId
        ? idempotencyKey
        : `${idempotencyKey}:${randomUUID()}`;
    await enqueueProjectionDelivery(db, {
        idempotencyKey: projectionDeliveryKey,
        businessEventLogId: eventLog.id,
        eventKey,
        targetType,
        targetId,
        actorUserId: input.actorUserId ?? null,
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
        eventInstanceId,
        payload: metadataJson,
    });

    const consumerContext: BusinessEventDispatchContext = {
        eventLog,
        eventKey,
        targetType,
        targetId,
        actorUserId: input.actorUserId ?? null,
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
        eventInstanceId,
        idempotencyKey,
        projectionDeliveryKey,
    };

    if (options?.deferConsumers) {
        options.deferConsumers(async () => {
            // Deferred work runs after the mutation transaction has finished.
            // Never retain its TransactionClient: Prisma correctly invalidates
            // that client as soon as the transaction commits or rolls back.
            const committedEventLog = await prisma.businessEventLog.findUnique({
                where: { id: eventLog.id },
            });
            if (!committedEventLog) return;

            const consumerResults = await dispatchBusinessEvent({
                client: prisma,
                context: {
                    ...consumerContext,
                    eventLog: committedEventLog,
                },
                // Projection already has a durable outbox delivery written in
                // the same transaction as the event.
                excludedConsumerKeys: ["projection"],
            });
            const failedBarrier = failedProjectionBarrier(eventKey, consumerResults);
            if (failedBarrier) {
                console.warn("[business-event] projection held because a completion barrier failed", {
                    eventKey,
                    targetType,
                    targetId,
                    projectionDeliveryKey,
                    consumer: failedBarrier.consumer,
                    status: failedBarrier.status,
                    error: failedBarrier.error,
                });
                return;
            }
            await markProjectionDeliveryReady(prisma, projectionDeliveryKey);
            await processProjectionDelivery(projectionDeliveryKey, {
                db: prisma,
            });
            perfLog("business-event", `${eventKey}:deferred-total`, totalStartedAt);
        });
        perfLog("business-event", `${eventKey}:accepted`, totalStartedAt);

        return {
            ok: true,
            eventLog,
            projectionDeliveryKey,
            deferred: true as const,
            consumers: {
                coordination: undefined,
                workflow: undefined,
                notification: undefined,
                timeline: undefined,
                projection: undefined,
            },
        };
    }

    const consumerResults = await dispatchBusinessEvent({
        client,
        context: consumerContext,
        // Projection is durably queued above. Synchronous mutation paths must not
        // pay projection fan-out latency; the system worker will drain the outbox.
        excludedConsumerKeys: ["projection"],
    });
    let compatibilityProjectionDelivery:
        | Awaited<ReturnType<typeof processProjectionDelivery>>
        | null = null;
    if (!failedProjectionBarrier(eventKey, consumerResults)) {
        await markProjectionDeliveryReady(client, projectionDeliveryKey);
        // Compatibility fail-safe for producers that have not yet adopted the
        // runtime after-commit scheduler. Correctness wins over request latency:
        // never leave an operation-visible delivery at PENDING/attempts=0 and
        // rely solely on the periodic worker.
        compatibilityProjectionDelivery = await processProjectionDelivery(
            projectionDeliveryKey,
            { db: client },
        );
    }
    perfLog("business-event", `${eventKey}:total`, totalStartedAt);

    return {
        ok: true,
        eventLog,
        projectionDeliveryKey,
        consumers: {
            coordination: consumerResults.coordination,
            workflow: consumerResults.workflow,
            notification: consumerResults.notification,
            timeline: consumerResults.timeline,
            projection: compatibilityProjectionDelivery?.result
                ? {
                    ok: compatibilityProjectionDelivery.result.ok,
                    consumer: "projection" as const,
                    status: compatibilityProjectionDelivery.result.ok ? "success" as const : "failed" as const,
                    attempts: 1,
                    durationMs: 0,
                    error: compatibilityProjectionDelivery.result.ok
                        ? undefined
                        : compatibilityProjectionDelivery.result.error,
                    result: compatibilityProjectionDelivery.result,
                }
                : consumerResults.projection,
        },
    };
}
