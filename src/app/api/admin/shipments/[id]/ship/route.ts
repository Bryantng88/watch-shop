import { NextRequest, NextResponse } from "next/server";
import { markShipmentShipped } from "@/app/(admin)/admin/shipments/_server/shipment.service";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    try {
        const shipmentId = ctx.params.id;
        const body = await req.json();
        const shippingFee = Number(body?.shippingFee ?? 0);

        if (!shipmentId) return NextResponse.json({ error: "Missing shipmentId" }, { status: 400 });
        if (Number.isNaN(shippingFee) || shippingFee < 0)
            return NextResponse.json({ error: "Invalid shippingFee" }, { status: 400 });

        await markShipmentShipped({ shipmentId, shippingFee });

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return new NextResponse(e?.message || "Internal error", { status: 500 });
    }
}
