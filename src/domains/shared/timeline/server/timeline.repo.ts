import {
    TimelineContainerType,
    TimelineSourceType,
    type Prisma,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";

export type AppendTimelineEntryInput = {
    containerType: TimelineContainerType;
    containerId: string;
    sourceType: TimelineSourceType;
    sourceId: string;
    occurredAt: Date;
    actorUserId?: string | null;
    title?: string | null;
    bodySnapshot?: string | null;
    visibility?: string | null;
    metadataJson?: Prisma.InputJsonValue;
};

export type CreateUserCommentInput = {
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    body: string;
    visibility?: string | null;
    metadataJson?: Prisma.InputJsonValue;
};

export async function upsertTimelineEntryRecord(
    db: DB,
    input: AppendTimelineEntryInput,
) {
    const client = dbOrTx(db);

    return client.timelineEntry.upsert({
        where: {
            containerType_containerId_sourceType_sourceId: {
                containerType: input.containerType,
                containerId: input.containerId,
                sourceType: input.sourceType,
                sourceId: input.sourceId,
            },
        },
        update: {
            occurredAt: input.occurredAt,
            actorUserId: input.actorUserId ?? null,
            title: input.title ?? null,
            bodySnapshot: input.bodySnapshot ?? null,
            visibility: input.visibility || "INTERNAL",
            metadataJson: input.metadataJson ?? undefined,
        },
        create: {
            containerType: input.containerType,
            containerId: input.containerId,
            sourceType: input.sourceType,
            sourceId: input.sourceId,
            occurredAt: input.occurredAt,
            actorUserId: input.actorUserId ?? null,
            title: input.title ?? null,
            bodySnapshot: input.bodySnapshot ?? null,
            visibility: input.visibility || "INTERNAL",
            metadataJson: input.metadataJson ?? undefined,
        },
    });
}

export async function listTimelineEntryRecords(
    db: DB,
    input: {
        containerType: TimelineContainerType;
        containerId: string;
        limit?: number;
    },
) {
    const client = dbOrTx(db);

    return client.timelineEntry.findMany({
        where: {
            containerType: input.containerType,
            containerId: input.containerId,
        },
        orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
        take: input.limit,
    });
}

export async function createUserCommentRecord(
    db: DB,
    input: CreateUserCommentInput,
) {
    const client = dbOrTx(db);

    return client.userComment.create({
        data: {
            targetType: input.targetType,
            targetId: input.targetId,
            actorUserId: input.actorUserId ?? null,
            body: input.body,
            visibility: input.visibility || "INTERNAL",
            metadataJson: input.metadataJson ?? undefined,
        },
    });
}
