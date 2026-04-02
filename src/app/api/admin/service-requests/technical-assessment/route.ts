import { NextRequest, NextResponse } from "next/server";
import { saveTechnicalAssessment } from "@/app/(admin)/admin/services/_server/technical.service";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        await saveTechnicalAssessment(payload, {
            evaluatedById: null,
            evaluatedByNameSnap: null,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Save technical failed" },
            { status: 500 }
        );
    }
}