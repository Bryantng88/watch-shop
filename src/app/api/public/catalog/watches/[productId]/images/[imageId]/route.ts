import { NextResponse } from "next/server";

import { signPublicWatchImage } from "@/domains/storefront/server";

export const dynamic = "force-dynamic";

const MAX_PUBLIC_IMAGE_BYTES = 20 * 1024 * 1024;

export async function GET(
  _request: Request,
  context: { params: Promise<{ productId: string; imageId: string }> },
) {
  const { productId, imageId } = await context.params;
  try {
    const signedUrl = await signPublicWatchImage({ productId, imageId });
    if (!signedUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const upstream = await fetch(signedUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const contentType = upstream.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
    const declaredLength = Number(upstream.headers.get("content-length") ?? 0);
    if (
      !upstream.ok ||
      !upstream.body ||
      !contentType?.startsWith("image/") ||
      contentType === "image/svg+xml" ||
      (declaredLength > 0 && declaredLength > MAX_PUBLIC_IMAGE_BYTES)
    ) {
      return NextResponse.json({ error: "Image unavailable" }, { status: 503 });
    }

    const body = await upstream.arrayBuffer();
    if (!body.byteLength || body.byteLength > MAX_PUBLIC_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image unavailable" }, { status: 503 });
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[public-watch-image] signing failed", {
      productId,
      imageId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Image unavailable" }, { status: 503 });
  }
}
