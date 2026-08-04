import { prisma, DB } from "@/server/db/client";

export async function getUserListRepo(params: { skip: number; take: number; q?: string }) {
    const where = params.q
        ? {
            OR: [
                { email: { contains: params.q, mode: "insensitive" as const } },
                { name: { contains: params.q, mode: "insensitive" as const } },
                { roles: { some: { name: { contains: params.q, mode: "insensitive" as const } } } },
            ],
        }
        : {};
    const [items, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return { items, total };
}

export async function listUsersRepo(db: DB) {
    return db.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
            createdAt: true,
        },
    });
}

export async function createUserRepo(data: {
    email: string;
    name?: string;
    passwordHash: string;
    roleIds: string[];
    isActive: boolean;
}) {
    return prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            passwordHash: data.passwordHash,
            isActive: data.isActive,
            roles: { connect: data.roleIds.map((id) => ({ id })) },
        },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
}

export async function updateUserRepo(
    db: DB,
    id: string,
    data: {
        email?: string;
        name?: string;
        isActive?: boolean;
        passwordHash?: string;
        roleIds?: string[];
    }
) {
    return db.user.update({
        where: { id },
        data: {
            ...(data.email !== undefined ? { email: data.email } : {}),
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
            ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
            ...(data.roleIds !== undefined
                ? { roles: { set: data.roleIds.map((roleId) => ({ id: roleId })) } }
                : {}),
        },
    });
}

export type RoleWithPermissions = {
    id: string;
    name: string;
    description: string | null;
    permissions: {
        id: string;
        code: string;
        description: string | null;
    }[];
};

export async function getAllRolesRepo(): Promise<RoleWithPermissions[]> {
    return prisma.role.findMany({
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            description: true,
            permissions: {
                select: {
                    id: true,
                    code: true,
                    description: true,
                },
                orderBy: { code: "asc" },
            },
        },
    });
}

export async function getAllPermissionsRepo() {
    return prisma.permission.findMany({
        orderBy: { code: "asc" },
        select: {
            id: true,
            code: true,
            description: true,
        },
    });
}

export async function findPermissionByCodeRepo(code: string) {
    return prisma.permission.findUnique({
        where: { code },
        select: {
            id: true,
            code: true,
            description: true,
        },
    });
}

export async function findPermissionByIdRepo(id: string) {
    return prisma.permission.findUnique({
        where: { id },
        select: {
            id: true,
            code: true,
            description: true,
        },
    });
}

export async function createPermissionRepo(input: {
    code: string;
    description?: string | null;
}) {
    return prisma.permission.create({
        data: {
            code: input.code,
            description: input.description?.trim() || null,
        },
        select: {
            id: true,
            code: true,
            description: true,
        },
    });
}

export async function updatePermissionRepo(
    id: string,
    input: {
        code?: string;
        description?: string | null;
    }
) {
    return prisma.permission.update({
        where: { id },
        data: {
            ...(input.code !== undefined ? { code: input.code } : {}),
            ...(input.description !== undefined
                ? { description: input.description?.trim() || null }
                : {}),
        },
        select: {
            id: true,
            code: true,
            description: true,
        },
    });
}

export async function findUsersByRoleNames(roleNames: string[]) {
    const normalized = Array.from(
        new Set(
            (roleNames ?? [])
                .map((x) => String(x).trim().toUpperCase())
                .filter(Boolean)
        )
    );

    if (!normalized.length) return [];

    return prisma.user.findMany({
        where: {
            isActive: true,
            roles: {
                some: {
                    OR: normalized.map((name) => ({
                        name: { equals: name, mode: "insensitive" as const },
                    })),
                },
            },
        },
        select: {
            id: true,
            email: true,
            name: true,
            roles: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
