import { TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { hydrateTaskBusinessLinks, executionIsDone } from "./task-business-hydrate.repo";
import { TASK_INCLUDE, TASK_ITEM_INCLUDE } from "./task.repo.shared";

function isTrackingExecution(execution: any) {
  return execution?.metadataJson?.linkMode === "TRACKING";
}

function trackingExecutions(item: any) {
  return (item.executions ?? []).filter(isTrackingExecution);
}

function subtaskIsDone(item: any) {
  const tracking = trackingExecutions(item);
  if (tracking.length > 0) return tracking.every(executionIsDone);
  return Boolean(item.isDone) || String(item.status ?? "").toUpperCase() === "DONE";
}

function subtaskHasProgress(item: any) {
  const executions = item.executions ?? [];
  if (executions.length > 0) return true;
  if (item.isDone) return true;
  return String(item.status ?? "").toUpperCase() === "IN_PROGRESS";
}

export async function syncTaskStatusFromChecklistRepo(db: DB, taskId: string) {
  const client = dbOrTx(db);

  const rawTask = await client.task.findUnique({
    where: { id: taskId },
    include: TASK_INCLUDE,
  });

  if (!rawTask) return null;
  if (rawTask.status === TaskStatus.CANCELLED) return rawTask;

  const task = await hydrateTaskBusinessLinks(db, rawTask);
  const items = task.taskItems ?? [];
  if (!items.length) return task;

  for (const item of items) {
    const executions = item.executions ?? [];
    const tracking = trackingExecutions(item);
    if (!tracking.length) continue;

    const isDone = tracking.every(executionIsDone);
    if (!executions.length) continue;

    await client.taskItem.update({
      where: { id: item.id },
      data: isDone
        ? {
            status: TaskStatus.DONE,
            isDone: true,
            completedAt: new Date(),
            cancelledAt: null,
          }
        : {
            status: TaskStatus.IN_PROGRESS,
            isDone: false,
            startedAt: item.startedAt ?? new Date(),
            completedAt: null,
          },
    });

    item.status = isDone ? TaskStatus.DONE : TaskStatus.IN_PROGRESS;
    item.isDone = isDone;
  }

  const allDone = items.every(subtaskIsDone);
  const hasProgress = items.some(subtaskHasProgress);

  if (allDone) {
    return client.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.DONE,
        completedAt: new Date(),
        cancelledAt: null,
      },
      include: TASK_INCLUDE,
    });
  }

  if (hasProgress && rawTask.status === TaskStatus.TODO) {
    return client.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.IN_PROGRESS,
        startedAt: rawTask.startedAt ?? new Date(),
        completedAt: null,
      },
      include: TASK_INCLUDE,
    });
  }

  return task;
}

export async function syncTaskItemStatusFromChecklistRepo(
  db: DB,
  taskItemId: string,
  actorUserId?: string | null,
) {
  const client = dbOrTx(db);

  const item = await client.taskItem.findUnique({
    where: { id: taskItemId },
    include: { checklists: true },
  });

  if (!item) return null;
  if (item.status === TaskStatus.CANCELLED) return item;

  const checklists = item.checklists ?? [];
  if (!checklists.length) return item;

  const allDone = checklists.every((x: any) => x.isDone);
  const hasProgress = checklists.some((x: any) => x.isDone);

  return client.taskItem.update({
    where: { id: taskItemId },
    data: allDone
      ? {
          isDone: true,
          status: TaskStatus.DONE,
          completedAt: new Date(),
          cancelledAt: null,
          ...(actorUserId ? { userId: actorUserId } : {}),
        }
      : hasProgress
        ? {
            isDone: false,
            status: TaskStatus.IN_PROGRESS,
            startedAt: item.startedAt ?? new Date(),
            completedAt: null,
          }
        : {
            isDone: false,
            status: TaskStatus.TODO,
            completedAt: null,
          },
    include: TASK_ITEM_INCLUDE,
  });
}
