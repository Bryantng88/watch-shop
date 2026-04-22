import { prisma } from "@/server/db/client";

export async function createSystemJobRunLog(input: {
    processorKey: string;
    triggerSource: string;
    status: string;
    processedCount?: number;
    errorCount?: number;
    note?: string | null;
    detail?: any;
    startedAt?: Date;
    finishedAt?: Date | null;
}) {
    return prisma.systemJobRunLog.create({
        data: {
            processorKey: input.processorKey,
            triggerSource: input.triggerSource,
            status: input.status,
            processedCount: input.processedCount ?? 0,
            errorCount: input.errorCount ?? 0,
            note: input.note ?? null,
            detail: input.detail ?? undefined,
            startedAt: input.startedAt ?? new Date(),
            finishedAt: input.finishedAt ?? null,
        },
    });
}

export async function getRecentJobRunLogs(limit = 20) {
    return prisma.systemJobRunLog.findMany({
        orderBy: { startedAt: "desc" },
        take: Math.max(1, Math.min(limit, 100)),
    });
}