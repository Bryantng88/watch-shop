import { NextResponse } from "next/server";
import { processQueuedAcquisitionSpecJobs } from "@/app/(admin)/admin/acquisitions/_server/ai/acquisition-spec-job.service";

function isAuthorized(req: Request) {
    const header = req.headers.get("x-internal-job-secret");
    return header && header === process.env.INTERNAL_JOB_SECRET;
}

export async function POST(req: Request) {
    if (!isAuthorized(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: any = {};
    try {
        body = await req.json();
    } catch { }

    const limit = Number(body?.limit ?? 6);
    const includeFailed = Boolean(body?.includeFailed ?? false);

    try {
        const result = await processQueuedAcquisitionSpecJobs({
            limit: Math.max(1, Math.min(limit, 10)),
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