import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { submitWatchReview } from "@/domains/watch/server/review";

export const dynamic = "force-dynamic";

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

export async function POST(
    _req: Request,
    {
        params,
    }: { params: Promise<{ productId: string }> | { productId: string } },
) {
    try {
        const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
        const { productId } = await params;

        const state = await submitWatchReview({
            productId,
            targetType: "IMAGE",
            userId: getAuthUserId(auth),
        });

        return NextResponse.json({ ok: true, item: state });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể gửi duyệt hình ảnh.",
            },
            { status: 500 },
        );
    }
}
