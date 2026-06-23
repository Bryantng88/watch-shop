import {
  Prisma,
  TaskKind,
  TaskSource,
  TaskStatus,
  type TaskPriority,
} from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type {
  CompleteRelatedTasksInput,
  CreateTaskItemInput,
  CreateTaskInput,
  EnsureSystemTaskInput,
  EnsureSystemTaskResult,
  FindOpenRelatedTasksInput,
  TaskDueKey,
  TaskListFilters,
  TaskViewKey,
  UpdateTaskItemInput,
  UpdateTaskInput,
} from "./task.types";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

const TASK_EXECUTION_INCLUDE = {
  createdByUser: {
    select: USER_SELECT,
  },
  serviceRequest: {
    select: {
      id: true,
      refNo: true,
      status: true,
    },
  },
  technicalIssue: {
    select: {
      id: true,
      summary: true,
      area: true,
      executionStatus: true,
      priority: true,
      serviceRequestId: true,
    },
  },
} satisfies Prisma.TaskExecutionInclude;

const CHECKLIST_ITEM_INCLUDE = {
  assignedToUser: {
    select: USER_SELECT,
  },
  executions: {
    orderBy: { createdAt: "desc" },
    include: TASK_EXECUTION_INCLUDE,
  },
  checklists: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],

  },
} satisfies Prisma.TaskItemInclude;

export const TASK_INCLUDE = {
  createdByUser: { select: USER_SELECT },
  assignedToUser: { select: USER_SELECT },
  completedByUser: { select: USER_SELECT },
  cancelledByUser: { select: USER_SELECT },

  watch: {
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          primaryImageUrl: true,
          sku: true,
        },
      },
    },
  },

  order: {
    select: {
      id: true,
      refNo: true,
      customerName: true,
      status: true,
      paymentStatus: true,
    },
  },

  shipment: {
    select: {
      id: true,
      refNo: true,
      orderRefNo: true,
      status: true,
    },
  },

  acquisition: {
    select: {
      id: true,
      refNo: true,
    },
  },

  taskItems: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: CHECKLIST_ITEM_INCLUDE,
  },

  serviceRequest: {
    include: {
      technicalIssue: {
        select: {
          id: true,
          summary: true,
          area: true,
          executionStatus: true,
          actualCost: true,
          completedAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  },

  technicalIssue: {
    select: {
      id: true,
      summary: true,
      area: true,
      executionStatus: true,
      serviceRequestId: true,
      priority: true,
      actualCost: true,
      completedAt: true,
      createdAt: true,
    },
  },

  payment: {
    select: {
      id: true,
      refNo: true,
      status: true,
      amount: true,
      currency: true,
      type: true,
      purpose: true,
    },
  },

  workCase: {
    select: {
      id: true,
      refNo: true,
      title: true,
      description: true,
      status: true,
      watchId: true,
      orderId: true,
      shipmentId: true,
      watch: {
        select: {
          id: true,
          saleStage: true,
          productId: true,
          product: {
            select: {
              title: true,
              sku: true,
              primaryImageUrl: true,
            },
          },
        },
      },
      order: {
        select: {
          id: true,
          refNo: true,
          customerName: true,
          status: true,
          paymentStatus: true,
        },
      },
      shipment: {
        select: {
          id: true,
          refNo: true,
          trackingCode: true,
          status: true,
        },
      },
      serviceRequests: {
        select: {
          id: true,
          refNo: true,
          status: true,
        },
        take: 3,
      },
    },
  },

  executions: {
    orderBy: { createdAt: "desc" },
    include: TASK_EXECUTION_INCLUDE,
  },
} satisfies Prisma.TaskInclude;

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: typeof TASK_INCLUDE;
}>;

type BusinessStageTone = "todo" | "progress" | "done" | "cancelled";

function toDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfTomorrow() {
  const d = startOfToday();
  d.setDate(d.getDate() + 1);
  return d;
}

function endOfThisWeek() {
  const d = startOfToday();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + (7 - day) + 1);
  return d;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function assignedSubtaskWhere(userId: string): Prisma.TaskWhereInput {
  return {
    taskItems: {
      some: {
        assignedToUserId: userId,
      },
    },
  };
}

function applyTaskRowAccess(
  task: any,
  currentUserId: string,
  canViewAll = false,
) {
  const isOwner =
    canViewAll ||
    task.assignedToUserId === currentUserId ||
    task.createdByUserId === currentUserId;

  if (isOwner) {
    return {
      ...task,
      rowAccess: "OWNER",
      visibleTaskItemIds: null,
    };
  }

  const visibleTaskItems = (task.taskItems ?? []).filter(
    (item: any) => item.assignedToUserId === currentUserId,
  );

  return {
    ...task,
    rowAccess: "SUBTASK_ASSIGNEE",
    visibleTaskItemIds: visibleTaskItems.map((item: any) => item.id),
  };
}

function normalizeBusinessStage(
  targetType: string,
  row: any,
): {
  businessStage: string;
  businessStageLabel: string;
  businessStageTone: BusinessStageTone;
  isBusinessDone: boolean;
} {
  const type = String(targetType).toUpperCase();

  if (type === "ORDER") {
    const stage = String(row.status ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `Order · ${stage}`,
      businessStageTone:
        stage === "COMPLETED"
          ? "done"
          : ["CANCELLED", "RETURNED"].includes(stage)
            ? "cancelled"
            : [
              "POSTED",
              "PROCESSING",
              "SHIPPED",
              "PAID",
              "RESERVED",
              "RETURNING",
            ].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "COMPLETED",
    };
  }

  if (type === "SERVICE_REQUEST") {
    const stage = String(row.status ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `SR · ${stage}`,
      businessStageTone: ["COMPLETED", "DELIVERED"].includes(stage)
        ? "done"
        : stage === "CANCELED"
          ? "cancelled"
          : ["DIAGNOSING", "WAIT_APPROVAL", "IN_PROGRESS"].includes(stage)
            ? "progress"
            : "todo",
      isBusinessDone: ["COMPLETED", "DELIVERED"].includes(stage),
    };
  }

  if (type === "TECHNICAL_ISSUE") {
    const stage = String(row.executionStatus ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `TI · ${stage}`,
      businessStageTone:
        stage === "DONE"
          ? "done"
          : stage === "CANCELED"
            ? "cancelled"
            : ["CONFIRMED", "OPEN", "IN_PROGRESS"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "DONE",
    };
  }

  if (type === "PAYMENT") {
    const stage = String(row.status ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `Payment · ${stage}`,
      businessStageTone: ["PAID", "COLLECTED"].includes(stage)
        ? "done"
        : ["CANCELED", "REFUNDED"].includes(stage)
          ? "cancelled"
          : "todo",
      isBusinessDone: ["PAID", "COLLECTED"].includes(stage),
    };
  }

  if (type === "SHIPMENT") {
    const stage = String(row.status ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `Shipment · ${stage}`,
      businessStageTone:
        stage === "DELIVERED"
          ? "done"
          : ["CANCELLED", "RETURNED"].includes(stage)
            ? "cancelled"
            : ["READY", "SHIPPED", "RETURNING"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "DELIVERED",
    };
  }

  if (type === "ACQUISITION") {
    const stage = String(row.accquisitionStt ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `Acquisition · ${stage}`,
      businessStageTone:
        stage === "POSTED"
          ? "done"
          : stage === "CANCELED"
            ? "cancelled"
            : "todo",
      isBusinessDone: stage === "POSTED",
    };
  }

  if (type === "WORK_CASE") {
    const stage = String(row.status ?? "").toUpperCase();

    return {
      businessStage: stage,
      businessStageLabel: `WorkCase · ${stage}`,
      businessStageTone:
        stage === "RESOLVED"
          ? "done"
          : stage === "CANCELLED"
            ? "cancelled"
            : ["TRIAGED", "IN_PROGRESS"].includes(stage)
              ? "progress"
              : "todo",
      isBusinessDone: stage === "RESOLVED",
    };
  }

  if (type === "WATCH") {
    const stage = String(row.saleStage ?? row.status ?? "").toUpperCase();

    return {
      businessStage: stage || "LINKED",
      businessStageLabel: stage ? `Watch · ${stage}` : "Watch · LINKED",
      businessStageTone: "progress",
      isBusinessDone: false,
    };
  }

  return {
    businessStage: "LINKED",
    businessStageLabel: "Linked",
    businessStageTone: "progress",
    isBusinessDone: false,
  };
}

async function getExecutionTargetSnapshot(client: any, execution: any) {
  const type = String(execution.targetType).toUpperCase();
  const rawId = String(execution.targetId ?? "").trim();

  if (!rawId) {
    return {
      ...execution,
      ...normalizeBusinessStage(type, execution),
    };
  }

  if (type === "ORDER") {
    const row = await client.order.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, status: true, customerName: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.refNo,
      targetTitle: row.customerName,
      targetStatus: row.status,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "SERVICE_REQUEST") {
    const row = await client.serviceRequest.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, status: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.refNo,
      targetStatus: row.status,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "TECHNICAL_ISSUE") {
    const row = await client.technicalIssue.findUnique({
      where: { id: rawId },
      select: { id: true, summary: true, area: true, executionStatus: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetTitle: row.summary || row.area,
      targetStatus: row.executionStatus,
      technicalIssue: row,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "PAYMENT") {
    const row = await client.payment.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, status: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.refNo,
      targetStatus: row.status,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "SHIPMENT") {
    const or: any[] = [{ refNo: rawId }, { trackingCode: rawId }];

    if (isUuid(rawId)) {
      or.push({ id: rawId });
    }

    const row = await client.shipment.findFirst({
      where: { OR: or },
      select: { id: true, refNo: true, trackingCode: true, status: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.refNo || row.trackingCode,
      targetStatus: row.status,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "ACQUISITION") {
    const row = await client.acquisition.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, accquisitionStt: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.refNo,
      targetStatus: row.accquisitionStt,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "WORK_CASE") {
    const row = await client.workCase.findFirst({
      where: { OR: [{ id: rawId }, { refNo: rawId }] },
      select: { id: true, refNo: true, title: true, status: true },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.refNo,
      targetTitle: row.title,
      targetStatus: row.status,
      ...normalizeBusinessStage(type, row),
    };
  }

  if (type === "WATCH") {
    const row = await client.watch.findFirst({
      where: {
        OR: [{ id: rawId }, { productId: rawId }, { product: { sku: rawId } }],
      },
      select: {
        id: true,
        productId: true,
        saleStage: true,
        product: { select: { title: true, sku: true } },
      },
    });

    if (!row)
      return { ...execution, ...normalizeBusinessStage(type, execution) };

    return {
      ...execution,
      targetId: row.id,
      targetRefNo: row.product?.sku,
      targetTitle: row.product?.title,
      targetStatus: row.saleStage,
      ...normalizeBusinessStage(type, row),
    };
  }

  return {
    ...execution,
    ...normalizeBusinessStage(type, execution),
  };
}

export async function hydrateTaskBusinessLinks(db: DB, task: any) {
  const client = dbOrTx(db);

  const hydrateList = async (items: any[]) =>
    Promise.all(items.map((item) => getExecutionTargetSnapshot(client, item)));

  const executions = await hydrateList(task.executions ?? []);

  const taskItems = await Promise.all(
    (task.taskItems ?? []).map(async (item: any) => ({
      ...item,
      executions: await hydrateList(item.executions ?? []),
    })),
  );

  return {
    ...task,
    executions,
    taskItems,
  };
}

function executionIsDone(execution: any) {
  return Boolean(execution?.isBusinessDone);
}

function subtaskHasProgress(item: any) {
  const executions = item.executions ?? [];

  if (executions.length > 0) return true;
  if (item.isDone) return true;

  return String(item.status ?? "").toUpperCase() === "IN_PROGRESS";
}

function buildAccessWhere(
  userId: string,
  canViewAll: boolean,
): Prisma.TaskWhereInput {
  if (canViewAll) {
    return {
      OR: [
        { kind: TaskKind.BUSINESS },
        {
          kind: TaskKind.PERSONAL,
          OR: [
            { createdByUserId: userId },
            { assignedToUserId: userId },
            assignedSubtaskWhere(userId),
          ],
        },
      ],
    };
  }

  return {
    OR: [
      { createdByUserId: userId },
      { assignedToUserId: userId },
      assignedSubtaskWhere(userId),
    ],
  };
}

function buildViewWhere(
  view: TaskViewKey,
  userId: string,
  canViewAll: boolean,
): Prisma.TaskWhereInput {
  const subtaskWhere = assignedSubtaskWhere(userId);

  if (view === "all") return buildAccessWhere(userId, canViewAll);

  if (view === "mine") {
    return {
      OR: [
        { createdByUserId: userId },
        { assignedToUserId: userId },
        subtaskWhere,
      ],
    };
  }

  if (view === "assigned") {
    return {
      OR: [{ assignedToUserId: userId }, subtaskWhere],
    };
  }

  if (view === "delegated") return { createdByUserId: userId };

  return buildAccessWhere(userId, canViewAll);
}

function buildDueWhere(due?: TaskDueKey): Prisma.TaskWhereInput {
  if (!due || due === "ALL") return {};

  const today = startOfToday();
  const tomorrow = startOfTomorrow();

  if (due === "OVERDUE") {
    return {
      dueAt: { lt: today },
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    };
  }

  if (due === "TODAY") return { dueAt: { gte: today, lt: tomorrow } };
  if (due === "THIS_WEEK")
    return { dueAt: { gte: today, lt: endOfThisWeek() } };
  if (due === "NO_DUE") return { dueAt: null };

  return {};
}

function buildFilterWhere(filters: TaskListFilters): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};
  const q = filters.q?.trim();

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { order: { refNo: { contains: q, mode: "insensitive" } } },
      { shipment: { refNo: { contains: q, mode: "insensitive" } } },
      { serviceRequest: { refNo: { contains: q, mode: "insensitive" } } },
      { payment: { refNo: { contains: q, mode: "insensitive" } } },
      { watch: { product: { title: { contains: q, mode: "insensitive" } } } },
      { watch: { product: { sku: { contains: q, mode: "insensitive" } } } },
      { workCase: { refNo: { contains: q, mode: "insensitive" } } },
      { workCase: { title: { contains: q, mode: "insensitive" } } },
      {
        taskItems: {
          some: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { note: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status =
      filters.status === "OPEN"
        ? { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] }
        : filters.status;
  }

  if (filters.priority && filters.priority !== "ALL") {
    where.priority = filters.priority as TaskPriority;
  }

  if (filters.kind && filters.kind !== "ALL") {
    where.kind = filters.kind;
  }

  const dueWhere = buildDueWhere(filters.due);

  return Object.keys(dueWhere).length ? { AND: [where, dueWhere] } : where;
}

function createLinkData(
  input: Partial<
    CreateTaskInput | EnsureSystemTaskInput | CreateTaskItemInput
  >,
) {
  return {
    watchId: input.watchId ?? null,
    orderId: input.orderId ?? null,
    shipmentId: input.shipmentId ?? null,
    acquisitionId: input.acquisitionId ?? null,
    serviceRequestId: input.serviceRequestId ?? null,
    technicalIssueId: input.technicalIssueId ?? null,
    paymentId: input.paymentId ?? null,
    workCaseId: input.workCaseId ?? null,
  };
}

function updateLinkData(input: Partial<UpdateTaskInput>) {
  const data: Record<string, string | null> = {};

  for (const key of [
    "watchId",
    "orderId",
    "shipmentId",
    "acquisitionId",
    "serviceRequestId",
    "technicalIssueId",
    "paymentId",
    "workCaseId",
  ] as const) {
    if (key in input) {
      data[key] = input[key] ?? null;
    }
  }

  return data;
}

function systemTaskIdentityWhere(
  input: EnsureSystemTaskInput,
): Prisma.TaskWhereInput {
  return {
    source: TaskSource.SYSTEM,
    title: input.title.trim(),
    ...createLinkData(input),
  };
}

function hasAnyLink(
  input: Partial<
    | CreateTaskInput
    | UpdateTaskInput
    | EnsureSystemTaskInput
    | CompleteRelatedTasksInput
    | FindOpenRelatedTasksInput
  >,
) {
  return Boolean(
    input.watchId ||
    input.orderId ||
    input.shipmentId ||
    input.acquisitionId ||
    input.serviceRequestId ||
    input.technicalIssueId ||
    input.paymentId ||
    input.workCaseId,
  );
}

function relatedTaskWhere(
  input: CompleteRelatedTasksInput | FindOpenRelatedTasksInput,
): Prisma.TaskWhereInput {
  return {
    ...(input.kind ? { kind: input.kind } : {}),
    ...(input.watchId ? { watchId: input.watchId } : {}),
    ...(input.orderId ? { orderId: input.orderId } : {}),
    ...(input.shipmentId ? { shipmentId: input.shipmentId } : {}),
    ...(input.acquisitionId ? { acquisitionId: input.acquisitionId } : {}),
    ...(input.serviceRequestId
      ? { serviceRequestId: input.serviceRequestId }
      : {}),
    ...(input.technicalIssueId
      ? { technicalIssueId: input.technicalIssueId }
      : {}),
    ...(input.paymentId ? { paymentId: input.paymentId } : {}),
    ...(input.workCaseId ? { workCaseId: input.workCaseId } : {}),
  };
}

export async function listTasksRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; filters: TaskListFilters },
) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(
    100,
    Math.max(10, Number(input.filters.pageSize || 25)),
  );
  const view = input.filters.view || "mine";
  const canViewAll = Boolean(input.canViewAll);

  const where: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(view, input.userId, canViewAll),
      buildFilterWhere(input.filters),
    ],
  };

  const [items, total] = await Promise.all([
    client.task.findMany({
      where,
      include: TASK_INCLUDE,
      orderBy: [
        { status: "asc" },
        { priority: "desc" },
        { dueAt: "asc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    client.task.count({ where }),
  ]);

  const hydratedItems = await Promise.all(
    items.map((item) => hydrateTaskBusinessLinks(db, item)),
  );

  const finalItems = hydratedItems.map((item) =>
    applyTaskRowAccess(item, input.userId, canViewAll),
  );

  return {
    items: finalItems,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function countTaskViewsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean },
) {
  const client = dbOrTx(db);
  const canViewAll = Boolean(input.canViewAll);
  const userId = input.userId;

  const openWhere: Prisma.TaskWhereInput = {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  };

  const [mine, assigned, delegated, all] = await Promise.all([
    client.task.count({
      where: { AND: [buildViewWhere("mine", userId, canViewAll), openWhere] },
    }),
    client.task.count({
      where: {
        AND: [buildViewWhere("assigned", userId, canViewAll), openWhere],
      },
    }),
    client.task.count({
      where: {
        AND: [buildViewWhere("delegated", userId, canViewAll), openWhere],
      },
    }),
    client.task.count({
      where: { AND: [buildViewWhere("all", userId, canViewAll), openWhere] },
    }),
  ]);

  return { mine, assigned, delegated, all };
}

export async function countTaskDueBucketsRepo(
  db: DB,
  input: { userId: string; canViewAll?: boolean; view?: TaskViewKey },
) {
  const client = dbOrTx(db);

  const base: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(
        input.view || "mine",
        input.userId,
        Boolean(input.canViewAll),
      ),
      { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } },
    ],
  };

  const today = startOfToday();
  const tomorrow = startOfTomorrow();
  const weekEnd = endOfThisWeek();

  const [overdue, todayCount, thisWeek, noDue] = await Promise.all([
    client.task.count({ where: { AND: [base, { dueAt: { lt: today } }] } }),
    client.task.count({
      where: { AND: [base, { dueAt: { gte: today, lt: tomorrow } }] },
    }),
    client.task.count({
      where: { AND: [base, { dueAt: { gte: today, lt: weekEnd } }] },
    }),
    client.task.count({ where: { AND: [base, { dueAt: null }] } }),
  ]);

  return {
    overdue,
    today: todayCount,
    thisWeek,
    noDue,
  };
}

export async function createTaskRepo(
  db: DB,
  input: CreateTaskInput & { createdByUserId?: string | null },
) {
  const client = dbOrTx(db);
  const createdByUserId = input.createdByUserId ?? null;
  const assignedToUserId = input.assignedToUserId ?? createdByUserId;

  return client.task.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      source: input.source ?? "MANUAL",
      kind: input.kind ?? TaskKind.BUSINESS,
      priority: input.priority ?? "MEDIUM",
      dueAt: toDate(input.dueAt),
      createdByUserId,
      assignedToUserId,
      ...createLinkData(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function ensureSystemTaskRepo(
  db: DB,
  input: EnsureSystemTaskInput,
): Promise<EnsureSystemTaskResult> {
  const client = dbOrTx(db);
  const dueAt = toDate(input.dueAt);

  const existing = await client.task.findFirst({
    where: systemTaskIdentityWhere(input),
    select: { id: true, status: true },
  });

  if (!existing) {
    const created = await client.task.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        source: TaskSource.SYSTEM,
        kind: TaskKind.BUSINESS,
        priority: input.priority ?? "MEDIUM",
        dueAt,
        createdByUserId: input.createdByUserId ?? null,
        assignedToUserId:
          input.assignedToUserId ?? input.createdByUserId ?? null,
        ...createLinkData(input),
      },
      select: { id: true },
    });

    return { id: created.id, created: true, reopened: false };
  }

  const reopened =
    existing.status === TaskStatus.DONE ||
    existing.status === TaskStatus.CANCELLED;

  await client.task.update({
    where: { id: existing.id },
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority ?? "MEDIUM",
      dueAt,
      assignedToUserId: input.assignedToUserId ?? input.createdByUserId ?? null,
      ...(reopened
        ? {
          status: TaskStatus.TODO,
          completedAt: null,
          cancelledAt: null,
          completedByUserId: null,
          cancelledByUserId: null,
        }
        : {}),
    },
  });

  return { id: existing.id, created: false, reopened };
}

export async function updateTaskRepo(
  db: DB,
  id: string,
  input: UpdateTaskInput,
) {
  const client = dbOrTx(db);

  return client.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
      ...(input.kind !== undefined ? { kind: input.kind } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueAt !== undefined ? { dueAt: toDate(input.dueAt) } : {}),
      ...(input.assignedToUserId !== undefined
        ? { assignedToUserId: input.assignedToUserId || null }
        : {}),
      ...updateLinkData(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function getTaskByIdRepo(db: DB, id: string) {
  const client = dbOrTx(db);

  const task = await client.task.findUnique({
    where: { id },
    include: TASK_INCLUDE,
  });

  if (!task) return null;

  return hydrateTaskBusinessLinks(db, task);
}

export async function setTaskStatusRepo(
  db: DB,
  input: { id: string; status: TaskStatus; actorUserId?: string | null },
) {
  const client = dbOrTx(db);
  const now = new Date();
  const data: Prisma.TaskUpdateInput = { status: input.status };

  if (input.status === TaskStatus.IN_PROGRESS) {
    data.startedAt = now;
  }

  if (input.status === TaskStatus.DONE) {
    data.completedAt = now;
    data.cancelledAt = null;
    if (input.actorUserId) {
      data.completedByUser = { connect: { id: input.actorUserId } };
    }
  }

  if (input.status === TaskStatus.CANCELLED) {
    data.cancelledAt = now;
    if (input.actorUserId) {
      data.cancelledByUser = { connect: { id: input.actorUserId } };
    }
  }

  if (input.status === TaskStatus.TODO) {
    data.startedAt = null;
    data.completedAt = null;
    data.cancelledAt = null;
    data.completedByUser = { disconnect: true };
    data.cancelledByUser = { disconnect: true };
  }

  return client.task.update({
    where: { id: input.id },
    data,
    include: TASK_INCLUDE,
  });
}

export async function completeRelatedTasksRepo(
  db: DB,
  input: CompleteRelatedTasksInput,
) {
  const client = dbOrTx(db);

  if (!input.kind && !hasAnyLink(input)) {
    return { count: 0 };
  }

  const where: Prisma.TaskWhereInput = {
    ...relatedTaskWhere(input),
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
  };

  return client.task.updateMany({
    where,
    data: {
      status: TaskStatus.DONE,
      completedAt: new Date(),
      completedByUserId: input.completedByUserId ?? null,
    },
  });
}

export async function listAssignableUsersRepo(db: DB) {
  const client = dbOrTx(db);

  return client.user.findMany({
    where: { isActive: true },
    select: USER_SELECT,
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}

export async function findOpenRelatedTasksRepo(
  db: DB,
  input: FindOpenRelatedTasksInput,
) {
  const client = dbOrTx(db);

  if (!input.kind && !hasAnyLink(input) && !input.taskItemId) {
    return [];
  }

  return client.task.findMany({
    where: {
      ...relatedTaskWhere(input),
      status: {
        in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
      },
      ...(input.taskItemId
        ? {
          executions: {
            some: {
              taskItemId: input.taskItemId,
            },
          },
        }
        : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueAt: true,
      assignedToUser: {
        select: USER_SELECT,
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: input.limit ?? 10,
  });
}

export async function createTaskItemRepo(
  db: DB,
  input: CreateTaskItemInput,
) {
  const client = dbOrTx(db);

  const last = await client.taskItem.findFirst({
    where: { taskId: input.taskId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return client.taskItem.create({
    data: {
      taskId: input.taskId,
      title: input.title.trim(),
      note: input.note?.trim() || null,
      status: input.status ?? TaskStatus.TODO,
      priority: input.priority ?? "MEDIUM",
      dueAt: toDate(input.dueAt),
      assignedToUserId: input.assignedToUserId || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
    include: CHECKLIST_ITEM_INCLUDE,
  });
}

export async function updateTaskItemRepo(
  db: DB,
  itemId: string,
  input: UpdateTaskItemInput,
) {
  const client = dbOrTx(db);

  return client.taskItem.update({
    where: { id: itemId },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueAt !== undefined ? { dueAt: toDate(input.dueAt) } : {}),
      ...(input.assignedToUserId !== undefined
        ? { assignedToUserId: input.assignedToUserId || null }
        : {}),
    },
    include: CHECKLIST_ITEM_INCLUDE,
  });
}

export async function setTaskItemDoneRepo(
  db: DB,
  input: { itemId: string; isDone: boolean },
) {
  const client = dbOrTx(db);
  const now = new Date();

  return client.taskItem.update({
    where: { id: input.itemId },
    data: input.isDone
      ? {
        isDone: true,
        status: TaskStatus.DONE,
        completedAt: now,
        cancelledAt: null,
      }
      : {
        isDone: false,
        status: TaskStatus.TODO,
        completedAt: null,
        cancelledAt: null,
      },
  });
}

export async function deleteTaskItemRepo(db: DB, itemId: string) {
  const client = dbOrTx(db);

  await client.taskExecution.updateMany({
    where: { taskItemId: itemId },
    data: { taskItemId: null },
  });

  return client.taskItem.delete({
    where: { id: itemId },
  });
}

export async function syncTaskStatusFromChecklistRepo(db: DB, taskId: string) {
  const client = dbOrTx(db);

  const rawTask = await client.task.findUnique({
    where: { id: taskId },
    include: TASK_INCLUDE,
  });

  if (!rawTask) return null;
  if (rawTask.status === TaskStatus.CANCELLED) return rawTask;

  const task = await hydrateTaskBusinessLinks(db, rawTask);
  const items = task.taskItems ?? [];

  if (!items.length) return task;

  for (const item of items) {
    const executions = item.executions ?? [];
    const tracking = trackingExecutions(item);
    if (!tracking.length) continue;

    const isDone = tracking.every(executionIsDone);
    if (!executions.length) continue;

    await client.taskItem.update({
      where: { id: item.id },
      data: isDone
        ? {
          status: TaskStatus.DONE,
          isDone: true,
          completedAt: new Date(),
          cancelledAt: null,
        }
        : {
          status: TaskStatus.IN_PROGRESS,
          isDone: false,
          startedAt: item.startedAt ?? new Date(),
          completedAt: null,
        },
    });

    item.status = isDone ? TaskStatus.DONE : TaskStatus.IN_PROGRESS;
    item.isDone = isDone;
  }

  const allDone = items.every(subtaskIsDone);
  const hasProgress = items.some(subtaskHasProgress);

  if (allDone) {
    return client.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.DONE,
        completedAt: new Date(),
        cancelledAt: null,
      },
      include: TASK_INCLUDE,
    });
  }

  if (hasProgress && rawTask.status === TaskStatus.TODO) {
    return client.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.IN_PROGRESS,
        startedAt: rawTask.startedAt ?? new Date(),
        completedAt: null,
      },
      include: TASK_INCLUDE,
    });
  }

  return task;
}

function isTrackingExecution(execution: any) {
  return execution?.metadataJson?.linkMode === "TRACKING";
}

function trackingExecutions(item: any) {
  return (item.executions ?? []).filter(isTrackingExecution);
}

function subtaskIsDone(item: any) {
  const tracking = trackingExecutions(item);

  if (tracking.length > 0) {
    return tracking.every(executionIsDone);
  }

  return (
    Boolean(item.isDone) || String(item.status ?? "").toUpperCase() === "DONE"
  );
}

export async function createTaskItemChecklistRepo(
  db: DB,
  input: CreateTaskItemChecklistInput,
) {
  const client = dbOrTx(db);

  const taskItem = await client.taskItem.findUnique({
    where: { id: input.taskItemId },
    select: { id: true },
  });

  if (!taskItem) throw new Error("Task item không tồn tại.");

  const last = await client.taskItemChecklist.findFirst({
    where: { taskItemId: input.taskItemId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return client.taskItemChecklist.create({
    data: {
      taskItemId: input.taskItemId,
      title: input.title.trim(),
      note: input.note?.trim() || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },

  });
}

export async function updateTaskItemChecklistRepo(
  db: DB,
  checklistId: string,
  input: UpdateTaskItemChecklistInput & { actorUserId?: string | null },
) {
  const client = dbOrTx(db);
  const doneChanged = input.isDone !== undefined;

  return client.taskItemChecklist.update({
    where: { id: checklistId },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(input.dueAt !== undefined ? { dueAt: toDate(input.dueAt) } : {}),
      ...(doneChanged
        ? input.isDone
          ? {
            isDone: true,
            doneAt: new Date(),
          }
          : {
            isDone: false,
            doneAt: null,
          }
        : {}),
    },

  });
}

export async function deleteTaskItemChecklistRepo(db: DB, checklistId: string) {
  const client = dbOrTx(db);
  return client.taskItemChecklist.delete({ where: { id: checklistId } });
}

export async function syncTaskItemStatusFromChecklistRepo(
  db: DB,
  taskItemId: string,
  actorUserId?: string | null,
) {
  const client = dbOrTx(db);

  const item = await client.taskItem.findUnique({
    where: { id: taskItemId },
    include: { checklists: true },
  });

  if (!item) return null;
  if (item.status === TaskStatus.CANCELLED) return item;

  const checklists = item.checklists ?? [];
  if (!checklists.length) return item;

  const allDone = checklists.every((x: any) => x.isDone);
  const hasProgress = checklists.some((x: any) => x.isDone);

  return client.taskItem.update({
    where: { id: taskItemId },
    data: allDone
      ? {
        isDone: true,
        status: TaskStatus.DONE,
        completedAt: new Date(),
        cancelledAt: null,
        ...(actorUserId ? { userId: actorUserId } : {}),
      }
      : hasProgress
        ? {
          isDone: false,
          status: TaskStatus.IN_PROGRESS,
          startedAt: item.startedAt ?? new Date(),
          completedAt: null,
        }
        : {
          isDone: false,
          status: TaskStatus.TODO,
          completedAt: null,
        },
    include: CHECKLIST_ITEM_INCLUDE,
  });
}
