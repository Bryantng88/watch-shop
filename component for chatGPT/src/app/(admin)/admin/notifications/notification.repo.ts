import { prisma } from "@/server/db/client";

export async function createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    priority?: "LOW" | "NORMAL" | "HIGH";
    metadata?: any;
}) {
    return prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type as any,
            title: data.title,
            message: data.message,
            priority: (data.priority ?? "NORMAL") as any,
            metadata: data.metadata ?? undefined,
        },
    });
}

export async function getNotifications(input: {
    userId: string;
    unreadOnly?: boolean;
    take?: number;
}) {
    return prisma.notification.findMany({
        where: {
            userId: input.userId,
            ...(input.unreadOnly ? { isRead: false } : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        take: input.take ?? 20,
    });
}

export async function countUnreadNotifications(userId: string) {
    return prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
}

export async function markNotificationAsRead(input: {
    id: string;
    userId: string;
}) {
    return prisma.notification.updateMany({
        where: {
            id: input.id,
            userId: input.userId,
        },
        data: {
            isRead: true,
        },
    });
}

export async function markAllNotificationsAsRead(userId: string) {
    return prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
}