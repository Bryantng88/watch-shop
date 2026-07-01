import { redirect } from "next/navigation";

import { getCurrentUser } from "./getCurrentUser";

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

    const permissions: string[] = Array.from(
        new Set<string>(Array.isArray(currentUser?.permissions) ? currentUser.permissions : []),
    );

    return {
        user: {
            ...(currentUser as any),
            id: userId,
            userId,
            email,
            name: currentUser?.name ?? null,
            roles: Array.isArray(currentUser?.roles) ? currentUser.roles : [],
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

    if (!permissions.includes(code)) {
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
    const { permissions } = await getCurrentUserPermissions();

    return permissions.includes(code);
}
