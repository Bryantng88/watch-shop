import { NextResponse } from "next/server";
import {
    getSystemJobControlDetail,
    updateSystemJobControl,
} from "@/server/jobs/job-control.service";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;
        const item = await getSystemJobControlDetail(key);

        if (!item) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Load job control failed" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;
        const body = await req.json().catch(() => ({}));

        const updated = await updateSystemJobControl(key, {
            enabled: body?.enabled,
            batchSize: body?.batchSize,
            pausedReason: body?.pausedReason,
            metadata: body?.metadata,
            updatedBy: body?.updatedBy ?? null,
        });

        return NextResponse.json({
            success: true,
            item: updated,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || "Update job control failed" },
            { status: 500 }
        );
    }
}