import { NextRequest, NextResponse } from "next/server";
import { createAcquisitionWithItem } from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(JSON.stringify(body))
        // Validate dữ liệu đầu vào (có thể xài Zod nếu muốn)
        if (!body.vendorId || !body.item?.productId)
            return NextResponse.json({ error: "Thiếu vendorId hoặc sản phẩm" }, { status: 400 });

        const input = {
            vendorId: body.vendorId,
            currency: body.currency,
            type: body.type,
            acquiredAt: body.acquiredAt ? new Date(body.acquiredAt) : undefined,
            notes: body.notes ?? null,
            item: {
                productId: body.item.productId,
                variantId: body.item.variantId,
                quantity: Number(body.item.quantity) || 1,
                unitCost: Number(body.item.unitCost) || 0
            }
        };

        const acq = await createAcquisitionWithItem(input);

        return NextResponse.json(acq, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err?.message || "Lỗi tạo phiếu nhập" }, { status: 500 });
    }
}
