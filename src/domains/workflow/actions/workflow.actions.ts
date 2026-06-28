"use server";

import {
  WorkflowActionType,
  WorkflowConditionStrategy,
  WorkflowTemplateStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { AppTagOwnerType, AppTagScope } from "@prisma/client";
import { tagSlug } from "@/domains/task/server/tag/task-tag.repo";


export type WorkflowTemplateInput = {
  id?: string | null;
  name: string;
  description?: string | null;
  status?: WorkflowTemplateStatus;
  strategy?: WorkflowConditionStrategy;
  conditions: Array<{
    eventKey: string;
    targetType?: string | null;
  }>;
  actions: Array<{
    actionType: WorkflowActionType;
  }>;
};

export async function listWorkflowTemplatesAction() {
  await requirePermission("TASK_VIEW");

  const items = await prisma.workflowTemplate.findMany({
    include: {
      conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      _count: { select: { tags: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return { ok: true, items };
}

export async function saveWorkflowTemplateAction(input: WorkflowTemplateInput) {
  await requirePermission("TASK_VIEW");

  const name = String(input.name || "").trim();
  if (!name) throw new Error("Vui lòng nhập tên workflow.");

  const conditions = (input.conditions ?? [])
    .map((x) => ({
      eventKey: String(x.eventKey || "").trim(),
      targetType: x.targetType ? String(x.targetType).trim() : null,
    }))
    .filter((x) => x.eventKey);

  const actions = (input.actions ?? []).filter((x) => x.actionType);

  if (!conditions.length) throw new Error("Workflow cần ít nhất 1 điều kiện.");
  if (!actions.length) throw new Error("Workflow cần ít nhất 1 action.");

  const data = {
    name,
    description: input.description?.trim() || null,
    status: input.status ?? WorkflowTemplateStatus.ACTIVE,
    strategy: input.strategy ?? WorkflowConditionStrategy.ALL,
  };

  const id = input.id ? String(input.id).trim() : "";

  const workflow = id
    ? await prisma.$transaction(async (tx) => {
      await tx.workflowCondition.deleteMany({ where: { workflowId: id } });
      await tx.workflowAction.deleteMany({ where: { workflowId: id } });

      return tx.workflowTemplate.update({
        where: { id },
        data: {
          ...data,
          conditions: {
            create: conditions.map((condition, index) => ({
              eventKey: condition.eventKey,
              targetType: condition.targetType,
              sortOrder: index * 10,
            })),
          },
          actions: {
            create: actions.map((action, index) => ({
              actionType: action.actionType,
              sortOrder: index * 10,
            })),
          },
        },
        include: {
          conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
          actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
          _count: { select: { tags: true } },
        },
      });
    })
    : await prisma.workflowTemplate.create({
      data: {
        ...data,
        conditions: {
          create: conditions.map((condition, index) => ({
            eventKey: condition.eventKey,
            targetType: condition.targetType,
            sortOrder: index * 10,
          })),
        },
        actions: {
          create: actions.map((action, index) => ({
            actionType: action.actionType,
            sortOrder: index * 10,
          })),
        },
      },
      include: {
        conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        _count: { select: { tags: true } },
      },
    });

  revalidatePath("/admin/workflows");
  revalidatePath("/admin/tasks");

  return { ok: true, workflow };
}

export async function deleteWorkflowTemplateAction(id: string) {
  await requirePermission("TASK_VIEW");

  const cleanId = String(id || "").trim();
  if (!cleanId) throw new Error("Missing workflow id");

  await prisma.workflowTemplate.delete({
    where: { id: cleanId },
  });

  revalidatePath("/admin/workflows");
  revalidatePath("/admin/tasks");

  return { ok: true };
}
export async function assignWorkflowTemplateToTagAction(input: {
  taskId: string;
  tagId?: string | null;
  tagName: string;
  workflowTemplateId: string | null;
}) {
  await requirePermission("TASK_VIEW");

  const taskId = String(input.taskId || "").trim();
  const tagName = String(input.tagName || "").trim();

  if (!taskId) throw new Error("Missing taskId");
  if (!tagName) throw new Error("Missing tagName");

  const tag = await prisma.appTag.findFirst({
    where: {
      ...(input.tagId ? { id: input.tagId } : {}),
      name: tagName,
      ownerType: "TASK",
      ownerId: taskId,
    },
  });

  if (!tag) throw new Error("Không tìm thấy tag để gắn workflow.");

  const updated = await prisma.appTag.update({
    where: { id: tag.id },
    data: {
      workflowTemplateId: input.workflowTemplateId || null,
    },
    include: {
      workflowTemplate: {
        include: {
          conditions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
          actions: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        },
      },
    },
  });

  revalidatePath("/admin/tasks");

  return { ok: true, tag: updated };
}