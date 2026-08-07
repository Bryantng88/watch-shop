import { NextResponse } from "next/server";
import { completePurchaseRequest, type PurchaseRequestTerminalOutcome } from "@/domains/purchase-request/server";

const allowed = new Set(["REJECTED", "CANCELLED", "EXPIRED", "DUPLICATE"]);

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    if (!allowed.has(body?.outcome)) throw new Error("Kết quả kết thúc không hợp lệ.");
    return NextResponse.json(await completePurchaseRequest({
      id: (await context.params).id,
      outcome: body.outcome as PurchaseRequestTerminalOutcome,
      reason: String(body.reason ?? ""),
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể kết thúc yêu cầu." }, { status: 400 });
  }
}
