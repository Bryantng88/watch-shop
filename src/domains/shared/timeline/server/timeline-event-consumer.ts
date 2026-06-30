import { TimelineContainerType, TimelineSourceType } from "@prisma/client";
import type { DB } from "@/server/db/client";
import {
    findRelatedTaskItemIdsForBusinessTargets,
} from "@/domains/task/server/business-binding.service";
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

function readStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value.map((item) => clean(item)).filter(Boolean);
}

function getTimelineTitle(eventKey: string) {
    const titles: Record<string, string> = {
        "watch.content.submitted": "Đã gửi duyệt nội dung",
        "watch.content.rejected": "Content watch bị trả về",
        "watch.content.approved": "Content watch đã được duyệt",
        "watch.image.submitted": "Đã gửi duyệt hình ảnh",
        "watch.image.rejected": "Hình ảnh watch bị trả về",
        "watch.image.approved": "Hình ảnh watch đã được duyệt",
    };

    return titles[eventKey] ?? eventKey;
}

async function findRelatedTaskItemIdsForBusinessEvent(
    client: DB,
    event: TimelineBusinessEventLog,
    metadata: Record<string, unknown>,
) {
    const targetType = clean(event.targetType);
    const targetId = clean(event.targetId);

    if (!targetType || !targetId) return [];

    const targetIds = Array.from(
        new Set(
            [
                targetId,
                clean(metadata.watchId),
                clean(metadata.productId),
                ...readStringArray(metadata.targetAliasIds),
            ].filter(Boolean),
        ),
    );

    return findRelatedTaskItemIdsForBusinessTargets(client, {
        targetType: targetType as BusinessBindingTargetType,
        targetIds,
    });
}

export async function projectBusinessEventToTaskItemTimeline(
    client: DB,
    event: TimelineBusinessEventLog,
) {
    const metadata = asRecord(event.metadataJson);
    const businessEventLogId = clean(event.id);
    const eventKey = clean(event.eventKey);

    if (!businessEventLogId) {
        return {
            ok: true,
            skipped: true,
            skippedReason: "NO_BUSINESS_EVENT_LOG_ID",
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
                    sourceType: TimelineSourceType.BUSINESS_EVENT,
                    sourceId: businessEventLogId,
                    occurredAt: toDate(event.createdAt),
                    actorUserId: event.actorUserId ?? null,
                    title: getTimelineTitle(eventKey) || null,
                    bodySnapshot: null,
                    metadataJson: {
                        eventKey: event.eventKey ?? null,
                        targetType: event.targetType ?? null,
                        targetId: event.targetId ?? null,
                        businessEventLogId,
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

export async function projectBusinessFeedbackEventToTaskItemTimeline(
    client: DB,
    event: TimelineBusinessEventLog,
) {
    const metadata = asRecord(event.metadataJson);
    const feedbackId = clean(metadata.feedbackId);
    const feedbackMessage = clean(metadata.feedbackMessage);
    const feedbackCreatedAt = toDate(
        clean(metadata.feedbackCreatedAt) || event.createdAt,
    );

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

    const eventKey = clean(event.eventKey);

    const timelineEntries = await Promise.all(
        taskItemIds.map((taskItemId) =>
            appendTimelineEntry(
                {
                    containerType: TimelineContainerType.TASK_ITEM,
                    containerId: taskItemId,
                    sourceType: TimelineSourceType.BUSINESS_FEEDBACK,
                    sourceId: feedbackId,
                    occurredAt: feedbackCreatedAt,
                    actorUserId: event.actorUserId ?? null,
                    title: getTimelineTitle(eventKey) || null,
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

export async function consumeBusinessEventForTimeline(
    client: DB,
    eventLog: unknown,
) {
    const event = eventLog as TimelineBusinessEventLog;

    try {
        const businessEventResult = await projectBusinessEventToTaskItemTimeline(
            client,
            event,
        );

        const feedbackResult = await projectBusinessFeedbackEventToTaskItemTimeline(
            client,
            event,
        );

        const timelineEntries = [
            ...businessEventResult.createdTimelineEntries,
            ...feedbackResult.createdTimelineEntries,
        ];

        if (!timelineEntries.length) {
            return {
                ok: true,
                skipped: true,
                reason:
                    feedbackResult.skippedReason ??
                    businessEventResult.skippedReason ??
                    "NO_TIMELINE_ENTRY",
            };
        }

        return {
            ok: true,
            skipped: false,
            timelineEntries,
            businessEvent: businessEventResult,
            feedback: feedbackResult,
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
