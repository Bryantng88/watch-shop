import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { ingestStorefrontAnalytics } from "@/domains/analytics/storefront/storefront-analytics.server";

export async function POST(request: NextRequest) {
  try {
    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > 24_000) return new NextResponse(null, { status: 413 });
    const result = await ingestStorefrontAnalytics(await request.json(), request);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    if (!(error instanceof ZodError)) console.error("[storefront-analytics] ingest failed", error);
    return new NextResponse(null, { status: error instanceof ZodError ? 400 : 202 });
  }
}
