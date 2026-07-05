import {
  TaskExecutionActionType,
  TaskStatus,
  type Prisma,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { createSystemActivity } from "@/domains/task/server/activity";
import { ensureTaskItemBusinessBinding } from "@/domains/task/server/business-binding.service";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import { isCoreWorkspaceBlueprint } from "@/domains/task/shared/workspace-flow-policy";
import {
  getWorkTypeKeyFromTicketNote,
} from "./coordination-cycle.service";
import {
  listWorkTypes,
  normalizeWorkTypeKey,
} from "@/domains/task/server/work-type.service";
import type { CoordinationContext } from "./coordination-cycle.types";

type RolloverStatus = "MOVED" | "SKIPPED" | "FAILED";

export type CoordinationRolloverItemResult = {
  status: RolloverStatus;
  targetType: string;
  targetId: string;
  fromWorkspaceTitle: string;
  toWorkspaceTitle: string | null;
  workTypeKey: string | null;
  reason?: string;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function normalizeText(value: unknown) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function previousPeriodKey(periodKey?: string | null) {
  const match = clean(periodKey).match(/^(\d{4})-W(\d{1,2})$/i);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(week) || week <= 1) return null;

  return `${year}-W${String(week - 1).padStart(2, "0")}`;
}

function contextMatchesTask(input: {
  context: CoordinationContext;
  title?: string | null;
  description?: string | null;
}) {
  const text = normalizeText(`${input.title ?? ""} ${input.description ?? ""}`);

  if (input.context === "MEDIA") return /\bmedia\b/.test(text);
  if (input.context === "PAYMENT") return text.includes("thanh toan") || /\bpayment\b/.test(text);
  if (input.context === "OPERATION") return text.includes("van hanh") || /\boperation\b/.test(text);
  if (input.context === "SALES") return text.includes("ban hang") || /\bsales\b/.test(text);
  if (input.context === "TECHNICAL") return text.includes("ky thuat") || /\btechnical\b/.test(text);
  if (input.context === "GENERAL") return text.includes("tong quat") || /\bgeneral\b/.test(text);

  return false;
}

function activeCoreWorkTypeKeys(context: CoordinationContext) {
  return new Set(
    listWorkTypes(context)
      .map((workType) => normalizeWorkTypeKey(workType.key))
      .filter((key) => isCoreWorkspaceBlueprint({ key, source: "REGISTRY" })),
  );
}

function countMatchingCoreWorkspaces(
  taskItems: Array<{ note: string | null }>,
  coreWorkTypeKeys: Set<string>,
) {
  return taskItems.filter((item) => {
    const workTypeKey = getWorkTypeKeyFromTicketNote(item.note);
    return Boolean(workTypeKey && coreWorkTypeKeys.has(workTypeKey));
  }).length;
}

function bindingFinished(metadataJson: unknown) {
  const runtime = getQueueItemWorkflowState({ metadataJson });
  if (!runtime) return false;
  return runtime.currentState === "DONE" || runtime.currentState === "CANCELLED";
}

function mergeRolloverMetadata(input: {
  metadataJson: unknown;
  fromTaskId: string;
  fromTaskItemId: string;
  fromTaskItemTitle: string;
  toTaskId: string;
  toTaskItemId: string;
  toTaskItemTitle: string;
  actorUserId?: string | null;
}) {
  return {
    ...asRecord(input.metadataJson),
    rollover: {
      fromTaskId: input.fromTaskId,
      fromTaskItemId: input.fromTaskItemId,
      fromTaskItemTitle: input.fromTaskItemTitle,
      toTaskId: input.toTaskId,
      toTaskItemId: input.toTaskItemId,
      toTaskItemTitle: input.toTaskItemTitle,
      actorUserId: input.actorUserId ?? null,
      movedAt: new Date().toISOString(),
    },
  } satisfies Prisma.JsonObject;
}

export async function rolloverPreviousCycleItems(
  db: DB,
  input: {
    taskId: string;
    context: CoordinationContext;
    actorUserId?: string | null;
  },
) {
  const client = dbOrTx(db);
  const taskId = clean(input.taskId);
  if (!taskId) throw new Error("Missing taskId");

  const currentTask = await client.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      description: true,
      kind: true,
      source: true,
      periodType: true,
      periodKey: true,
      taskItems: {
        where: { status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] } },
        select: { id: true, title: true, note: true, status: true },
      },
    },
  });

  if (!currentTask) throw new Error("Space hiện tại không tồn tại.");

  const previousKey = previousPeriodKey(currentTask.periodKey);
  if (!previousKey) {
    return {
      ok: true,
      previousPeriodKey: null,
      moved: 0,
      skipped: 0,
      failed: 0,
      items: [] as CoordinationRolloverItemResult[],
    };
  }

  const coreWorkTypeKeys = activeCoreWorkTypeKeys(input.context);
  const previousTaskCandidates = await client.task.findMany({
    where: {
      kind: currentTask.kind,
      periodType: currentTask.periodType,
      periodKey: previousKey,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      id: true,
      title: true,
      description: true,
      source: true,
      taskItems: {
        where: { status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] } },
        select: { id: true, title: true, note: true, status: true },
      },
    },
    orderBy: [{ createdAt: "asc" }],
  });
  const previousTask = previousTaskCandidates
    .map((task) => ({
      ...task,
      contextMatched: contextMatchesTask({
        context: input.context,
        title: task.title,
        description: task.description,
      }),
      matchingCoreWorkspaceCount: countMatchingCoreWorkspaces(
        task.taskItems,
        coreWorkTypeKeys,
      ),
    }))
    .filter((task) => task.matchingCoreWorkspaceCount > 0)
    .sort((left, right) => {
      if (left.contextMatched !== right.contextMatched) {
        return left.contextMatched ? -1 : 1;
      }
      if (right.matchingCoreWorkspaceCount !== left.matchingCoreWorkspaceCount) {
        return right.matchingCoreWorkspaceCount - left.matchingCoreWorkspaceCount;
      }
      if (left.source === currentTask.source && right.source !== currentTask.source) {
        return -1;
      }
      if (right.source === currentTask.source && left.source !== currentTask.source) {
        return 1;
      }
      return 0;
    })[0] ?? null;

  if (!previousTask) {
    return {
      ok: true,
      previousPeriodKey: previousKey,
      moved: 0,
      skipped: 0,
      failed: 0,
      items: [] as CoordinationRolloverItemResult[],
    };
  }

  const currentByWorkType = new Map(
    currentTask.taskItems
      .map((item) => {
        const workTypeKey = getWorkTypeKeyFromTicketNote(item.note);
        if (
          !workTypeKey ||
          !isCoreWorkspaceBlueprint({ key: workTypeKey, source: "REGISTRY" })
        ) {
          return null;
        }
        return [workTypeKey, item] as const;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  );

  const previousCoreItems = previousTask.taskItems
    .map((item) => ({
      ...item,
      workTypeKey: getWorkTypeKeyFromTicketNote(item.note),
    }))
    .filter((item) =>
      item.workTypeKey &&
      coreWorkTypeKeys.has(item.workTypeKey),
    );

  const previousBindings = await client.taskExecution.findMany({
    where: {
      taskId: previousTask.id,
      taskItemId: { in: previousCoreItems.map((item) => item.id) },
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      id: true,
      taskId: true,
      taskItemId: true,
      targetType: true,
      targetId: true,
      actionType: true,
      metadataJson: true,
      note: true,
      createdByUserId: true,
      taskItem: {
        select: {
          id: true,
          title: true,
          note: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const results: CoordinationRolloverItemResult[] = [];

  for (const binding of previousBindings) {
    const fromItem = binding.taskItem;
    const workTypeKey = getWorkTypeKeyFromTicketNote(fromItem?.note);
    const toItem = workTypeKey ? currentByWorkType.get(workTypeKey) : null;
    const baseResult = {
      targetType: binding.targetType,
      targetId: binding.targetId,
      fromWorkspaceTitle: fromItem?.title ?? "Workspace cũ",
      toWorkspaceTitle: toItem?.title ?? null,
      workTypeKey: workTypeKey ?? null,
    };

    if (!fromItem || !workTypeKey) {
      results.push({ ...baseResult, status: "SKIPPED", reason: "MISSING_WORK_TYPE" });
      continue;
    }

    if (bindingFinished(binding.metadataJson)) {
      results.push({ ...baseResult, status: "SKIPPED", reason: "ITEM_ALREADY_DONE" });
      continue;
    }

    if (!toItem) {
      results.push({ ...baseResult, status: "FAILED", reason: "MISSING_TARGET_WORKSPACE" });
      continue;
    }

    try {
      const metadataJson = mergeRolloverMetadata({
        metadataJson: binding.metadataJson,
        fromTaskId: previousTask.id,
        fromTaskItemId: fromItem.id,
        fromTaskItemTitle: fromItem.title,
        toTaskId: currentTask.id,
        toTaskItemId: toItem.id,
        toTaskItemTitle: toItem.title,
        actorUserId: input.actorUserId ?? null,
      });

      const bindingResult = await ensureTaskItemBusinessBinding(client, {
        taskId: currentTask.id,
        taskItemId: toItem.id,
        targetType: binding.targetType,
        targetId: binding.targetId,
        actionType: TaskExecutionActionType.LINKED,
        createdByUserId: input.actorUserId ?? binding.createdByUserId ?? null,
        metadataJson,
        note: binding.note,
      });

      await client.taskExecution.update({
        where: { id: binding.id },
        data: {
          actionType: TaskExecutionActionType.CANCELLED,
          metadataJson: {
            ...asRecord(binding.metadataJson),
            rolledOverToTaskId: currentTask.id,
            rolledOverToTaskItemId: toItem.id,
            rolledOverToBindingId: bindingResult.binding.id,
            rolledOverAt: new Date().toISOString(),
          } satisfies Prisma.JsonObject,
        },
      });

      await createSystemActivity({
        taskItemId: fromItem.id,
        actorUserId: input.actorUserId ?? null,
        sourceId: `rollover-out:${binding.id}:${currentTask.id}`,
        title: `Đã chuyển item sang ${toItem.title}`,
        body: `Target ${binding.targetType}:${binding.targetId} được chuyển sang ${currentTask.title}.`,
        metadataJson: {
          rolloverDirection: "OUT",
          targetType: binding.targetType,
          targetId: binding.targetId,
          toTaskId: currentTask.id,
          toTaskItemId: toItem.id,
          toBindingId: bindingResult.binding.id,
        },
      }, client);

      await createSystemActivity({
        taskItemId: toItem.id,
        actorUserId: input.actorUserId ?? null,
        sourceId: `rollover-in:${binding.id}:${currentTask.id}`,
        title: `Nhận item tồn từ ${fromItem.title}`,
        body: `Target ${binding.targetType}:${binding.targetId} được chuyển từ ${previousTask.title}.`,
        metadataJson: {
          rolloverDirection: "IN",
          targetType: binding.targetType,
          targetId: binding.targetId,
          fromTaskId: previousTask.id,
          fromTaskItemId: fromItem.id,
          fromBindingId: binding.id,
          bindingId: bindingResult.binding.id,
        },
      }, client);

      results.push({
        ...baseResult,
        status: bindingResult.created ? "MOVED" : "SKIPPED",
        reason: bindingResult.created ? undefined : "ALREADY_EXISTS",
      });
    } catch (error) {
      results.push({
        ...baseResult,
        status: "FAILED",
        reason: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      });
    }
  }

  return {
    ok: true,
    previousPeriodKey: previousKey,
    moved: results.filter((item) => item.status === "MOVED").length,
    skipped: results.filter((item) => item.status === "SKIPPED").length,
    failed: results.filter((item) => item.status === "FAILED").length,
    items: results,
  };
}
