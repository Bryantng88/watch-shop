import { NextResponse } from "next/server";
import { getCurrentUser } from "./getCurrentUser";

export async function requirePermissionApi(code: string) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const isAdmin =
        Array.isArray(user.roles) &&
        user.roles.includes("ADMIN");

    if (isAdmin) {
        return user;
    }

    if (!user.permissions.includes(code)) {
        return NextResponse.json(
            { message: "Forbidden" },
            { status: 403 }
        );
    }

    return user;
}

export async function requireAnyPermissionApi(codes: readonly string[]) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.roles?.includes("ADMIN") || codes.some((code) => user.permissions.includes(code))) return user;
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}
