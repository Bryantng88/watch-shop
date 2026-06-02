import { NextRequest, NextResponse } from "next/server";

import { saveTechnicalCatalogItem } from "@/domains/category/server/";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ kind: string }> }
) {
    try {
        const { kind } = await params;
        const payload = await req.json();

        const item = await saveTechnicalCatalogItem(kind as any, payload);

        return NextResponse.json(item);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể lưu catalog." },
            { status: 400 }
        );
    }
}
