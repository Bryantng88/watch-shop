import { NextResponse } from "next/server";
import { adminProductService } from "@/features/products/server/product.service";

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
        const body = await req.json();            // service sẽ validate bằng Zod
        const created = await adminProductService.create(body);
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        console.dir(err, { depth: 10 });
        return NextResponse.json(
            { error: err?.message ?? "Failed to create product" },
            { status: 400 },
        );
    }
}
