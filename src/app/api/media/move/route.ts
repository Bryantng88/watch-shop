import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { moveMediaObject } from "@/server/lib/media-storage"
import { normalizeKey } from "@/server/lib/product-image-storage";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
    fromKey: z.string().min(1),
    toPrefix: z.string().min(1),
    deleteSource: z.boolean().optional(),
    overwrite: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json());

        const moved = await moveMediaObject({
            fromKey: body.fromKey,
            toPrefix: body.toPrefix,
            deleteSource: body.deleteSource,
            overwrite: body.overwrite,
        });

        const key = normalizeKey(moved.key);

        return NextResponse.json({
            success: true,
            key,
            fromKey: normalizeKey(moved.fromKey),
            url: `/api/media/sign?key=${encodeURIComponent(key)}`,
            copied: moved.copied,
            deleted: moved.deleted,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Move media failed" },
            { status: 400 }
        );
    }
}
