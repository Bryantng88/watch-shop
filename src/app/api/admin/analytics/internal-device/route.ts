import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { STOREFRONT_INTERNAL_COOKIE } from "@/domains/analytics/storefront/storefront-analytics.shared";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { isAuthCookieSecure } from "@/server/auth/auth-cookie";

export async function POST(request: NextRequest) {
  const { user, permissions } = await getCurrentUserPermissions();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!user.roles.includes("ADMIN") && !permissions.includes(PERMISSIONS.REPORT_VIEW)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as { enabled?: unknown } | null;
  const enabled = body?.enabled === true;
  const hostname = request.nextUrl.hostname.toLowerCase();
  const sharedDomain = hostname === "vinticwatches.vn" || hostname.endsWith(".vinticwatches.vn")
    ? ".vinticwatches.vn"
    : undefined;
  const response = NextResponse.json({ enabled });
  response.cookies.set(STOREFRONT_INTERNAL_COOKIE, enabled ? "1" : "", {
    httpOnly: true,
    secure: isAuthCookieSecure(),
    sameSite: "lax",
    path: "/",
    domain: sharedDomain,
    maxAge: enabled ? 365 * 24 * 60 * 60 : 0,
  });
  return response;
}
