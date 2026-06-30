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
    }: { params: Promise<{ id: string }> | { id: string } },
) {
    try {
        const auth = await requirePermission(PERMISSIONS.PRODUCT_APPROVE);

        const { id } = await params;
        const productId = String(id ?? "").trim();

        if (!productId) {
            throw new Error("Thiếu productId khi duyệt nội dung.");
        }

        const body = await req.json().catch(() => ({}));
        const action = String(body?.action ?? "").toLowerCase();

        if (action === "approve") {
            const state = await approveWatchReview({
                productId,
                targetType: "CONTENT",
                userId: getAuthUserId(auth),
            });
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reject") {
            const note = String(body?.note ?? "").trim();
            if (!note) {
                return NextResponse.json(
                    { ok: false, error: "Vui lòng nhập lý do trả về nội dung." },
                    { status: 400 },
                );
            }

            const state = await rejectWatchReview({
                productId,
                targetType: "CONTENT",
                userId: getAuthUserId(auth),
                note,
            });
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reset") {
            const state = await resetWatchReviewToDraft({
                productId,
                targetType: "CONTENT",
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
                        : "Không thể cập nhật duyệt nội dung.",
            },
            { status: 500 },
        );
    }
}
