import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { updateWatchContentReviewStatus } from "@/domains/watch/server/content";


export const dynamic = "force-dynamic";

const BodySchema = z.object({
    action: z.enum(["submit", "approve", "reject", "publish", "draft"]),
    note: z.string().optional().nullable(),
});
const REVIEW_ACTIONS = new Set(["approve", "reject"]);

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

        const content = await updateWatchContentReviewStatus({
            productId: params.id,
            action: body.action,
            note: body.note,
            userId: null,
        });

        return NextResponse.json({
            success: true,
            contentStatus: content.contentStatus,
            reviewNote: content.reviewNote,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error?.message ||
                    "Không thể cập nhật trạng thái duyệt content.",
            },
            { status: 400 }
        );
    }
}