"use server";

import {
  Prisma,
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskPriority,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma, withDbTransaction } from "@/server/db/client";
import { ensureCoordinationCycle } from "@/domains/coordination/server/coordination-cycle.service";
import { createTaskItemRepo } from "@/domains/task/server/core/task-item.repo";
import { ensureTaskItemReferenceBinding } from "@/domains/task/server/business-binding.service";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { getTaskQuickCreateData } from "@/domains/task/server/core/task.service";

export type AdHocWorkTarget = {
  targetType: TaskExecutionTargetType;
  targetId: string;
  title: string;
  ref?: string | null;
  imageUrl?: string | null;
  href?: string | null;
};

export async function listAdHocWorkAssigneesAction() {
  const auth = await requirePermission("TASK_VIEW");
  return getTaskQuickCreateData(prisma, auth);
}

export async function createAdHocWorkAction(input: {
  request: string;
  detail?: string | null;
  priority?: TaskPriority;
  dueAt?: string | null;
  assignedToUserId?: string | null;
  target?: AdHocWorkTarget | null;
}) {
  const auth = await requirePermission("TASK_VIEW");
  const request = String(input.request ?? "").trim();
  const detail = String(input.detail ?? "").trim();
  if (!request) throw new Error("Vui lòng nhập yêu cầu cần thực hiện.");

  const result = await withDbTransaction(prisma, async (tx) => {
    const creator = auth.userId
      ? await tx.user.findUnique({
          where: { id: auth.userId },
          select: { id: true, name: true, email: true, avatarUrl: true },
        })
      : null;
    const requestedAssigneeId =
      input.assignedToUserId === undefined
        ? auth.userId
        : String(input.assignedToUserId ?? "").trim() || null;
    const assignedUser = requestedAssigneeId
      ? await tx.user.findFirst({
          where: { id: requestedAssigneeId, isActive: true },
          select: { id: true, name: true, email: true, avatarUrl: true },
        })
      : null;
    if (requestedAssigneeId && !assignedUser) {
      throw new Error("Người xử lý không tồn tại hoặc đã ngừng hoạt động.");
    }
    const operationSpace = await ensureCoordinationCycle(tx, {
      context: "OPERATION",
      provisionWorkTickets: false,
    });
    const note = [
      "workTypeKey: ad-hoc-work",
      "blueprintKey: ad-hoc-work",
      "blueprintSource: REGISTRY",
      "workspaceKind: STANDALONE_WORKSPACE",
      "operationWorkspaceRole: AD_HOC_WORK",
      "ownerType: USER",
      "shareGroupKey: operation",
      "workspaceType: ad-hoc-work",
      "itemLabel: Việc phát sinh",
      "defaultView: items",
      input.target ? `identityTargetType: ${input.target.targetType}` : null,
      detail ? `requestDetail: ${detail.replace(/\r?\n/g, " ")}` : null,
    ].filter(Boolean).join("\n");

    const item = await createTaskItemRepo(tx, {
      taskId: operationSpace.task.id,
      title: request,
      note,
      ownerUserId: auth.userId,
      assignedToUserId: assignedUser?.id ?? null,
      priority: input.priority ?? "MEDIUM",
      dueAt: input.dueAt ?? null,
      tagNames: ["Việc phát sinh"],
    });

    let bindingId: string | null = null;
    if (input.target?.targetId) {
      const binding = await ensureTaskItemReferenceBinding(tx, {
        taskId: operationSpace.task.id,
        taskItemId: item.id,
        targetType: input.target.targetType,
        targetId: input.target.targetId,
        actionType: TaskExecutionActionType.LINKED,
        createdByUserId: auth.userId,
        note: detail || null,
        metadataJson: {
          source: "MANUAL",
          workTypeKey: "ad-hoc-work",
          targetTitle: input.target.title,
          targetRef: input.target.ref ?? null,
          targetImageUrl: input.target.imageUrl ?? null,
          targetHref: input.target.href ?? null,
          intakeNote: detail || request,
          addedBy: auth.userId,
          addedAt: new Date().toISOString(),
        } satisfies Prisma.InputJsonObject,
      });
      bindingId = binding.binding.id;
    }

    await recordBusinessEvent(tx, {
      eventKey: "task.item.created",
      targetType: "TASK_ITEM",
      targetId: item.id,
      actorUserId: auth.userId,
      payload: {
        taskId: operationSpace.task.id,
        taskTitle: operationSpace.task.title,
        taskKind: operationSpace.task.kind,
        taskKindLabel: "Vận hành",
        taskItemId: item.id,
        taskItemTitle: item.title,
        creatorUserId: auth.userId,
        creatorName: creator?.name || creator?.email || "-",
        creatorAvatarUrl: creator?.avatarUrl ?? null,
        assignedToUserId: assignedUser?.id ?? null,
        assignedToName: assignedUser?.name || assignedUser?.email || "Chưa gán",
        assignedToAvatarUrl: assignedUser?.avatarUrl ?? null,
        priority: item.priority,
        dueAt: item.dueAt,
        dueLabel: item.dueAt ? new Date(item.dueAt).toLocaleString("vi-VN") : "-",
        tagNames: ["Việc phát sinh"],
        tagLabel: "Việc phát sinh",
        workspaceKind: "STANDALONE_WORKSPACE",
        operationWorkspaceRole: "AD_HOC_WORK",
        workTypeKey: "ad-hoc-work",
        bindingId,
        businessTarget: input.target ?? null,
      },
    });

    return { id: item.id, taskId: operationSpace.task.id };
  });

  revalidatePath("/admin/coordination/operation");
  revalidatePath("/admin/watches");
  revalidatePath("/admin/acquisitions");
  revalidatePath("/admin/orders");
  return { ok: true, ...result };
}
