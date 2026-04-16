// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { createAdminUser } from "@/app/(admin)/admin/users/_server/user.service";

export async function POST(req: Request) {
    await requirePermissionApi(PERMISSIONS.USER_MANAGE);

    try {
        const body = await req.json();
        console.log('in ra test body : ' + JSON.stringify(body))

        const user = await createAdminUser(body);
        return NextResponse.json(user, { status: 201 });
    } catch (err: any) {
        console.error("CREATE_USER_ERROR:", err);

        if (err?.message === "EMAIL_EXISTS") {
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
