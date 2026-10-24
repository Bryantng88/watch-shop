import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { mediaStorage } from "@/domains/media/storage";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { editorialKey } from "@/domains/storefront/content/contract";
export const maxDuration = 60;
export async function GET() {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  const lists = await Promise.all(
    ["storefront/editorial/", "storefront/hero/"].map((prefix) =>
      mediaStorage.list({ prefix, maxKeys: 500 }),
    ),
  );
  const entries = lists
    .flatMap((r) => r.items)
    .filter((i) => editorialKey.safeParse(i.key).success)
    .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
    .slice(0, 300);
  const items = await Promise.all(
    entries.map(async (i) => ({
      key: i.key,
      name: i.key.split("/").pop(),
      url: await mediaStorage.sign(i.key, 600),
    })),
  );
  return NextResponse.json(
    { items, truncated: lists.some((l) => l.truncated) || entries.length === 300 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const length = Number(req.headers.get("content-length") || 0);
    if (length > 21 * 1024 * 1024) throw new Error("Ảnh tối đa 20 MB.");
    const file = (await req.formData()).get("file");
    if (
      !(file instanceof File) ||
      file.size > 20 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new Error("Chọn ảnh JPEG, PNG hoặc WebP tối đa 20 MB.");
    const source = Buffer.from(await file.arrayBuffer());
    const output = await sharp(source, { limitInputPixels: 50000000 })
      .rotate()
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
    const key = `storefront/editorial/${randomUUID()}.webp`;
    await mediaStorage.write({ key, bytes: output, contentType: "image/webp" });
    return NextResponse.json({
      item: { key, name: file.name, url: await mediaStorage.sign(key, 600) },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không tải được ảnh." },
      { status: 400 },
    );
  }
}
