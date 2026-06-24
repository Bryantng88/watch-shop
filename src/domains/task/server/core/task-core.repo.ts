import { Prisma, TaskKind, TaskPeriod, TaskSource, TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type {
  CompleteRelatedTasksInput,
  CreateTaskInput,
  EnsureSystemTaskInput,
  EnsureSystemTaskResult,
  FindOpenRelatedTasksInput,
  UpdateTaskInput,
} from "../task.types";
import {
  TASK_INCLUDE,
  USER_SELECT,
  createLinkData,
  hasAnyLink,
  relatedTaskWhere,
  systemTaskIdentityWhere,
  toDate,
  updateLinkData,
} from "./task.repo.shared";
import { hydrateTaskBusinessLinks } from "./task-business-hydrate.repo";

export async function createTaskRepo(
  db: DB,
  input: CreateTaskInput & { createdByUserId?: string | null },
) {
  const client = dbOrTx(db);
  const createdByUserId = input.createdByUserId ?? null;
  const assignedToUserId = input.assignedToUserId ?? createdByUserId;

  return client.task.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      source: input.source ?? "MANUAL",
      kind: input.kind ?? TaskKind.BUSINESS,
      periodType: input.periodType ?? null,
      periodKey: input.periodKey?.trim() || null,
      priority: input.priority ?? "MEDIUM",
      dueAt: toDate(input.dueAt),
      createdByUserId,
      assignedToUserId,
      ...createLinkData(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function ensureSystemTaskRepo(
  db: DB,
  input: EnsureSystemTaskInput,
): Promise<EnsureSystemTaskResult> {
  const client = dbOrTx(db);
  const dueAt = toDate(input.dueAt);

  const existing = await client.task.findFirst({
    where: systemTaskIdentityWhere(input),
    select: { id: true, status: true },
  });

  if (!existing) {
    const created = await client.task.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        source: TaskSource.SYSTEM,
        kind: TaskKind.BUSINESS,
        periodType: null,
        periodKey: null,
        priority: input.priority ?? "MEDIUM",
        dueAt,
        createdByUserId: input.createdByUserId ?? null,
        assignedToUserId: input.assignedToUserId ?? input.createdByUserId ?? null,
        ...createLinkData(input),
      },
      select: { id: true },
    });

    return { id: created.id, created: true, reopened: false };
  }

  const reopened = existing.status === TaskStatus.DONE || existing.status === TaskStatus.CANCELLED;

  await client.task.update({
    where: { id: existing.id },
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority ?? "MEDIUM",
      dueAt,
      assignedToUserId: input.assignedToUserId ?? input.createdByUserId ?? null,
      ...(reopened
        ? {
          status: TaskStatus.TODO,
          completedAt: null,
          cancelledAt: null,
          completedByUserId: null,
          cancelledByUserId: null,
        }
        : {}),
    },
  });

  return { id: existing.id, created: false, reopened };
}

export async function updateTaskRepo(db: DB, id: string, input: UpdateTaskInput) {
  const client = dbOrTx(db);
  return client.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.kind !== undefined ? { kind: input.kind } : {}),
      ...(input.periodType !== undefined ? { periodType: input.periodType } : {}),
      ...(input.periodKey !== undefined ? { periodKey: input.periodKey?.trim() || null } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueAt !== undefined ? { dueAt: toDate(input.dueAt) } : {}),
      ...(input.assignedToUserId !== undefined ? { assignedToUserId: input.assignedToUserId || null } : {}),
      ...updateLinkData(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function setTaskStatusRepo(
  db: DB,
  input: { id: string; status: TaskStatus; actorUserId?: string | null },
) {
  const client = dbOrTx(db);
  const now = new Date();
  const data: Prisma.TaskUpdateInput = { status: input.status };

  if (input.status === TaskStatus.IN_PROGRESS) data.startedAt = now;
  if (input.status === TaskStatus.DONE) {
    data.completedAt = now;
    data.cancelledAt = null;
    if (input.actorUserId) data.completedByUser = { connect: { id: input.actorUserId } };
  }
  if (input.status === TaskStatus.CANCELLED) {
    data.cancelledAt = now;
    if (input.actorUserId) data.cancelledByUser = { connect: { id: input.actorUserId } };
  }
  if (input.status === TaskStatus.TODO) {
    data.startedAt = null;
    data.completedAt = null;
    data.cancelledAt = null;
    data.completedByUser = { disconnect: true };
    data.cancelledByUser = { disconnect: true };
  }

  return client.task.update({ where: { id: input.id }, data, include: TASK_INCLUDE });
}

export async function completeRelatedTasksRepo(db: DB, input: CompleteRelatedTasksInput) {
  const client = dbOrTx(db);
  if (!input.kind && !hasAnyLink(input)) return { count: 0 };

  const where: Prisma.TaskWhereInput = {
    ...relatedTaskWhere(input),
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  };

  return client.task.updateMany({
    where,
    data: {
      status: TaskStatus.DONE,
      completedAt: new Date(),
      completedByUserId: input.completedByUserId ?? null,
    },
  });
}

export async function findOpenRelatedTasksRepo(db: DB, input: FindOpenRelatedTasksInput) {
  const client = dbOrTx(db);
  if (!input.kind && !hasAnyLink(input) && !input.taskItemId) return [];

  return client.task.findMany({
    where: {
      ...relatedTaskWhere(input),
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
      ...(input.taskItemId
        ? {
          executions: {
            some: { taskItemId: input.taskItemId },
          },
        }
        : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueAt: true,
      assignedToUser: { select: USER_SELECT },
    },
    orderBy: [{ createdAt: "desc" }],
    take: input.limit ?? 10,
  });
}

export async function findActivePeriodTaskRepo(
  db: DB,
  input: {
    kind: TaskKind;
    periodType: TaskPeriod;
    periodKey: string;
  },
) {
  const client = dbOrTx(db);

  return client.task.findFirst({
    where: {
      kind: input.kind,
      periodType: input.periodType,
      periodKey: input.periodKey,
      status: {
        notIn: [TaskStatus.DONE, TaskStatus.CANCELLED],
      },
    },
    include: TASK_INCLUDE,
    orderBy: [{ createdAt: "asc" }],
  });
}