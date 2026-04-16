import { prisma } from "@/server/db/client";

export async function findRecentJobRunLogs(limit = 50) {
    return prisma.system_job_run_log.findMany({
        orderBy: { started_at: "desc" },
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
    return prisma.system_job_run_log.create({
        data: {
            processor_key: input.processorKey,
            trigger_source: input.triggerSource,
            status: input.status,
            processed_count: input.processedCount ?? 0,
            error_count: input.errorCount ?? 0,
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
    return prisma.system_job_run_log.update({
        where: { id },
        data: {
            status: input.status,
            processed_count: input.processedCount ?? 0,
            error_count: input.errorCount ?? 0,
            note: input.note ?? null,
            detail: input.detail ?? null,
            finished_at: new Date(),
        },
    });
}