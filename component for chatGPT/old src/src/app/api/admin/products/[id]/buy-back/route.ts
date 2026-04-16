import { NextResponse } from "next/server";
import * as productService from "@/app/(admin)/admin/products/_server/core/product.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const result = await productService.buyBackProduct({
            productId: id,
            unitCost: Number(body.unitCost ?? 0),
            notes: body.notes ?? null,
            customerId: body.customerId ?? null,
            needService: Boolean(body.needService),
        });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Buy back failed" },
            { status: 500 }
        );
    }
}