import { NextResponse } from "next/server";
import { getOrderDetailRepo } from "@/domains/order/server";
import { prisma } from "@/server/db/client";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    const { id } = await ctx.params;

    const order = await getOrderDetailRepo(prisma, id);
    if (!order) {
        return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
        items: order.orderItem.map((i) => ({
            id: i.id,
            title: i.title,
            quantity: i.quantity ?? 1,
            unitPrice: Number(i.unitPriceAgreed ?? 0),
            productType: i.productType,
        })),
    });
}
