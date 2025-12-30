import { prisma, DB } from "@/server/db/client";


export async function getUserListRepo(
    params: {
        skip: number;
        take: number;
    }
) {
    const [items, total] = await Promise.all([
        prisma.user.findMany({
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
                        name: true,
                    },
                },
            },
        }),
        prisma.user.count(),
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



export async function createUserRepo(
    data: {
        email: string;
        name?: string;
        passwordHash: string;
        roleId: string;   // 👈 đổi ở đây
    }
) {
    return prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            passwordHash: data.passwordHash,
            roles: {
                connect: { id: data.roleId }, // 👈 chuẩn
            },
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
        name?: string;
        isActive?: boolean;
    }
) {
    return db.user.update({
        where: { id },
        data,
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