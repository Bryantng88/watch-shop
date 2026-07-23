import { NextRequest, NextResponse } from "next/server";
import type { AudienceSegment } from "@prisma/client";

import { PERMISSIONS } from "@/constants/permissions";
import { getWatchListDashboard } from "@/domains/watch/server";
import { requirePermission } from "@/server/auth/requirePermission";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_VIEW);
        const data = await getWatchListDashboard(
            (req.nextUrl.searchParams.get("segment") === "WOMEN"
                ? "WOMEN"
                : "MEN") as AudienceSegment,
        );

        return NextResponse.json(
            { ok: true, data },
            {
                headers: {
                    "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
                },
            },
        );
    } catch (error) {
        console.error("[WATCH_LIST_DASHBOARD_API_ERROR]", error);
        return NextResponse.json(
            {
                ok: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể tải dashboard watch",
            },
            { status: 500 },
        );
    }
}
