import {
  WorkflowActionType,
  WorkflowConditionStrategy,
  WorkflowTemplateStatus,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";

import { normalizeBusinessEventKey } from "@/domains/event/registry/business-event-registry";

export async function listWorkflowTemplatesRepo(
  db: DB,
  input?: { ownerType?: string | null; ownerId?: string | null; includeGlobal?: boolean },
) {
  const client = dbOrTx(db) as any;

  const ownerType = input?.ownerType ?? null;
  const ownerId = input?.ownerId ?? null;
  const includeGlobal = input?.includeGlobal !== false;

  return client.workflowTemplate.findMany({
    where: {
      status: { not: WorkflowTemplateStatus.ARCHIVED },
      OR: [
        ...(includeGlobal ? [{ ownerType: null, ownerId: null }] : []),
        ...(ownerType && ownerId ? [{ ownerType, ownerId }] : []),
      ],
    },
    include: {
      conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
  });
}

export async function createWorkflowTemplateRepo(
  db: DB,
  input: {
    name: string;
    description?: string | null;
    ownerType?: string | null;
    ownerId?: string | null;
    strategy?: WorkflowConditionStrategy;
    eventKeys: string[];
    actionTypes?: WorkflowActionType[];
  },
) {
  const client = dbOrTx(db) as any;
  const name = String(input.name || "").trim();
  if (!name) throw new Error("Missing workflow name");

  const eventKeys = Array.from(
    new Set(input.eventKeys.map(normalizeBusinessEventKey).filter(Boolean)),
  );

  if (!eventKeys.length) throw new Error("Workflow cần ít nhất một condition");

  const actionTypes = input.actionTypes?.length
    ? input.actionTypes
    : [WorkflowActionType.COMPLETE_TASK_ITEM];

  return client.workflowTemplate.create({
    data: {
      name,
      description: input.description?.trim() || null,
      ownerType: input.ownerType || null,
      ownerId: input.ownerId || null,
      strategy: input.strategy ?? WorkflowConditionStrategy.ALL,
      conditions: {
        create: eventKeys.map((eventKey, index) => ({
          eventKey,
          sortOrder: index,
        })),
      },
      actions: {
        create: actionTypes.map((actionType, index) => ({
          actionType,
          sortOrder: index,
        })),
      },
    },
    include: {
      conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export async function setTagWorkflowRepo(
  db: DB,
  input: { tagId: string; workflowId?: string | null },
) {
  const client = dbOrTx(db) as any;
  const tagId = String(input.tagId || "").trim();
  if (!tagId) throw new Error("Missing tagId");

  return client.appTag.update({
    where: { id: tagId },
    data: {
      workflowId: input.workflowId || null,
    },
    include: {
      workflow: {
        include: {
          conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
          actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        },
      },
    },
  });
}



function keyOf(targetType: string, targetId: string) {
  return `${String(targetType).toUpperCase()}:${String(targetId)}`;
}

function sameTargetType(a?: string | null, b?: string | null) {
  if (!a || !b) return true;
  return String(a).toUpperCase() === String(b).toUpperCase();
}

export async function getTaskItemWorkflowProgress(db: DB, taskItemIds: string[]) {
  const client = dbOrTx(db);
  if (!taskItemIds.length) return new Map<string, any>();

  const workflowExecutions = await client.workflowExecution.findMany({
    where: {
      actionTargetType: "TASK_ITEM",
      actionTargetId: { in: taskItemIds },
    },
    include: {
      workflow: {
        include: {
          conditions: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
      events: {
        orderBy: [{ createdAt: "asc" }],
      },
    },
  });

  const taskExecutions = await client.taskExecution.findMany({
    where: {
      taskItemId: { in: taskItemIds },
    },
    select: {
      id: true,
      taskItemId: true,
      targetType: true,
      targetId: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  const watchRawIds = taskExecutions
    .filter((x) => String(x.targetType).toUpperCase() === "WATCH")
    .map((x) => x.targetId);

  const eventWatchIds = workflowExecutions.flatMap((execution) =>
    (execution.events ?? [])
      .filter((event) => String(event.targetType).toUpperCase() === "WATCH")
      .map((event) => event.targetId),
  );

  const watchIds = Array.from(new Set([...watchRawIds, ...eventWatchIds]));

  const watches = watchIds.length
    ? await client.watch.findMany({
      where: {
        OR: [{ id: { in: watchIds } }, { productId: { in: watchIds } }],
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            sku: true,
          },
        },
      },
    })
    : [];

  const watchByAnyId = new Map<string, any>();

  for (const watch of watches) {
    watchByAnyId.set(watch.id, watch);
    watchByAnyId.set(watch.productId, watch);
  }

  function normalizeTarget(targetType: string, targetId: string) {
    const type = String(targetType).toUpperCase();

    if (type === "WATCH") {
      const watch = watchByAnyId.get(targetId);
      if (watch) {
        return {
          targetType: "WATCH",
          targetId: watch.id,
          label: watch.product?.sku || watch.product?.title || watch.id,
          subtitle: watch.product?.title || "",
        };
      }
    }

    return {
      targetType: type,
      targetId,
      label: targetId,
      subtitle: "",
    };
  }

  const linkedByTaskItem = new Map<string, any[]>();

  for (const link of taskExecutions) {
    if (!link.taskItemId) continue;

    const normalized = normalizeTarget(
      String(link.targetType),
      String(link.targetId),
    );

    const list = linkedByTaskItem.get(link.taskItemId) ?? [];
    list.push({
      ...link,
      ...normalized,
    });
    linkedByTaskItem.set(link.taskItemId, list);
  }

  const result = new Map<string, any>();

  for (const execution of workflowExecutions) {
    const taskItemId = execution.actionTargetId;
    const linkedEntities = linkedByTaskItem.get(taskItemId) ?? [];

    const eventMap = new Map<string, Set<string>>();

    for (const event of execution.events ?? []) {
      const normalized = normalizeTarget(
        String(event.targetType),
        String(event.targetId),
      );

      const key = keyOf(normalized.targetType, normalized.targetId);
      const set = eventMap.get(key) ?? new Set<string>();
      set.add(event.eventKey);
      eventMap.set(key, set);
    }

    const targets = linkedEntities.map((link) => {
      const eventKeys =
        eventMap.get(keyOf(link.targetType, link.targetId)) ?? new Set<string>();

      const conditions = (execution.workflow.conditions ?? [])
        .filter((condition: any) =>
          sameTargetType(condition.targetType, link.targetType),
        )
        .map((condition: any) => ({
          eventKey: condition.eventKey,
          done: eventKeys.has(condition.eventKey),
        }));

      const completed = conditions.filter((x: any) => x.done).length;
      const total = conditions.length;

      return {
        targetType: link.targetType,
        targetId: link.targetId,
        label: link.label,
        subtitle: link.subtitle,
        completed,
        total,
        done: total > 0 && completed === total,
        conditions,
      };
    });

    const total = targets.reduce((sum, x) => sum + x.total, 0);
    const completed = targets.reduce((sum, x) => sum + x.completed, 0);

    result.set(taskItemId, {
      executionId: execution.id,
      workflowId: execution.workflowId,
      workflowName: execution.workflow.name,
      strategy: execution.workflow.strategy,
      status: execution.status,
      completed,
      total,
      done: total > 0 && completed === total,
      targets,
    });
  }

  return result;
}