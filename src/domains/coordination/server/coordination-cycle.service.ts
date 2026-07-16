import { TaskKind, TaskPeriod, TaskSource, TaskStatus } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  listWorkTypes,
  normalizeWorkTypeKey,
} from "@/domains/task/server/work-type.service";
import { eventBindingsForWorkType } from "@/domains/blueprint/shared/event-bindings";
import {
  shouldAutoCreateOnSpaceOpened,
  workspaceProvisioningForWorkType,
} from "@/domains/blueprint/shared/workspace-provisioning";
import type { WorkTypeDefinition } from "@/domains/task/server/work-type.types";
import type {
  CoordinationContext,
  CoordinationWeekRange,
  EnsureCoordinationCycleInput,
  EnsureCoordinationCycleResult,
  ResolveCurrentCoordinationCycleInput,
  ResolveCurrentCoordinationCycleResult,
} from "./coordination-cycle.types";

const COORDINATION_CYCLE_TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  source: true,
  kind: true,
  periodType: true,
  periodKey: true,
  status: true,
} as const;

const COORDINATION_WORK_TICKET_SELECT = {
  id: true,
  taskId: true,
  title: true,
  note: true,
  sortOrder: true,
  status: true,
} as const;

const DEFAULT_SYSTEM_SHARE_GROUP_BY_CONTEXT: Record<CoordinationContext, string> = {
  OPERATION: "operation",
  SALES: "sales",
  TECHNICAL: "technical",
  MEDIA: "media",
  PAYMENT: "payment",
  GENERAL: "general",
};

const SERVICE_OPERATION_TECHNICAL_WORKSPACES = [
  { role: "INSPECT", title: "Service Operation - Inspect", sortOrder: 55 },
  { role: "PROCESSING", title: "Service Operation - Processing", sortOrder: 56 },
  { role: "DONE", title: "Service Operation - Done / Follow-up", sortOrder: 57 },
] as const;

const PAYMENT_COLLECTION_WORKSPACES = [
  {
    role: "PAYMENT_INBOX",
    title: "Payment Collection - Inbox",
    flowStageKey: "payment-inbox",
    flowStageOrder: 10,
    sortOrder: 10,
  },
  {
    role: "PAYMENT_REVIEW",
    title: "Payment Collection - Review",
    flowStageKey: "payment-review",
    flowStageOrder: 20,
    sortOrder: 20,
  },
  {
    role: "PAYMENT_SETTLED",
    title: "Payment Collection - Settled / Exception",
    flowStageKey: "payment-settled",
    flowStageOrder: 30,
    sortOrder: 30,
  },
] as const;

function startOfUtcDate(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function contextToTaskKind(context: CoordinationContext) {
  if (context === "OPERATION") return TaskKind.OPERATION;
  if (context === "TECHNICAL") return TaskKind.SERVICE;

  return TaskKind.BUSINESS;
}

function sharedUserIdsFromNote(note?: string | null) {
  return Array.from(
    new Set(
      String(note ?? "")
        .match(/^sharedUserIds:\s*(.+)$/im)?.[1]
        ?.split(",")
        .map((item) => item.trim())
        .filter(Boolean) ?? [],
    ),
  );
}

function workTypeNote(
  workType: WorkTypeDefinition,
  sharedUserIds: string[] = [],
  options: {
    extraLines?: string[];
    eventTargetTypes?: string[];
    workspaceType?: string;
    itemLabel?: string;
  } = {},
) {
  const eventTargetTypes = new Set(
    (options.eventTargetTypes ?? []).map((value) => value.trim().toUpperCase()),
  );
  const eventBindings = eventBindingsForWorkType({
    workTypeKey: workType.key,
    coordinationContext: workType.coordinationContext,
  }).filter((binding) =>
    eventTargetTypes.size
      ? eventTargetTypes.has(String(binding.targetType ?? "").toUpperCase())
      : true,
  );
  const provisioning = workspaceProvisioningForWorkType({
    workTypeKey: workType.key,
    coordinationContext: workType.coordinationContext,
    enabled: workType.enabled,
  });
  const lines = [
    `workTypeKey: ${workType.key}`,
    "ownerType: SYSTEM",
    `shareGroupKey: ${DEFAULT_SYSTEM_SHARE_GROUP_BY_CONTEXT[workType.coordinationContext]}`,
    ...(options.extraLines ?? []),
  ];

  if (workType.workflowKey) {
    lines.push(`workflowKey: ${workType.workflowKey}`);
  }

  if (sharedUserIds.length) {
    lines.push(`sharedUserIds: ${sharedUserIds.join(",")}`);
  }

  if (eventBindings.length) {
    lines.push("blueprintAutoBindingReceiver: true");

    const metadata = workType.metadata ?? {};
    const workspaceType =
      options.workspaceType ??
      (typeof metadata.workspaceType === "string"
        ? metadata.workspaceType
        : `${workType.title} Workspace`);
    const itemLabel =
      options.itemLabel ??
      (typeof metadata.itemLabel === "string"
        ? metadata.itemLabel
        : `${workType.title} Items`);
    const defaultView =
      typeof metadata.defaultView === "string" ? metadata.defaultView : "items";
    const workspaceDefinition = {
      defaultName: workType.title,
      defaultDescription:
        typeof metadata.description === "string"
          ? metadata.description
          : null,
      workspaceType,
      itemLabel,
      defaultView,
      provisioning,
      eventBindings,
    };
    const snapshot = {
      blueprintKey: workType.key,
      blueprintName: workType.title,
      blueprintSource: "REGISTRY",
      workTypeKey: workType.key,
      coordinationContext: workType.coordinationContext,
      workflowKey: workType.workflowKey ?? null,
      workspaceDefinition,
      provisioning,
      eventBindings,
      itemLabel: workspaceDefinition.itemLabel,
      defaultView: workspaceDefinition.defaultView,
      workspaceType: workspaceDefinition.workspaceType,
      snapshotAt: new Date().toISOString(),
    };

    lines.push(`blueprintKey: ${workType.key}`);
    lines.push("blueprintSource: REGISTRY");
    lines.push(`blueprintSnapshot: ${JSON.stringify(snapshot)}`);
  }

  return lines.join("\n");
}

function noteHasBlueprintEventBindings(note: string | null | undefined) {
  return /blueprintSnapshot:\s*/i.test(String(note ?? "")) &&
    /"eventBindings"\s*:/i.test(String(note ?? ""));
}

async function listAdminUserIds(db: DB) {
  const users = await dbOrTx(db).user.findMany({
    where: {
      isActive: true,
      roles: {
        some: {
          OR: [
            { name: { equals: "ADMIN", mode: "insensitive" } },
            {
              permissions: {
                some: { code: { equals: "ADMIN", mode: "insensitive" } },
              },
            },
          ],
        },
      },
    },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  return users.map((user) => user.id);
}

function shouldAutoCreateWorkTicket(workType: WorkTypeDefinition) {
  return shouldAutoCreateOnSpaceOpened(
    workspaceProvisioningForWorkType({
      workTypeKey: workType.key,
      coordinationContext: workType.coordinationContext,
      enabled: workType.enabled,
    }),
  );
}

export function getWeekRange(date = new Date()): CoordinationWeekRange {
  const current = startOfUtcDate(date);
  const day = current.getUTCDay() || 7;
  const startDate = new Date(current);
  startDate.setUTCDate(current.getUTCDate() - day + 1);

  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 6);
  endDate.setUTCHours(23, 59, 59, 999);

  const weekDate = new Date(startDate);
  weekDate.setUTCDate(startDate.getUTCDate() + 3);

  const yearStart = new Date(Date.UTC(weekDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((weekDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  const year = weekDate.getUTCFullYear();

  return {
    weekLabel: `Tuần ${weekNumber}`,
    startDate,
    endDate,
    year,
    weekNumber,
    periodKey: `${year}-W${String(weekNumber).padStart(2, "0")}`,
  };
}

export function getCoordinationCycleTitle(
  context: CoordinationContext,
  weekNumber: number,
) {
  if (context === "OPERATION") return `Vận hành tuần ${weekNumber}`;
  if (context === "SALES") return `Bán hàng tuần ${weekNumber}`;
  if (context === "TECHNICAL") return `Kỹ thuật tuần ${weekNumber}`;

  return `Khác tuần ${weekNumber}`;
}

function getCoordinationCycleRuntimeTitle(
  context: CoordinationContext,
  weekNumber: number,
) {
  if (context === "OPERATION") return `Vận hành tuần ${weekNumber}`;
  if (context === "SALES") return `Bán hàng tuần ${weekNumber}`;
  if (context === "TECHNICAL") return `Kỹ thuật tuần ${weekNumber}`;
  if (context === "MEDIA") return `Media tuần ${weekNumber}`;
  if (context === "PAYMENT") return `Thanh toán tuần ${weekNumber}`;

  return `Tổng quát tuần ${weekNumber}`;
}

async function findCoordinationCycleTask(
  db: DB,
  input: {
    context: CoordinationContext;
    week: CoordinationWeekRange;
  },
) {
  const title = getCoordinationCycleRuntimeTitle(
    input.context,
    input.week.weekNumber,
  );

  return dbOrTx(db).task.findFirst({
    where: {
      title,
      kind: contextToTaskKind(input.context),
      periodType: TaskPeriod.WEEKLY,
      periodKey: input.week.periodKey,
      status: { not: TaskStatus.CANCELLED },
    },
    select: COORDINATION_CYCLE_TASK_SELECT,
    orderBy: [
      { source: "asc" },
      { createdAt: "asc" },
    ],
  });
}

async function listWorkTicketsForCycle(
  db: DB,
  input: {
    taskId: string;
    context: CoordinationContext;
  },
) {
  const activeWorkTypeKeys = new Set(
    listWorkTypes(input.context).map((workType) => normalizeWorkTypeKey(workType.key)),
  );
  const items = await dbOrTx(db).taskItem.findMany({
    where: { taskId: input.taskId },
    select: COORDINATION_WORK_TICKET_SELECT,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return items.filter((item) => {
    const workTypeKey = getWorkTypeKeyFromTicketNote(item.note);
    if (!workTypeKey) return true;
    return activeWorkTypeKeys.has(workTypeKey);
  });
}

export async function resolveCoordinationCycle(
  db: DB,
  input: ResolveCurrentCoordinationCycleInput,
): Promise<ResolveCurrentCoordinationCycleResult | null> {
  const week = getWeekRange(input.date);
  const task = await findCoordinationCycleTask(db, {
    context: input.context,
    week,
  });

  if (!task) return null;

  return {
    task,
    week,
    context: input.context,
  };
}

export async function ensureWorkTickets(
  db: DB,
  input: {
    taskId: string;
    context: CoordinationContext;
  },
) {
  const client = dbOrTx(db);
  const existing = await listWorkTicketsForCycle(client, input);
  const existingByTitle = new Map(existing.map((item) => [item.title.trim(), item]));
  const existingTitles = new Set(existingByTitle.keys());
  const adminUserIds = await listAdminUserIds(client);
  let createdCount = 0;

  for (const workType of listWorkTypes(input.context)) {
    if (!shouldAutoCreateWorkTicket(workType)) continue;

    if (
      input.context === "TECHNICAL" &&
      normalizeWorkTypeKey(workType.key) === "service-operation"
    ) {
      for (const technicalWorkspace of SERVICE_OPERATION_TECHNICAL_WORKSPACES) {
        const existingItem = existingByTitle.get(technicalWorkspace.title);
        const note = workTypeNote(workType, adminUserIds, {
          extraLines: [
            `serviceOperationWorkspaceRole: ${technicalWorkspace.role}`,
          ],
          eventTargetTypes: ["TECHNICAL_ISSUE"],
          workspaceType: `${technicalWorkspace.title} Workspace`,
          itemLabel: "Technical Issue Operation",
        });

        if (existingItem) {
          const nextSharedUserIds = Array.from(
            new Set([...sharedUserIdsFromNote(existingItem.note), ...adminUserIds]),
          );
          const nextNote = workTypeNote(workType, nextSharedUserIds, {
            extraLines: [
              `serviceOperationWorkspaceRole: ${technicalWorkspace.role}`,
            ],
            eventTargetTypes: ["TECHNICAL_ISSUE"],
            workspaceType: `${technicalWorkspace.title} Workspace`,
            itemLabel: "Technical Issue Operation",
          });

          if (
            nextNote !== existingItem.note &&
            (nextSharedUserIds.length > sharedUserIdsFromNote(existingItem.note).length ||
              (nextNote.includes("blueprintSnapshot:") &&
                !noteHasBlueprintEventBindings(existingItem.note)))
          ) {
            await client.taskItem.update({
              where: { id: existingItem.id },
              data: { note: nextNote },
            });
          }
          continue;
        }

        const createdItem = await client.taskItem.create({
          data: {
            taskId: input.taskId,
            title: technicalWorkspace.title,
            note,
            status: TaskStatus.TODO,
            priority: "MEDIUM",
            assignedToUserId: null,
            sortOrder: technicalWorkspace.sortOrder,
          },
        });

        existingByTitle.set(technicalWorkspace.title, createdItem);
        existingTitles.add(technicalWorkspace.title);
        createdCount += 1;
      }

      continue;
    }

    if (
      input.context === "PAYMENT" &&
      normalizeWorkTypeKey(workType.key) === "payment"
    ) {
      for (const paymentWorkspace of PAYMENT_COLLECTION_WORKSPACES) {
        const existingItem = existingByTitle.get(paymentWorkspace.title);
        const extraLines = [
          `operationWorkspaceRole: ${paymentWorkspace.role}`,
          "workspaceKind: FLOW_STAGE_WORKSPACE",
          "coreFlowKey: payment-collection-core-flow",
          `flowStageKey: ${paymentWorkspace.flowStageKey}`,
          `flowStageOrder: ${paymentWorkspace.flowStageOrder}`,
        ];
        const note = workTypeNote(workType, adminUserIds, {
          extraLines,
          eventTargetTypes: ["PAYMENT"],
          workspaceType: `${paymentWorkspace.title} Workspace`,
          itemLabel: "Payment",
        });

        if (existingItem) {
          const nextSharedUserIds = Array.from(
            new Set([...sharedUserIdsFromNote(existingItem.note), ...adminUserIds]),
          );
          const nextNote = workTypeNote(workType, nextSharedUserIds, {
            extraLines,
            eventTargetTypes: ["PAYMENT"],
            workspaceType: `${paymentWorkspace.title} Workspace`,
            itemLabel: "Payment",
          });

          if (
            nextNote !== existingItem.note &&
            (nextSharedUserIds.length > sharedUserIdsFromNote(existingItem.note).length ||
              (nextNote.includes("blueprintSnapshot:") &&
                !noteHasBlueprintEventBindings(existingItem.note)))
          ) {
            await client.taskItem.update({
              where: { id: existingItem.id },
              data: { note: nextNote },
            });
          }
          continue;
        }

        const createdItem = await client.taskItem.create({
          data: {
            taskId: input.taskId,
            title: paymentWorkspace.title,
            note,
            status: TaskStatus.TODO,
            priority: "MEDIUM",
            assignedToUserId: null,
            sortOrder: paymentWorkspace.sortOrder,
          },
        });

        existingByTitle.set(paymentWorkspace.title, createdItem);
        existingTitles.add(paymentWorkspace.title);
        createdCount += 1;
      }

      continue;
    }

    const existingItem = existingByTitle.get(workType.title);
    if (existingItem) {
      const nextSharedUserIds = Array.from(
        new Set([...sharedUserIdsFromNote(existingItem.note), ...adminUserIds]),
      );
      const nextNote = workTypeNote(workType, nextSharedUserIds);
      if (
        nextNote !== existingItem.note &&
        (nextSharedUserIds.length > sharedUserIdsFromNote(existingItem.note).length ||
          (nextNote.includes("blueprintSnapshot:") &&
            !noteHasBlueprintEventBindings(existingItem.note)))
      ) {
        await client.taskItem.update({
          where: { id: existingItem.id },
          data: { note: nextNote },
        });
      }
      continue;
    }

    const createdItem = await client.taskItem.create({
      data: {
        taskId: input.taskId,
        title: workType.title,
        note: workTypeNote(workType, adminUserIds),
        status: TaskStatus.TODO,
        priority: "MEDIUM",
        assignedToUserId: null,
        sortOrder: workType.sortOrder,
      },
    });

    existingByTitle.set(workType.title, createdItem);
    existingTitles.add(workType.title);
    createdCount += 1;
  }

  return {
    items: await listWorkTicketsForCycle(client, input),
    createdCount,
  };
}

export async function ensureCoordinationCycle(
  db: DB,
  input: EnsureCoordinationCycleInput,
): Promise<EnsureCoordinationCycleResult> {
  const week = getWeekRange(input.date);
  const client = dbOrTx(db);

  const existing = await findCoordinationCycleTask(client, {
    context: input.context,
    week,
  });

  if (existing) {
    const workTickets = await ensureWorkTickets(client, {
      taskId: existing.id,
      context: input.context,
    });

    return {
      task: existing,
      week,
      context: input.context,
      created: false,
      workTickets: workTickets.items,
      workTicketsCreated: workTickets.createdCount,
    };
  }

  const title = getCoordinationCycleRuntimeTitle(
    input.context,
    week.weekNumber,
  );

  const task = await client.task.create({
    data: {
      title,
      description: `Coordination cycle ${input.context} ${week.periodKey}`,
      source: TaskSource.SYSTEM,
      kind: contextToTaskKind(input.context),
      periodType: TaskPeriod.WEEKLY,
      periodKey: week.periodKey,
      priority: "MEDIUM",
    },
    select: COORDINATION_CYCLE_TASK_SELECT,
  });

  const workTickets = await ensureWorkTickets(client, {
    taskId: task.id,
    context: input.context,
  });

  return {
    task,
    week,
    context: input.context,
    created: true,
    workTickets: workTickets.items,
    workTicketsCreated: workTickets.createdCount,
  };
}

export async function resolveCurrentCoordinationCycle(
  db: DB,
  input: ResolveCurrentCoordinationCycleInput & { createIfMissing?: boolean },
) {
  if (input.createIfMissing) {
    return ensureCoordinationCycle(db, input);
  }

  return resolveCoordinationCycle(db, input);
}

export function getWorkTypeKeyFromTicketNote(note: string | null | undefined) {
  const match = String(note ?? "").match(/workTypeKey:\s*([a-z0-9-]+)/i);
  return match ? normalizeWorkTypeKey(match[1]) : null;
}
