import { ActivitySourceType, type Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type {
  AddActivityReplyInput,
  CreateBusinessEventActivityInput,
  CreateDiscussionActivityInput,
  CreateSystemActivityInput,
  TaskItemActivitySourceIdentity,
} from "./task-item-activity.types";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const TASK_ITEM_ACTIVITY_INCLUDE = {
  actorUser: { select: USER_SELECT },
  replies: {
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    include: {
      actorUser: { select: USER_SELECT },
    },
  },
} satisfies Prisma.TaskItemActivityInclude;

export async function findTaskItemActivityTaskRepo(db: DB, taskItemId: string) {
  return dbOrTx(db).taskItem.findUnique({
    where: { id: taskItemId },
    select: { id: true },
  });
}

export async function findTaskItemActivityBySourceRepo(
  db: DB,
  input: TaskItemActivitySourceIdentity,
) {
  return dbOrTx(db).taskItemActivity.findFirst({
    where: {
      taskItemId: input.taskItemId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
    },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
  });
}

export async function createDiscussionActivityRepo(
  db: DB,
  input: CreateDiscussionActivityInput,
) {
  return dbOrTx(db).taskItemActivity.create({
    data: {
      taskItemId: input.taskItemId,
      sourceType: ActivitySourceType.DISCUSSION,
      title: input.title,
      body: input.body ?? null,
      actorUserId: input.actorUserId ?? null,
      metadataJson: input.metadataJson ?? undefined,
    },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
  });
}

export async function createSystemActivityRepo(
  db: DB,
  input: CreateSystemActivityInput,
) {
  return dbOrTx(db).taskItemActivity.create({
    data: {
      taskItemId: input.taskItemId,
      sourceType: ActivitySourceType.SYSTEM,
      sourceId: input.sourceId ?? null,
      title: input.title,
      body: input.body ?? null,
      actorUserId: input.actorUserId ?? null,
      metadataJson: input.metadataJson ?? undefined,
    },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
  });
}

export async function createBusinessEventActivityRepo(
  db: DB,
  input: CreateBusinessEventActivityInput,
) {
  return dbOrTx(db).taskItemActivity.create({
    data: {
      taskItemId: input.taskItemId,
      sourceType: ActivitySourceType.BUSINESS_EVENT,
      sourceId: input.sourceId,
      title: input.title,
      body: input.body ?? null,
      actorUserId: input.actorUserId ?? null,
      metadataJson: input.metadataJson ?? undefined,
    },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
  });
}

export async function updateTaskItemActivityMetadataRepo(
  db: DB,
  activityId: string,
  metadataJson: Prisma.InputJsonValue,
) {
  return dbOrTx(db).taskItemActivity.update({
    where: { id: activityId },
    data: { metadataJson },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
  });
}

export async function addActivityReplyRepo(db: DB, input: AddActivityReplyInput) {
  return dbOrTx(db).taskItemActivityReply.create({
    data: {
      activityId: input.activityId,
      body: input.body,
      actorUserId: input.actorUserId ?? null,
      metadataJson: input.metadataJson ?? undefined,
    },
    include: {
      actorUser: { select: USER_SELECT },
    },
  });
}

export async function findTaskItemActivityByIdRepo(db: DB, activityId: string) {
  return dbOrTx(db).taskItemActivity.findUnique({
    where: { id: activityId },
    select: { id: true },
  });
}

export async function listTaskItemActivitiesRepo(db: DB, taskItemId: string) {
  return dbOrTx(db).taskItemActivity.findMany({
    where: { taskItemId },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
  });
}

export async function listBusinessTargetActivitiesRepo(
  db: DB,
  input: { targetType: string; targetId: string },
) {
  return dbOrTx(db).taskItemActivity.findMany({
    where: {
      AND: [
        {
          metadataJson: {
            path: ["targetType"],
            equals: input.targetType,
          },
        },
        {
          metadataJson: {
            path: ["targetId"],
            equals: input.targetId,
          },
        },
      ],
    },
    include: TASK_ITEM_ACTIVITY_INCLUDE,
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
  });
}
