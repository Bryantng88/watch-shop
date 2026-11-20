import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";
export async function GET() {
  const hero = await prisma.storefrontHeroImage.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
    select: { derivativeKey: true, storageKey: true },
  });
  if (!hero) return new NextResponse(null, { status: 404 });
  const key = hero.derivativeKey || hero.storageKey;
  if (
    !key.startsWith("storefront/hero/") ||
    key.includes("..") ||
    key.includes("\\") ||
    !/\.(?:jpe?g|png|webp)$/i.test(key)
  )
    return new NextResponse(null, { status: 404 });
  try {
    const source = await mediaStorage.read(key);
    return new NextResponse(Buffer.from(source.bytes), {
      headers: {
        "Content-Type": /\.jpe?g$/i.test(key)
          ? "image/jpeg"
          : /\.png$/i.test(key)
            ? "image/png"
            : "image/webp",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
