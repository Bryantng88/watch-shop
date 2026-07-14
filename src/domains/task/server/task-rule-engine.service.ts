import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  getTaskCompletionRuleDefinition,
  normalizeTaskCompletionRuleKey,
  TASK_COMPLETION_RULES,
  type TaskBusinessEventKey,
  type TaskCompletionRuleKey,
} from "./task-rule-keys";

type RecordTaskBusinessEventInput = {
  eventKey: TaskBusinessEventKey;
  targetType: TaskExecutionTargetType;
  targetId: string;
  actorUserId?: string | null;
  note?: string | null;
};

type TaskTypeRuleReader = {
  findMany(args: {
    where: {
      completionMode: "BUSINESS_RULE";
      completionRuleKey: { in: string[] };
    };
    select: {
      id: true;
      completionRuleKey: true;
    };
  }): Promise<Array<{ id: string; completionRuleKey: string | null }>>;
};

function eventMarker(ruleKey: string, eventKey: string) {
  return `rule:${ruleKey} event:${eventKey}`;
}

function eventNote(ruleKey: string, eventKey: string, note?: string | null) {
  const extra = note?.trim();
  return extra ? `${eventMarker(ruleKey, eventKey)} - ${extra}` : eventMarker(ruleKey, eventKey);
}

function buildDirectTargetWhere(targetType: TaskExecutionTargetType, targetId: string) {
  if (targetType === TaskExecutionTargetType.WATCH) {
    return [{ watchId: targetId }, { workCase: { watchId: targetId } }];
  }

  if (targetType === TaskExecutionTargetType.ORDER) return [{ orderId: targetId }];
  if (targetType === TaskExecutionTargetType.SHIPMENT) return [{ shipmentId: targetId }];
  if (targetType === TaskExecutionTargetType.PAYMENT) return [{ paymentId: targetId }];
  if (targetType === TaskExecutionTargetType.SERVICE_REQUEST) return [{ serviceRequestId: targetId }];
  if (targetType === TaskExecutionTargetType.TECHNICAL_ISSUE) return [{ technicalIssueId: targetId }];
  if (targetType === TaskExecutionTargetType.ACQUISITION) return [{ acquisitionId: targetId }];
  if (targetType === TaskExecutionTargetType.WORK_CASE) return [{ workCaseId: targetId }];

  return [];
}

function rulesForEvent(eventKey: TaskBusinessEventKey) {
  return TASK_COMPLETION_RULES.filter((rule) => rule.requiredEvents.includes(eventKey));
}

export async function recordTaskBusinessEvent(db: DB, input: RecordTaskBusinessEventInput) {
  const client = dbOrTx(db);
  const cleanEventKey = normalizeTaskCompletionRuleKey(input.eventKey) as TaskBusinessEventKey;
  const cleanTargetId = String(input.targetId ?? "").trim();

  if (!cleanTargetId) throw new Error("Thiếu targetId để ghi task business event");

  const relatedRules = rulesForEvent(cleanEventKey);
  if (!relatedRules.length) return { matched: 0, completed: 0, eventKey: cleanEventKey };

  const directWhere = buildDirectTargetWhere(input.targetType, cleanTargetId);
  const relatedRuleKeys = relatedRules.map((rule) => rule.key);
  const taskTypeReader = (client as unknown as { taskType?: TaskTypeRuleReader }).taskType;
  const taskTypes = taskTypeReader
    ? await taskTypeReader.findMany({
        where: {
          completionMode: "BUSINESS_RULE",
          completionRuleKey: { in: relatedRuleKeys },
        },
        select: {
          id: true,
          completionRuleKey: true,
        },
      })
    : [];
  const ruleKeyByTaskTypeId = new Map(
    taskTypes
      .map((taskType) => [
        taskType.id,
        normalizeTaskCompletionRuleKey(taskType.completionRuleKey),
      ] as const)
      .filter(([, ruleKey]) => Boolean(ruleKey)),
  );
  const taskTypeIds = [...ruleKeyByTaskTypeId.keys()];

  if (!taskTypeIds.length) {
    return { matched: 0, completed: 0, eventKey: cleanEventKey };
  }

  const tasks = await client.task.findMany({
    where: {
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
      taskTypeId: { in: taskTypeIds },
      AND: [
        {
          OR: [
            { executions: { some: { targetType: input.targetType, targetId: cleanTargetId } } },
            ...directWhere,
          ],
        },
      ],
    },
    include: {
      executions: true,
    },
  });

  let completed = 0;

  for (const task of tasks) {
    const rule = getTaskCompletionRuleDefinition(
      ruleKeyByTaskTypeId.get(task.taskTypeId ?? ""),
    );
    if (!rule) continue;

    const marker = eventMarker(rule.key, cleanEventKey);
    const alreadyRecorded = task.executions.some(
      (execution) =>
        execution.targetType === input.targetType &&
        execution.targetId === cleanTargetId &&
        execution.actionType === TaskExecutionActionType.UPDATED &&
        String(execution.note ?? "").includes(marker),
    );

    if (!alreadyRecorded) {
      await client.taskExecution.create({
        data: {
          taskId: task.id,
          targetType: input.targetType,
          targetId: cleanTargetId,
          actionType: TaskExecutionActionType.UPDATED,
          note: eventNote(rule.key, cleanEventKey, input.note),
          createdByUserId: input.actorUserId ?? null,
        },
      });
    }

    const allRequiredEventsDone = rule.requiredEvents.every((eventKey) => {
      if (eventKey === cleanEventKey) return true;

      return task.executions.some(
        (execution) =>
          execution.actionType === TaskExecutionActionType.UPDATED &&
          String(execution.note ?? "").includes(eventMarker(rule.key, eventKey)),
      );
    });

    if (allRequiredEventsDone) {
      await client.task.update({
        where: { id: task.id },
        data: {
          status: TaskStatus.DONE,
          completedAt: new Date(),
          completedByUserId: input.actorUserId ?? task.completedByUserId ?? null,
        },
      });
      completed += 1;
    } else if (task.status === TaskStatus.TODO) {
      await client.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.IN_PROGRESS },
      });
    }
  }

  return { matched: tasks.length, completed, eventKey: cleanEventKey };
}

export async function completeSystemTasksByRule(
  db: DB,
  input: {
    ruleKey: TaskCompletionRuleKey | string;
    targetType: TaskExecutionTargetType;
    targetId: string;
    actorUserId?: string | null;
    note?: string | null;
  },
) {
  const rule = getTaskCompletionRuleDefinition(input.ruleKey);
  if (!rule) throw new Error(`Rule ${input.ruleKey} chưa được hỗ trợ`);

  let totalMatched = 0;
  let totalCompleted = 0;

  for (const eventKey of rule.requiredEvents) {
    const result = await recordTaskBusinessEvent(db, {
      eventKey,
      targetType: input.targetType,
      targetId: input.targetId,
      actorUserId: input.actorUserId,
      note: input.note,
    });
    totalMatched += result.matched;
    totalCompleted += result.completed;
  }

  return { matched: totalMatched, completed: totalCompleted, ruleKey: rule.key };
}
