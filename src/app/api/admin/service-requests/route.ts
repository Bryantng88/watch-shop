import { NextResponse } from "next/server";
import { saveTechnicalAssessment } from "@/app/(admin)/admin/services/_server/technical_assessment.serivce";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const result = await saveTechnicalAssessment(body);

        return NextResponse.json({
            ok: true,
            data: result,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error?.message ?? "Save technical assessment failed" },
            { status: 500 }
        );
    }
}