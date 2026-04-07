import { NextRequest, NextResponse } from "next/server";
import { createOrderWithItems } from "@/app/(admin)/admin/orders/_servers/order.service";

export async function POST(req: NextRequest) {
    let body: any;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Body không hợp lệ (không phải JSON)" },
            { status: 400 }
        );
    }

    if (!body.customerName?.trim()) {
        return NextResponse.json(
            { error: "Thiếu tên khách hàng" },
            { status: 400 }
        );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
            { error: "Phải có ít nhất 1 dòng sản phẩm / dịch vụ" },
            { status: 400 }
        );
    }

    for (const [i, item] of body.items.entries()) {
        if (!item.title || typeof item.title !== "string") {
            return NextResponse.json(
                { error: `Dòng ${i + 1} thiếu tên` },
                { status: 400 }
            );
        }

        if (!item.quantity || Number(item.quantity) < 1) {
            return NextResponse.json(
                { error: `Dòng ${i + 1} số lượng phải ≥ 1` },
                { status: 400 }
            );
        }

        if (item.listPrice == null || Number.isNaN(Number(item.listPrice))) {
            return NextResponse.json(
                { error: `Dòng ${i + 1} đơn giá không hợp lệ` },
                { status: 400 }
            );
        }
    }

    const payload = {
        ...body,
        source: "ADMIN",
        verificationStatus: "VERIFIED",
        status: body.status ?? "DRAFT",
    };

    try {
        const order = await createOrderWithItems(payload);
        return NextResponse.json(order, { status: 201 });
    } catch (err: any) {
        console.error("Create order failed:", err);
        return NextResponse.json(
            { error: err?.message || "Lỗi hệ thống" },
            { status: 400 }
        );
    }
}