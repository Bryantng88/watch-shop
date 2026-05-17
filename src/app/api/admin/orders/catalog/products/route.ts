// app/api/admin/orders/catalog/products/route.ts

import { NextRequest, NextResponse } from "next/server";

import { searchOrderProducts } from "@/domains/order/server/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const items = await searchOrderProducts(q);

    return NextResponse.json({ items });
}