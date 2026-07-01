import type { ActivitySourceType, Prisma } from "@prisma/client";

export type TaskItemActivityUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export type CreateDiscussionActivityInput = {
  taskItemId: string;
  title: string;
  body?: string | null;
  actorUserId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
};

export type CreateBusinessEventActivityInput = {
  taskItemId: string;
  sourceId: string;
  title: string;
  body?: string | null;
  actorUserId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
};

export type AddActivityReplyInput = {
  activityId: string;
  body: string;
  actorUserId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
};

export type ListTaskItemActivitiesInput = {
  taskItemId: string;
};

export type TaskItemActivitySourceIdentity = {
  sourceType: ActivitySourceType;
  sourceId: string;
};
