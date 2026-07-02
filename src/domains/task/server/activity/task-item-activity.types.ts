import type { ActivitySourceType, ActivityStatus, Prisma } from "@prisma/client";

export type TaskItemActivityUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export type CreateDiscussionActivityInput = {
  taskItemId: string;
  title: string;
  body?: string | null;
  actorUserId?: string | null;
  metadataJson?: Prisma.InputJsonValue;
};

export type CreateSystemActivityInput = CreateDiscussionActivityInput & {
  sourceId?: string | null;
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
  taskItemId: string;
  sourceType: ActivitySourceType;
  sourceId: string;
};

export type TaskItemActivityFeedbackViewModel = {
  id: string;
  message: string;
};

export type TaskItemActivityReplyViewModel = {
  id: string;
  body: string;
  actorUserId: string | null;
  actorLabel: string;
  actorAvatarUrl: string | null;
  createdAt: string;
  metadataJson: Prisma.JsonValue | null;
};

export type TaskItemActivityViewModel = {
  id: string;
  sourceType: ActivitySourceType;
  sourceId: string | null;
  title: string;
  body: string | null;
  status: ActivityStatus;
  actorUserId: string | null;
  actorLabel: string;
  actorAvatarUrl: string | null;
  occurredAt: string;
  tone: "rose" | "green" | "blue" | "slate";
  icon: "event" | "message" | "system";
  feedback: TaskItemActivityFeedbackViewModel | null;
  replies: TaskItemActivityReplyViewModel[];
  metadataJson: Prisma.JsonValue | null;
};
