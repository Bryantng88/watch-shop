import { NextResponse } from "next/server";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function GET() {
    const items = await srService.getServiceCatalogOptions();
    return NextResponse.json({ items });
}
