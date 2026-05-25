import { NextResponse } from "next/server";
import {
    completePaymentApplication,
    createPaymentApplication,
    listAcquisitionPaymentsApplication,
} from "@/domains/payment/application";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> },
) {
    const { id } = await ctx.params;
    const items = await listAcquisitionPaymentsApplication(id);
    return NextResponse.json({ items });
}

export async function POST(
    req: Request,
    ctx: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await ctx.params;
        const body = await req.json().catch(() => ({}));

        if (body?.paymentId || body?.action === "complete") {
            const result = await completePaymentApplication({
                paymentId: body.paymentId,
                reference: body.reference ?? null,
                note: body.note ?? null,
                paidAt: body.paidAt ?? null,
            });

            return NextResponse.json({ ok: true, result });
        }

        const result = await createPaymentApplication({
            ownerType: "ACQUISITION",
            ownerId: id,
            amount: body.amount == null ? null : Number(body.amount),
            method: body.method ?? null,
            purpose: body.purpose ?? "ACQUISITION_PAYOUT",
            note: body.note ?? null,
            markPaidNow: Boolean(body.markPaidNow),
        });

        return NextResponse.json({ ok: true, result });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || "Không thể xử lý payment phiếu nhập." },
            { status: 400 },
        );
    }
}