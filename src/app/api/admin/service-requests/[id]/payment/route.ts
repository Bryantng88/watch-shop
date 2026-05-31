import { NextResponse } from "next/server";
import {
  cancelServiceRequestPaymentApplication,
  completeServiceRequestPaymentApplication,
  createServiceRequestPaymentApplication,
  listServiceRequestPaymentsApplication,
} from "@/domains/service/application";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const items = await listServiceRequestPaymentsApplication(id);
  return NextResponse.json({ items });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));

    if (body?.action === "cancel" || body?.cancelPaymentId) {
      const result = await cancelServiceRequestPaymentApplication({
        paymentId: body.cancelPaymentId ?? body.paymentId,
        note: body.note ?? null,
      });
      return NextResponse.json({ ok: true, result });
    }

    if (body?.paymentId || body?.action === "complete") {
      const result = await completeServiceRequestPaymentApplication({
        paymentId: body.paymentId,
        reference: body.reference ?? null,
        note: body.note ?? null,
        paidAt: body.paidAt ?? null,
      });
      return NextResponse.json({ ok: true, result });
    }

    const result = await createServiceRequestPaymentApplication({
      serviceRequestId: id,
      amount: body.amount == null ? null : Number(body.amount),
      method: body.method ?? null,
      purpose: body.purpose ?? "MAINTENANCE_COST",
      note: body.note ?? null,
      markPaidNow: Boolean(body.markPaidNow),
    });

    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Không thể xử lý payment service." },
      { status: 400 },
    );
  }
}
