import { NextResponse } from "next/server";
import { getTechnicalAssessmentCatalogs } from "@/domains/service/server";

export async function GET() {
    try {
        const catalogs = await getTechnicalAssessmentCatalogs();

        return NextResponse.json({
            ok: true,
            data: catalogs,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Load technical catalogs failed" },
            { status: 500 },
        );
    }
}