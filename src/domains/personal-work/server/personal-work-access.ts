import { PersonalTaskShareAccess, type Prisma } from "@prisma/client";

export function personalWorkEditAccessWhere(userId: string): Prisma.TaskItemWhereInput {
  return {
    OR: [
      { task: { createdByUserId: userId } },
      { task: { assignedToUserId: userId } },
      { personalShares: { some: { userId, accessLevel: PersonalTaskShareAccess.EDITOR } } },
    ],
  };
}

