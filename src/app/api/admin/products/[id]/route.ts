import { NextResponse, NextRequest } from "next/server";
import { adminProductService } from "@/features/products/server/product.service";
import { UpdateProductWithAcqSchema } from "@/features/products/schemas/product.schema";

type Ctx = { params: { id: string } };

// GET /api/admin/products/:id
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params
    try {
        const data = await adminProductService.detail(id);
        if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 400 });
    }
}

// PUT /api/admin/products/:id
export async function PATCH(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params
    try {
        const body = await _req.json();
        console.dir("in cai body ra test + " + JSON.stringify(body) + "in cai id nưa + " + id)

        const dto = UpdateProductWithAcqSchema.parse({ id: id, ...body });
        const updated = await adminProductService.updateProduct(dto);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        console.error("❌ [PATCH /api/admin/products/:id] Update failed:", err);
        const message = err?.errors ? JSON.stringify(err.errors) : err?.message ?? "Unexpected error";
        return NextResponse.json({ error: message }, { status: 400 });
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