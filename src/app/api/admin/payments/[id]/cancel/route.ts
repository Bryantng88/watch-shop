import { NextRequest, NextResponse } from "next/server";

import { cancelPayment } from "@/domains/payment/server";
import { authorizePaymentAccess } from "@/domains/payment/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;
        const access = await authorizePaymentAccess(id, "DELETE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

        if (!id || id === "undefined") {
            return NextResponse.json(
                { error: "Thiếu paymentId để hủy payment." },
                { status: 400 },
            );
        }

        const body = await req.json().catch(() => ({}));

        const result = await cancelPayment({
            paymentId: id,
            note: body?.note ?? null,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể hủy payment." },
            { status: 400 },
        );
    }
}
