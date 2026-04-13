import { NextRequest, NextResponse } from "next/server";
import { setStorefrontImage } from "@/app/(admin)/admin/products/_server/core/product.service";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        const fileKey = String(body?.fileKey ?? "").trim();

        if (!fileKey) {
            return NextResponse.json(
                { error: "Thiếu fileKey." },
                { status: 400 }
            );
        }

        const result = await setStorefrontImage(id, fileKey);

        return NextResponse.json({
            ok: true,
            ...result,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không cập nhật được ảnh đại diện bán hàng." },
            { status: 500 }
        );
    }
}