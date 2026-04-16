import { NextRequest, NextResponse } from "next/server";
import { getAdminShipmentList } from "@/app/(admin)/admin/shipment/_server/shipment.service";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);

    const data = await getAdminShipmentList({ page, pageSize });

    return NextResponse.json(data);
}
