import { NextResponse } from "next/server";
import { runSystemJobs } from "@/server/jobs/system-job-runner.service";

function isAuthorized(req: Request) {
    const header = req.headers.get("x-internal-job-secret");
    return header && header === process.env.INTERNAL_JOB_SECRET;
}

export async function POST(req: Request) {
    if (!isAuthorized(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const summary = await runSystemJobs({
            triggerSource: "cron",
        });

        return NextResponse.json({
            success: true,
            summary,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Job runner failed",
            },
            { status: 500 }
        );
    }
}