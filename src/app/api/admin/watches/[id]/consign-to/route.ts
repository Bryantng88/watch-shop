import { NextRequest, NextResponse } from "next/server";
import { consignWatch } from "@/domains/watch/server/bridge";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();

    const result = await consignWatch({
        productId: params.id,
        vendorId: String(body?.vendorId ?? "").trim(),
        notes: body?.notes ?? null,
    });

    return NextResponse.json({ ok: true, result });
}