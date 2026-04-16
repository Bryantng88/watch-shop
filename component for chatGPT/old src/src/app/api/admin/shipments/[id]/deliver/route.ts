import { NextRequest, NextResponse } from "next/server";
import { markShipmentDelivered } from "@/app/(admin)/admin/shipments/_server/shipment.service";

export async function POST(_req: NextRequest, ctx: { params: { id: string } }) {
    try {
        const shipmentId = ctx.params.id;
        if (!shipmentId) return NextResponse.json({ error: "Missing shipmentId" }, { status: 400 });

        await markShipmentDelivered({ shipmentId });

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return new NextResponse(e?.message || "Internal error", { status: 500 });
    }
}
