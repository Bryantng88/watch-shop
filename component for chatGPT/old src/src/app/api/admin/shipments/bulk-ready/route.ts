import { NextResponse } from "next/server";
import { bulkReadyShipments } from "@/app/(admin)/admin/shipments/_server/shipment.service";
// ✅ đổi path theo project bạn

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        const shipmentIds = body?.shipmentIds;

        if (!Array.isArray(shipmentIds)) {
            return NextResponse.json(
                { error: "shipmentIds phải là mảng" },
                { status: 400 }
            );
        }

        const data = await bulkReadyShipments({ shipmentIds });

        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Bulk ready failed" },
            { status: 400 }
        );
    }
}
