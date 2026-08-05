import { NextResponse } from "next/server";
import {
  cancelPaymentApplication,
  completePaymentApplication,
  createPaymentApplication,
  listServicePaymentsApplication,
} from "@/domains/payment/application";
import { authorizePaymentAccess, authorizePaymentOwner } from "@/domains/payment/server";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const access = await authorizePaymentOwner("SERVICE", "VIEW");
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
  const items = await listServicePaymentsApplication(id);
  return NextResponse.json({ items });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));

    if (body?.action === "cancel" || body?.cancelPaymentId) {
      const access = await authorizePaymentAccess(body.cancelPaymentId ?? body.paymentId, "DELETE");
      if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
      const result = await cancelPaymentApplication({
        paymentId: body.cancelPaymentId ?? body.paymentId,
        note: body.note ?? null,
      });
      return NextResponse.json({ ok: true, result });
    }

    if (body?.paymentId || body?.action === "complete") {
      const access = await authorizePaymentAccess(body.paymentId, "UPDATE");
      if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
      const result = await completePaymentApplication({
        paymentId: body.paymentId,
        reference: body.reference ?? null,
        note: body.note ?? null,
        paidAt: body.paidAt ?? null,
      });
      return NextResponse.json({ ok: true, result });
    }

    const access = await authorizePaymentOwner("SERVICE", "CREATE");
    if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

    const result = await createPaymentApplication({
      ownerType: "SERVICE",
      ownerId: id,
      amount: body.amount == null ? null : Number(body.amount),
      method: body.method ?? null,
      purpose: body.purpose ?? "SERVICE_REQUEST",
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
