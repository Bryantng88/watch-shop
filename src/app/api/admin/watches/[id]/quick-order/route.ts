import { NextRequest, NextResponse } from "next/server";
import { quickOrderWatch } from "@/domains/watch/server/bridge";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();

    const result = await quickOrderWatch({
        productId: params.id,
        customerName: String(body?.customerName ?? "").trim(),
        customerId: body?.customerId ?? null,
        listPrice:
            body?.listPrice == null || body?.listPrice === ""
                ? null
                : Number(body.listPrice),
        unitPriceAgreed:
            body?.unitPriceAgreed == null || body?.unitPriceAgreed === ""
                ? null
                : Number(body.unitPriceAgreed),
        notes: body?.notes ?? null,
    });

    return NextResponse.json({ ok: true, result });
}