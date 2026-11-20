import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { editorialKey } from "@/domains/storefront/content/contract";
import { mediaStorage } from "@/domains/media/storage";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key.length > 1000 || !editorialKey.safeParse(key).success) return new NextResponse(null, { status: 404 });
  try {
    const image = await mediaStorage.read(key);
    return new NextResponse(Buffer.from(image.bytes), { headers: {
      "Content-Type": /\.jpe?g$/i.test(key) ? "image/jpeg" : /\.png$/i.test(key) ? "image/png" : "image/webp",
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    } });
  } catch { return new NextResponse(null, { status: 404 }); }
}
