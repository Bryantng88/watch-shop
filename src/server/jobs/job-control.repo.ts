import { prisma } from "@/server/db/client";

export async function getJobControl(key: string) {
    return prisma.systemJobControl.findUnique({
        where: { key },
    });
}

export async function listJobControls() {
    return prisma.systemJobControl.findMany({
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
    return prisma.systemJobControl.update({
        where: { key },
        data: {
            ...(input.enabled != null ? { enabled: input.enabled } : {}),
            ...(input.batchSize != null ? { batchSize: input.batchSize } : {}),
            ...(input.pausedReason !== undefined ? { pausedReason: input.pausedReason } : {}),
            ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
            ...(input.updatedBy !== undefined ? { updatedBy: input.updatedBy } : {}),
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
