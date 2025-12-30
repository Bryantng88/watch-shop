import { NextResponse } from "next/server";
import { createUserService } from "@/app/(admin)/admin/users/_server/user.service";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(req: Request) {
    await requirePermissionApi(PERMISSIONS.USER_MANAGE);

    try {
        const body = await req.json();
        const user = await createUserService(body);
        return NextResponse.json(user);
    } catch (err: any) {
        if (err.message === "EMAIL_EXISTS") {
            return NextResponse.json(
                { message: "Email đã tồn tại" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: "Create user failed" },
            { status: 500 }
        );
    }
}
