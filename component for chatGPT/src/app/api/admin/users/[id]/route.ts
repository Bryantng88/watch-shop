import { NextResponse } from "next/server";
import { updateUserService } from "@/app/(admin)/admin/users/_server/user.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    await requirePermission(PERMISSIONS.USER_UPDATE);

    const body = await req.json();
    await updateUserService(params.id, body);

    return NextResponse.json({ success: true });
}
