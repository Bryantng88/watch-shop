import {
  ServiceRequestStatus,
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
  TechnicalIssueExecutionStatus,
  type Prisma,
} from "@prisma/client";
import { dbOrTx, withDbTransaction, type DB } from "@/server/db/client";
import { createSystemActivity } from "@/domains/task/server/activity";
import { ensureTaskItemBusinessBinding } from "@/domains/task/server/business-binding.service";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import { isCoreWorkspaceBlueprint } from "@/domains/task/shared/workspace-flow-policy";
import {
  getWorkTypeKeyFromTicketNote,
} from "./coordination-cycle.service";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
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
  const keys = new Set(
    listWorkTypes(context)
      .map((workType) => normalizeWorkTypeKey(workType.key))
      .filter((key) => isCoreWorkspaceBlueprint({ key, source: "REGISTRY" })),
  );

  if (context === "TECHNICAL") {
    keys.add("service-operation");
  }

  return keys;
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

function normalizeStatus(value: unknown) {
  return clean(value).toUpperCase();
}

function terminalStatesForTarget(
  terminalStatesByTargetType: Record<string, string[]> | undefined,
  targetType: string,
) {
  return new Set(
    (terminalStatesByTargetType?.[normalizeStatus(targetType)] ?? [])
      .map(normalizeStatus)
      .filter(Boolean),
  );
}

function statusListIsProcessing(
  statuses: unknown[],
  terminalStates: Set<string>,
  fallback?: boolean,
) {
  const normalized = statuses.map(normalizeStatus).filter(Boolean);
  if (!normalized.length) return fallback ?? true;
  if (!terminalStates.size) return fallback ?? true;

  return !normalized.some((status) => terminalStates.has(status));
}

function targetKey(input: { targetType: string; targetId: string }) {
  return `${input.targetType}:${input.targetId}`;
}

function noteLineValue(note: string | null | undefined, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(note ?? "").match(new RegExp(`^${escaped}:\\s*([^\\r\\n]+)\\s*$`, "im"));
  return match?.[1]?.trim() ?? null;
}

function serviceOperationWorkspaceRole(note?: string | null) {
  const role = String(note ?? "")
    .match(/^serviceOperationWorkspaceRole:\s*(SR_CASE|INSPECT|PROCESSING|DONE)\s*$/im)?.[1]
    ?.toUpperCase();

  if (role === "SR_CASE" || role === "INSPECT" || role === "PROCESSING" || role === "DONE") {
    return role;
  }

  return null;
}

function currentItemKey(input: {
  context: CoordinationContext;
  workTypeKey: string;
  note?: string | null;
}) {
  const workTypeKey = normalizeWorkTypeKey(input.workTypeKey);

  if (input.context === "TECHNICAL" && workTypeKey === "service-operation") {
    const role = serviceOperationWorkspaceRole(input.note);
    if (role === "SR_CASE") {
      return `${workTypeKey}:SR_CASE:${noteLineValue(input.note, "serviceRequestId") ?? ""}`;
    }

    return `${workTypeKey}:${role ?? "PROCESSING"}`;
  }

  return workTypeKey;
}

function isServiceRequestProcessing(status: ServiceRequestStatus | null | undefined) {
  return Boolean(
    status &&
      status !== ServiceRequestStatus.COMPLETED &&
      status !== ServiceRequestStatus.DELIVERED &&
      status !== ServiceRequestStatus.CANCELED,
  );
}

function isTechnicalIssueProcessing(
  status: TechnicalIssueExecutionStatus | null | undefined,
) {
  return Boolean(
    status &&
      status !== TechnicalIssueExecutionStatus.DONE &&
      status !== TechnicalIssueExecutionStatus.CANCELED,
  );
}

async function loadProcessingTargetMap(
  client: DB,
  bindings: Array<{ targetType: string; targetId: string }>,
  terminalStatesByTargetType?: Record<string, string[]>,
) {
  const map = new Map<string, boolean>();
  const serviceRequestIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.SERVICE_REQUEST)
    .map((binding) => binding.targetId);
  const technicalIssueIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.TECHNICAL_ISSUE)
    .map((binding) => binding.targetId);
  const watchIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.WATCH)
    .map((binding) => binding.targetId);
  const paymentIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.PAYMENT)
    .map((binding) => binding.targetId);
  const orderIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.ORDER)
    .map((binding) => binding.targetId);
  const shipmentIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.SHIPMENT)
    .map((binding) => binding.targetId);
  const acquisitionIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.ACQUISITION)
    .map((binding) => binding.targetId);
  const workCaseIds = bindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.WORK_CASE)
    .map((binding) => binding.targetId);

  const [
    serviceRequests,
    technicalIssues,
    watches,
    payments,
    orders,
    shipments,
    acquisitions,
    workCases,
  ] = await Promise.all([
    serviceRequestIds.length
      ? client.serviceRequest.findMany({
          where: { id: { in: serviceRequestIds } },
          select: { id: true, status: true },
        })
      : [],
    technicalIssueIds.length
      ? client.technicalIssue.findMany({
          where: { id: { in: technicalIssueIds } },
          select: { id: true, executionStatus: true },
        })
      : [],
    watchIds.length
      ? client.watch.findMany({
          where: { id: { in: watchIds } },
          select: {
            id: true,
            saleStage: true,
            isContentDownloaded: true,
            isImageDownloaded: true,
          },
        })
      : [],
    paymentIds.length
      ? client.payment.findMany({
          where: { id: { in: paymentIds } },
          select: { id: true, status: true },
        })
      : [],
    orderIds.length
      ? client.order.findMany({
          where: { id: { in: orderIds } },
          select: { id: true, status: true },
        })
      : [],
    shipmentIds.length
      ? client.shipment.findMany({
          where: { id: { in: shipmentIds } },
          select: { id: true, status: true },
        })
      : [],
    acquisitionIds.length
      ? client.acquisition.findMany({
          where: { id: { in: acquisitionIds } },
          select: { id: true, accquisitionStt: true },
        })
      : [],
    workCaseIds.length
      ? client.workCase.findMany({
          where: { id: { in: workCaseIds } },
          select: { id: true, status: true },
        })
      : [],
  ]);

  for (const row of serviceRequests) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.SERVICE_REQUEST,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        targetId: row.id,
      }),
      statusListIsProcessing(
        [row.status],
        terminalStates,
        isServiceRequestProcessing(row.status),
      ),
    );
  }

  for (const row of technicalIssues) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.TECHNICAL_ISSUE,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
        targetId: row.id,
      }),
      statusListIsProcessing(
        [row.executionStatus],
        terminalStates,
        isTechnicalIssueProcessing(row.executionStatus),
      ),
    );
  }

  for (const row of watches) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.WATCH,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.WATCH,
        targetId: row.id,
      }),
      statusListIsProcessing(
        [
          row.saleStage,
          row.isContentDownloaded && row.isImageDownloaded ? "POSTED" : null,
        ],
        terminalStates,
      ),
    );
  }

  for (const row of payments) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.PAYMENT,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.PAYMENT,
        targetId: row.id,
      }),
      statusListIsProcessing([row.status], terminalStates),
    );
  }

  for (const row of orders) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.ORDER,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.ORDER,
        targetId: row.id,
      }),
      statusListIsProcessing([row.status], terminalStates),
    );
  }

  for (const row of shipments) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.SHIPMENT,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.SHIPMENT,
        targetId: row.id,
      }),
      statusListIsProcessing([row.status], terminalStates),
    );
  }

  for (const row of acquisitions) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.ACQUISITION,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.ACQUISITION,
        targetId: row.id,
      }),
      statusListIsProcessing([row.accquisitionStt], terminalStates),
    );
  }

  for (const row of workCases) {
    const terminalStates = terminalStatesForTarget(
      terminalStatesByTargetType,
      TaskExecutionTargetType.WORK_CASE,
    );
    map.set(
      targetKey({
        targetType: TaskExecutionTargetType.WORK_CASE,
        targetId: row.id,
      }),
      statusListIsProcessing([row.status], terminalStates),
    );
  }

  return map;
}

function targetStillProcessing(input: {
  targetType: string;
  targetId: string;
  processingTargetMap: Map<string, boolean>;
}) {
  return input.processingTargetMap.get(targetKey(input)) ?? true;
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
      movementKind: "ACTIVE_OWNERSHIP_MOVE",
      direction: "IN",
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
    dryRun?: boolean;
  },
) {
  const client = dbOrTx(db);
  const taskId = clean(input.taskId);
  if (!taskId) throw new Error("Missing taskId");
  const carryoverPolicy = getSpaceViewConfig(input.context).carryover;

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
          !coreWorkTypeKeys.has(workTypeKey)
        ) {
          return null;
        }
        return [
          currentItemKey({
            context: input.context,
            workTypeKey,
            note: item.note,
          }),
          item,
        ] as const;
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
  const processingTargetMap = await loadProcessingTargetMap(
    client,
    previousBindings,
    carryoverPolicy.terminalStatesByTargetType,
  );

  const results: CoordinationRolloverItemResult[] = [];

  for (const binding of previousBindings) {
    const fromItem = binding.taskItem;
    const workTypeKey = getWorkTypeKeyFromTicketNote(fromItem?.note);
    const toItemKey = workTypeKey
      ? currentItemKey({
        context: input.context,
        workTypeKey,
        note: fromItem?.note,
      })
      : null;
    let toItem = toItemKey
      ? currentByWorkType.get(
        toItemKey,
      )
      : null;
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

    if (
      !targetStillProcessing({
        targetType: binding.targetType,
        targetId: binding.targetId,
        processingTargetMap,
      })
    ) {
      results.push({ ...baseResult, status: "SKIPPED", reason: "TARGET_NOT_PROCESSING" });
      continue;
    }

    if (
      !toItem &&
      input.context === "TECHNICAL" &&
      workTypeKey === "service-operation" &&
      serviceOperationWorkspaceRole(fromItem.note) === "SR_CASE" &&
      binding.targetType === TaskExecutionTargetType.SERVICE_REQUEST
    ) {
      if (input.dryRun) {
        toItem = {
          id: `dry-run:${binding.targetId}`,
          title: fromItem.title,
          note: fromItem.note,
          status: TaskStatus.TODO,
        };
      } else {
        const createdItem = await client.taskItem.create({
          data: {
            taskId: currentTask.id,
            title: fromItem.title,
            note: fromItem.note,
            status: TaskStatus.TODO,
            priority: "MEDIUM",
            assignedToUserId: null,
            sortOrder: 56,
          },
          select: { id: true, title: true, note: true, status: true },
        });

        toItem = createdItem;
        if (toItemKey) currentByWorkType.set(toItemKey, createdItem);
      }
    }

    if (toItem && !baseResult.toWorkspaceTitle) {
      baseResult.toWorkspaceTitle = toItem.title;
    }

    if (!toItem) {
      results.push({ ...baseResult, status: "FAILED", reason: "MISSING_TARGET_WORKSPACE" });
      continue;
    }

    if (input.dryRun) {
      results.push({ ...baseResult, status: "MOVED", reason: "READY_TO_MOVE" });
      continue;
    }

    try {
      let createdTargetBinding = false;
      await withDbTransaction(client, async (tx) => {
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

      const bindingResult = await ensureTaskItemBusinessBinding(tx, {
        taskId: currentTask.id,
        taskItemId: toItem.id,
        targetType: binding.targetType,
        targetId: binding.targetId,
        actionType: TaskExecutionActionType.LINKED,
        createdByUserId: input.actorUserId ?? binding.createdByUserId ?? null,
        metadataJson,
        note: binding.note,
      });
      createdTargetBinding = bindingResult.created;

      await tx.taskExecution.update({
        where: { id: binding.id },
        data: {
          actionType: TaskExecutionActionType.CANCELLED,
          metadataJson: {
            ...asRecord(binding.metadataJson),
            rollover: {
              movementKind: "ACTIVE_OWNERSHIP_MOVE",
              direction: "OUT",
              fromTaskId: previousTask.id,
              fromTaskItemId: fromItem.id,
              fromTaskItemTitle: fromItem.title,
              toTaskId: currentTask.id,
              toTaskItemId: toItem.id,
              toTaskItemTitle: toItem.title,
              toBindingId: bindingResult.binding.id,
              actorUserId: input.actorUserId ?? null,
              movedAt: new Date().toISOString(),
            },
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
      }, tx);

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
      }, tx);
      });

      results.push({
        ...baseResult,
        status: "MOVED",
        reason: createdTargetBinding ? undefined : "ALREADY_LINKED",
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
