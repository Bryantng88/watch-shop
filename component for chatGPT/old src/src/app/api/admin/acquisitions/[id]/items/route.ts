import { NextResponse } from "next/server";
import {
    getAcquisitionDetail,
    createAcquisitionWithItem,
} from "@/app/(admin)/admin/acquisitions/_server/core/acquisition.service"

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const acq = await getAcquisitionDetail(id);

    if (!acq) {
        return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
        items: acq.acquisitionItem.map((i) => ({
            id: i.id,
            title: i.productTitle,
            quantity: i.quantity ?? 1,
            unitCost: Number(i.unitCost ?? 0),
            productType: i.productType,
            status: i.status ?? null,
        })),
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const created = await createAcquisitionWithItem(body);

        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        console.dir(err, { depth: 10 });
        return NextResponse.json(
            { error: err?.message ?? "Failed to create acquisition" },
            { status: 400 }
        );
    }
}