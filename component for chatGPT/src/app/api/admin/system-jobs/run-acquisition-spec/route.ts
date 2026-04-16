import { NextResponse } from "next/server";
import { processQueuedAcquisitionSpecJobs } from "@/app/(admin)/admin/acquisitions/_server/ai/acquisition-spec-job.service";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));

    const limit = Math.max(1, Math.min(Number(body?.limit ?? 6), 10));
    const includeFailed = Boolean(body?.includeFailed ?? false);

    try {
        const result = await processQueuedAcquisitionSpecJobs({
            limit,
            includeFailed,
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Run acquisition spec jobs failed",
            },
            { status: 500 }
        );
    }
}