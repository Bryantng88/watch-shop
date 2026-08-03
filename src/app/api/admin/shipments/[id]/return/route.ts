import { NextRequest, NextResponse } from "next/server";
import { markShipmentReturnedApplication } from "@/domains/shipment/application";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await markShipmentReturnedApplication({ shipmentId: (await ctx.params).id, note: body?.note ?? null });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Không thể chuyển shipment về trả hàng." }, { status: 400 });
  }
}
