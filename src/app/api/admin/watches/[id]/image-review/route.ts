import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import {
    approveWatchReview,
    rejectWatchReview,
    resetWatchReviewToDraft,
} from "@/domains/watch/server/review";

export const dynamic = "force-dynamic";

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    req: NextRequest,
    {
        params,
    }: { params: Promise<{ productId: string }> | { productId: string } },
) {
    try {
        const auth = await requirePermission(PERMISSIONS.PRODUCT_CONTENT_REVIEW);
        const { productId } = await params;
        const body = await req.json().catch(() => ({}));
        const action = String(body?.action ?? "").toLowerCase();

        if (action === "approve") {
            const state = await approveWatchReview({
                productId,
                targetType: "IMAGE",
                userId: getAuthUserId(auth),
            });
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reject") {
            const state = await rejectWatchReview({
                productId,
                targetType: "IMAGE",
                userId: getAuthUserId(auth),
                note: body?.note ?? null,
            });
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reset") {
            const state = await resetWatchReviewToDraft({
                productId,
                targetType: "IMAGE",
                userId: getAuthUserId(auth),
            });
            return NextResponse.json({ ok: true, item: state });
        }

        return NextResponse.json(
            { ok: false, error: "Review action không hợp lệ." },
            { status: 400 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể cập nhật duyệt hình ảnh.",
            },
            { status: 500 },
        );
    }
}
