import { after, NextRequest, NextResponse } from "next/server";

import { reconcileOrderServiceIntake } from "@/domains/service/server";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const orderId = (await ctx.params).id;
    const result = await reconcileOrderServiceIntake(orderId, {
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json(result);
  } catch (error: unknown) {
    return new NextResponse(
      error instanceof Error ? error.message : "Không thể đồng bộ phiếu kỹ thuật.",
      { status: 400 },
    );
  }
}
