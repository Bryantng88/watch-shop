import { NextRequest, NextResponse } from "next/server";
import { buyBackFromWatch } from "@/src/domains/watch/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();

    const result = await buyBackFromWatch({
        productId: params.id,
        unitCost: Number(body?.unitCost ?? 0),
        notes: body?.notes ?? null,
        customerId: body?.customerId ?? null,
        needService: Boolean(body?.needService),
    });

    return NextResponse.json({ ok: true, result });
}