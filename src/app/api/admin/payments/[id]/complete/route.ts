import { NextRequest, NextResponse } from "next/server";

import { completePaymentApplication } from "@/domains/payment/application";
import { authorizePaymentAccess } from "@/domains/payment/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const access = await authorizePaymentAccess(id, "UPDATE");
    if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
    const body = await req.json().catch(() => ({}));

    const result = await completePaymentApplication({
      paymentId: id,
      paidAt: body?.paidAt ?? null,
      reference: body?.reference ?? null,
      note: body?.note ?? null,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Không hoàn tất được payment." },
      { status: 400 },
    );
  }
}
