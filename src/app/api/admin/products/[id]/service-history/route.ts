import { NextRequest, NextResponse } from "next/server";
import * as adminProductService from "@/app/(admin)/admin/products/_server/product.service";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_VIEW);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const items = await adminProductService.getProductServiceHistory(id);
        return NextResponse.json({ items }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed to load service history" }, { status: 400 });
    }
}
