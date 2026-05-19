import { NextRequest, NextResponse } from "next/server";
import { createShipmentFeeAndShipApplication } from "@/domains/shipment/application";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount ?? body?.shippingFee ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Phí ship phải lớn hơn 0." }, { status: 400 });
    }

    const data = await createShipmentFeeAndShipApplication({
      shipmentId: ctx.params.id,
      amount,
      method: body?.method ?? body?.paymentMethod ?? "BANK_TRANSFER",
      carrier: body?.carrier ?? null,
      trackingCode: body?.trackingCode ?? null,
      reference: body?.reference ?? null,
      note: body?.note ?? null,
      paidAt: body?.paidAt ?? null,
    });

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Không thể tạo phí ship." }, { status: 400 });
  }
}
