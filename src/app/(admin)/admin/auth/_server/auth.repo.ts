// app/(admin)/admin/auth/_server/auth.repo.ts
import { prisma } from "@/server/db/client";

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
        include: {
            roles: {
                include: {
                    permissions: true,
                },
            },
        },
    });
}

export async function updateLastLogin(userId: string) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            updatedAt: new Date(),
        },
    });
}
export async function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            roles: {
                include: {
                    permissions: true,
                },
            },
        },
    });
}