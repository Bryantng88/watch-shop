import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { getBusinessTargetActivityPage } from "@/domains/task/server/activity";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function GET(request: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.ACTIVITY_READ);
    if (auth instanceof Response) return auth;

    const targetType = request.nextUrl.searchParams.get("type")?.trim() ?? "";
    const targetId = request.nextUrl.searchParams.get("id")?.trim() ?? "";
    const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
    if (!targetType || !targetId) {
        return NextResponse.json({ error: "Thiếu ngữ cảnh activity." }, { status: 400 });
    }

    try {
        return NextResponse.json(await getBusinessTargetActivityPage({
            targetType,
            targetId,
            page,
            pageSize: 10,
            mode: "HISTORY",
        }));
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Không thể tải lịch sử activity.",
            },
            { status: 400 },
        );
    }
}
