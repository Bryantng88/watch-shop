import { NextRequest, NextResponse } from "next/server";
import * as adminProductService from "@/app/(admin)/admin/products/_server/product.service";
import { UpdateProductPatchSchema } from "@/app/(admin)/admin/products/_server/product.dto";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

type Ctx = { params: Promise<{ id: string }> };

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

export async function PATCH(req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const body = await req.json();

        const patch = UpdateProductPatchSchema.parse(body);
        const updated = await adminProductService.updateProduct(id, patch);
        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        console.error("PATCH /api/admin/products/:id failed:", err);
        const message =
            err?.issues ? JSON.stringify(err.issues) : err?.message ?? "Unexpected error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_DELETE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const result = await adminProductService.remove(id);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed to delete" }, { status: 400 });
    }
}