import { NextRequest, NextResponse } from "next/server";
import { createTechnicalIssueMaintenanceLog } from "@/domains/service/server/issue-board/service-issue-board.service";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const body = await req.json();

        const result = await createTechnicalIssueMaintenanceLog({
            technicalIssueId: params.id,
            eventType: body.eventType,
            notes: body.notes,
            totalCost: body.totalCost,
            needApproval: Boolean(body.needApproval),
        });

        return NextResponse.json({ ok: true, data: result });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || "Không tạo được nhật ký xử lý." },
            { status: 400 },
        );
    }
}