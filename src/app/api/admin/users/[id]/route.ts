import { NextResponse } from "next/server";

import { updateUserService } from "@/app/(admin)/admin/users/_server/user.service";
import { PERMISSIONS } from "@/constants/permissions";
import { requireAnyPermissionApi } from "@/server/auth/requirePermissionApi";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAnyPermissionApi([PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_MANAGE]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
        return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    if (id === auth.id && body.isActive === false) {
        return NextResponse.json(
            { message: "Bạn không thể tự vô hiệu hóa tài khoản đang đăng nhập" },
            { status: 400 }
        );
    }

    try {
        const user = await updateUserService(id, body);
        return NextResponse.json({ success: true, user });
    } catch (error) {
        const code = error instanceof Error ? error.message : "UPDATE_FAILED";
        const status = code === "EMAIL_EXISTS" ? 409 : 400;
        const messages: Record<string, string> = {
            EMAIL_EXISTS: "Email đã được sử dụng",
            PASSWORD_TOO_SHORT: "Mật khẩu mới phải có ít nhất 8 ký tự",
            ROLE_REQUIRED: "Người dùng phải có ít nhất một role",
        };
        return NextResponse.json({ message: messages[code] ?? "Không thể cập nhật người dùng" }, { status });
    }
}
