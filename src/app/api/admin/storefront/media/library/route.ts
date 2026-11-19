import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { websiteFolder } from "@/domains/storefront/media/website-media";
import { findWebsiteImage, listWebsiteImages } from "@/domains/storefront/media/website-media.service";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  const key = req.nextUrl.searchParams.get("key");
  const folder = websiteFolder.safeParse(req.nextUrl.searchParams.get("folder") || "editorial");
  const cursor = req.nextUrl.searchParams.get("cursor");
  if (!folder.success || (cursor?.length ?? 0) > 4096 || (key?.length ?? 0) > 1000) return NextResponse.json({ error: "Thư mục hoặc bộ lọc không hợp lệ." }, { status: 400 });
  try {
    if (key !== null) {
      const item = await findWebsiteImage(key);
      return item ? NextResponse.json({ item }, { headers: { "Cache-Control": "no-store" } }) : NextResponse.json({ error: "Không tìm thấy ảnh website." }, { status: 404 });
    }
    return NextResponse.json(await listWebsiteImages(folder.data, cursor), { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Không tải được thư viện ảnh. Thử làm mới." }, { status: 503 }); }
}
