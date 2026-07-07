import { dbOrTx, type DB } from "@/server/db/client";
import { validateBusinessEventInput } from "@/domains/event/validator/business-event-validator";
import { dispatchBusinessEvent } from "@/domains/event/dispatcher/business-event-dispatcher";
import type {
    BusinessEventConsumerContext,
    BusinessEventEffect,
} from "@/domains/event/dispatcher/business-event-consumer.types";
import { perfLog, perfNow } from "@/lib/server-perf";
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

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function formatValidationErrors(
    result: ReturnType<typeof validateBusinessEventInput>,
) {
    return result.issues
        .filter((issue) => issue.severity === "error")
        .map((issue) => issue.message)
        .join(" ");
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

    const validation = validateBusinessEventInput({
        eventKey,
        targetType,
        targetId,
        payload: input.payload,
    });

    if (!validation.ok) {
        throw new Error(formatValidationErrors(validation));
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

    const consumerResults = await dispatchBusinessEvent({
        client,
        context: consumerContext,
    });
    perfLog("business-event", `${eventKey}:total`, totalStartedAt);

    return {
        ok: true,
        eventLog,
        consumers: {
            coordination: consumerResults.coordination,
            workflow: consumerResults.workflow,
            notification: consumerResults.notification,
            timeline: consumerResults.timeline,
        },
    };
}
