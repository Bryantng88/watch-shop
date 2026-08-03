import { prisma } from "@/server/db/client";

export async function findRecentJobRunLogs(limit = 50) {
    return prisma.systemJobRunLog.findMany({
        orderBy: { startedAt: "desc" },
        take: limit,
    });
}

export async function createJobRunLog(input: {
    processorKey: string;
    triggerSource: string;
    status: string;
    processedCount?: number;
    errorCount?: number;
    note?: string | null;
    detail?: any;
}) {
    return prisma.systemJobRunLog.create({
        data: {
            processorKey: input.processorKey,
            triggerSource: input.triggerSource,
            status: input.status,
            processedCount: input.processedCount ?? 0,
            errorCount: input.errorCount ?? 0,
            note: input.note ?? null,
            detail: input.detail ?? null,
        },
    });
}

export async function finishJobRunLog(
    id: string,
    input: {
        status: string;
        processedCount?: number;
        errorCount?: number;
        note?: string | null;
        detail?: any;
    }
) {
    return prisma.systemJobRunLog.update({
        where: { id },
        data: {
            status: input.status,
            processedCount: input.processedCount ?? 0,
            errorCount: input.errorCount ?? 0,
            note: input.note ?? null,
            detail: input.detail ?? null,
            finishedAt: new Date(),
        },
    });
}
