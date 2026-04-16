import { NextResponse } from "next/server";
import * as productService from "@/app/(admin)/admin/products/_server/core/product.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const result = await productService.consignToProduct({
            productId: id,
            vendorId: body.vendorId,
            notes: body.notes ?? null,
        });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Consign to failed" },
            { status: 500 }
        );
    }
}