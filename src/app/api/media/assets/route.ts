import { NextRequest, NextResponse } from "next/server";
import type { ImageRole, MediaAssetStatus } from "@prisma/client";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { getMediaAssetDashboard, listMediaAssets } from "@/domains/media/server";

export const dynamic = "force-dynamic";

function toStatus(value: string | null): MediaAssetStatus | null {
  if (
    value === "ACTIVE" ||
    value === "CHOSEN" ||
    value === "ATTACHED" ||
    value === "ARCHIVED" ||
    value === "MISSING"
  ) {
    return value;
  }
  return null;
}

function toRole(value: string | null): ImageRole | null {
  if (value === "INLINE" || value === "GALLERY") return value;
  return null;
}

export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_VIEW);
  if (auth instanceof Response) return auth;

  try {
    if (req.nextUrl.searchParams.get("dashboard") === "1") {
      const dashboard = await getMediaAssetDashboard();
      return NextResponse.json(dashboard);
    }

    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") ?? 48);

    const result = await listMediaAssets({
      page,
      pageSize,
      q: req.nextUrl.searchParams.get("q"),
      prefix: req.nextUrl.searchParams.get("prefix"),
      profile: req.nextUrl.searchParams.get("profile"),
      status: toStatus(req.nextUrl.searchParams.get("status")),
      role: toRole(req.nextUrl.searchParams.get("role")),
      productId: req.nextUrl.searchParams.get("productId"),
      acquisitionId: req.nextUrl.searchParams.get("acquisitionId"),
      missingOnly: req.nextUrl.searchParams.get("missingOnly") === "1",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không thể tải MediaAsset.",
      },
      { status: 500 }
    );
  }
}
