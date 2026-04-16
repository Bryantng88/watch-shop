import { prisma } from "@/server/db/client";

export async function getJobControl(key: string) {
    return prisma.system_job_control.findUnique({
        where: { key },
    });
}

export async function listJobControls() {
    return prisma.system_job_control.findMany({
        orderBy: { key: "asc" },
    });
}

export async function updateJobControlByKey(
    key: string,
    input: {
        enabled?: boolean;
        batchSize?: number;
        pausedReason?: string | null;
        metadata?: any;
        updatedBy?: string | null;
    }
) {
    return prisma.system_job_control.update({
        where: { key },
        data: {
            ...(input.enabled != null ? { enabled: input.enabled } : {}),
            ...(input.batchSize != null ? { batch_size: input.batchSize } : {}),
            ...(input.pausedReason !== undefined ? { paused_reason: input.pausedReason } : {}),
            ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
            ...(input.updatedBy !== undefined ? { updated_by: input.updatedBy } : {}),
        },
    });
}

export async function countAcquisitionSpecPendingJobs() {
    return prisma.acquisitionSpecJob.count({
        where: { status: "PENDING" },
    });
}

export async function countAcquisitionSpecFailedJobs() {
    return prisma.acquisitionSpecJob.count({
        where: { status: "FAILED" },
    });
}