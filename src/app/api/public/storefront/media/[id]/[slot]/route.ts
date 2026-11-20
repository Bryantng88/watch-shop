import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";
import { contentImages } from "@/domains/storefront/content/contract";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; slot: string }> },
) {
  const { id, slot } = await params;
  const row = await prisma.storefrontDocument.findUnique({ where: { id } });
  if (!row?.publishedAt || !row.published) return new NextResponse(null, { status: 404 });
  const image = contentImages(row.kind, row.published)[slot];
  if (!image?.key) return new NextResponse(null, { status: 404 });
  try {
    const content = await mediaStorage.read(image.key);
    return new NextResponse(Buffer.from(content.bytes), {
      headers: {
        "Content-Type": image.key.match(/\.jpe?g$/i)
          ? "image/jpeg"
          : image.key.match(/\.png$/i)
            ? "image/png"
            : "image/webp",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
