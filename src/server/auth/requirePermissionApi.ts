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

    if (!user.permissions.includes(code)) {
        return NextResponse.json(
            { message: "Forbidden" },
            { status: 403 }
        );
    }

    return user;
}
