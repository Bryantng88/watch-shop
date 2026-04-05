import { NextRequest, NextResponse } from "next/server";
import { saveTechnicalCatalogItem } from "@/app/(admin)/admin/catalogs/technical/_server/technical.catalog.service";


type RouteContext = {
    params: Promise<{ kind: "action" | "part" | "appearanceIssue" }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
    try {
        const { kind } = await context.params;
        const body = await req.json();

        const result = await saveTechnicalCatalogItem(kind, body);

        return NextResponse.json({
            ok: true,
            item: result,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error?.message ?? "Save technical catalog failed" },
            { status: 500 }
        );
    }
}