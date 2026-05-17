// app/api/admin/orders/catalog/customers/route.ts

import { NextRequest, NextResponse } from "next/server";

import { searchOrderCustomers } from "@/domains/order/server/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const items = await searchOrderCustomers(q);

    return NextResponse.json({ items });
}