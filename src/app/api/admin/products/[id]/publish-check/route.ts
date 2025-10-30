import { NextResponse } from "next/server";
import { adminProductService } from "@/features/products/admin/server/admin-product.service";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const snap = await adminProductService.getPublishSnapshot(params.id);
    const missing = adminProductService.buildMissing(snap);
    return NextResponse.json({
        pass: missing.length === 0,
        missing,
        snapshot: snap,
    });
}
