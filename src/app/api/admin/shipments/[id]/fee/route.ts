import { NextRequest, NextResponse } from "next/server";

import { createShipmentFeeAndShipApplication } from "@/domains/shipment/application";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const params = await ctx.params;

    const body = await req.json().catch(() => ({}));

    const amount = Number(body?.amount ?? body?.shippingFee ?? 0);

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: "Phí ship không hợp lệ." },
        { status: 400 }
      );
    }

    const data = await createShipmentFeeAndShipApplication({
      shipmentId: params.id,
      amount,
      payer: body?.payer ?? "CUSTOMER",
      method:
        body?.method ??
        body?.paymentMethod ??
        "BANK_TRANSFER",
      carrier: body?.carrier ?? null,
      trackingCode: body?.trackingCode ?? null,
      reference: body?.reference ?? null,
      note: body?.note ?? null,
      paidAt: body?.paidAt ?? null,
    });

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("[SHIPMENT_FEE_ERROR]", e);

    return NextResponse.json(
      {
        error: e?.message ?? "Không thể cập nhật vận chuyển.",
      },
      { status: 400 }
    );
  }
}