import { NextRequest, NextResponse } from "next/server";
import { createOrderWithItems } from "@/app/(admin)/admin/orders/_servers/order.service";

// POST /api/admin/orders
export async function POST(req: NextRequest) {
    let body: any;
    // ==========================
    // Parse JSON
    // ==========================
    try {
        body = await req.json();
        console.log('in ra test body o order api: ' + JSON.stringify(body))

    } catch {
        return NextResponse.json(
            { error: "Body không hợp lệ (không phải JSON)" },
            { status: 400 }
        );
    }

    // ==========================
    // Validate bắt buộc
    // ==========================
    if (!body.customerName && !body.customerId) {
        return NextResponse.json(
            { error: "Thiếu thông tin khách hàng" },
            { status: 400 }
        );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
            { error: "Phải có ít nhất 1 sản phẩm" },
            { status: 400 }
        );
    }

    for (const [i, item] of body.items.entries()) {
        if (!item.title || typeof item.title !== "string") {
            return NextResponse.json(
                { error: `Sản phẩm dòng ${i + 1} thiếu tên (title)` },
                { status: 400 }
            );
        }

        if (!item.quantity || item.quantity < 1) {
            return NextResponse.json(
                { error: `Sản phẩm dòng ${i + 1} số lượng phải ≥ 1` },
                { status: 400 }
            );
        }

        if (item.price == null) {
            return NextResponse.json(
                { error: `Sản phẩm dòng ${i + 1} đơn giá không hợp lệ` },
                { status: 400 }
            );
        }
    }

    // ==========================
    // Create order
    // ==========================
    const payload = {
        ...body,
        source: "ADMIN",
        verificationStatus: "VERIFIED",
    };

    // (optional)
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
