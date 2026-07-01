import { ActivitySourceType } from "@prisma/client";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import {
  addActivityReplyRepo,
  createBusinessEventActivityRepo,
  createDiscussionActivityRepo,
  findTaskItemActivityByIdRepo,
  findTaskItemActivityBySourceRepo,
  findTaskItemActivityTaskRepo,
  listTaskItemActivitiesRepo,
} from "./task-item-activity.repo";
import type {
  AddActivityReplyInput,
  CreateBusinessEventActivityInput,
  CreateDiscussionActivityInput,
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
) {
  const taskItemId = clean(input.taskItemId);
  const sourceId = clean(input.sourceId);
  const title = clean(input.title);

  assertPresent(taskItemId, "Missing taskItemId");
  assertPresent(sourceId, "Missing businessEventLogId");
  assertPresent(title, "Missing activity title");

  return withDbTransaction(prisma, async (tx) => {
    await assertTaskItemExists(tx, taskItemId);

    const existing = await findTaskItemActivityBySourceRepo(tx, {
      sourceType: ActivitySourceType.BUSINESS_EVENT,
      sourceId,
    });

    if (existing) return existing;

    return createBusinessEventActivityRepo(tx, {
      ...input,
      taskItemId,
      sourceId,
      title,
      body: cleanNullable(input.body),
      actorUserId: cleanNullable(input.actorUserId),
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
