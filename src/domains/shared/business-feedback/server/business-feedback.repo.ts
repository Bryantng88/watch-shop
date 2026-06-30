import { prisma } from "@/server/db/client";

export type CreateBusinessFeedbackInput = {
    targetType: string;
    targetId: string;
    message: string;
    eventKey?: string | null;
    actorUserId?: string | null;
    visibility?: string;
    metadataJson?: any;
};

function clean(value: any) {
    return String(value ?? "").trim();
}

export async function createBusinessFeedback(input: CreateBusinessFeedbackInput) {
    const targetType = clean(input.targetType);
    const targetId = clean(input.targetId);
    const message = clean(input.message);

    if (!targetType) throw new Error("Missing feedback targetType");
    if (!targetId) throw new Error("Missing feedback targetId");
    if (!message) throw new Error("Vui lòng nhập nội dung feedback.");

    return prisma.businessFeedback.create({
        data: {
            targetType,
            targetId,
            message,
            eventKey: input.eventKey ?? null,
            actorUserId: input.actorUserId ?? null,
            visibility: input.visibility ?? "INTERNAL",
            metadataJson: input.metadataJson ?? undefined,
        },
    });
}

export async function listBusinessFeedbacks(input: {
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