import { NextResponse } from "next/server";

import { bulkPostOrdersApplication } from "@/domains/order/application";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const orderIds = Array.isArray(body?.orderIds) ? body.orderIds : [];

        if (!orderIds.length) {
            return NextResponse.json({ error: "Không có đơn hàng nào để post." }, { status: 400 });
        }

        const result = await bulkPostOrdersApplication(orderIds);

        return NextResponse.json({ ok: true, ...result });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message ?? "Không thể post đơn hàng." },
            { status: 400 },
        );
    }
}
