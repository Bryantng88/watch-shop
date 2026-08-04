// src/server/auth/getCurrentUser.ts
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import * as authRepo from "@/app/(admin)/admin/auth/_server/auth.repo"
import { verifyAuthToken } from "./auth-token";
import { expandPermissions } from "./permission-implications";

const findCachedUserById = unstable_cache(
    (id: string) => authRepo.findUserById(id),
    ["auth-current-user-by-id"],
    { revalidate: 15 },
);

export const getCurrentUser = cache(async function getCurrentUser() {
    const cookieStore = await cookies(); // 👈 BẮT BUỘC await
    const token = cookieStore.get("auth_token")?.value;
    const session = verifyAuthToken(token);
    if (!session) return null;

    const user = await findCachedUserById(session.userId);
    if (!user || !user.isActive) return null;

    const permissions = expandPermissions(user.roles.flatMap((role) =>
        role.permissions.map((permission) => permission.code)
    ));

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        roles: user.roles.map((r) => r.name),
        permissions: [...permissions],
    };
});
