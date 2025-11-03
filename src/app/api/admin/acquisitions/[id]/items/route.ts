import { NextResponse } from "next/server";
import { getAcquisitionDetail } from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params
    const acq = await getAcquisitionDetail(id);
    if (!acq) return NextResponse.json({ items: [] });

    return NextResponse.json({
        items: acq.AcquisitionItem.map((i) => ({
            id: i.id,
            title: i.product?.title ?? i.variant?.name ?? i.productId,
            quantity: i.quantity ?? 1,
            unitCost: Number(i.unitCost ?? 0),
        })),
    });
}