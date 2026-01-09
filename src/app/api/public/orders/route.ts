import { NextRequest, NextResponse } from "next/server";
import { createOrderWithItems } from "@/app/(admin)/admin/orders/_servers/order.service";

// POST /api/public/orders
export async function POST(req: NextRequest) {
    let body: any;

    // ==========================
    // Parse JSON
    // ==========================
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Body không hợp lệ (không phải JSON)" },
            { status: 400 }
        );
    }

    // ==========================
    // Validate tối thiểu (public)
    // ==========================
    // public thường không có customerId → yêu cầu customerName + shipPhone + shipAddress tối thiểu
    if (!body.customerName || typeof body.customerName !== "string") {
        return NextResponse.json({ error: "Thiếu tên khách hàng" }, { status: 400 });
    }

    if (!body.shipPhone || typeof body.shipPhone !== "string") {
        return NextResponse.json({ error: "Thiếu số điện thoại" }, { status: 400 });
    }

    if (!body.shipAddress || typeof body.shipAddress !== "string") {
        return NextResponse.json({ error: "Thiếu địa chỉ" }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
            { error: "Phải có ít nhất 1 sản phẩm" },
            { status: 400 }
        );
    }

    // Với public: KHÔNG tin price từ client (nếu service của bạn tự lookup giá từ product thì OK)
    // Nếu service hiện tại cần price thì tạm vẫn validate, nhưng khuyến nghị bỏ price khỏi public input.
    for (const [i, item] of body.items.entries()) {
        if (!item.productId || typeof item.productId !== "string") {
            return NextResponse.json(
                { error: `Sản phẩm dòng ${i + 1} thiếu productId` },
                { status: 400 }
            );
        }

        if (!item.quantity || item.quantity < 1) {
            return NextResponse.json(
                { error: `Sản phẩm dòng ${i + 1} số lượng phải ≥ 1` },
                { status: 400 }
            );
        }

        // optional: nếu bạn vẫn đang truyền title từ UI
        if (item.title != null && typeof item.title !== "string") {
            return NextResponse.json(
                { error: `Sản phẩm dòng ${i + 1} title không hợp lệ` },
                { status: 400 }
            );
        }
    }

    // ==========================
    // Force flags for WEB orders
    // ==========================
    // Ép cứng: không cho client tự set/override
    const payload = {
        ...body,
        customerId: null, // public thường không có customerId (tuỳ bạn)
        source: "WEB",
        verificationStatus: "PENDING",
        // status: "DRAFT", // nếu service không tự set status thì bạn có thể ép ở đây
    };

    // OPTIONAL: chặn các field nhạy cảm từ public (tuỳ dự án bạn)
    // delete payload.discount;
    // delete payload.manualPrice;
    // delete payload.internalNotes;

    // ==========================
    // Create order
    // ==========================
    try {
        const order = await createOrderWithItems(payload);
        return NextResponse.json(order, { status: 201 });
    } catch (err: any) {
        console.error("Create public order failed:", err);
        return NextResponse.json(
            { error: err?.message || "Lỗi hệ thống" },
            { status: 400 }
        );
    }
}
