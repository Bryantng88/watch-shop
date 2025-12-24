import { NextRequest, NextResponse } from "next/server";
import { searchProductService } from "@/app/(admin)/admin/products/_server/product.service";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim() || "";

        if (!q) return NextResponse.json({ items: [] });

        const items = await searchProductService(q);
        return NextResponse.json({ items });
    } catch (err: any) {
        console.error("Search API error:", err);
        return NextResponse.json(
            { error: "Search failed" },
            { status: 500 }
        );
    }
}
