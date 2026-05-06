import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { resetWatchReviewToDraft } from "@/domains/watch/server/review";

export const dynamic = "force-dynamic";

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;

        const auth = await requirePermissionApi(
            PERMISSIONS.PRODUCT_CONTENT_REVIEW
        );
        if (auth instanceof Response) return auth;

        const state = await resetWatchReviewToDraft({
            productId: params.id,
            targetType: "IMAGE",
            userId: getAuthUserId(auth),
        });

        return NextResponse.json({
            success: true,
            targetType: state.targetType,
            status: state.status,
            reviewNote: state.reviewNote,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Không thể mở khóa hình ảnh.",
            },
            { status: 400 }
        );
    }
}