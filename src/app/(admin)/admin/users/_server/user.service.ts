// src/server/auth/user.service.ts
import * as authRepo from "@/app/(admin)/admin/auth/_server/auth.repo";

export async function getAdminUserList() {
    const users = await authRepo.getUserList();

    return users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isActive: u.isActive,
        roles: u.roles.map((r) => r.name),
        permissions: u.roles.flatMap((r) =>
            r.permissions.map((p) => p.code)
        ),
        createdAt: u.createdAt,
    }));
}
