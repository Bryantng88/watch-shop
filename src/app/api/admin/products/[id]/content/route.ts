import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import * as productService from "@/app/(admin)/admin/products/_server/product.service";

type Ctx = { params: Promise<{ id: string }> };

const BodySchema = z.object({
    generatedContent: z.string().nullish().optional(),
    promptNote: z.string().nullish().optional(),
    syncSnapshot: z.boolean().optional(),
});

export async function POST(req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const body = BodySchema.parse(await req.json());
        const result = await productService.saveContent(id, body);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Lưu content thất bại." }, { status: 400 });
    }
}
