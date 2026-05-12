import { NextRequest, NextResponse } from "next/server";

import { createAcquisitionWithItemApplication } from "@/domains/acquisition/application";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.vendorId && !body.quickVendorName) {
            return NextResponse.json(
                { error: "Thiếu vendorId hoặc tên vendor mới" },
                { status: 400 }
            );
        }

        if (!Array.isArray(body.items) || !body.items.length) {
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
                    { error: `Sản phẩm dòng ${i + 1} số lượng phải > 0` },
                    { status: 400 }
                );
            }
        }

        const result = await createAcquisitionWithItemApplication(body);
        return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Lỗi hệ thống" },
            { status: 400 }
        );
    }
}