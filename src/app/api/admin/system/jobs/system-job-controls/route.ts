import { NextResponse } from "next/server";
import { getSystemJobControlsOverview } from "@/domains/system/server/jobs/system-job-control.service";

export async function GET() {
    try {
        const result = await getSystemJobControlsOverview();

        return NextResponse.json({
            ok: true,
            controls: result.controls,
            stats: result.stats,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: error?.message || "Không thể tải job controls",
            },
            { status: 500 }
        );
    }
}