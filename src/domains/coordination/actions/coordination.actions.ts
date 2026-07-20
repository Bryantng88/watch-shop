"use server";

import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import type { CoordinationContext } from "../server/coordination-cycle.types";
import { normalizeWorkTypeKey } from "@/domains/task/server/work-type.service";
import { rolloverPreviousCycleItems } from "../server/coordination-rollover.service";

function clean(value: unknown) {
  return String(value ?? "").trim();
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
    key: normalizeWorkTypeKey(blueprintKey),
    source: String(blueprintSource || "REGISTRY").trim().toUpperCase(),
  };
}

function sameBlueprint(
  left: ReturnType<typeof blueprintIdentityFromNote>,
  right: ReturnType<typeof blueprintIdentityFromNote>,
) {
  return Boolean(left && right && left.key === right.key && left.source === right.source);
}

function setAutoBindingReceiverNote(note: string | null | undefined, enabled: boolean) {
  const lines = String(note ?? "")
    .split(/\r?\n/)
    .filter((line) => !/^blueprintAutoBindingReceiver:\s*/i.test(line.trim()));

  if (enabled) lines.push("blueprintAutoBindingReceiver: true");

  return lines.join("\n").trim() || null;
}

function uniqueShareIds(userIds: string[]) {
  return Array.from(
    new Set(userIds.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );
}

function workTypeKeyFromNote(note?: string | null) {
  return String(note ?? "").match(/^workTypeKey:\s*([a-z0-9-]+)/im)?.[1] ?? null;
}

function coreFlowScopeKeyFromNote(note?: string | null) {
  const explicit = String(note ?? "").match(/^coreFlowKey:\s*([a-z0-9-]+)/im)?.[1] ?? null;
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  return explicit ?? snapshot?.coreFlowKey ?? workTypeKeyFromNote(note);
}

function setShareUserIdsInNote(
  note: string | null | undefined,
  lineKey: string,
  userIds: string[],
) {
  const cleanIds = uniqueShareIds(userIds);
  const escapedKey = lineKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linePattern = new RegExp(`^${escapedKey}:\\s*`, "i");
  const lines = String(note ?? "")
    .split(/\r?\n/)
    .filter((line) => !linePattern.test(line.trim()));

  if (cleanIds.length) {
    lines.push(`${lineKey}: ${cleanIds.join(",")}`);
  }

  return lines.join("\n").trim() || null;
}

function contextPath(context: CoordinationContext) {
  if (context === "SALES") return "sales";
  if (context === "TECHNICAL") return "technical";
  if (context === "MEDIA") return "media";
  if (context === "PAYMENT") return "payment";
  if (context === "GENERAL") return "general";
  return "operation";
}

export async function setWorkspaceAutoBindingReceiverAction(input: {
  taskId: string;
  taskItemId: string | null;
  context: CoordinationContext;
  blueprintKey: string;
  blueprintSource: string;
}) {
  await requirePermission("TASK_VIEW");

  const taskId = clean(input.taskId);
  const taskItemId = clean(input.taskItemId);
  const requestedBlueprint = {
    key: normalizeWorkTypeKey(input.blueprintKey),
    source: clean(input.blueprintSource || "REGISTRY").toUpperCase(),
  };

  if (!taskId) throw new Error("Missing taskId");
  if (!requestedBlueprint.key) throw new Error("Missing blueprintKey");

  const items = await prisma.taskItem.findMany({
    where: {
      taskId,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      id: true,
      note: true,
      status: true,
    },
  });

  const matchingItems = items.filter((item) =>
    sameBlueprint(blueprintIdentityFromNote(item.note), requestedBlueprint),
  );

  if (taskItemId) {
    const receiver = matchingItems.find(
      (item) => item.id === taskItemId && item.status !== TaskStatus.DONE,
    );
    if (!receiver) {
      throw new Error("Workspace được chọn không còn active hoặc không thuộc Blueprint này.");
    }
  }

  await prisma.$transaction(
    matchingItems.map((item) =>
      prisma.taskItem.update({
        where: { id: item.id },
        data: {
          note: setAutoBindingReceiverNote(item.note, Boolean(taskItemId && item.id === taskItemId)),
        },
      }),
    ),
  );

  revalidatePath(`/admin/coordination/${contextPath(input.context)}`);
  if (taskItemId) revalidatePath(`/admin/task-items/${taskItemId}`);

  return { ok: true, receiverId: taskItemId || null };
}

export async function updateSpaceSharingAction(input: {
  taskId: string;
  context: CoordinationContext;
  sharingScope: "SPACE" | "CORE_FLOW";
  coreFlowKey?: string | null;
  sharedUserIds: string[];
}) {
  await requirePermission("TASK_VIEW");

  const taskId = clean(input.taskId);
  const sharingScope = input.sharingScope;
  const coreFlowKey = normalizeWorkTypeKey(input.coreFlowKey);
  const requestedIds = uniqueShareIds(input.sharedUserIds ?? []);

  if (!taskId) throw new Error("Missing taskId");
  if (sharingScope === "CORE_FLOW" && !coreFlowKey) {
    throw new Error("Missing coreFlowKey");
  }

  const users = requestedIds.length
    ? await prisma.user.findMany({
      where: { id: { in: requestedIds }, isActive: true },
      select: { id: true },
    })
    : [];
  const validIds = users.map((user) => user.id);

  const items = await prisma.taskItem.findMany({
    where: {
      taskId,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      id: true,
      note: true,
    },
  });

  const targetItems =
    sharingScope === "SPACE"
      ? items
      : items.filter((item) => coreFlowScopeKeyFromNote(item.note) === coreFlowKey);
  const lineKey =
    sharingScope === "SPACE"
      ? "spaceSharedUserIds"
      : `coreFlowSharedUserIds:${coreFlowKey}`;

  await prisma.$transaction(
    targetItems.map((item) =>
      prisma.taskItem.update({
        where: { id: item.id },
        data: {
          note: setShareUserIdsInNote(item.note, lineKey, validIds),
        },
      }),
    ),
  );

  revalidatePath(`/admin/coordination/${contextPath(input.context)}`);
  revalidatePath("/admin/task-items");

  return { ok: true, sharedUserIds: validIds };
}

export async function rolloverPreviousCycleItemsAction(input: {
  taskId: string;
  context: CoordinationContext;
}) {
  const user = await requirePermission("TASK_VIEW");

  const result = await rolloverPreviousCycleItems(prisma, {
    taskId: input.taskId,
    context: input.context,
    actorUserId: user.id,
  });

  revalidatePath(`/admin/coordination/${contextPath(input.context)}`);

  return result;
}

export async function previewRolloverPreviousCycleItemsAction(input: {
  taskId: string;
  context: CoordinationContext;
}) {
  await requirePermission("TASK_VIEW");

  return rolloverPreviousCycleItems(prisma, {
    taskId: input.taskId,
    context: input.context,
    dryRun: true,
  });
}

export async function updateTechnicalIssuePriorityAction(input: {
  issueId: string;
  priority: "URGENT" | "NORMAL";
  context: CoordinationContext;
}) {
  await requirePermission("TASK_VIEW");

  const issueId = clean(input.issueId);
  const priority = input.priority === "URGENT" ? "URGENT" : "NORMAL";

  if (!issueId) throw new Error("Missing issueId");

  await prisma.technicalIssue.update({
    where: { id: issueId },
    data: { priority },
  });

  revalidatePath(`/admin/coordination/${contextPath(input.context)}`);
  revalidatePath("/admin/services");

  return { ok: true, issueId, priority };
}
