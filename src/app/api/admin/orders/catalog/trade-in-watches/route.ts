import { NextRequest, NextResponse } from "next/server";

import { searchCustomerSoldWatches } from "@/domains/order/server/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const items = await searchCustomerSoldWatches({
    customerId: req.nextUrl.searchParams.get("customerId"),
    phone: req.nextUrl.searchParams.get("phone"),
    q: req.nextUrl.searchParams.get("q"),
  });
  return NextResponse.json({ items });
}
