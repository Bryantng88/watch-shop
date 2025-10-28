import { NextResponse } from "next/server";
import { adminProductService } from "@/features/products/server/product.service";

type Ctx = { params: { id: string } };

// GET /api/admin/products/:id
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        const data = await adminProductService.detail(id);
        if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 400 });
    }
}

// PUT /api/admin/products/:id
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        const body = await req.json();
        const updated = await adminProductService.update(id, body);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        console.error('Update product failed:', err);
        return NextResponse.json({ error: err?.message ?? "Failed to update" }, { status: 400 });
    }
}

// DELETE /api/admin/products/:id
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;          // ✅ await params
    try {
        const result = await adminProductService.remove(id);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? 'Failed to delete' }, { status: 400 });
    }
}