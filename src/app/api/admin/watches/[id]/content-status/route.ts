import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import {
    approveWatchReview,
    rejectWatchReview,
    resetWatchReviewToDraft,
    submitWatchReview,
} from "@/domains/watch/server/review";
import { publishWatchContent } from "@/domains/watch/server/content";


export const dynamic = "force-dynamic";

const BodySchema = z.object({
    action: z.enum(["submit", "approve", "reject", "publish", "draft"]),
    note: z.string().optional().nullable(),
});
const REVIEW_ACTIONS = new Set(["approve", "reject"]);

type AuthLike = {
    user?: { id?: string | null } | null;
    id?: string | null;
    userId?: string | null;
};

function getAuthUserId(auth: AuthLike) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = BodySchema.parse(await req.json());

        const permission = REVIEW_ACTIONS.has(body.action)
            ? PERMISSIONS.PRODUCT_APPROVE
            : PERMISSIONS.PRODUCT_UPDATE;

        const auth = await requirePermissionApi(permission);
        if (auth instanceof Response) return auth;

        const userId = getAuthUserId(auth);
        const productId = params.id;

        if (body.action === "reject" && !String(body.note ?? "").trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Vui lòng nhập lý do trả về nội dung.",
                },
                { status: 400 },
            );
        }

        if (body.action === "publish") {
            const content = await publishWatchContent({
                productId,
                userId,
            });

            return NextResponse.json({
                success: true,
                contentStatus: content.contentStatus,
                reviewNote: content.reviewNote,
            });
        }

        const state =
            body.action === "submit"
                ? await submitWatchReview({
                    productId,
                    targetType: "CONTENT",
                    userId,
                })
                : body.action === "approve"
                    ? await approveWatchReview({
                        productId,
                        targetType: "CONTENT",
                        userId,
                    })
                    : body.action === "reject"
                        ? await rejectWatchReview({
                            productId,
                            targetType: "CONTENT",
                            userId,
                            note: String(body.note ?? "").trim(),
                        })
                        : await resetWatchReviewToDraft({
                            productId,
                            targetType: "CONTENT",
                            userId,
                        });

        return NextResponse.json({
            success: true,
            contentStatus: state.status,
            reviewNote: state.reviewNote,
        });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                success: false,
                error:
                    (error instanceof Error ? error.message : null) ||
                    "Không thể cập nhật trạng thái duyệt content.",
            },
            { status: 400 }
        );
    }
}
