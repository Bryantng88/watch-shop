// app/api/admin/users/route.ts
import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { createAdminUser } from "@/app/(admin)/admin/users/_server/user.service";

export async function POST(req: Request) {
    const auth = await requirePermissionApi(PERMISSIONS.USER_MANAGE);
    if (auth instanceof Response) return auth;

    try {
        const body = await req.json();
        const user = await createAdminUser(body);

        return NextResponse.json(user, { status: 201 });
    } catch (err: any) {
        console.error("CREATE_USER_ERROR:", err);

        if (err?.message === "EMAIL_EXISTS" || err?.message === "Email đã tồn tại") {
            return NextResponse.json({ message: "Email đã tồn tại" }, { status: 409 });
        }

        if (err?.message === "INVALID_INPUT") {
            return NextResponse.json({ message: "Thiếu dữ liệu bắt buộc" }, { status: 400 });
        }

        return NextResponse.json(
            { message: "Create user failed", detail: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}
