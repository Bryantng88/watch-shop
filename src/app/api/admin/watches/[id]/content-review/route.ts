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
            "content:requirePermission",
            () => requirePermission(PERMISSIONS.PRODUCT_APPROVE),
        );

        const { id } = await params;
        const productId = String(id ?? "").trim();

        if (!productId) {
            throw new Error("Thiếu productId khi duyệt nội dung.");
        }

        const body = await perfStep(
            "watch-review-route",
            "content:parseBody",
            () => req.json().catch(() => ({})),
        );
        const action = String(body?.action ?? "").toLowerCase();

        if (action === "approve") {
            const state = await perfStep(
                "watch-review-route",
                "content:approve",
                () => approveWatchReview({
                productId,
                targetType: "CONTENT",
                userId: getAuthUserId(auth),
            }),
            );
            perfLog("watch-review-route", "content:total", totalStartedAt);
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

            const state = await perfStep(
                "watch-review-route",
                "content:reject",
                () => rejectWatchReview({
                productId,
                targetType: "CONTENT",
                userId: getAuthUserId(auth),
                note,
            }),
            );
            perfLog("watch-review-route", "content:total", totalStartedAt);
            return NextResponse.json({ ok: true, item: state });
        }

        if (action === "reset") {
            const state = await perfStep(
                "watch-review-route",
                "content:reset",
                () => resetWatchReviewToDraft({
                productId,
                targetType: "CONTENT",
                userId: getAuthUserId(auth),
            }),
            );
            perfLog("watch-review-route", "content:total", totalStartedAt);
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
