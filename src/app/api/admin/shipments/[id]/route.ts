import { NextRequest, NextResponse } from "next/server";
import { getShipmentDetailApplication, updateShipmentApplication } from "@/domains/shipment/application";

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const data = await getShipmentDetailApplication(ctx.params.id);
    if (!data) return NextResponse.json({ error: "Shipment không tồn tại." }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Không thể tải shipment." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await updateShipmentApplication({ shipmentId: ctx.params.id, data: body });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Không thể cập nhật shipment." }, { status: 400 });
  }
}
