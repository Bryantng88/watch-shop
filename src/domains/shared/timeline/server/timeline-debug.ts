import { prisma } from "@/server/db/client";
import {
    projectBusinessFeedbackEventToTaskItemTimeline,
    type TimelineBusinessEventLog,
} from "./timeline-event-consumer";

type DebugProjectFeedbackEventToTaskItemTimelineInput = {
    eventKey: string;
    targetType: string;
    targetId: string;
    feedbackId: string;
    feedbackMessage: string;
    actorUserId?: string | null;
    createdAt?: Date;
    metadataJson?: unknown;
};

// Dev/debug helper only. Do not call this from production routes.
export async function debugProjectFeedbackEventToTaskItemTimeline(
    input: DebugProjectFeedbackEventToTaskItemTimelineInput,
) {
    const metadata =
        input.metadataJson && typeof input.metadataJson === "object"
            ? input.metadataJson
            : {};

    const eventLog: TimelineBusinessEventLog = {
        id: "debug-business-event",
        eventKey: input.eventKey,
        targetType: input.targetType,
        targetId: input.targetId,
        actorUserId: input.actorUserId ?? null,
        createdAt: input.createdAt ?? new Date(),
        metadataJson: {
            ...metadata,
            feedbackId: input.feedbackId,
            feedbackMessage: input.feedbackMessage,
        },
    };

    const result = await projectBusinessFeedbackEventToTaskItemTimeline(
        prisma,
        eventLog,
    );

    return {
        relatedTaskItemIds: result.relatedTaskItemIds,
        createdTimelineEntries: result.createdTimelineEntries,
        skippedReason: result.skipped ? result.skippedReason : null,
    };
}
