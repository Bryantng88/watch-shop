import { NextResponse } from "next/server";
import { cancelOrderApplication } from "@/domains/order/application";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const result = await cancelOrderApplication({ id, reason: body?.reason ?? null });

    return NextResponse.json({
      ok: true,
      message: "Đã hủy đơn và restore watch theo snapshot trước khi giữ hàng.",
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Không thể hủy đơn." },
      { status: 400 },
    );
  }
}
