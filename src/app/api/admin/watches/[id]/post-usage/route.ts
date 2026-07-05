import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { markWatchPostUsage } from "@/domains/watch/server/content/watch-post-usage.service";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
    action: z.enum(["CONTENT_COPIED", "IMAGE_DOWNLOADED"]),
});

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = BodySchema.parse(await req.json());

        const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
        if (auth instanceof Response) return auth;

        const state = await markWatchPostUsage({
            productId: params.id,
            kind: body.action,
            actorUserId: auth.id,
        });

        return NextResponse.json({
            success: true,
            ...state,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Không thể cập nhật trạng thái đăng bài.",
            },
            { status: 400 }
        );
    }
}
