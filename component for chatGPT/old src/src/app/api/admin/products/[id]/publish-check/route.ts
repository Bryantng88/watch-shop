import { NextResponse } from "next/server";
import { adminProductService } from "@/features/products/server/product.service";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    const { id } = await ctx.params
    const snap = await adminProductService.getPublishSnapshot(id);
    const missing = adminProductService.buildMissing(snap)
    return NextResponse.json({
        pass: missing.length === 0,
        missing,
        snapshot: snap,
    });
}


