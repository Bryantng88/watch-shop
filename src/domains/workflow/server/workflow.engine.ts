import { dbOrTx, type DB } from "@/server/db/client";
import { evaluateWorkflowExecution } from "./workflow-evaluator";

type BusinessEventEffect = "ASSERT" | "REVOKE";

type BusinessEventInput = {
  eventKey: string;
  targetType: string;
  targetId: string;
  actorUserId?: string | null;
  payload?: any;

  effect?: "ASSERT" | "REVOKE";
  revokeEventKey?: string | null;

  // dùng cho case domain có nhiều id đại diện: watch.id / productId / orderId...
  targetAliasIds?: string[];
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function recordBusinessEvent(db: DB, input: BusinessEventInput) {
  const client = dbOrTx(db);

  const eventKey = clean(input.eventKey);
  const targetType = clean(input.targetType);
  const targetId = clean(input.targetId);
  const effect: BusinessEventEffect = input.effect ?? "ASSERT";
  const revokeEventKey = clean(input.revokeEventKey);

  if (!eventKey) throw new Error("Missing eventKey");
  if (!targetType) throw new Error("Missing targetType");
  if (!targetId) throw new Error("Missing targetId");

  if (effect === "REVOKE" && !revokeEventKey) {
    throw new Error("Missing revokeEventKey");
  }

  const eventLog = await client.workflowEventLog.upsert({
    where: {
      eventKey_targetType_targetId: {
        eventKey,
        targetType,
        targetId,
      },
    },
    update: {
      actorUserId: input.actorUserId ?? null,
      metadataJson: {
        ...(input.payload ?? {}),
        effect,
        revokeEventKey: revokeEventKey || null,
      },
    },
    create: {
      eventKey,
      targetType,
      targetId,
      actorUserId: input.actorUserId ?? null,
      metadataJson: {
        ...(input.payload ?? {}),
        effect,
        revokeEventKey: revokeEventKey || null,
      },
    },
  });

  if (effect === "REVOKE") {
    const revokeTargetIds = Array.from(
      new Set(
        [targetId, ...(input.targetAliasIds ?? [])]
          .map((id) => String(id || "").trim())
          .filter(Boolean),
      ),
    );

    const executionEventsToRevoke =
      await client.workflowExecutionEvent.findMany({
        where: {
          eventKey: revokeEventKey,
          targetType,
          targetId: { in: revokeTargetIds },
        },
        select: {
          executionId: true,
        },
        distinct: ["executionId"],
      });

    await client.workflowExecutionEvent.deleteMany({
      where: {
        eventKey: revokeEventKey,
        targetType,
        targetId: { in: revokeTargetIds },
      },
    });

    for (const row of executionEventsToRevoke) {
      await client.workflowExecution.update({
        where: { id: row.executionId },
        data: {
          status: "RUNNING" as any,
          completedAt: null,
          errorMessage: null,
        },
      });

      await evaluateWorkflowExecution(client, row.executionId, {
        actorUserId: input.actorUserId ?? null,
        eventLog,
      });
    }

    return {
      ok: true,
      eventLog,
      effect,
      revokedEventKey: revokeEventKey,
      affectedExecutions: executionEventsToRevoke.length,
    };
  }

  const conditions = await client.workflowCondition.findMany({
    where: { eventKey },
    include: {
      workflow: {
        include: {
          tags: true,
        },
      },
    },
  });

  for (const condition of conditions) {
    const workflow = condition.workflow;
    if (!workflow || workflow.status !== "ACTIVE") continue;

    const tagIds = (workflow.tags ?? []).map((tag: any) => tag.id);
    if (!tagIds.length) continue;

    const tagLinks = await client.appTagLink.findMany({
      where: {
        tagId: { in: tagIds },
        targetType: "TASK_ITEM" as any,
      },
      select: {
        targetId: true,
      },
    });

    for (const link of tagLinks) {
      const taskItem = await client.taskItem.findUnique({
        where: { id: link.targetId },
        select: {
          id: true,
          isDone: true,
          status: true,
        },
      });

      if (!taskItem) continue;

      const existingExecution = await client.workflowExecution.findFirst({
        where: {
          workflowId: workflow.id,
          actionTargetType: "TASK_ITEM",
          actionTargetId: taskItem.id,
        },
      });

      const execution = existingExecution
        ? await client.workflowExecution.update({
          where: { id: existingExecution.id },
          data: {
            status:
              String(existingExecution.status) === "COMPLETED"
                ? existingExecution.status
                : ("RUNNING" as any),
            startedAt: existingExecution.startedAt ?? new Date(),
            errorMessage: null,
          },
        })
        : await client.workflowExecution.create({
          data: {
            workflowId: workflow.id,
            actionTargetType: "TASK_ITEM",
            actionTargetId: taskItem.id,
            status: "RUNNING" as any,
            startedAt: new Date(),
          },
        });

      const existingExecutionEvent =
        await client.workflowExecutionEvent.findFirst({
          where: {
            executionId: execution.id,
            eventKey,
            targetType,
            targetId,
          },
        });

      if (!existingExecutionEvent) {
        await client.workflowExecutionEvent.create({
          data: {
            executionId: execution.id,
            eventKey,
            targetType,
            targetId,
            eventLogId: eventLog.id,
          },
        });
      }

      await evaluateWorkflowExecution(client, execution.id, {
        actorUserId: input.actorUserId ?? null,
        eventLog,
      });
    }
  }

  return { ok: true, eventLog, effect };
}