// src/server/auth/getCurrentUser.ts
import { cookies } from "next/headers";
import * as authRepo from "@/app/(admin)/admin/auth/_server/auth.repo"

export async function getCurrentUser() {
    const cookieStore = await cookies(); // 👈 BẮT BUỘC await
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const user = await authRepo.findUserById(token);
    if (!user || !user.isActive) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((r) => r.name),
        permissions: user.roles.flatMap((r) =>
            r.permissions.map((p) => p.code)
        ),
    };
}
