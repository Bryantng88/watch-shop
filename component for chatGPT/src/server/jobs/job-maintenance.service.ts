import { prisma } from "@/server/db/client";

export async function resetStaleAcquisitionSpecJobs() {
    const threshold = new Date(Date.now() - 15 * 60 * 1000);

    const result = await (prisma as any).acquisitionSpecJob.updateMany({
        where: {
            status: "RUNNING",
            startedAt: {
                lt: threshold,
            },
        },
        data: {
            status: "FAILED",
            finishedAt: new Date(),
            lastError: "Stale RUNNING job auto-failed",
            runAfter: new Date(Date.now() + 5 * 60 * 1000),
        },
    });

    return { count: result?.count ?? 0 };
}