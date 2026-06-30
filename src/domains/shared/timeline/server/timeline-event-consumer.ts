import { TimelineContainerType, TimelineSourceType } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { findRelatedTaskItemIdsForBusinessTarget } from "@/domains/task/server/business-binding.service";
import type { BusinessBindingTargetType } from "@/domains/task/server/business-binding.types";
import { appendTimelineEntry } from "./timeline.service";

export type TimelineBusinessEventLog = {
    id?: string | null;
    eventKey?: string | null;
    targetType?: string | null;
    targetId?: string | null;
    actorUserId?: string | null;
    metadataJson?: unknown;
    createdAt?: Date | string | null;
};

function asRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as Record<string, unknown>;
}

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function toDate(value: Date | string | null | undefined) {
    if (value instanceof Date) return value;
    if (value) return new Date(value);
    return new Date();
}

function getTimelineTitle(eventKey: string) {
    const titles: Record<string, string> = {
        "watch.content.rejected": "Content watch bị trả về",
        "watch.image.rejected": "Hình ảnh watch bị trả về",
    };

    return titles[eventKey] ?? eventKey;
}

export async function projectBusinessFeedbackEventToTaskItemTimeline(
    client: DB,
    event: TimelineBusinessEventLog,
) {
    const metadata = asRecord(event.metadataJson);
    const feedbackId = clean(metadata.feedbackId);
    const feedbackMessage = clean(metadata.feedbackMessage);

    if (!feedbackId || !feedbackMessage) {
        return {
            ok: true,
            skipped: true,
            skippedReason: "NO_FEEDBACK_METADATA",
            relatedTaskItemIds: [],
            createdTimelineEntries: [],
        };
    }

    const taskItemIds = await findRelatedTaskItemIdsForBusinessEvent(
        client,
        event,
        metadata,
    );

    if (!taskItemIds.length) {
        return {
            ok: true,
            skipped: true,
            skippedReason: "NO_RELATED_TASK_ITEM",
            relatedTaskItemIds: [],
            createdTimelineEntries: [],
        };
    }

    const timelineEntries = await Promise.all(
        taskItemIds.map((taskItemId) =>
            appendTimelineEntry(
                {
                    containerType: TimelineContainerType.TASK_ITEM,
                    containerId: taskItemId,
                    sourceType: TimelineSourceType.BUSINESS_FEEDBACK,
                    sourceId: feedbackId,
                    occurredAt: toDate(event.createdAt),
                    actorUserId: event.actorUserId ?? null,
                    title: getTimelineTitle(clean(event.eventKey)) || null,
                    bodySnapshot: feedbackMessage,
                    metadataJson: {
                        eventKey: event.eventKey ?? null,
                        targetType: event.targetType ?? null,
                        targetId: event.targetId ?? null,
                        feedbackId,
                        businessEventLogId: event.id ?? null,
                    },
                },
                client,
            ),
        ),
    );

    return {
        ok: true,
        skipped: false,
        relatedTaskItemIds: taskItemIds,
        createdTimelineEntries: timelineEntries,
    };
}

async function findRelatedTaskItemIdsForBusinessEvent(
    client: DB,
    event: TimelineBusinessEventLog,
    metadata: Record<string, unknown>,
) {
    const explicitTaskItemId = clean(metadata.taskItemId);
    if (explicitTaskItemId) return [explicitTaskItemId];

    const targetType = clean(event.targetType);
    const targetId = clean(event.targetId);

    if (!targetType || !targetId) return [];

    const aliasIds = Array.from(
        new Set(
            [
                clean(metadata.watchId),
                clean(metadata.productId),
                ...readStringArray(metadata.targetAliasIds),
            ].filter(Boolean),
        ),
    );

    return findRelatedTaskItemIdsForBusinessTarget(client, {
        targetType: targetType as BusinessBindingTargetType,
        targetId,
        aliasIds,
    });
}

function readStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value.map((item) => clean(item)).filter(Boolean);
}

export async function consumeBusinessEventForTimeline(
    client: DB,
    eventLog: unknown,
) {
    const event = eventLog as TimelineBusinessEventLog;

    try {
        const result = await projectBusinessFeedbackEventToTaskItemTimeline(
            client,
            event,
        );

        if (result.skipped) {
            return {
                ok: true,
                skipped: true,
                reason: result.skippedReason,
            };
        }

        return {
            ok: true,
            skipped: false,
            timelineEntries: result.createdTimelineEntries,
        };
    } catch (error) {
        console.error("TIMELINE_CONSUMER_FAILED", {
            businessEventLogId: event.id ?? null,
            error,
        });

        return {
            ok: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
