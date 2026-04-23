import { NextRequest, NextResponse } from "next/server";
import { regenerateWatchTitleAndSku } from "@/domains/watch/server/core/write/watch-write.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const productId =
            typeof body?.productId === "string" ? body.productId.trim() : "";

        if (!productId) {
            return NextResponse.json(
                { ok: false, error: "Thiếu productId" },
                { status: 400 }
            );
        }

        const result = await regenerateWatchTitleAndSku(productId);

        return NextResponse.json({
            ok: true,
            item: result,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: error?.message || "Không thể gen lại title & SKU",
            },
            { status: 500 }
        );
    }
}