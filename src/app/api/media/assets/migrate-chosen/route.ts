import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const dynamic = "force-dynamic";

export async function POST() {
  const auth = await requirePermissionApi(PERMISSIONS.MEDIA_VIEW);
  if (auth instanceof Response) return auth;
  return NextResponse.json(
    {
      success: false,
      code: "LEGACY_MEDIA_WRITE_RETIRED",
      error: "Migrate chosen legacy đã ngừng. Hãy dùng Media Reconciliation import.",
    },
    { status: 410 },
  );
}
