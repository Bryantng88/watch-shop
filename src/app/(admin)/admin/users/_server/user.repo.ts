import { prisma, DB } from "@/server/db/client";

export async function getUserListRepo() {
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
            roles: {
                select: {
                    name: true,
                },
            },
        },
    });
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
    db: DB,
    data: {
        email: string;
        name?: string | null;
        passwordHash: string;
    }
) {
    return db.user.create({
        data: {
            email: data.email,
            name: data.name,
            passwordHash: data.passwordHash,
            isActive: true,
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

