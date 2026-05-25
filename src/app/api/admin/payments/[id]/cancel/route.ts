import { NextRequest, NextResponse } from "next/server";

import { cancelPayment } from "@/domains/payment/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;

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