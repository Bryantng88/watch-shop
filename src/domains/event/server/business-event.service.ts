import { dbOrTx, type DB } from "@/server/db/client";
import { consumeBusinessEventForWorkflow } from "@/domains/workflow/server/workflow-event-consumer";
import { consumeBusinessEventForNotification } from "@/domains/notification/server/notification-event-consumer";
export type BusinessEventEffect = "ASSERT" | "REVOKE";

export type BusinessEventInput = {
    eventKey: string;
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    payload?: any;

    effect?: BusinessEventEffect;
    revokeEventKey?: string | null;
    targetAliasIds?: string[];
};

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
        ...(input.payload ?? {}),
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
    };

    const shouldCreateNewLog =
        Boolean((input.payload as any)?.feedbackMessage) ||
        eventKey.endsWith(".rejected") ||
        eventKey.includes(".rejected.");

    const eventLog = shouldCreateNewLog
        ? await client.businessEventLog.create({
            data: {
                eventKey,
                targetType,
                targetId,
                actorUserId: input.actorUserId ?? null,
                metadataJson,
            },
        })
        : await client.businessEventLog.upsert({
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

    const workflowResult = await consumeBusinessEventForWorkflow(client, {
        eventLog,
        eventKey,
        targetType,
        targetId,
        actorUserId: input.actorUserId ?? null,
        effect,
        revokeEventKey: revokeEventKey || null,
        targetAliasIds: input.targetAliasIds ?? [],
    });

    const notificationResult = await consumeBusinessEventForNotification(
        client,
        eventLog,
    );

    return {
        ok: true,
        eventLog,
        consumers: {
            workflow: workflowResult,
            notification: notificationResult,
        },
    };
}