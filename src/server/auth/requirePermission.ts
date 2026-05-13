import { redirect } from "next/navigation";

import { prisma } from "@/server/db/client";
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

    const dbUser = await prisma.user.findFirst({
        where: {
            isActive: true,
            OR: [
                userId ? { id: userId } : undefined,
                email ? { email } : undefined,
            ].filter(Boolean) as any,
        },
        select: {
            id: true,
            email: true,
            name: true,
            roles: {
                select: {
                    name: true,
                    permissions: {
                        select: {
                            code: true,
                        },
                    },
                },
            },
        },
    });

    if (!dbUser) {
        return {
            user: null,
            permissions: [],
        };
    }

    const permissions: string[] = Array.from(
        new Set<string>(
            dbUser.roles.flatMap((role) =>
                role.permissions.map((permission) => permission.code),
            ),
        ),
    );

    return {
        user: {
            ...(currentUser as any),
            id: dbUser.id,
            userId: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            roles: dbUser.roles.map((role) => role.name),
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