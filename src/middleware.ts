import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/server/auth/auth-token";
import { getAdminApiPolicy, getAdminPagePolicy, isAdminAccessAllowed } from "@/server/auth/admin-api-policy";
import { findUserById } from "@/app/(admin)/admin/auth/_server/auth.repo";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const session = verifyAuthToken(token);
    const protectedApi =
        req.nextUrl.pathname.startsWith("/api/admin") ||
        req.nextUrl.pathname.startsWith("/api/media");

    if (session) {
        const user = await findUserById(session.userId);
        if (!user?.isActive) {
            return protectedApi
                ? NextResponse.json({ message: "Unauthorized" }, { status: 401 })
                : NextResponse.redirect(new URL("/login", req.url));
        }

        const policy = protectedApi
            ? getAdminApiPolicy(req.nextUrl.pathname, req.method)
            : getAdminPagePolicy(req.nextUrl.pathname);
        const roles = user.roles.map((role) => role.name);
        const permissions = new Set(
            user.roles.flatMap((role) => role.permissions.map((permission) => permission.code))
        );
        const allowed =
            roles.includes("ADMIN") || isAdminAccessAllowed(policy, permissions);

        if (allowed) return NextResponse.next();

        console.warn("[admin api denied]", {
            pathname: req.nextUrl.pathname,
            method: req.method,
            userId: user.id,
            policy,
        });
        return protectedApi
            ? NextResponse.json({ message: "Forbidden" }, { status: 403 })
            : NextResponse.redirect(new URL("/403", req.url));
    }

    if (protectedApi) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
        "next",
        `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*", "/api/media/:path*"],
};

export const runtime = "nodejs";
