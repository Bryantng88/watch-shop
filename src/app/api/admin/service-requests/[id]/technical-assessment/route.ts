import { NextResponse } from "next/server";
import * as technicalService from "@/app/(admin)/admin/services/_server/technical_assessment.serivce";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const panel = await technicalService.getTechnicalAssessmentPanel(id);
        return NextResponse.json(panel);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Load technical assessment failed" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const saved = await technicalService.saveTechnicalAssessment({
            ...body,
            serviceRequestId: id,
        });

        return NextResponse.json({ ok: true, item: saved });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Save technical assessment failed" },
            { status: 500 }
        );
    }
}