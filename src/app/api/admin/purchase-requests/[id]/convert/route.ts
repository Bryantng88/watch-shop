import { NextResponse } from "next/server";
import { convertPurchaseRequestToOrder } from "@/domains/purchase-request/server";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json(await convertPurchaseRequestToOrder({
      id: (await context.params).id,
      agreedPrices: body?.agreedPrices && typeof body.agreedPrices === "object" ? body.agreedPrices : {},
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo đơn hàng." }, { status: 400 });
  }
}
