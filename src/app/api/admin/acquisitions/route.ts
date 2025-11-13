import { NextRequest, NextResponse } from "next/server";
import { createAcquisitionWithItem } from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";
import { title } from "process";
// app/api/admin/acquisitions/route.ts


export async function POST(req: NextRequest) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Body không hợp lệ (không phải JSON)" }, { status: 400 });
    }

    // Validate các trường bắt buộc
    if (!body.vendorId && !body.quickVendorName) {
        return NextResponse.json({ error: "Thiếu vendorId hoặc tên vendor mới" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || !body.items.length) {
        return NextResponse.json({ error: "Phải có ít nhất 1 sản phẩm" }, { status: 400 });
    }
    for (const [i, item] of body.items.entries()) {
        if (!item.title || typeof item.title !== "string") {
            return NextResponse.json({ error: `Sản phẩm dòng ${i + 1} thiếu tên (title)` }, { status: 400 });
        }
        if (!item.quantity || item.quantity < 1) {
            return NextResponse.json({ error: `Sản phẩm dòng ${i + 1} số lượng phải > 0` }, { status: 400 });
        }
    }

    try {
        const acq = await createAcquisitionWithItem(body);
        return NextResponse.json(acq, { status: 201 });
    } catch (err: any) {
        // Ưu tiên trả lỗi rõ ràng từ service
        return NextResponse.json({ error: err?.message || "Lỗi hệ thống" }, { status: 400 });
    }
}
