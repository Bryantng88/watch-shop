import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import {
  getLegacyManifestSummary,
  scanLegacyMediaManifest,
} from "@/domains/media/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_VIEW);
  if (auth instanceof Response) return auth;
  return NextResponse.json({ ok: true, data: await getLegacyManifestSummary() });
}

export async function POST(request: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const result = await scanLegacyMediaManifest({
      cursor: typeof body.cursor === "string" ? body.cursor : null,
      take: Number(body.take ?? 100),
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Không thể scan manifest." },
      { status: 500 },
    );
  }
}
