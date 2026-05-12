import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import {
    getRoleManagementData,
    updateRoleService,
} from "@/app/(admin)/admin/users/_server/user.service";

type RouteContext = {
    params: Promise<{ id: string }> | { id: string };
};

async function getParams(params: RouteContext["params"]) {
    return await Promise.resolve(params);
}

export async function PUT(req: Request, { params }: RouteContext) {
    const auth = await requirePermissionApi(PERMISSIONS.USER_MANAGE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await getParams(params);

        if (!id) {
            return NextResponse.json(
                { message: "Thiếu role id" },
                { status: 400 }
            );
        }

        const body = await req.json();
        await updateRoleService(id, body);

        const data = await getRoleManagementData();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message || "Cập nhật role thất bại" },
            { status: 400 }
        );
    }
}
