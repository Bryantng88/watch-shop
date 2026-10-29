import { AppTagOwnerType, PersonalTaskShareAccess, type Prisma } from "@prisma/client";

export const personalWorkScopeWhere: Prisma.TaskItemWhereInput = {
  OR: [{ personalOwnerUserId: { not: null } }, { task: { kind: "PERSONAL" } }],
};

export function personalWorkOwnerAccessWhere(userId: string): Prisma.TaskItemWhereInput {
  return { OR: [
    { personalOwnerUserId: userId },
    { task: { kind: "PERSONAL", OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] } },
  ] };
}

export function personalWorkViewAccessWhere(userId: string): Prisma.TaskItemWhereInput {
  return { AND: [personalWorkScopeWhere, { OR: [personalWorkOwnerAccessWhere(userId), { personalShares: { some: { userId } } }] }] };
}

export function isPersonalWorkOwner(item: {
  personalOwnerUserId: string | null;
  task: { kind: string; createdByUserId: string | null; assignedToUserId: string | null } | null;
}, userId: string) {
  return item.personalOwnerUserId === userId || (item.task?.kind === "PERSONAL" &&
    (item.task.createdByUserId === userId || item.task.assignedToUserId === userId));
}

export function personalWorkTagOwner(item: { taskId: string | null; personalOwnerUserId: string | null }) {
  if (item.taskId) return { ownerType: AppTagOwnerType.TASK, ownerId: item.taskId };
  if (!item.personalOwnerUserId) throw new Error("Personal work owner is missing");
  return { ownerType: AppTagOwnerType.GENERAL, ownerId: item.personalOwnerUserId };
}

export function personalWorkEditAccessWhere(userId: string): Prisma.TaskItemWhereInput {
  return {
    AND: [personalWorkScopeWhere, { OR: [personalWorkOwnerAccessWhere(userId),
      { personalShares: { some: { userId, accessLevel: PersonalTaskShareAccess.EDITOR } } },
    ] }],
  };
}

