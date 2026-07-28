import { NextRequest, NextResponse } from "next/server";

import { getBusinessTargetActivityPage } from "@/domains/task/server/activity";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const taskAuth = await requirePermissionApi(PERMISSIONS.TASK_VIEW);
  if (taskAuth instanceof NextResponse) return taskAuth;
  const auth = await requirePermissionApi(PERMISSIONS.ACTIVITY_READ);
  if (auth instanceof NextResponse) return auth;

  const targetType = request.nextUrl.searchParams.get("targetType") ?? "";
  const targetId = request.nextUrl.searchParams.get("targetId") ?? "";
  if (!targetType || !targetId) {
    return NextResponse.json({ error: "Missing activity target." }, { status: 400 });
  }

  const data = await getBusinessTargetActivityPage({
    targetType,
    targetId,
    page: Number(request.nextUrl.searchParams.get("page") ?? 1),
    pageSize: Number(request.nextUrl.searchParams.get("pageSize") ?? 10),
  });
  return NextResponse.json(data);
}
