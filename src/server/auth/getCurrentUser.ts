// src/server/auth/getCurrentUser.ts
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import * as authRepo from "@/app/(admin)/admin/auth/_server/auth.repo"

const findCachedUserById = unstable_cache(
    (id: string) => authRepo.findUserById(id),
    ["auth-current-user-by-id"],
    { revalidate: 15 },
);

export const getCurrentUser = cache(async function getCurrentUser() {
    const cookieStore = await cookies(); // 👈 BẮT BUỘC await
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const user = await findCachedUserById(token);
    if (!user || !user.isActive) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        roles: user.roles.map((r) => r.name),
        permissions: user.roles.flatMap((r) =>
            r.permissions.map((p) => p.code)
        ),
    };
});
