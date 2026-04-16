import { NextResponse } from "next/server";

import { cancelTechnicalIssue } from "@/app/(admin)/admin/services/_server/technical-issues.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        const data = await cancelTechnicalIssue(id, {
            reason: body?.reason || null,
        });

        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể hủy issue" },
            { status: 400 }
        );
    }
}