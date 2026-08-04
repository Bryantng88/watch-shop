import { after, NextRequest, NextResponse } from "next/server";

import { createOrderApplication } from "@/domains/order/application";
import type { CreateOrderInput } from "@/domains/order/server/shared";

type PublicOrderItem = {
    productId?: unknown;
    quantity?: unknown;
    title?: unknown;
};

type PublicOrderBody = {
    customerName?: unknown;
    shipPhone?: unknown;
    shipAddress?: unknown;
    shipCity?: unknown;
    shipDistrict?: unknown;
    shipWard?: unknown;
    items?: PublicOrderItem[];
};

function optionalText(value: unknown, maxLength: number) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : null;
}

export async function POST(req: NextRequest) {
    let body: PublicOrderBody;

    try {
        body = await req.json() as PublicOrderBody;
    } catch {
        return NextResponse.json({ error: "Body must be valid JSON" }, { status: 400 });
    }

    if (typeof body.customerName !== "string" || !body.customerName.trim()) {
        return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }
    if (typeof body.shipPhone !== "string" || !body.shipPhone.trim()) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (typeof body.shipAddress !== "string" || !body.shipAddress.trim()) {
        return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
        return NextResponse.json({ error: "Order must contain 1 to 20 products" }, { status: 400 });
    }

    for (const item of body.items) {
        if (typeof item.productId !== "string" || !item.productId) {
            return NextResponse.json({ error: "Every product must have an id" }, { status: 400 });
        }
        if (!Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 20) {
            return NextResponse.json({ error: "Product quantity must be between 1 and 20" }, { status: 400 });
        }
    }

    const payload: CreateOrderInput = {
        customerName: body.customerName.trim().slice(0, 120),
        shipPhone: body.shipPhone.trim().slice(0, 30),
        shipAddress: body.shipAddress.trim().slice(0, 500),
        shipCity: optionalText(body.shipCity, 120),
        shipDistrict: optionalText(body.shipDistrict, 120),
        shipWard: optionalText(body.shipWard, 120),
        customerId: null,
        source: "WEB",
        verificationStatus: "PENDING",
        hasShipment: true,
        paymentMethod: "BANK_TRANSFER",
        notes: null,
        reserve: null,
        tradeIn: null,
        items: body.items.map((item) => ({
            kind: "PRODUCT",
            productId: String(item.productId),
            title: typeof item.title === "string" ? item.title.slice(0, 200) : "",
            quantity: Number(item.quantity),
            listPrice: 0,
            unitPriceAgreed: null,
        })),
    };

    try {
        const order = await createOrderApplication(payload, {
            deferConsumers: (work) => after(work),
        });
        return NextResponse.json(
            { id: order.id, status: order.status },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create public order failed:", error);
        return NextResponse.json({ error: "Unable to create order" }, { status: 400 });
    }
}
