import { NextResponse } from "next/server";
import { openTechnicalAssessment } from "@/domains/service/server";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await openTechnicalAssessment(id);
        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Open technical assessment failed" },
            { status: 500 }
        );
    }
}