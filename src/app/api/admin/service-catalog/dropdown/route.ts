import { NextResponse } from "next/server";
import { getServiceCatalogOptions } from "@/domains/order/server/catalog/order-catalog.service";

export async function GET() {
    const items = await getServiceCatalogOptions();
    return NextResponse.json({ items });
}
