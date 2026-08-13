import { NextRequest, NextResponse } from "next/server";
import { getPublicWatchBySlug } from "@/domains/storefront/server";
import {
  parseStorefrontCartCookie,
  STOREFRONT_CART_COOKIE,
} from "@/domains/storefront/server/request-cart.service";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const returnTo = String(form.get("returnTo") ?? "/products").trim();
  const watch = slug ? await getPublicWatchBySlug(slug).catch(() => null) : null;
  if (!watch || watch.availability !== "AVAILABLE" || watch.price.mode !== "SHOW") {
    return NextResponse.redirect(new URL(slug ? `/products/${slug}` : "/products", request.url), 303);
  }

  const current = parseStorefrontCartCookie(request.cookies.get(STOREFRONT_CART_COOKIE)?.value);
  const next = [slug, ...current.filter((item) => item !== slug)].slice(0, 20);
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : `/products/${slug}`;
  const response = request.headers.get("accept")?.includes("application/json")
    ? NextResponse.json({ ok: true, slug, added: !current.includes(slug) })
    : NextResponse.redirect(new URL(safeReturnTo, request.url), 303);
  response.cookies.set(STOREFRONT_CART_COOKIE, JSON.stringify(next), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  const input = await request.json().catch(() => null);
  const slug = String(input?.slug ?? "").trim();
  const current = parseStorefrontCartCookie(request.cookies.get(STOREFRONT_CART_COOKIE)?.value);
  const next = current.filter((item) => item !== slug);
  const response = NextResponse.json({ ok: true, removed: current.length !== next.length });
  response.cookies.set(STOREFRONT_CART_COOKIE, JSON.stringify(next), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
