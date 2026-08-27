import { NextRequest, NextResponse } from "next/server";

import { verifyPurchaseRequestEmail } from "@/domains/storefront/server";

export async function GET(request: NextRequest) {
  const verified = await verifyPurchaseRequestEmail(request.nextUrl.searchParams.get("token") ?? "");
  const destination = new URL("/request", request.url);
  destination.searchParams.set("emailVerification", verified ? "success" : "invalid");
  return NextResponse.redirect(destination, 303);
}
