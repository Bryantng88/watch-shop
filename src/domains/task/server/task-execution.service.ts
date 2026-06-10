import { TaskStatus } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { authCanViewAllTasks, getAuthUserId } from "./task.service";
import { createTaskExecutionRepo, listTaskExecutionsRepo } from "./task-execution.repo";
import type { LinkTaskExecutionInput } from "./task-execution.types";

function assertUser(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("Không xác định được user hiện tại");
}

async function assertCanExecuteTask(db: DB, taskId: string, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const task = await db.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      status: true,
      createdByUserId: true,
      assignedToUserId: true,
    },
  });

  if (!task) throw new Error("Không tìm thấy task");

  if (!authCanViewAllTasks(auth) && task.createdByUserId !== userId && task.assignedToUserId !== userId) {
    throw new Error("Bạn không có quyền thực thi task này");
  }

  if (task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED) {
    throw new Error("Task đã đóng, không thể tạo thêm nghiệp vụ");
  }

  return { task, userId };
}

export async function listTaskExecutions(db: DB, taskId: string, auth: any) {
  await assertCanExecuteTask(db, taskId, auth);
  return listTaskExecutionsRepo(db, taskId);
}

export async function linkTaskExecution(db: DB, input: LinkTaskExecutionInput, auth: any) {
  const { userId } = await assertCanExecuteTask(db, input.taskId, auth);

  return createTaskExecutionRepo(db, {
    ...input,
    createdByUserId: userId,
    syncTaskRelation: input.syncTaskRelation ?? true,
  });
}
