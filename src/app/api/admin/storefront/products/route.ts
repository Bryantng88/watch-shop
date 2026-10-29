import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { listPublicWatches } from "@/domains/storefront/server/public-catalog.service";
import { selectedWatches } from "@/domains/storefront/content/service";
export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  const ids = req.nextUrl.searchParams.get("ids");
  const items = ids
    ? await selectedWatches(ids.split(",").slice(0, 12))
    : (
        await listPublicWatches({
          q: (req.nextUrl.searchParams.get("q") || "").slice(0, 120),
          limit: 24,
        })
      ).items;
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
