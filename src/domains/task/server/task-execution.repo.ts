import { Prisma, TaskExecutionTargetType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { LinkTaskExecutionInput } from "./task-execution.types";

export const TASK_EXECUTION_INCLUDE = {
  createdByUser: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TaskExecutionInclude;

function relationPatchForTarget(targetType: TaskExecutionTargetType, targetId: string): Prisma.TaskUpdateInput {
  if (targetType === TaskExecutionTargetType.WATCH) return { watch: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.ORDER) return { order: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.SHIPMENT) return { shipment: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.PAYMENT) return { payment: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.SERVICE_REQUEST) return { serviceRequest: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.TECHNICAL_ISSUE) return { technicalIssue: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.ACQUISITION) return { acquisition: { connect: { id: targetId } } };
  if (targetType === TaskExecutionTargetType.WORK_CASE) return { workCase: { connect: { id: targetId } } };
  return {};
}

export async function listTaskExecutionsRepo(db: DB, taskId: string) {
  const client = dbOrTx(db);
  return client.taskExecution.findMany({
    where: { taskId },
    include: TASK_EXECUTION_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function createTaskExecutionRepo(
  db: DB,
  input: LinkTaskExecutionInput & { createdByUserId?: string | null },
) {
  const client = dbOrTx(db);
  const taskId = String(input.taskId ?? "").trim();
  const targetId = String(input.targetId ?? "").trim();
  if (!taskId) throw new Error("Missing taskId");
  if (!targetId) throw new Error("Missing targetId");

  return client.$transaction(async (tx) => {
    const duplicated = await tx.taskExecution.findFirst({
      where: {
        taskId,
        targetType: input.targetType,
        targetId,
        actionType: input.actionType ?? "CREATED",
      },
      select: { id: true },
    });

    if (duplicated) {
      throw new Error("Nghiệp vụ này đã được gắn với task");
    }

    const execution = await tx.taskExecution.create({
      data: {
        taskId,
        targetType: input.targetType,
        targetId,
        actionType: input.actionType ?? "CREATED",
        note: input.note?.trim() || null,
        createdByUserId: input.createdByUserId ?? null,
      },
      include: TASK_EXECUTION_INCLUDE,
    });

    if (input.syncTaskRelation !== false) {
      await tx.task.update({
        where: { id: taskId },
        data: relationPatchForTarget(input.targetType, targetId),
      });
    }

    return execution;
  });
}
