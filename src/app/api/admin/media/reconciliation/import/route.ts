import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import { importVerifiedLegacyMedia } from "@/domains/media/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function POST(request: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const result = await importVerifiedLegacyMedia({
      take: Number(body.take ?? 50),
      dryRun: body.dryRun !== false,
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Không thể import media." },
      { status: 500 },
    );
  }
}
