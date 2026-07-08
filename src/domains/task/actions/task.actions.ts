"use server";

import { revalidatePath } from "next/cache";
import { Prisma, TaskExecutionTargetType, TaskStatus, TaskPriority, TaskKind } from "@prisma/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import {
  changeTaskStatus,
  completeTasksByIds,
  createTask,
  findOpenRelatedTasks,
  getTaskDetail,
  getTaskQuickCreateData,
  updateTask,
  quickCreateTaskItem,
  authCanViewAllTasks,
  getAuthUserId,
} from "../server/core/task.service";
import { getTaskWorkPanelData } from "../server/core/task-list.service";
import type {
  CreateTaskInput,
  FindOpenRelatedTasksInput,
  UpdateTaskItemInput,
  UpdateTaskInput,
} from "../server/task.types";
import {
  createTaskItemRepo,
  deleteTaskItemRepo,
  setTaskItemDoneRepo,
  syncTaskStatusFromChecklistRepo,
  updateTaskItemRepo,
  createTaskItemChecklistRepo,
  updateTaskItemChecklistRepo,
  deleteTaskItemChecklistRepo,
  syncTaskItemStatusFromChecklistRepo,
  moveTaskItemRepo,
  buildAccessWhere,

} from "../server/core/task.repo";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import { setTargetTagsRepo } from "../server/core/task.repo";

import {
  AppTagOwnerType,
  AppTagTargetType,
} from "@prisma/client";
import { addActivityReply } from "../server/activity";
import { applyManualWorkflowAction } from "../server/business-binding-workflow.service";
import { processManualWorkspaceWorkflowTransition } from "../server/workspace-workflow-processor";
import {
  addManualQueueItem,
  searchManualQueueTargets,
} from "../server/business-binding.service";
import type { BusinessBindingTargetType } from "../server/business-binding.types";
import { isCoreWorkspaceBlueprint } from "../shared/workspace-flow-policy";

function authActorLabel(auth: unknown) {
  const root = auth && typeof auth === "object" && !Array.isArray(auth)
    ? (auth as Record<string, unknown>)
    : {};
  const user = root.user && typeof root.user === "object" && !Array.isArray(root.user)
    ? (root.user as Record<string, unknown>)
    : {};

  return {
    name: user.name ?? root.name ?? null,
    email: user.email ?? root.email ?? null,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeTextKey(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

async function resolveActivityTargetTitle(input: {
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
}) {
  const metadataTitle = cleanText(input.metadata.targetTitle) ||
    cleanText(input.metadata.title);

  if (metadataTitle) return metadataTitle;

  if (input.targetType === TaskExecutionTargetType.WATCH && input.targetId) {
    const watch = await prisma.watch.findUnique({
      where: { id: input.targetId },
      select: {
        product: {
          select: {
            title: true,
          },
        },
      },
    });

    return cleanText(watch?.product?.title) || null;
  }

  return null;
}

function blueprintIdentityFromNote(note?: string | null) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  const blueprintKey =
    snapshot?.blueprintKey ??
    String(note ?? "").match(/blueprintKey:\s*([^\r\n]+)/i)?.[1]?.trim();
  const blueprintSource =
    snapshot?.blueprintSource ??
    String(note ?? "").match(/blueprintSource:\s*([^\r\n]+)/i)?.[1]?.trim();

  if (!blueprintKey) return null;

  return {
    key: normalizeTextKey(blueprintKey),
    source: String(blueprintSource || "REGISTRY").trim().toUpperCase(),
  };
}

async function assertWorkspaceCreationAllowed(input: {
  taskId: string;
  title: string;
  note?: string | null;
  allowDuplicateBlueprint?: boolean;
}) {
  const existingItems = await prisma.taskItem.findMany({
    where: {
      taskId: input.taskId,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      title: true,
      note: true,
      status: true,
    },
  });
  const nextBlueprint = blueprintIdentityFromNote(input.note);
  if (!nextBlueprint) return;

  const duplicateTitle = existingItems.find(
    (item) => normalizeTextKey(item.title) === normalizeTextKey(input.title),
  );

  if (duplicateTitle) {
    throw new Error("Workspace name already exists in this Space.");
  }

  const duplicateBlueprint = existingItems.find((item) => {
    if (item.status === TaskStatus.DONE) return false;
    const current = blueprintIdentityFromNote(item.note);

    return (
      current?.key === nextBlueprint.key &&
      current.source === nextBlueprint.source
    );
  });

  if (duplicateBlueprint) {
    if (isCoreWorkspaceBlueprint(nextBlueprint)) {
      throw new Error(
        "This core Blueprint can only have one active Workspace in this Space.",
      );
    }

    if (input.allowDuplicateBlueprint) return;

    throw new Error(
      "This Blueprint already has an active Workspace in this Space. Confirm duplicate Blueprint creation before trying again.",
    );
  }
}

async function getTaskAuth() {
  return requirePermission("TASK_VIEW");
}

export async function getTaskQuickCreateDataAction() {
  const auth = await getTaskAuth();
  return getTaskQuickCreateData(prisma, auth);
}

export async function getTaskDetailAction(id: string) {
  const auth = await getTaskAuth();
  const task = await getTaskDetail(prisma, id, auth);
  return { ok: true, task };
}

export async function getTaskWorkPanelAction(id: string) {
  const auth = await getTaskAuth();
  const task = await getTaskWorkPanelData(prisma, { id, auth });
  return { ok: true, task };
}

export async function createTaskAction(input: CreateTaskInput) {
  const auth = await getTaskAuth();

  const result = await createTask(prisma, input, auth);

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/task-items");

  return {
    ok: true,
    task: result.task,
    wasExistingPeriodTask: result.wasExistingPeriodTask,
  };
}

export async function updateTaskAction(id: string, input: UpdateTaskInput) {
  const auth = await getTaskAuth();
  const task = await updateTask(prisma, id, input, auth);
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${id}`);
  return { ok: true, task };
}

export async function changeTaskStatusAction(id: string, status: TaskStatus) {
  const auth = await getTaskAuth();
  const task = await changeTaskStatus(prisma, id, status, auth);
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${id}`);
  return { ok: true, task };
}

export async function findOpenRelatedTasksAction(
  input: FindOpenRelatedTasksInput,
) {
  await getTaskAuth();
  const items = await findOpenRelatedTasks(prisma, input);
  return { ok: true, items };
}

export async function completeTasksByIdsAction(ids: string[]) {
  const auth = await getTaskAuth();
  const result = await completeTasksByIds(prisma, ids, auth);
  revalidatePath("/admin/tasks");
  return { ok: true, count: result.count };
}

export async function createTaskItemAction(input: {
  taskId: string;
  title: string;
  note?: string | null;
  assignedToUserId?: string | null;
  priority?: TaskPriority | null;
  dueAt?: string | null;
  tagNames?: string[];
  allowDuplicateBlueprint?: boolean;
}) {
  const auth = await getTaskAuth();

  const cleanTaskId = String(input?.taskId || "").trim();
  const cleanTitle = String(input?.title || "").trim();

  if (!cleanTaskId) throw new Error("Missing taskId");
  if (!cleanTitle) throw new Error("Vui lòng nhập nội dung subtask.");

  await assertWorkspaceCreationAllowed({
    taskId: cleanTaskId,
    title: cleanTitle,
    note: input.note ?? null,
    allowDuplicateBlueprint: input.allowDuplicateBlueprint ?? false,
  });

  const item = await createTaskItemRepo(prisma, {
    taskId: cleanTaskId,
    title: cleanTitle,
    note: input.note ?? null,
    ownerUserId: getAuthUserId(auth),
    assignedToUserId: input.assignedToUserId || null,
    priority: input.priority || "MEDIUM",
    dueAt: input.dueAt || null,
    tagNames: input.tagNames ?? [],
  });

  const task = await prisma.task.findUnique({
    where: { id: item.taskId },
    select: {
      id: true,
      title: true,
      kind: true,
      assignedToUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const creator = auth.userId
    ? await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    : null;

  const assignedUser = item.assignedToUserId
    ? await prisma.user.findUnique({
      where: { id: item.assignedToUserId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    : task?.assignedToUser ?? null;

  const taskKindLabel =
    task?.kind === "BUSINESS"
      ? "Kinh doanh"
      : task?.kind === "OPERATION"
        ? "Vận hành"
        : task?.kind === "SERVICE"
          ? "Kỹ thuật / Service"
          : task?.kind === "PERSONAL"
            ? "Cá nhân"
            : task?.kind === "FREE"
              ? "Tự do"
              : "-";

  const tagNames = input.tagNames ?? [];

  await recordBusinessEvent(prisma, {
    eventKey: "task.item.created",
    targetType: "TASK_ITEM",
    targetId: item.id,
    actorUserId: auth.userId,
    payload: {
      taskId: item.taskId,
      taskTitle: task?.title ?? "-",
      taskKind: task?.kind ?? null,
      taskKindLabel,

      taskItemId: item.id,
      taskItemTitle: item.title,

      creatorUserId: auth.userId,
      creatorName: creator?.name || creator?.email || "-",

      assignedToUserId: assignedUser?.id ?? item.assignedToUserId ?? null,
      assignedToName: assignedUser?.name || assignedUser?.email || "-",

      priority: item.priority ?? "MEDIUM",

      dueAt: item.dueAt,
      dueLabel: item.dueAt
        ? new Date(item.dueAt).toLocaleString("vi-VN")
        : "-",

      tagNames,
      tagLabel: tagNames.length ? tagNames.join(", ") : "-",
    },
  });
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${cleanTaskId}`);
  revalidatePath("/admin/task-items");
  revalidatePath("/admin/coordination/operation");
  revalidatePath("/admin/coordination/sales");
  revalidatePath("/admin/coordination/technical");
  revalidatePath("/admin/coordination/general");

  return { ok: true, item };
}
// Backward-compatible alias if old UI still calls createTaskItemAction(taskId, title).
export async function createTaskItemLegacyAction(
  taskId: string,
  title: string,
) {
  return createTaskItemAction({ taskId, title });
}

export async function updateTaskItemAction(
  itemId: string,
  input: UpdateTaskItemInput,
) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await updateTaskItemRepo(prisma, cleanItemId, input);

  let tags: Awaited<ReturnType<typeof setTargetTagsRepo>> = [];

  if (Array.isArray(input.tagNames)) {
    tags = await setTargetTagsRepo(prisma, {
      ownerType: AppTagOwnerType.TASK,
      ownerId: item.taskId,
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: item.id,
      names: input.tagNames,
    });
  }

  await syncTaskStatusFromChecklistRepo(prisma, item.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${item.taskId}`);
  revalidatePath("/admin/task-items");

  return {
    ok: true,
    item: {
      ...item,
      tags,
    },
  };
}

function setSharedUserIdsInNote(note: string | null | undefined, userIds: string[]) {
  const cleanIds = Array.from(
    new Set(userIds.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );
  const lines = String(note ?? "")
    .split(/\r?\n/)
    .filter((line) => !/^sharedUserIds:\s*/i.test(line.trim()));

  if (cleanIds.length) {
    lines.push(`sharedUserIds: ${cleanIds.join(",")}`);
  }

  return lines.join("\n").trim() || null;
}

export async function updateTaskItemSharingAction(input: {
  taskItemId: string;
  sharedUserIds: string[];
}) {
  const auth = await getTaskAuth();
  const actorUserId = getAuthUserId(auth);
  const canViewAll = authCanViewAllTasks(auth);

  const taskItemId = String(input.taskItemId ?? "").trim();
  if (!taskItemId) throw new Error("Missing taskItemId");

  const requestedIds = Array.from(
    new Set(
      (input.sharedUserIds ?? [])
        .map((id) => String(id ?? "").trim())
        .filter(Boolean),
    ),
  );

  const users = requestedIds.length
    ? await prisma.user.findMany({
      where: { id: { in: requestedIds }, isActive: true },
      select: { id: true },
    })
    : [];
  const validIds = users.map((user) => user.id);

  const item = await prisma.taskItem.findUnique({
    where: { id: taskItemId },
    select: {
      id: true,
      taskId: true,
      note: true,
      userId: true,
      assignedToUserId: true,
      task: {
        select: {
          createdByUserId: true,
          assignedToUserId: true,
        },
      },
    },
  });

  if (!item) throw new Error("Phiếu xử lý không tồn tại.");
  if (
    !canViewAll &&
    actorUserId !== item.userId &&
    actorUserId !== item.assignedToUserId &&
    actorUserId !== item.task.createdByUserId &&
    actorUserId !== item.task.assignedToUserId
  ) {
    throw new Error("Bạn không có quyền chia sẻ phiếu xử lý này.");
  }

  await prisma.taskItem.update({
    where: { id: taskItemId },
    data: {
      note: setSharedUserIdsInNote(item.note, validIds),
    },
  });

  revalidatePath("/admin/coordination/operation");
  revalidatePath(`/admin/task-items/${taskItemId}`);
  revalidatePath("/admin/task-items");

  return { ok: true, sharedUserIds: validIds };
}

export async function changeTaskItemStatusAction(
  itemId: string,
  status: TaskStatus,
) {
  return updateTaskItemAction(itemId, { status });
}

export async function changeTaskItemDoneAction(
  itemId: string,
  isDone: boolean,
) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const item = await setTaskItemDoneRepo(prisma, {
    itemId: cleanItemId,
    isDone,
  });

  await syncTaskStatusFromChecklistRepo(prisma, item.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${item.taskId}`);
  revalidatePath("/admin/task-items");

  return { ok: true, item };
}

export async function deleteTaskItemAction(itemId: string) {
  await getTaskAuth();

  const cleanItemId = String(itemId || "").trim();
  if (!cleanItemId) throw new Error("Missing checklist item id");

  const taskItem = await prisma.taskItem.findUnique({
    where: { id: cleanItemId },
    select: { taskId: true },
  });

  const item = await deleteTaskItemRepo(prisma, cleanItemId);

  if (taskItem?.taskId) {
    await syncTaskStatusFromChecklistRepo(prisma, taskItem.taskId);
    revalidatePath(`/admin/tasks/${taskItem.taskId}`);
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/task-items");

  return { ok: true, item };
}

export async function createTaskItemChecklistAction(input: {
  taskItemId: string;
  title: string;
  note?: string | null;
}) {
  await getTaskAuth();

  const taskItemId = String(input.taskItemId || "").trim();
  const title = String(input.title || "").trim();

  if (!taskItemId) throw new Error("Missing taskItemId");
  if (!title) throw new Error("Vui lòng nhập checklist.");

  const checklist = await createTaskItemChecklistRepo(prisma, {
    taskItemId,
    title,
    note: input.note || null,
  });

  return { ok: true, checklist };
}
export async function changeTaskItemChecklistDoneAction(
  checklistId: string,
  isDone: boolean,
) {
  const auth = await getTaskAuth();

  const cleanId = String(checklistId || "").trim();
  if (!cleanId) throw new Error("Missing checklist id");

  const row = await prisma.taskItemChecklist.findUnique({
    where: { id: cleanId },
    select: { taskItemId: true, taskItem: { select: { taskId: true } } },
  });

  if (!row) throw new Error("Checklist không tồn tại.");

  const checklist = await updateTaskItemChecklistRepo(prisma, cleanId, {
    isDone,
    actorUserId: auth.userId,
  });

  await syncTaskItemStatusFromChecklistRepo(
    prisma,
    row.taskItemId,
    auth.userId,
  );
  await syncTaskStatusFromChecklistRepo(prisma, row.taskItem.taskId);

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/task-items");
  revalidatePath(`/admin/tasks/${row.taskItem.taskId}`);

  return { ok: true, checklist };
}


export async function quickCreateTaskItemAction(
  input: {
    kind: TaskKind;
    title: string;

    assignedToUserId?: string | null;
    priority?: TaskPriority;
    dueAt?: string | null;
  },
) {
  const auth = await getTaskAuth();

  const result = await quickCreateTaskItem(
    prisma,
    input,
    auth,
  );

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/task-items");

  return {
    ok: true,
    ...result,
  };
}
export async function updateTaskItemChecklistTitleAction(
  checklistId: string,
  title: string,
) {
  await getTaskAuth();

  const cleanId = String(checklistId || "").trim();
  const cleanTitle = String(title || "").trim();

  if (!cleanId) throw new Error("Missing checklist id");
  if (!cleanTitle) throw new Error("Vui lòng nhập nội dung checklist.");

  const existing = await prisma.taskItemChecklist.findUnique({
    where: { id: cleanId },
    select: { id: true },
  });

  if (!existing) {
    return { ok: true, checklist: null, alreadyDeleted: true };
  }

  const checklist = await updateTaskItemChecklistRepo(prisma, cleanId, {
    title: cleanTitle,
  });

  return { ok: true, checklist, alreadyDeleted: false };
}

export async function deleteTaskItemChecklistAction(checklistId: string) {
  await getTaskAuth();

  const cleanId = String(checklistId || "").trim();
  if (!cleanId) throw new Error("Missing checklist id");

  const existing = await prisma.taskItemChecklist.findUnique({
    where: { id: cleanId },
    select: { id: true },
  });

  if (!existing) {
    return { ok: true, checklist: null, alreadyDeleted: true };
  }

  const checklist = await deleteTaskItemChecklistRepo(prisma, cleanId);

  return { ok: true, checklist, alreadyDeleted: false };
}

export async function moveTaskItemAction(input: {
  itemId: string;
  toTaskId: string;
}) {
  const auth = await getTaskAuth();

  const itemId = String(input.itemId || "").trim();
  const toTaskId = String(input.toTaskId || "").trim();

  if (!itemId) throw new Error("Missing taskItemId");
  if (!toTaskId) throw new Error("Vui lòng chọn task đích.");

  const result = await moveTaskItemRepo(prisma, { itemId, toTaskId });

  await Promise.all([
    syncTaskStatusFromChecklistRepo(prisma, result.fromTaskId),
    syncTaskStatusFromChecklistRepo(prisma, result.toTaskId),
  ]);

  await recordBusinessEvent(prisma, {
    eventKey: "task.item.moved",
    targetType: "TASK_ITEM",
    targetId: result.item.id,
    actorUserId: getAuthUserId(auth),
    payload: {
      taskItemId: result.item.id,
      title: result.item.title,
      fromTaskId: result.fromTaskId,
      toTaskId: result.toTaskId,
      message: `Đã move task item: ${result.item.title}`,
    },
  });

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${result.fromTaskId}`);
  revalidatePath(`/admin/tasks/${result.toTaskId}`);

  return { ok: true, ...result };
}

export async function addTaskItemActivityReplyAction(input: {
  activityId: string;
  body: string;
}) {
  const auth = await getTaskAuth();
  const activityId = String(input.activityId ?? "").trim();
  const body = String(input.body ?? "").trim();

  if (!activityId) throw new Error("Missing activityId");
  if (!body) throw new Error("Vui lòng nhập nội dung trao đổi.");

  const activity = await prisma.taskItemActivity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      title: true,
      body: true,
      sourceType: true,
      sourceId: true,
      metadataJson: true,
      taskItemId: true,
      taskItem: {
        select: {
          id: true,
          title: true,
          status: true,
          taskId: true,
          task: {
            select: {
              id: true,
              title: true,
              periodKey: true,
            },
          },
        },
      },
    },
  });

  const reply = await addActivityReply({
    activityId,
    body,
    actorUserId: getAuthUserId(auth),
  });

  if (activity?.taskItemId) {
    const actor = authActorLabel(auth);
    const actorName = String(actor.name || actor.email || "System");
    const activityMetadata = asRecord(activity.metadataJson);
    const targetType = cleanText(activityMetadata.targetType);
    const targetId = cleanText(activityMetadata.targetId);
    const targetTitle = await resolveActivityTargetTitle({
      targetType,
      targetId,
      metadata: activityMetadata,
    });
    const watchTitle = targetType === TaskExecutionTargetType.WATCH
      ? targetTitle
      : null;

    await recordBusinessEvent(prisma, {
      eventKey: "task.item.activity.commented",
      targetType: "TASK_ITEM",
      targetId: reply.id,
      actorUserId: getAuthUserId(auth),
      payload: {
        taskItemId: activity.taskItemId,
        targetTaskItemId: activity.taskItemId,
        taskItemTitle: activity.taskItem?.title ?? null,
        taskItemStatus: activity.taskItem?.status ?? null,
        targetType: targetType || null,
        targetId: targetId || null,
        targetTitle,
        watchTitle,
        route: `/admin/task-items/${activity.taskItemId}?tab=activity`,
        taskId: activity.taskItem?.taskId ?? null,
        taskTitle: activity.taskItem?.task?.title ?? null,
        periodKey: activity.taskItem?.task?.periodKey ?? null,
        activityId: activity.id,
        activityTitle: activity.title,
        activityBody: activity.body ?? null,
        activitySourceType: activity.sourceType,
        activitySourceId: activity.sourceId ?? null,
        replyId: reply.id,
        replyBody: reply.body,
        actorName,
        message: `${actorName} commented on ${activity.taskItem?.title ?? "workspace activity"}: ${reply.body}`,
      },
    });
  }

  revalidatePath("/admin/task-items");
  if (activity?.taskItemId) {
    revalidatePath(`/admin/task-items/${activity.taskItemId}`);
  }

  return { ok: true, reply };
}

export async function applyQueueItemManualTransitionAction(input: {
  bindingId: string;
  actionKey?: string | null;
  toState?: string | null;
  note?: string | null;
}) {
  const auth = await getTaskAuth();
  const bindingId = String(input.bindingId ?? "").trim();
  const actionKey = String(input.actionKey ?? "").trim();
  const toState = String(input.toState ?? "").trim();

  if (!bindingId) throw new Error("Missing bindingId");
  if (!actionKey && !toState) throw new Error("Missing manual workflow action");

  let result = await applyManualWorkflowAction(prisma, {
    bindingId,
    actionKey,
    toState,
    actorUserId: getAuthUserId(auth),
    actorLabel: auth?.user?.name ?? auth?.name ?? auth?.user?.email ?? auth?.email ?? null,
    note: input.note ?? null,
  });

  if (
    result.applied &&
    result.workflowKey === "watch-photography" &&
    result.toState === "IN_PROGRESS"
  ) {
    const nextResult = await applyManualWorkflowAction(prisma, {
      bindingId,
      actionKey: "mark-done",
      actorUserId: getAuthUserId(auth),
      actorLabel: auth?.user?.name ?? auth?.name ?? auth?.user?.email ?? auth?.email ?? null,
      note: input.note ?? null,
    });

    if (nextResult.applied) {
      result = nextResult;
    }
  }

  const workflowProcessorResult = await processManualWorkspaceWorkflowTransition(
    prisma,
    {
      bindingId,
      transition: result,
      actorUserId: getAuthUserId(auth),
      note: input.note ?? null,
    },
  );

  if (workflowProcessorResult.affectedProductIds.length) {
    revalidatePath("/admin/watches");
    for (const productId of workflowProcessorResult.affectedProductIds) {
      revalidatePath(`/admin/watches/${productId}`);
      revalidatePath(`/admin/watches/${productId}/edit`);
    }
  }

  revalidatePath("/admin/task-items");
  if (result.applied && result.taskItemId) {
    revalidatePath(`/admin/task-items/${result.taskItemId}`);
  }

  return {
    ok: true,
    result,
    mediaProcessingResult: workflowProcessorResult.mediaProcessingResult,
    workflowProcessorResult,
  };
}

export async function applyQueueItemManualTransitionsAction(input: {
  items: Array<{
    bindingId: string;
    actionKey?: string | null;
    toState?: string | null;
    note?: string | null;
  }>;
}) {
  const items = (input.items ?? [])
    .map((item) => ({
      bindingId: String(item.bindingId ?? "").trim(),
      actionKey: String(item.actionKey ?? "").trim(),
      toState: String(item.toState ?? "").trim(),
      note: item.note ?? null,
    }))
    .filter((item) => item.bindingId && (item.actionKey || item.toState));

  if (!items.length) throw new Error("Missing manual workflow items");

  const results: Array<{
    bindingId: string;
    ok: boolean;
    reason?: string;
  }> = [];

  for (const item of items) {
    try {
      const result = await applyQueueItemManualTransitionAction(item);
      results.push({
        bindingId: item.bindingId,
        ok: Boolean(result.result.applied),
        reason: result.result.applied ? undefined : result.result.reason,
      });
    } catch (error) {
      results.push({
        bindingId: item.bindingId,
        ok: false,
        reason: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      });
    }
  }

  revalidatePath("/admin/task-items");

  return {
    ok: results.every((result) => result.ok),
    applied: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  };
}

export async function searchManualQueueTargetsAction(input: {
  targetType: string;
  keyword?: string | null;
  limit?: number | null;
}) {
  await getTaskAuth();
  const items = await searchManualQueueTargets(prisma, {
    targetType: String(input.targetType ?? "").trim() as BusinessBindingTargetType,
    keyword: input.keyword ?? null,
    limit: input.limit ?? null,
  });

  return { ok: true, items };
}

export async function addManualQueueItemAction(input: {
  taskItemId: string;
  targetType: string;
  targetId: string;
  intakeNote?: string | null;
}) {
  const auth = await getTaskAuth();
  const taskItemId = String(input.taskItemId ?? "").trim();
  const targetId = String(input.targetId ?? "").trim();
  const targetType = String(input.targetType ?? "").trim();

  if (!taskItemId) throw new Error("Missing taskItemId");
  if (!targetType) throw new Error("Vui lòng chọn loại nghiệp vụ.");
  if (!targetId) throw new Error("Vui lòng chọn nghiệp vụ.");

  const result = await addManualQueueItem(prisma, {
    taskItemId,
    targetType: targetType as BusinessBindingTargetType,
    targetId,
    intakeNote: input.intakeNote ?? null,
    actorUserId: getAuthUserId(auth),
    actor: authActorLabel(auth),
  });

  revalidatePath("/admin/task-items");
  revalidatePath(`/admin/task-items/${taskItemId}`);

  return { ok: true, result };
}
export async function searchTasksForTaskItemMoveAction(input: {
  keyword?: string | null;
  excludeTaskId?: string | null;
  limit?: number | null;
}) {
  const auth = await getTaskAuth();
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được user hiện tại.");

  const keyword = String(input.keyword ?? "").trim();
  const excludeTaskId = String(input.excludeTaskId ?? "").trim();
  const limit = Math.min(30, Math.max(5, Number(input.limit || 15)));
  const canViewAll = authCanViewAllTasks(auth);

  const where: Prisma.TaskWhereInput = {
    AND: [
      buildAccessWhere(userId, canViewAll),
      excludeTaskId ? { id: { not: excludeTaskId } } : {},
      { status: { not: TaskStatus.CANCELLED } },
      keyword
        ? {
          OR: [
            { id: keyword },
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }
        : {},
    ],
  };

  const items = await prisma.task.findMany({
    where,
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      kind: true,
      dueAt: true,
      assignedToUser: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { taskItems: true },
      },
    },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { updatedAt: "desc" },
    ],
    take: limit,
  });

  return { ok: true, items };
}
