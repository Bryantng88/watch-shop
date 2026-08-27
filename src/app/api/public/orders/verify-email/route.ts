import { after, NextRequest, NextResponse } from "next/server";

import { verifyPurchaseRequestEmail } from "@/domains/storefront/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    return NextResponse.redirect(new URL("/request?emailVerification=invalid", request.url), 303);
  }
  return new NextResponse(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Xác minh email</title></head><body style="font-family:system-ui;margin:0;display:grid;min-height:100vh;place-items:center;background:#f7f5f2;color:#27231f"><main style="max-width:32rem;padding:2rem;text-align:center"><h1>Xác minh địa chỉ email</h1><p>Nhấn nút bên dưới để xác nhận email cho yêu cầu mua hàng của bạn.</p><form method="post"><input type="hidden" name="token" value="${token}"><button style="border:0;border-radius:.75rem;background:#27231f;color:white;padding:.85rem 1.25rem;font-weight:700;cursor:pointer" type="submit">Xác nhận email</button></form></main></body></html>`, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const verified = await verifyPurchaseRequestEmail(String(form.get("token") ?? ""), {
    deferConsumers: (work) => after(work),
  });
  const destination = new URL("/request", request.url);
  destination.searchParams.set("emailVerification", verified ? "success" : "invalid");
  return NextResponse.redirect(destination, 303);
}
