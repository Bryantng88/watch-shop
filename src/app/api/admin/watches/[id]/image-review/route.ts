import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import {
    approveWatchReview,
    rejectWatchReview,
    resetWatchReviewToDraft,
} from "@/domains/watch/server/review/watch-review.service";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

export const dynamic = "force-dynamic";
function isNextRedirectError(error: unknown) {
    const maybeRedirect = error as { digest?: unknown };
    return (
        error instanceof Error &&
        (error.message === "NEXT_REDIRECT" ||
            String(maybeRedirect.digest ?? "").startsWith("NEXT_REDIRECT"))
    );
}
function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function getAuthUserId(auth: unknown) {
    const root = asRecord(auth);
    const user = asRecord(root.user);
    const id = user.id ?? root.id ?? root.userId;
    return typeof id === "string" && id.trim() ? id : null;
}

export async function POST(
    req: NextRequest,
    {
        params,
    }: { params: Promise<{ id: string }> | { id: string } },
) {
    const totalStartedAt = perfNow();
    try {
        const auth = await perfStep(
            "watch-review-route",
            "image:requirePermission",
            () => requirePermission(PERMISSIONS.PRODUCT_APPROVE),
        );

        const { id } = await params;
        const productId = id;

        const body = await perfStep(
            "watch-review-route",
            "image:parseBody",
            () => req.json().catch(() => ({})),
        );
        const action = String(body?.action ?? "").toLowerCase();

        // giữ nguyên phần approve/reject/reset bên dưới

        if (action === "approve") {
            const state = await perfStep(
                "watch-review-route",
                "image:approve",
                () => approveWatchReview({
                productId,
                targetType: "IMAGE",
                userId: getAuthUserId(auth),
            }),
            );
            perfLog("watch-review-route", "image:total", totalStartedAt);
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reject") {
            const note = String(body?.note ?? "").trim();
            if (!note) {
                return NextResponse.json(
                    { ok: false, error: "Vui lòng nhập lý do trả về hình ảnh." },
                    { status: 400 },
                );
            }

            const state = await perfStep(
                "watch-review-route",
                "image:reject",
                () => rejectWatchReview({
                productId,
                targetType: "IMAGE",
                userId: getAuthUserId(auth),
                note,
            }),
            );
            perfLog("watch-review-route", "image:total", totalStartedAt);
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reset") {
            const state = await perfStep(
                "watch-review-route",
                "image:reset",
                () => resetWatchReviewToDraft({
                productId,
                targetType: "IMAGE",
                userId: getAuthUserId(auth),
            }),
            );
            perfLog("watch-review-route", "image:total", totalStartedAt);
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
