import { TaskExecutionActionType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type {
  BusinessBindingTargetInput,
  CreateBusinessBindingInput,
} from "./business-binding.types";
import type { BusinessBindingTargetType } from "./business-binding.types";
function clean(value: unknown) {
  return String(value ?? "").trim();
}

function assertPresent(value: unknown, message: string) {
  if (!clean(value)) throw new Error(message);
}

function relationIdsForTarget(input: BusinessBindingTargetInput) {
  if (input.targetType === "SERVICE_REQUEST") {
    return { serviceRequestId: input.targetId };
  }

  if (input.targetType === "TECHNICAL_ISSUE") {
    return { technicalIssueId: input.targetId };
  }

  return {};
}

// TaskExecution is the persisted model. BusinessBinding is the domain
// abstraction used by collaboration/timeline code to describe this mapping.
export async function createBusinessBinding(
  db: DB,
  input: CreateBusinessBindingInput,
) {
  const client = dbOrTx(db);
  const taskId = clean(input.taskId);
  const targetId = clean(input.targetId);
  const taskItemId = clean(input.taskItemId);

  assertPresent(taskId, "Missing taskId");
  assertPresent(targetId, "Missing targetId");

  return client.taskExecution.create({
    data: {
      taskId,
      taskItemId: taskItemId || null,
      targetType: input.targetType,
      targetId,
      actionType: input.actionType ?? TaskExecutionActionType.LINKED,
      metadataJson: input.metadataJson ?? undefined,
      note: clean(input.note) || null,
      createdByUserId: input.createdByUserId ?? null,
      serviceRequestId: input.serviceRequestId ?? null,
      technicalIssueId: input.technicalIssueId ?? null,
      ...relationIdsForTarget({
        targetType: input.targetType,
        targetId,
      }),
    },
  });
}

// Reads TaskExecution rows through the BusinessBinding vocabulary.
export async function findBusinessBindingsByTarget(
  db: DB,
  targetType: BusinessBindingTargetInput["targetType"],
  targetId: string,
) {
  const client = dbOrTx(db);
  const cleanTargetId = clean(targetId);
  assertPresent(cleanTargetId, "Missing targetId");

  return client.taskExecution.findMany({
    where: {
      targetType,
      targetId: cleanTargetId,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function findTaskItemIdsByTarget(
  db: DB,
  targetType: BusinessBindingTargetInput["targetType"],
  targetId: string,
) {
  const client = dbOrTx(db);
  const cleanTargetId = clean(targetId);
  assertPresent(cleanTargetId, "Missing targetId");

  const rows = await client.taskExecution.findMany({
    where: {
      targetType,
      targetId: cleanTargetId,
      taskItemId: {
        not: null,
      },
    },
    select: {
      taskItemId: true,
    },
    distinct: ["taskItemId"],
  });

  return rows
    .map((row) => clean(row.taskItemId))
    .filter(Boolean);
}

export async function findBusinessBindingsByTaskItem(
  db: DB,
  taskItemId: string,
) {
  const client = dbOrTx(db);
  const cleanTaskItemId = clean(taskItemId);
  assertPresent(cleanTaskItemId, "Missing taskItemId");

  return client.taskExecution.findMany({
    where: {
      taskItemId: cleanTaskItemId,
    },
    orderBy: { createdAt: "desc" },
  });
}
export async function findTaskItemIdsByTargetIds(
  db: DB,
  input: {
    targetType: BusinessBindingTargetType;
    targetIds: string[];
  },
) {
  const client = dbOrTx(db);

  const targetIds = Array.from(
    new Set(input.targetIds.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );

  if (!targetIds.length) return [];

  const rows = await client.taskExecution.findMany({
    where: {
      targetType: input.targetType as any,
      targetId: { in: targetIds },
      taskItemId: { not: null },
    },
    select: { taskItemId: true },
    distinct: ["taskItemId"],
  });

  return rows
    .map((row) => row.taskItemId)
    .filter((id): id is string => Boolean(id));
}