import { NextRequest, NextResponse } from "next/server";
import { approveTechnicalIssueMaintenanceLog } from "@/domains/service/server/issue-board/service-issue-board.service";

export async function POST(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const result = await approveTechnicalIssueMaintenanceLog({
            id: params.id,
        });

        return NextResponse.json({ ok: true, data: result });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || "Không duyệt được phát sinh." },
            { status: 400 },
        );
    }
}