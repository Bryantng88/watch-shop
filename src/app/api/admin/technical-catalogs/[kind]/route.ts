import { NextRequest, NextResponse } from "next/server";
import { saveTechnicalCatalogItem } from "@/app/(admin)/admin/catalogs/technical/_server/technical_catalog.service";

export async function POST(
    req: NextRequest,
    { params }: { params: { kind: "action" | "part" | "appearanceIssue" } }
) {
    try {
        const body = await req.json();
        const result = await saveTechnicalCatalogItem(params.kind, body);
        return NextResponse.json({ ok: true, item: result });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error?.message ?? "Save technical catalog failed" },
            { status: 500 }
        );
    }
}