import { NextResponse } from "next/server";
import { getSystemJobControlsOverview } from "@/server/jobs/job-control.service";

export async function GET() {
    try {
        const result = await getSystemJobControlsOverview();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Load system job controls failed",
            },
            { status: 500 }
        );
    }
}