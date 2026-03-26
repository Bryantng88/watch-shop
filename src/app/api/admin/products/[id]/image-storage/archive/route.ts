import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { archiveProductImagesForSold } from "@/server/lib/product-image-storage";

const BodySchema = z.object({
    deleteSource: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const body = BodySchema.parse(await req.json().catch(() => ({})));
        const result = await archiveProductImagesForSold(id, {
            deleteSource: body.deleteSource,
        });
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Archive failed" }, { status: 400 });
    }
}
