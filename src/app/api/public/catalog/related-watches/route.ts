import { NextRequest, NextResponse } from "next/server";

import { listRelatedPublicWatches } from "@/domains/storefront/server";

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null);
  const productIds = Array.isArray(input?.productIds)
    ? input.productIds.filter((value: unknown): value is string => typeof value === "string" && value.length > 0).slice(0, 20)
    : [];
  if (!productIds.length) return NextResponse.json({ items: [] });
  const items = await listRelatedPublicWatches(productIds);
  return NextResponse.json({ items });
}
