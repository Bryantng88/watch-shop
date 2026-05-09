import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { getMediaAssetDashboard } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requirePermissionApi(PERMISSIONS.MEDIA_VIEW);
  if (auth instanceof Response) return auth;

  try {
    const dashboard = await getMediaAssetDashboard();
    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không tải được media dashboard.",
      },
      { status: 500 }
    );
  }
}