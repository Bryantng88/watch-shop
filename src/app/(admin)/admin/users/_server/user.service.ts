// src/server/auth/user.service.ts
import * as userRepo from "./user.repo";

export async function getAdminUserList() {
    const rows = await userRepo.getUserListRepo();

    return rows.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isActive: u.isActive,
        roles: u.roles.map((r) => r.name),
    }));

}
