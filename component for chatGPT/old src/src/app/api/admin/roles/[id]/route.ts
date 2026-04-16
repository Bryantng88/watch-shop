import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { getRoleManagementData, updateRoleService } from "@/app/(admin)/admin/users/_server/user.service";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await requirePermissionApi(PERMISSIONS.USER_MANAGE);

    try {
        const body = await req.json();
        await updateRoleService(params.id, body);
        const data = await getRoleManagementData();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message || "Cập nhật role thất bại" },
            { status: 400 }
        );
    }
}
