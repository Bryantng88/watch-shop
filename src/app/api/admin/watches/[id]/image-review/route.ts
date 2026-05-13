import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import {
    approveWatchReview,
    rejectWatchReview,
    resetWatchReviewToDraft,
} from "@/domains/watch/server/review";

export const dynamic = "force-dynamic";
function isNextRedirectError(error: unknown) {
    return (
        error instanceof Error &&
        (error.message === "NEXT_REDIRECT" ||
            String((error as any)?.digest ?? "").startsWith("NEXT_REDIRECT"))
    );
}
function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    req: NextRequest,
    {
        params,
    }: { params: Promise<{ id: string }> | { id: string } },
) {
    try {
        const auth = await requirePermission(PERMISSIONS.PRODUCT_APPROVE);

        const { id } = await params;
        const productId = id;

        const body = await req.json().catch(() => ({}));
        const action = String(body?.action ?? "").toLowerCase();

        // giữ nguyên phần approve/reject/reset bên dưới

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
        if (isNextRedirectError(error)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Bạn không có quyền duyệt hoặc phiên đăng nhập đã hết hạn.",
                },
                { status: 403 },
            );
        }

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
