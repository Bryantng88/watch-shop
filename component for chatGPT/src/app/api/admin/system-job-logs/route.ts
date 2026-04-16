import { NextResponse } from "next/server";
import { getRecentJobRunLogs } from "@/server/jobs/job-run-log.service";

export async function GET() {
    try {
        const logs = await getRecentJobRunLogs(50);
        return NextResponse.json({ logs });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Load system job logs failed",
            },
            { status: 500 }
        );
    }
}