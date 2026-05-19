import { NextRequest, NextResponse } from "next/server";

import { completePaymentApplication } from "@/domains/payment/application";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
