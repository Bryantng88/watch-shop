import { NextResponse } from "next/server";

import { buildWatchGalleryZip } from "@/domains/watch/server/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params:
  | Promise<{ id?: string; productId?: string }>
  | { id?: string; productId?: string };
};

export async function GET(req: Request, ctx: RouteParams) {
  try {
    const params = await ctx.params;
    const productId = String(params.productId ?? params.id ?? "").trim();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Thiếu productId." },
        { status: 400 }
      );
    }

    const { buffer, filename, usage } = await buildWatchGalleryZip({
      productId,
      origin: new URL(req.url).origin,
      cookie: req.headers.get("cookie"),
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
        "X-Watch-Is-Image-Downloaded": String(usage.isImageDownloaded),
        "X-Watch-Is-Content-Downloaded": String(usage.isContentDownloaded),
        "X-Watch-Is-Posted": String(
          usage.isImageDownloaded && usage.isContentDownloaded
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Không thể tải gallery.",
      },
      { status: 400 }
    );
  }
}
