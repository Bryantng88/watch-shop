import { NextResponse } from "next/server";
import { adminProductService } from "@/features/products/server/product.service";

type Ctx = { params: { id: string } };

// GET /api/admin/products/:id
export async function GET(_req: Request, { params }: Ctx) {
    try {
        const data = await adminProductService.detail(params.id);
        if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 400 });
    }
}

// PUT /api/admin/products/:id
export async function PUT(req: Request, { params }: Ctx) {
    try {
        const body = await req.json();
        const updated = await adminProductService.update(params.id, body);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed to update" }, { status: 400 });
    }
}

// DELETE /api/admin/products/:id
export async function DELETE(_req: Request, { params }: Ctx) {
    try {
        const result = await adminProductService.remove(params.id);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed to delete" }, { status: 400 });
    }
}
