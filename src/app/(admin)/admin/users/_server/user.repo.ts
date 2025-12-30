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
        roleIds: string[];
    }
) {
    return prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            passwordHash: data.passwordHash,
            roles: {
                connect: data.roleIds.map((id) => ({ id })),
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

