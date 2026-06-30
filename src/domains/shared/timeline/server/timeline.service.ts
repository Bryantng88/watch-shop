import {
    TimelineContainerType,
    TimelineSourceType,
    type Prisma,
} from "@prisma/client";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import {
    createUserCommentRecord,
    listTimelineEntryRecords,
    upsertTimelineEntryRecord,
    type AppendTimelineEntryInput,
} from "./timeline.repo";
import {
    mapTimelineEntriesToViewModels,
    type TimelineEntryViewModel,
} from "./timeline-renderer.service";

type BusinessFeedbackLike = {
    id: string;
    message: string;
    createdAt: Date;
    actorUserId?: string | null;
    visibility?: string | null;
    eventKey?: string | null;
    targetType?: string | null;
    targetId?: string | null;
    metadataJson?: Prisma.JsonValue | null;
};

type ProjectBusinessFeedbackToTaskItemTimelineInput = {
    taskItemIds: string[];
    feedback: BusinessFeedbackLike;
    title?: string | null;
    metadataJson?: Prisma.InputJsonValue;
};

function clean(value: unknown) {
    return String(value ?? "").trim();
}

function assertPresent(value: unknown, message: string) {
    if (!clean(value)) throw new Error(message);
}

async function assertTaskItemExists(db: DB, taskItemId: string) {
    const item = await db.taskItem.findUnique({
        where: { id: taskItemId },
        select: { id: true },
    });

    if (!item) throw new Error("Task item không tồn tại.");
}

export async function appendTimelineEntry(input: AppendTimelineEntryInput, db?: DB) {
    assertPresent(input.containerId, "Missing timeline containerId");
    assertPresent(input.sourceId, "Missing timeline sourceId");

    return upsertTimelineEntryRecord(db ?? prisma, {
        ...input,
        containerId: clean(input.containerId),
        sourceId: clean(input.sourceId),
        title: input.title ? clean(input.title) : null,
        bodySnapshot: input.bodySnapshot ? clean(input.bodySnapshot) : null,
        visibility: clean(input.visibility) || "INTERNAL",
    });
}

export async function listTimelineEntries(
    containerType: TimelineContainerType,
    containerId: string,
    limit?: number,
    db?: DB,
) {
    const cleanContainerId = clean(containerId);
    assertPresent(cleanContainerId, "Missing timeline containerId");

    return listTimelineEntryRecords(db ?? prisma, {
        containerType,
        containerId: cleanContainerId,
        limit,
    });
}

export async function getTaskItemTimelineViewModels(
    taskItemId: string,
    limit?: number,
): Promise<TimelineEntryViewModel[]> {
    const cleanTaskItemId = clean(taskItemId);
    assertPresent(cleanTaskItemId, "Missing taskItemId");

    const entries = await listTimelineEntries(
        TimelineContainerType.TASK_ITEM,
        cleanTaskItemId,
        limit,
    );

    return mapTimelineEntriesToViewModels(entries);
}

export async function appendTaskItemComment(
    taskItemId: string,
    body: string,
    actorUserId?: string | null,
) {
    const cleanTaskItemId = clean(taskItemId);
    const cleanBody = clean(body);

    assertPresent(cleanTaskItemId, "Missing taskItemId");
    assertPresent(cleanBody, "Vui lòng nhập nội dung bình luận.");

    return withDbTransaction(prisma, async (tx) => {
        await assertTaskItemExists(tx, cleanTaskItemId);

        const comment = await createUserCommentRecord(tx, {
            targetType: "TASK_ITEM",
            targetId: cleanTaskItemId,
            actorUserId: actorUserId ?? null,
            body: cleanBody,
        });

        const timelineEntry = await upsertTimelineEntryRecord(tx, {
            containerType: TimelineContainerType.TASK_ITEM,
            containerId: cleanTaskItemId,
            sourceType: TimelineSourceType.USER_COMMENT,
            sourceId: comment.id,
            occurredAt: comment.createdAt,
            actorUserId: actorUserId ?? null,
            bodySnapshot: cleanBody,
            visibility: comment.visibility,
        });

        return {
            comment,
            timelineEntry,
        };
    });
}

export async function appendTaskItemBusinessFeedbackTimelineEntry(
    taskItemId: string,
    feedback: BusinessFeedbackLike,
    options: {
        title?: string | null;
        metadataJson?: Prisma.InputJsonValue;
    } = {},
) {
    const cleanTaskItemId = clean(taskItemId);
    const feedbackId = clean(feedback?.id);
    const message = clean(feedback?.message);

    assertPresent(cleanTaskItemId, "Missing taskItemId");
    assertPresent(feedbackId, "Missing feedback id");
    assertPresent(message, "Missing feedback message");

    return withDbTransaction(prisma, async (tx) => {
        await assertTaskItemExists(tx, cleanTaskItemId);

        return upsertTimelineEntryRecord(tx, {
            containerType: TimelineContainerType.TASK_ITEM,
            containerId: cleanTaskItemId,
            sourceType: TimelineSourceType.BUSINESS_FEEDBACK,
            sourceId: feedbackId,
            occurredAt: feedback.createdAt,
            actorUserId: feedback.actorUserId ?? null,
            title: options.title ?? null,
            bodySnapshot: message,
            visibility: feedback.visibility || "INTERNAL",
            metadataJson: options.metadataJson ?? {
                eventKey: feedback.eventKey ?? null,
                targetType: feedback.targetType ?? null,
                targetId: feedback.targetId ?? null,
                feedbackMetadata: feedback.metadataJson ?? null,
            },
        });
    });
}

export async function projectBusinessFeedbackToTaskItemTimeline(
    input: ProjectBusinessFeedbackToTaskItemTimelineInput,
) {
    const taskItemIds = Array.from(
        new Set(
            (input.taskItemIds ?? [])
                .map((taskItemId) => clean(taskItemId))
                .filter(Boolean),
        ),
    );

    if (!taskItemIds.length) return [];

    return Promise.all(
        taskItemIds.map((taskItemId) =>
            appendTaskItemBusinessFeedbackTimelineEntry(
                taskItemId,
                input.feedback,
                {
                    title: input.title ?? null,
                    metadataJson: input.metadataJson,
                },
            ),
        ),
    );
}
