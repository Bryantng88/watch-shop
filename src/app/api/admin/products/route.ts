import { NextResponse } from "next/server";
import { adminProductService } from "@/features/products/server/product.service";
import prisma from "@/server/db/client";
// GET /api/admin/products
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const raw: Record<string, unknown> = Object.fromEntries(url.searchParams);

        // các param dạng mảng: ?status=A&status=B
        raw.status = url.searchParams.getAll("status");
        raw.type = url.searchParams.getAll("type");
        raw.brandIds = url.searchParams.getAll("brandIds");

        const data = await adminProductService.list(raw);
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message ?? "Failed to fetch products" },
            { status: 400 },
        );
    }


}

// POST /api/admin/products
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const product = await adminProductService.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (err: any) {
        console.error("Create product error:", err);

        // Nếu lỗi từ Zod
        if (err.name === "ZodError") {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ", errors: err.flatten?.() },
                { status: 400 }
            );
        }

        // Lỗi khác
        return NextResponse.json(
            { message: err.message || "Lỗi tạo sản phẩm" },
            { status: 500 }
        );
    }
}