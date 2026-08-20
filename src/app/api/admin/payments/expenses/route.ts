import { NextRequest, NextResponse } from "next/server";

import {
  createStandaloneExpensePayment,
  getStandaloneExpensePaymentOptions,
} from "@/domains/payment/server";
import { authorizePaymentOwner } from "@/domains/payment/server";

export async function GET() {
  const access = await authorizePaymentOwner("ALL", "VIEW");
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
  return NextResponse.json(await getStandaloneExpensePaymentOptions());
}

export async function POST(req: NextRequest) {
  try {
    const access = await authorizePaymentOwner("ALL", "CREATE");
    if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
    const body = await req.json().catch(() => ({}));
    const payment = await createStandaloneExpensePayment({
      kind: body.kind,
      amount: Number(body.amount),
      method: body.method,
      payeeUserId: body.payeeUserId,
      payeeName: body.payeeName,
      expenseCategoryId: body.expenseCategoryId,
      reference: body.reference,
      note: body.note,
      markPaidNow: body.markPaidNow,
      effectiveAt: body.effectiveAt,
      actorUserId: access.user.id,
      financeChannel: body.financeChannel,
    });
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tạo khoản thu/chi." },
      { status: 400 },
    );
  }
}
