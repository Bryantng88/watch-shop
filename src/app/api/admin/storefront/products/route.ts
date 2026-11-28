import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { listPublicWatches } from "@/domains/storefront/server/public-catalog.service";
import { selectedWatches } from "@/domains/storefront/content/service";
import { prisma } from "@/server/db/client";
import { publicWatchEligibilityWhere, publicWatchDetailSelect } from "@/domains/storefront/server/public-catalog.repo";
export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  const gallery = req.nextUrl.searchParams.get("gallery");
  if (gallery) {
    const product = await prisma.product.findFirst({
      where: { AND: [publicWatchEligibilityWhere(), { id: gallery }] },
      select: {
        id: true, title: true,
        productImage: {
          where: { isForStorefront: true, fileKey: { not: "" }, role: "GALLERY" },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
          select: publicWatchDetailSelect.productImage.select,
        },
      },
    });
    if (!product) return NextResponse.json({error:"Đồng hồ không còn công khai."},{status:404});
    return NextResponse.json({images:product.productImage.map(image=>({id:image.id,url:`/api/public/catalog/watches/${encodeURIComponent(product.id)}/images/${encodeURIComponent(image.id)}`,alt:image.alt||product.title}))},{headers:{"Cache-Control":"no-store"}});
  }
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
