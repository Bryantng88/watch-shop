import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import {
    createPermissionService,
    getRoleManagementData,
} from "@/app/(admin)/admin/users/_server/user.service";

export async function POST(req: Request) {
    const auth = await requirePermissionApi(PERMISSIONS.USER_MANAGE);
    if (auth instanceof Response) return auth;

    try {
        const body = await req.json().catch(() => ({}));

        const permission = await createPermissionService({
            code: String(body?.code ?? ""),
            description: body?.description ?? null,
        });

        const data = await getRoleManagementData();

        return NextResponse.json(
            {
                permission,
                roles: data.roles,
                permissions: data.permissions,
            },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message || "Tạo permission thất bại" },
            { status: 400 }
        );
    }
}
