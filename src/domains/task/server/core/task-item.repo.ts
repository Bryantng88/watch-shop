import { TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type {
  CreateTaskItemChecklistInput,
  CreateTaskItemInput,
  UpdateTaskItemChecklistInput,
  UpdateTaskItemInput,
} from "../task.types";
import { TASK_ITEM_INCLUDE, toDate } from "./task.repo.shared";

export async function createTaskItemRepo(db: DB, input: CreateTaskItemInput) {
  const client = dbOrTx(db);

  const last = await client.taskItem.findFirst({
    where: { taskId: input.taskId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return client.taskItem.create({
    data: {
      taskId: input.taskId,
      title: input.title.trim(),
      note: input.note?.trim() || null,
      status: input.status ?? TaskStatus.TODO,
      priority: input.priority ?? "MEDIUM",
      dueAt: toDate(input.dueAt),
      assignedToUserId: input.assignedToUserId || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
    include: TASK_ITEM_INCLUDE,
  });
}

export async function updateTaskItemRepo(
  db: DB,
  itemId: string,
  input: UpdateTaskItemInput,
) {
  const client = dbOrTx(db);

  return client.taskItem.update({
    where: { id: itemId },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueAt !== undefined ? { dueAt: toDate(input.dueAt) } : {}),
      ...(input.assignedToUserId !== undefined
        ? { assignedToUserId: input.assignedToUserId || null }
        : {}),
    },
    include: TASK_ITEM_INCLUDE,
  });
}

export async function setTaskItemDoneRepo(
  db: DB,
  input: { itemId: string; isDone: boolean },
) {
  const client = dbOrTx(db);
  const now = new Date();

  return client.taskItem.update({
    where: { id: input.itemId },
    data: input.isDone
      ? {
        isDone: true,
        status: TaskStatus.DONE,
        completedAt: now,
        cancelledAt: null,
      }
      : {
        isDone: false,
        status: TaskStatus.TODO,
        completedAt: null,
        cancelledAt: null,
      },
  });
}

export async function deleteTaskItemRepo(db: DB, itemId: string) {
  const client = dbOrTx(db);

  await client.taskExecution.deleteMany({
    where: { taskItemId: itemId },
  });

  return client.taskItem.delete({
    where: { id: itemId },
  });
}
export async function createTaskItemChecklistRepo(
  db: DB,
  input: CreateTaskItemChecklistInput,
) {
  const client = dbOrTx(db);

  const taskItem = await client.taskItem.findUnique({
    where: { id: input.taskItemId },
    select: { id: true },
  });

  if (!taskItem) throw new Error("Task item không tồn tại.");

  const last = await client.taskItemChecklist.findFirst({
    where: { taskItemId: input.taskItemId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return client.taskItemChecklist.create({
    data: {
      taskItemId: input.taskItemId,
      title: input.title.trim(),
      note: input.note?.trim() || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
}

export async function updateTaskItemChecklistRepo(
  db: DB,
  checklistId: string,
  input: UpdateTaskItemChecklistInput & { actorUserId?: string | null },
) {
  const client = dbOrTx(db);
  const doneChanged = input.isDone !== undefined;

  return client.taskItemChecklist.update({
    where: { id: checklistId },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(doneChanged
        ? input.isDone
          ? { isDone: true, doneAt: new Date() }
          : { isDone: false, doneAt: null }
        : {}),
    },
  });
}

export async function deleteTaskItemChecklistRepo(db: DB, checklistId: string) {
  const client = dbOrTx(db);
  return client.taskItemChecklist.delete({ where: { id: checklistId } });
}
