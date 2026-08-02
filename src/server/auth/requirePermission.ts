import { redirect } from "next/navigation";

import { getCurrentUser } from "./getCurrentUser";
import { PERMISSIONS } from "@/constants/permissions";

type AuthUserWithPermissions = {
    id: string;
    userId: string;
    email?: string | null;
    name?: string | null;
    roles: string[];
    permissions: string[];
} & Record<string, any>;

type CurrentUserPermissionsResult = {
    user: AuthUserWithPermissions | null;
    permissions: string[];
};

function getUserId(user: any) {
    return user?.user?.id ?? user?.id ?? user?.userId ?? null;
}

function getUserEmail(user: any) {
    return user?.user?.email ?? user?.email ?? null;
}

export async function getCurrentUserPermissions(): Promise<CurrentUserPermissionsResult> {
    const currentUser = await getCurrentUser();

    const userId = getUserId(currentUser);
    const email = getUserEmail(currentUser);

    if (!userId && !email) {
        return {
            user: null,
            permissions: [],
        };
    }

    if (!userId) {
        return {
            user: null,
            permissions: [],
        };
    }

    const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : [];
    const permissions: string[] = Array.from(new Set<string>([
        ...(Array.isArray(currentUser?.permissions) ? currentUser.permissions : []),
        ...(roles.includes("ADMIN") ? Object.values(PERMISSIONS) : []),
    ]));

    return {
        user: {
            ...(currentUser as any),
            id: userId,
            userId,
            email,
            name: currentUser?.name ?? null,
            roles,
            permissions,
        },
        permissions,
    };
}

export async function requirePermission(code: string) {
    const { user, permissions } = await getCurrentUserPermissions();

    if (!user) {
        redirect("/login");
    }

    const isAdmin = user.roles.includes("ADMIN");

    if (!isAdmin && !permissions.includes(code)) {
        console.warn("[requirePermission denied]", {
            required: code,
            userId: user.id,
            email: user.email,
            permissions,
        });

        redirect("/403");
    }

    return user;
}

export async function hasPermission(code: string) {
    const { user, permissions } = await getCurrentUserPermissions();

    return Boolean(user?.roles.includes("ADMIN") || permissions.includes(code));
}
