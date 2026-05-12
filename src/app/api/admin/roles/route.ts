import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import {
    createRoleService,
    getRoleManagementData,
} from "@/app/(admin)/admin/users/_server/user.service";

export async function POST(req: Request) {
    const auth = await requirePermissionApi(PERMISSIONS.USER_MANAGE);
    if (auth instanceof Response) return auth;

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
