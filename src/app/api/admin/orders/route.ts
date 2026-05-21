import { NextRequest, NextResponse } from "next/server";
import { createOrderApplication } from "@/domains/order/application";

export async function POST(req: NextRequest) {
    let body: any;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
    }

    const payload = {
        ...body,
        source: "ADMIN",
        verificationStatus: "VERIFIED",
        status: body.status, // không default DRAFT ở route nữa
        quickFromProductId: body.quickFromProductId ?? null,
        quickFlowType: body.quickFlowType ?? "STANDARD",
    };

    try {
        const order = await createOrderApplication(payload);
        return NextResponse.json(order, { status: 201 });
    } catch (err: any) {
        console.error("[ORDER_CREATE_ROUTE][ERROR]", err);
        return NextResponse.json({ error: err?.message || "Lỗi hệ thống" }, { status: 400 });
    }
}