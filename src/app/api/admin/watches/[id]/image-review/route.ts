import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import {
    approveWatchReview,
    rejectWatchReview,
} from "@/domains/watch/server/review";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
    action: z.enum(["approve", "reject"]),
    note: z.string().optional().nullable(),
});

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = BodySchema.parse(await req.json());

        const auth = await requirePermissionApi(
            PERMISSIONS.PRODUCT_CONTENT_REVIEW
        );
        if (auth instanceof Response) return auth;

        const input = {
            productId: params.id,
            targetType: "IMAGE" as const,
            userId: getAuthUserId(auth),
        };

        const state =
            body.action === "approve"
                ? await approveWatchReview(input)
                : await rejectWatchReview({
                    ...input,
                    note: body.note,
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
                error: error?.message || "Không thể duyệt hình ảnh.",
            },
            { status: 400 }
        );
    }
}