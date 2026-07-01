import { ActivitySourceType, type Prisma } from "@prisma/client";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import {
  addActivityReplyRepo,
  createBusinessEventActivityRepo,
  createDiscussionActivityRepo,
  findTaskItemActivityByIdRepo,
  findTaskItemActivityBySourceRepo,
  findTaskItemActivityTaskRepo,
  listTaskItemActivitiesRepo,
  updateTaskItemActivityMetadataRepo,
} from "./task-item-activity.repo";
import type {
  AddActivityReplyInput,
  CreateBusinessEventActivityInput,
  CreateDiscussionActivityInput,
  TaskItemActivityFeedbackViewModel,
  TaskItemActivityViewModel,
} from "./task-item-activity.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function cleanNullable(value: unknown) {
  const text = clean(value);
  return text || null;
}

function assertPresent(value: unknown, message: string) {
  if (!clean(value)) throw new Error(message);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function normalizeBusinessEventActivityMetadata(
  metadataJson: unknown,
): Prisma.InputJsonObject {
  const metadata = { ...asRecord(metadataJson) } as Prisma.InputJsonObject;
  const feedbackId = clean(metadata.feedbackId);
  const feedbackMessage = clean(metadata.feedbackMessage);

  if (feedbackId && feedbackMessage) {
    metadata.feedbackId = feedbackId;
    metadata.feedbackMessage = feedbackMessage;
    metadata.feedback = {
      id: feedbackId,
      message: feedbackMessage,
    };
  }

  return metadata;
}

function mergeBusinessEventActivityMetadata(
  existingMetadata: unknown,
  incomingMetadata: unknown,
): Prisma.InputJsonObject {
  const existing = { ...asRecord(existingMetadata) } as Prisma.InputJsonObject;
  const incoming = normalizeBusinessEventActivityMetadata(incomingMetadata);
  const merged = { ...existing } as Prisma.InputJsonObject;

  for (const key of [
    "eventKey",
    "targetType",
    "targetId",
    "businessEventLogId",
  ]) {
    const value = incoming[key];
    if (value != null && clean(merged[key]) === "") {
      merged[key] = value;
    }
  }

  const feedbackId = clean(incoming.feedbackId);
  const feedbackMessage = clean(incoming.feedbackMessage);
  const existingFeedback = asRecord(merged.feedback);

  if (feedbackId && feedbackMessage) {
    if (!clean(merged.feedbackId)) merged.feedbackId = feedbackId;
    if (!clean(merged.feedbackMessage)) merged.feedbackMessage = feedbackMessage;

    if (!clean(existingFeedback.id) || !clean(existingFeedback.message)) {
      merged.feedback = {
        ...existingFeedback,
        id: clean(existingFeedback.id) || feedbackId,
        message: clean(existingFeedback.message) || feedbackMessage,
      };
    }
  }

  return merged;
}

function metadataChanged(left: unknown, right: unknown) {
  return JSON.stringify(asRecord(left)) !== JSON.stringify(asRecord(right));
}

function actorLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "System";
}

function actorAvatarUrl(
  user?: { avatarUrl?: string | null } | null,
) {
  return clean(user?.avatarUrl) || null;
}

function formatDateValue(value: Date | string | null | undefined) {
  if (value instanceof Date) return value.toISOString();
  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date().toISOString();
}

function getBusinessEventTone(activity: {
  title?: string | null;
  metadataJson?: unknown;
}): TaskItemActivityViewModel["tone"] {
  const metadata = asRecord(activity.metadataJson);
  const key = `${clean(metadata.eventKey)} ${clean(activity.title)}`.toLowerCase();

  if (key.includes("reject") || key.includes("rejected")) {
    return "rose";
  }

  if (key.includes("approve") || key.includes("approved")) {
    return "green";
  }

  if (key.includes("submit") || key.includes("submitted")) {
    return "blue";
  }

  return "slate";
}

function getActivityTone(activity: {
  sourceType: ActivitySourceType;
  title?: string | null;
  metadataJson?: unknown;
}): TaskItemActivityViewModel["tone"] {
  if (activity.sourceType === ActivitySourceType.BUSINESS_EVENT) {
    return getBusinessEventTone(activity);
  }

  return "slate";
}

function getActivityIcon(
  sourceType: ActivitySourceType,
): TaskItemActivityViewModel["icon"] {
  if (sourceType === ActivitySourceType.DISCUSSION) return "message";
  if (sourceType === ActivitySourceType.SYSTEM) return "system";
  return "event";
}

function getActivityFeedback(
  metadataJson: unknown,
): TaskItemActivityFeedbackViewModel | null {
  const metadata = asRecord(metadataJson);
  const feedback = asRecord(metadata.feedback);
  const id = clean(feedback.id) || clean(metadata.feedbackId);
  const message = clean(feedback.message) || clean(metadata.feedbackMessage);

  if (!id || !message) return null;

  return { id, message };
}

function toTaskItemActivityViewModel(
  activity: Awaited<ReturnType<typeof listTaskItemActivities>>[number],
): TaskItemActivityViewModel {
  return {
    id: activity.id,
    sourceType: activity.sourceType,
    sourceId: activity.sourceId ?? null,
    title: activity.title,
    body: activity.body ?? null,
    status: activity.status,
    actorUserId: activity.actorUserId ?? null,
    actorLabel: actorLabel(activity.actorUser),
    actorAvatarUrl: actorAvatarUrl(activity.actorUser),
    occurredAt: formatDateValue(activity.occurredAt),
    tone: getActivityTone(activity),
    icon: getActivityIcon(activity.sourceType),
    feedback: getActivityFeedback(activity.metadataJson),
    replies: (activity.replies ?? []).map((reply) => ({
      id: reply.id,
      body: reply.body,
      actorUserId: reply.actorUserId ?? null,
      actorLabel: actorLabel(reply.actorUser),
      actorAvatarUrl: actorAvatarUrl(reply.actorUser),
      createdAt: formatDateValue(reply.createdAt),
      metadataJson: reply.metadataJson ?? null,
    })),
    metadataJson: activity.metadataJson ?? null,
  };
}

async function assertTaskItemExists(db: DB, taskItemId: string) {
  const item = await findTaskItemActivityTaskRepo(db, taskItemId);
  if (!item) throw new Error("TaskItem khong ton tai.");
}

export async function createDiscussionActivity(
  input: CreateDiscussionActivityInput,
) {
  const taskItemId = clean(input.taskItemId);
  const title = clean(input.title);

  assertPresent(taskItemId, "Missing taskItemId");
  assertPresent(title, "Vui long nhap tieu de activity.");

  return withDbTransaction(prisma, async (tx) => {
    await assertTaskItemExists(tx, taskItemId);

    return createDiscussionActivityRepo(tx, {
      ...input,
      taskItemId,
      title,
      body: cleanNullable(input.body),
      actorUserId: cleanNullable(input.actorUserId),
    });
  });
}

export async function createBusinessEventActivity(
  input: CreateBusinessEventActivityInput,
  db?: DB,
) {
  const taskItemId = clean(input.taskItemId);
  const sourceId = clean(input.sourceId);
  const title = clean(input.title);

  assertPresent(taskItemId, "Missing taskItemId");
  assertPresent(sourceId, "Missing businessEventLogId");
  assertPresent(title, "Missing activity title");

  return withDbTransaction(db ?? prisma, async (tx) => {
    await assertTaskItemExists(tx, taskItemId);

    const existing = await findTaskItemActivityBySourceRepo(tx, {
      taskItemId,
      sourceType: ActivitySourceType.BUSINESS_EVENT,
      sourceId,
    });

    const metadataJson = normalizeBusinessEventActivityMetadata(input.metadataJson);

    if (existing) {
      const mergedMetadata = mergeBusinessEventActivityMetadata(
        existing.metadataJson,
        metadataJson,
      );

      if (!metadataChanged(existing.metadataJson, mergedMetadata)) {
        return existing;
      }

      return updateTaskItemActivityMetadataRepo(tx, existing.id, mergedMetadata);
    }

    return createBusinessEventActivityRepo(tx, {
      ...input,
      taskItemId,
      sourceId,
      title,
      body: cleanNullable(input.body),
      actorUserId: cleanNullable(input.actorUserId),
      metadataJson,
    });
  });
}

export async function addActivityReply(input: AddActivityReplyInput) {
  const activityId = clean(input.activityId);
  const body = clean(input.body);

  assertPresent(activityId, "Missing activityId");
  assertPresent(body, "Vui long nhap noi dung reply.");

  return withDbTransaction(prisma, async (tx) => {
    const activity = await findTaskItemActivityByIdRepo(tx, activityId);
    if (!activity) throw new Error("Activity khong ton tai.");

    return addActivityReplyRepo(tx, {
      ...input,
      activityId,
      body,
      actorUserId: cleanNullable(input.actorUserId),
    });
  });
}

export async function listTaskItemActivities(taskItemId: string) {
  const cleanTaskItemId = clean(taskItemId);
  assertPresent(cleanTaskItemId, "Missing taskItemId");

  return listTaskItemActivitiesRepo(prisma, cleanTaskItemId);
}

export async function getTaskItemActivityViewModels(
  taskItemId: string,
  limit?: number,
) {
  const cleanTaskItemId = clean(taskItemId);
  assertPresent(cleanTaskItemId, "Missing taskItemId");

  const items = await listTaskItemActivities(cleanTaskItemId);
  const take = Number(limit);
  const limitedItems = Number.isFinite(take) && take > 0
    ? items.slice(-Math.floor(take))
    : items;

  return limitedItems.map(toTaskItemActivityViewModel);
}
