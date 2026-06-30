import { prisma } from "@/server/db/client";
import type { Prisma } from "@prisma/client";

export type CreateBusinessFeedbackRecordInput = {
    targetType: string;
    targetId: string;
    message: string;
    eventKey?: string | null;
    actorUserId?: string | null;
    visibility?: string;
    metadataJson?: Prisma.InputJsonValue;
};

export async function createBusinessFeedbackRecord(
    input: CreateBusinessFeedbackRecordInput,
) {
    return prisma.businessFeedback.create({
        data: {
            targetType: input.targetType,
            targetId: input.targetId,
            message: input.message,
            eventKey: input.eventKey ?? null,
            actorUserId: input.actorUserId ?? null,
            visibility: input.visibility ?? "INTERNAL",
            metadataJson: input.metadataJson ?? undefined,
        },
    });
}

export async function listBusinessFeedbackRecords(input: {
    targetType: string;
    targetId: string;
    limit?: number;
}) {
    return prisma.businessFeedback.findMany({
        where: {
            targetType: input.targetType,
            targetId: input.targetId,
        },
        orderBy: { createdAt: "desc" },
        take: input.limit ?? 20,
    });
}

export async function findLatestBusinessFeedbackRecord(input: {
    targetType: string;
    targetId: string;
}) {
    return prisma.businessFeedback.findFirst({
        where: {
            targetType: input.targetType,
            targetId: input.targetId,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function listBusinessFeedbackRecordsForTargets(
    targets: Array<{ targetType: string; targetId: string }>,
) {
    if (!targets.length) return [];

    return prisma.businessFeedback.findMany({
        where: {
            OR: targets.map((target) => ({
                targetType: target.targetType,
                targetId: target.targetId,
            })),
        },
        orderBy: { createdAt: "desc" },
    });
}
