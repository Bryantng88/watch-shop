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
        const { title, brandId, status, primaryImageUrl, price } = body as {
            title: string;
            brandId?: string | null;
            status: "ACTIVE" | "HOLD" | "SOLD" | "CONSIGNED" | "HIDDEN";
            primaryImageUrl?: string | null;
            price: number;
        };

        if (!title || typeof price !== "number") {
            return NextResponse.json(
                { message: "Thiếu dữ liệu: title/price" },
                { status: 400 }
            );
        }

        // Tạo sản phẩm + 1 biến thể mặc định để có giá
        const created = await prisma.product.create({
            data: {
                title,
                status,
                primaryImageUrl: primaryImageUrl || null,
                ...(brandId ? { brandId } : {}),
                variants: {
                    create: [
                        {
                            name: "Default",
                            price,
                            isActive: true,
                            stockQty: 0,
                        },
                    ],
                },
            },
            select: { id: true, slug: true },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json(
            { message: e?.message || "Tạo sản phẩm thất bại" },
            { status: 500 }
        );
    }
}