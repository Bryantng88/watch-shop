// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ allow public routes
    if (
        pathname === "/login" ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    // ✅ protect admin
    if (pathname.startsWith("/admin")) {
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
