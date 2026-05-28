import { NextRequest, NextResponse } from "next/server";

import { finalizeOrderByPaidApplication } from "@/domains/order/application";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const body = await request.json().catch(() => ({}));

    const result = await finalizeOrderByPaidApplication({
      orderId: params.id,
      note: body?.note ?? null,
    });

    return NextResponse.json({
      ok: true,
      message: "Đã chốt order theo tiền đã nhận.",
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Không thể chốt order." },
      { status: 400 },
    );
  }
}
