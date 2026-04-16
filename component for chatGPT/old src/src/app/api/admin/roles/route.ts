import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { createRoleService, getRoleManagementData } from "@/app/(admin)/admin/users/_server/user.service";

export async function POST(req: Request) {
    await requirePermissionApi(PERMISSIONS.USER_MANAGE);

    try {
        const body = await req.json();
        await createRoleService(body);
        const data = await getRoleManagementData();
        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message || "Tạo role thất bại" },
            { status: 400 }
        );
    }
}
