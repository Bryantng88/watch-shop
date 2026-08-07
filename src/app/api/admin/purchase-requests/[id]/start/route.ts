import { NextResponse } from "next/server";
import { startPurchaseRequest } from "@/domains/purchase-request/server";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    return NextResponse.json(await startPurchaseRequest((await context.params).id));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tiếp nhận yêu cầu." }, { status: 400 });
  }
}
