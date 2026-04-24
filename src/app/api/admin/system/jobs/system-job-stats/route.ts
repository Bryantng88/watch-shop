import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET() {
    try {
        const [pendingSpecCount, failedSpecCount, latestRun] = await Promise.all([
            prisma.acquisitionSpecJob.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma.acquisitionSpecJob.count({
                where: {
                    status: "FAILED",
                },
            }),
            prisma.systemJobRunLog.findFirst({
                orderBy: {
                    startedAt: "desc",
                },
                select: {
                    status: true,
                    startedAt: true,
                },
            }),
        ]);

        return NextResponse.json({
            ok: true,
            item: {
                processorCount: 1,
                pendingSpecCount,
                failedSpecCount,
                latestRunStatus: latestRun?.status ?? null,
                latestRunAt: latestRun?.startedAt ?? null,
                acquisitionSpec: {
                    pending: pendingSpecCount,
                    failed: failedSpecCount,
                },
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: error?.message || "Không thể tải job stats",
            },
            { status: 500 }
        );
    }
}