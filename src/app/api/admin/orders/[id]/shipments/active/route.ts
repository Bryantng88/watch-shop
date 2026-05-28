import { NextResponse } from "next/server";
import { getActiveShipmentByOrderIdApplication } from "@/domains/shipment/application";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
    try {
        const data = await getActiveShipmentByOrderIdApplication(ctx.params.id);
        return NextResponse.json(data ?? null);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Không thể tải shipment active của order." },
            { status: 500 },
        );
    }
}
