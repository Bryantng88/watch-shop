import { NextResponse } from "next/server";
import { getRecentJobRunLogs } from "@/domains/system/server/jobs/system-job-log.service";

export async function GET() {
    try {
        const logs = await getRecentJobRunLogs(50);

        return NextResponse.json({
            ok: true,
            items: logs,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: error?.message || "Không thể tải job logs",
            },
            { status: 500 }
        );
    }
}