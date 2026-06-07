import { prisma, type DB, dbOrTx } from "@/server/db/client";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: NotificationPriority;
  metadata?: any;
  taskId?: string | null;
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority ?? "NORMAL",
      metadata: data.metadata ?? undefined,
      taskId: data.taskId ?? null,
    },
  });
}

export async function upsertTaskNotification(db: DB, data: {
  userId: string;
  taskId: string;
  type: string;
  title: string;
  message: string;
  priority?: NotificationPriority;
  metadata?: any;
}) {
  const client = dbOrTx(db);
  return client.notification.upsert({
    where: {
      userId_taskId_type: {
        userId: data.userId,
        taskId: data.taskId,
        type: data.type,
      },
    },
    create: {
      userId: data.userId,
      taskId: data.taskId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority ?? "NORMAL",
      metadata: data.metadata ?? undefined,
      isRead: false,
    },
    update: {
      title: data.title,
      message: data.message,
      priority: data.priority ?? "NORMAL",
      metadata: data.metadata ?? undefined,
      isRead: false,
      updatedAt: new Date(),
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
    include: {
      task: {
        select: {
          id: true,
          title: true,
          status: true,
          kind: true,
          priority: true,
          dueAt: true,
          watchId: true,
          orderId: true,
          shipmentId: true,
          serviceRequestId: true,
          technicalIssueId: true,
          paymentId: true,
        },
      },
    },
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
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

export async function markTaskNotificationsAsRead(input: {
  taskId: string;
  userId: string;
}) {
  return prisma.notification.updateMany({
    where: {
      taskId: input.taskId,
      userId: input.userId,
      isRead: false,
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
