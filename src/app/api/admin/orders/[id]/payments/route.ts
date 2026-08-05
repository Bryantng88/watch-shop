import { NextResponse } from "next/server";

import { createPaymentApplication } from "@/domains/payment/application";
import { authorizePaymentOwner } from "@/domains/payment/server";

export async function POST(
    req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const params = await ctx.params;
        const body = await req.json().catch(() => ({}));
        const access = await authorizePaymentOwner("ORDER", "CREATE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

        const result = await createPaymentApplication({
            ownerType: "ORDER",
            ownerId: params.id,
            amount: Number(body?.amount ?? 0),
            method: body?.method ?? null,
            purpose: body?.purpose ?? null,
            note: body?.note ?? null,
            markPaidNow: Boolean(body?.markPaidNow),
        });

        return NextResponse.json({ ok: true, item: result });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message ?? "Không thể tạo payment." },
            { status: 400 },
        );
    }
}
