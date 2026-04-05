import { NextResponse } from "next/server";
import { openTechnicalAssessment } from "@/app/(admin)/admin/services/_server/technical_assessment.serivce";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const data = await openTechnicalAssessment(id);

    return NextResponse.json({ ok: true, data });
}