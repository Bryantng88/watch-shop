import { NextRequest, NextResponse } from "next/server";
import { rejectTechnicalIssueMaintenanceLog } from "@/domains/service/server/issue-board/service-issue-board.service";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const body = await req.json();

        const result = await rejectTechnicalIssueMaintenanceLog({
            id: params.id,
            reason: body.reason,
            nextAction: body.nextAction,
            newVendorId: body.newVendorId,
        });

        return NextResponse.json({ ok: true, data: result });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || "Không từ chối được phát sinh." },
            { status: 400 },
        );
    }
}