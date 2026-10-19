import { NextRequest, NextResponse } from "next/server";

import { getNasMediaThumbnail } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const key = String(req.nextUrl.searchParams.get("key") ?? "").trim();
    const version = String(req.nextUrl.searchParams.get("v") ?? "").trim() || null;
    if (!key) return NextResponse.json({ error: "Thiếu key." }, { status: 400 });

    const thumbnail = await getNasMediaThumbnail({ key, version });
    const etag = thumbnail.etag ? `"${thumbnail.etag}"` : null;
    const cacheControl = version
      ? "private, max-age=31536000, immutable"
      : "private, max-age=300, must-revalidate";
    if (etag && req.headers.get("if-none-match") === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ETag: etag, "Cache-Control": cacheControl },
      });
    }

    return new NextResponse(Buffer.from(thumbnail.bytes), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(thumbnail.bytes.byteLength),
        "Cache-Control": cacheControl,
        "X-Media-Thumbnail-Cache": thumbnail.cacheHit ? "HIT" : "MISS",
        ...(etag ? { ETag: etag } : {}),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Không thể tạo thumbnail.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
