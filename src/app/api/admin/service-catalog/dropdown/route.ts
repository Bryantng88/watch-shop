import { NextResponse } from "next/server";
import * as srService from "@/domains/service/server";

export async function GET() {
    const items = await srService.getServiceCatalogOptions();
    return NextResponse.json({ items });
}
