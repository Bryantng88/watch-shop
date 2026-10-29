import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { AUTH_TOKEN_MAX_AGE, createAuthToken } from "@/server/auth/auth-token";
import { isAuthCookieSecure } from "@/server/auth/auth-cookie";
import { isLocalAutoLoginRequestAllowed } from "@/server/auth/local-auto-login";

export async function POST(request: Request) {
    if (!isLocalAutoLoginRequestAllowed(request)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const user = await prisma.user.findUnique({
        where: { email: "admin@system.local" },
        select: { id: true, isActive: true, roles: { select: { name: true } } },
    });
    if (!user?.isActive || !user.roles.some((role) => role.name === "ADMIN")) {
        return NextResponse.json({ error: "Local admin is unavailable. Use the regular login form." }, { status: 403 });
    }
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set("auth_token", createAuthToken(user.id), {
        httpOnly: true,
        sameSite: "lax",
        secure: isAuthCookieSecure(),
        path: "/",
        maxAge: AUTH_TOKEN_MAX_AGE,
    });
    return response;
}
