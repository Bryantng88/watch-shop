import { NextRequest, NextResponse } from "next/server";

import { createShipmentReturnFeeApplication } from "@/domains/shipment/application";

export async function POST(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const params = await ctx.params;
        const body = await req.json().catch(() => ({}));

        const amount = Number(body?.amount ?? 0);

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Phí hoàn hàng phải lớn hơn 0." },
                { status: 400 }
            );
        }

        const data = await createShipmentReturnFeeApplication({
            shipmentId: params.id,
            amount,
            method: body?.method ?? body?.paymentMethod ?? "BANK_TRANSFER",
            reference: body?.reference ?? null,
            note: body?.note ?? null,
            paidAt: body?.paidAt ?? null,
        });

        return NextResponse.json(data);
    } catch (e: any) {
        console.error("[SHIPMENT_RETURN_FEE_ERROR]", e);

        return NextResponse.json(
            { error: e?.message ?? "Không thể ghi nhận phí hoàn hàng." },
            { status: 400 }
        );
    }
}