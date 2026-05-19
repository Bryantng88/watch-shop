import { NextRequest, NextResponse } from "next/server";
import { markShipmentDeliveredApplication } from "@/domains/shipment/application";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await markShipmentDeliveredApplication({ shipmentId: ctx.params.id, note: body?.note ?? null });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Không thể hoàn tất shipment." }, { status: 400 });
  }
}
