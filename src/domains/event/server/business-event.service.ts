import { dbOrTx, isPrismaClient, prisma, type DB } from "@/server/db/client";
import { validateBusinessEventInput } from "@/domains/event/validator/business-event-validator";
import type {
    BusinessEventDispatchResult,
    BusinessEventEffect,
} from "@/domains/event/dispatcher/business-event-consumer.types";
import type { BusinessEventLog } from "@prisma/client";
import { perfLog, perfNow } from "@/lib/server-perf";
import { randomUUID } from "node:crypto";
import { enqueueProjectionDelivery } from "@/domains/projection/server/projection-delivery.repo";
import { markProjectionDeliveryReady } from "@/domains/projection/server/projection-delivery.repo";
import { getBusinessEventContract } from "@/domains/event/catalog/business-event-catalog";
import {
    DURABLE_BUSINESS_EVENT_CONSUMERS,
    enqueueBusinessEventConsumerDeliveries,
    processBusinessEventOperation,
    type DurableBusinessEventConsumerKey,
} from "@/domains/event/delivery";
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

export type RecordedBusinessEvent = {
    ok: true;
    eventLog: BusinessEventLog;
    projectionDeliveryKey: string;
    deferred: boolean;
    consumers: BusinessEventDispatchResult;
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
): Promise<RecordedBusinessEvent> {
    const totalStartedAt = perfNow();
    const client = dbOrTx(db);

    // A direct PrismaClient call still needs one atomic boundary for the event
    // log and both delivery outboxes. Domain commands that already own a
    // transaction pass their TransactionClient and use the branch below.
    if (isPrismaClient(client)) {
        const result = await client.$transaction((tx) =>
            recordBusinessEvent(tx, input, options),
        );

        if (!options?.deferConsumers) {
            await processBusinessEventOperation(result.projectionDeliveryKey, {
                db: client,
            });
        }

        perfLog(
            "business-event",
            `${clean(input.eventKey)}:${options?.deferConsumers ? "accepted" : "total"}`,
            totalStartedAt,
        );
        return {
            ...result,
            deferred: Boolean(options?.deferConsumers),
        };
    }

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
    const knownConsumers = getBusinessEventContract(eventKey)?.knownConsumers ?? [];
    const durableConsumerKeys = DURABLE_BUSINESS_EVENT_CONSUMERS.filter(
        (key): key is DurableBusinessEventConsumerKey => knownConsumers.includes(key),
    );
    await enqueueBusinessEventConsumerDeliveries(db, {
        operationKey: projectionDeliveryKey,
        businessEventLogId: eventLog.id,
        consumerKeys: [...durableConsumerKeys],
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
    const hasProjectionBarrier = ["coordination", "workflow"].some(
        (key) => durableConsumerKeys.includes(key as DurableBusinessEventConsumerKey),
    );
    if (!hasProjectionBarrier) {
        await markProjectionDeliveryReady(db, projectionDeliveryKey);
    }

    if (options?.deferConsumers) {
        options.deferConsumers(async () => {
            await processBusinessEventOperation(
              projectionDeliveryKey,
              {
                db: prisma,
              },
            );
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

    perfLog("business-event", `${eventKey}:total`, totalStartedAt);

    return {
        ok: true,
        eventLog,
        projectionDeliveryKey,
        deferred: true,
        consumers: {
            coordination: undefined,
            workflow: undefined,
            notification: undefined,
            timeline: undefined,
            projection: undefined,
        },
    };
}
