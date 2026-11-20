import { NextResponse } from "next/server";
import { signPublicWatchImage } from "@/domains/storefront/server";
import { PublicImageError, readPublicImageResponse } from "@/domains/storefront/server/public-image-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ productId: string; imageId: string }> },
) {
  const { productId, imageId } = await context.params;
  let phase: "SIGNING_FAILED" | "FETCH_FAILED" = "SIGNING_FAILED";
  try {
    const signedUrl = await signPublicWatchImage({ productId, imageId });
    if (!signedUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    phase = "FETCH_FAILED";
    const upstream = await fetch(signedUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const { bytes, contentType } = await readPublicImageResponse(upstream);
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const code = error instanceof PublicImageError ? error.code : phase;
    // Do not log storage URLs, signatures, keys, credentials or raw SDK errors.
    console.error("[public-watch-image] unavailable", {
      productId, imageId, code,
      ...(error instanceof PublicImageError && error.upstreamStatus ? { upstreamStatus: error.upstreamStatus } : {}),
    });
    return NextResponse.json({ error: "Image unavailable", code }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
