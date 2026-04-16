import { NextResponse } from "next/server";
import { getOrderDetail } from "@/app/(admin)/admin/orders/_servers/order.service";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    const { id } = await ctx.params;

    const order = await getOrderDetail(id);
    if (!order) {
        return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
        items: order.items.map((i) => ({
            id: i.id,
            title: i.title,
            quantity: i.quantity ?? 1,
            unitPrice: Number(i.unitPriceAgreed ?? 0),
            productType: i.productType,
        })),
    });
}
