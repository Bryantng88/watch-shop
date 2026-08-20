import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { ingestStorefrontAnalytics } from "@/domains/analytics/storefront/storefront-analytics.server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (Buffer.byteLength(body, "utf8") > 24_000) return new NextResponse(null, { status: 413 });
    const result = await ingestStorefrontAnalytics(JSON.parse(body), request);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    if (!(error instanceof ZodError) && !(error instanceof SyntaxError) && !(error instanceof Error && error.message === "STOREFRONT_ANALYTICS_RATE_LIMITED")) console.error("[storefront-analytics] ingest failed", error);
    if (error instanceof Error && error.message === "STOREFRONT_ANALYTICS_RATE_LIMITED") return new NextResponse(null, { status: 429 });
    return new NextResponse(null, { status: error instanceof ZodError || error instanceof SyntaxError ? 400 : 202 });
  }
}
