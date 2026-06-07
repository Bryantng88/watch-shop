import { createNotification, upsertTaskNotification, type NotificationPriority } from "./notification.repo";
import { findUsersByRoleNames } from "@/app/(admin)/admin/users/_server/user.repo";
import { prisma, type DB } from "@/server/db/client";

export async function notifyUsersByRole(input: {
  role: string | string[];
  type: string;
  title: string;
  message: string;
  priority?: NotificationPriority;
  metadata?: any;
}) {
  const roles = (Array.isArray(input.role) ? input.role : [input.role])
    .map((x) => String(x).trim().toUpperCase())
    .filter(Boolean);

  if (!roles.length) return [];

  const users = await findUsersByRoleNames(roles);
  if (!users.length) return [];

  return Promise.all(
    users.map((user) =>
      createNotification({
        userId: user.id,
        type: input.type,
        title: input.title,
        message: input.message,
        priority: input.priority ?? "NORMAL",
        metadata: input.metadata ?? null,
      })
    )
  );
}

export async function notifyTaskAssigned(db: DB, input: {
  taskId: string;
  userIds?: string[];
  type?: string;
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  metadata?: any;
}) {
  const task = await db.task.findUnique({
    where: { id: input.taskId },
    select: {
      id: true,
      title: true,
      description: true,
      assignedToUserId: true,
      kind: true,
      priority: true,
      status: true,
      dueAt: true,
      watchId: true,
      orderId: true,
      shipmentId: true,
      serviceRequestId: true,
      technicalIssueId: true,
      paymentId: true,
    },
  });

  if (!task) return [];

  const userIds = Array.from(new Set([...(input.userIds ?? []), task.assignedToUserId].filter(Boolean) as string[]));
  if (!userIds.length) return [];

  const type = input.type ?? `TASK_${task.kind}`;
  const title = input.title ?? task.title;
  const message = input.message ?? task.description ?? "Có task cần xử lý.";
  const priority = input.priority ?? (task.priority === "URGENT" || task.priority === "HIGH" ? "HIGH" : "NORMAL");

  return Promise.all(
    userIds.map((userId) =>
      upsertTaskNotification(db, {
        userId,
        taskId: task.id,
        type,
        title,
        message,
        priority,
        metadata: {
          taskKind: task.kind,
          taskStatus: task.status,
          dueAt: task.dueAt,
          watchId: task.watchId,
          orderId: task.orderId,
          shipmentId: task.shipmentId,
          serviceRequestId: task.serviceRequestId,
          technicalIssueId: task.technicalIssueId,
          paymentId: task.paymentId,
          ...(input.metadata ?? {}),
        },
      })
    )
  );
}

export async function notifyTaskAssignedSafe(db: DB, input: Parameters<typeof notifyTaskAssigned>[1]) {
  try {
    return await notifyTaskAssigned(db, input);
  } catch (error) {
    console.error("[notification] notifyTaskAssignedSafe failed", error);
    return [];
  }
}

export async function notifyTaskToRoles(db: DB, input: {
  taskId: string;
  roles: string[];
  type?: string;
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  metadata?: any;
}) {
  const roles = input.roles.map((x) => String(x).trim().toUpperCase()).filter(Boolean);
  if (!roles.length) return [];
  const users = await findUsersByRoleNames(roles);
  return notifyTaskAssigned(db, {
    taskId: input.taskId,
    userIds: users.map((u) => u.id),
    type: input.type,
    title: input.title,
    message: input.message,
    priority: input.priority,
    metadata: input.metadata,
  });
}

export async function notifyTaskToRolesSafe(db: DB, input: Parameters<typeof notifyTaskToRoles>[1]) {
  try {
    return await notifyTaskToRoles(db, input);
  } catch (error) {
    console.error("[notification] notifyTaskToRolesSafe failed", error);
    return [];
  }
}

// Backward-compatible helper for old callers. Use only for informational alerts
// that do not represent work to be done. For actionable events, create/sync a Task
// then call notifyTaskAssigned/notifyTaskToRoles.
export async function createInformationalNotification(input: Parameters<typeof createNotification>[0]) {
  return createNotification(input);
}

export { prisma };
