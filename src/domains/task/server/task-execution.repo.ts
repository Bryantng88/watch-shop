import { Prisma, TaskExecutionTargetType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { LinkTaskExecutionInput } from "./task-execution.types";

export const TASK_EXECUTION_INCLUDE = {
  createdByUser: { select: { id: true, name: true, email: true } },
  serviceRequest: {
    select: {
      id: true,
      refNo: true,
      status: true,
    },
  },
  technicalIssue: {
    select: {
      id: true,
      summary: true,
      area: true,
      executionStatus: true,
      priority: true,
      serviceRequestId: true,
    },
  },
} satisfies Prisma.TaskExecutionInclude;
function executionRelationPatch(
  targetType: TaskExecutionTargetType,
  targetId: string,
): Pick<
  Prisma.TaskExecutionUncheckedCreateInput,
  "serviceRequestId" | "technicalIssueId"
> {
  if (targetType === TaskExecutionTargetType.SERVICE_REQUEST) {
    return { serviceRequestId: targetId };
  }

  if (targetType === TaskExecutionTargetType.TECHNICAL_ISSUE) {
    return { technicalIssueId: targetId };
  }

  return {};
}
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

  const actionType = input.actionType ?? "CREATED";

  const duplicated = await client.taskExecution.findFirst({
    where: {
      taskId,
      targetType: input.targetType,
      targetId,
      actionType,
      checklistItemId: input.checklistItemId ?? null,
    },
    select: { id: true },
  });

  if (duplicated) {
    throw new Error("Nghiệp vụ này đã được gắn với task");
  }

  const execution = await client.taskExecution.create({
    data: {
      taskId,
      checklistItemId: input.checklistItemId ?? null,
      targetType: input.targetType,
      targetId,
      actionType,
      note: input.note?.trim() || null,
      createdByUserId: input.createdByUserId ?? null,
      ...executionRelationPatch(input.targetType, targetId),
    },
    include: TASK_EXECUTION_INCLUDE,
  });

  if (input.syncTaskRelation !== false) {
    await client.task.update({
      where: { id: taskId },
      data: {
        ...relationPatchForTarget(input.targetType, targetId),
        status: "IN_PROGRESS",
      },
    });
  }

  return execution;
}
