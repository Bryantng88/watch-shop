import { prisma } from "@/server/db/client";

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
