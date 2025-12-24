// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as adminProductService from "@/app/(admin)/admin/products/_server/product.service";
import { UpdateProductPatchSchema } from "@/app/(admin)/admin/products/_server/product.dto";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/admin/products/:id
export async function GET(_req: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params;
        const data = await adminProductService.detail(id);

        if (!data) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 400 });
    }
}

// PATCH /api/admin/products/:id
// Body: { title?, minPrice?, image?, priceVisibility?, availabilityStatus?, contentStatus? ... }
// => PATCH PARTIAL (gom vào 1 cái, update field nào gửi field đó)
export async function PATCH(req: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params;
        const body = await req.json();

        // ✅ FIX lỗi của bạn: parse trực tiếp body (partial), KHÔNG bắt { product: {...} }
        const patch = UpdateProductPatchSchema.parse(body);
        console.log('in ra test image url : ' + JSON.stringify(body))
        const updated = await adminProductService.updateProduct(id, patch);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        console.error("❌ [PATCH /api/admin/products/:id] Update failed:", err);
        const message =
            err?.issues ? JSON.stringify(err.issues) : err?.message ?? "Unexpected error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

// DELETE /api/admin/products/:id
export async function DELETE(_req: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params;
        const result = await adminProductService.remove(id);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed to delete" }, { status: 400 });
    }
}
