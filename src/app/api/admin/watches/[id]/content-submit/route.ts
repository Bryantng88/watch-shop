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
    }: { params: Promise<{ id: string }> | { id: string } },
) {
    try {
        const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const { id } = await params;
        const productId = String(id ?? "").trim();

        if (!productId) {
            throw new Error("Thiếu productId khi gửi duyệt nội dung.");
        }

        const state = await submitWatchReview({
            productId,
            targetType: "CONTENT",
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
                        : "Không thể gửi duyệt nội dung.",
            },
            { status: 500 },
        );
    }
}