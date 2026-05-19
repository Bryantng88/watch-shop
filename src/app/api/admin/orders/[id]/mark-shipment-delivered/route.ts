import { NextResponse } from "next/server";
import { markOrderShipmentDeliveredApplication } from "@/domains/payment/application";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));

    const result = await markOrderShipmentDeliveredApplication({
      orderId: id,
      note: body?.note ?? null,
    });

    return NextResponse.json({
      ok: true,
      message: "Đã đánh dấu shipment delivered. Nếu là COD, payment COD đã chuyển sang chờ đối soát.",
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Không thể hoàn tất shipment." },
      { status: 400 },
    );
  }
}
