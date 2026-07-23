import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import { auditLegacyMediaAssets } from "@/domains/media/server";
import { requirePermission } from "@/server/auth/requirePermission";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);
    const params = request.nextUrl.searchParams;
    const take = Number(params.get("take") ?? 100);
    const result = await auditLegacyMediaAssets({
      cursor: params.get("cursor"),
      take: Number.isFinite(take) ? take : 100,
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Không thể audit media.",
      },
      { status: 500 },
    );
  }
}
