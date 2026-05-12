import { prisma } from "@/server/db/client";

export async function appendAcquisitionSpecJobLog(input: {
    acquisitionSpecJobId: string;
    acquisitionItemId: string;
    acquisitionId?: string | null;
    productId?: string | null;
    stage: string;
    level?: "INFO" | "WARN" | "ERROR";
    message: string;
    payload?: unknown;
}) {
    return prisma.acquisitionSpecJobLog.create({
        data: {
            acquisitionSpecJobId: input.acquisitionSpecJobId,
            acquisitionItemId: input.acquisitionItemId,
            acquisitionId: input.acquisitionId ?? null,
            productId: input.productId ?? null,
            stage: input.stage,
            level: input.level ?? "INFO",
            message: input.message,
            payload: input.payload ?? null,
        },
    });
}

export async function listAcquisitionSpecJobLogs(input: {
    acquisitionSpecJobId?: string;
    acquisitionItemId?: string;
    limit?: number;
}) {
    return prisma.acquisitionSpecJobLog.findMany({
        where: {
            ...(input.acquisitionSpecJobId
                ? { acquisitionSpecJobId: input.acquisitionSpecJobId }
                : {}),
            ...(input.acquisitionItemId
                ? { acquisitionItemId: input.acquisitionItemId }
                : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        take: Math.max(1, Math.min(Number(input.limit ?? 100), 500)),
    });
}