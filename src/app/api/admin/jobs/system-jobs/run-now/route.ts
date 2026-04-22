import { NextResponse } from "next/server";
import { runSystemJobs } from "@/domains/system/server/jobs/system-job-runner.service";

export async function POST() {
    try {
        const summary = await runSystemJobs({
            triggerSource: "admin_manual",
        });

        return NextResponse.json({
            success: true,
            summary,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Run system jobs failed",
            },
            { status: 500 }
        );
    }
}