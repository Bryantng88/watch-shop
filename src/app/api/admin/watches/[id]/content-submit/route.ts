import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { submitWatchReview } from "@/domains/watch/server/review";

export const dynamic = "force-dynamic";

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
        if (auth instanceof Response) return auth;

        const state = await submitWatchReview({
            productId: params.id,
            targetType: "CONTENT",
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
                error: error?.message || "Không thể gửi duyệt.",
            },
            { status: 400 }
        );
    }
}
