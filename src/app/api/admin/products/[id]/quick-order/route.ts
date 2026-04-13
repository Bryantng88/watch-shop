import { NextResponse } from "next/server";
import * as productService from "@/app/(admin)/admin/products/_server/core/product.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const result = await productService.quickOrderProduct({
            productId: id,
            customerName: body.customerName,
            customerId: body.customerId ?? null,
            listPrice: body.listPrice ?? null,
            unitPriceAgreed: body.unitPriceAgreed ?? null,
            notes: body.notes ?? null,
        });

        return NextResponse.json(result);
    } catch (e: any) {
        console.error("[PRODUCT_QUICK_ORDER_ROUTE][ERROR]", {
            name: e?.name,
            message: e?.message,
            stack: e?.stack,
        });

        return NextResponse.json(
            { error: e?.message || "Quick order failed" },
            { status: 500 }
        );
    }
}