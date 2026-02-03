import { NextResponse } from "next/server";
import * as productPostService from "@/app/(admin)/admin/products/_server/product.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const productIds: string[] = body?.productIds ?? [];

        const result = await productPostService.bulkPostProducts(productIds);

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json(
            { message: e?.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
