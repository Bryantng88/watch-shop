import { NextResponse } from "next/server";

import { getVendorPricingImage } from "@/domains/acquisition/server";
import { mediaStorage } from "@/domains/media/storage";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ token: string; itemId: string }> }) {
  try {
    const { token, itemId } = await context.params;
    const key = await getVendorPricingImage(token, itemId);
    if (!key) return new NextResponse(null, { status: 404 });
    const media = await mediaStorage.read(key);
    return new NextResponse(Buffer.from(media.bytes), {
      headers: {
        "Content-Type": media.contentType || "application/octet-stream",
        "Content-Length": String(media.bytes.byteLength),
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=300, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
