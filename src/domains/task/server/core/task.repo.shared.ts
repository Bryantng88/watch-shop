import {
  Prisma,
  TaskKind,
  TaskSource,
  TaskStatus,
  type TaskPriority,
} from "@prisma/client";
import type {
  CompleteRelatedTasksInput,
  CreateTaskInput,
  CreateTaskItemInput,
  EnsureSystemTaskInput,
  FindOpenRelatedTasksInput,
  TaskDueKey,
  TaskListFilters,
  TaskViewKey,
  UpdateTaskInput,
} from "../task.types";

export const USER_SELECT = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

export const TASK_EXECUTION_INCLUDE = {
  createdByUser: { select: USER_SELECT },
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

export const TASK_ITEM_INCLUDE = {
  assignedToUser: { select: USER_SELECT },
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
      status: true,
      customerName: true,
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
  acquisition: {
    select: {
      id: true,
      refNo: true,
      accquisitionStt: true,
    },
  },
  serviceRequest: {
    select: {
      id: true,
      refNo: true,
      status: true,
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          primaryImageUrl: true,
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
      priority: true,
      serviceRequestId: true,
    },
  },
  payment: {
    select: {
      id: true,
      refNo: true,
      status: true,
      amount: true,
      direction: true,
    },
  },
  workCase: {
    select: {
      id: true,
      refNo: true,
      title: true,
      status: true,
      priority: true,
      order: {
        select: {
          id: true,
          refNo: true,
          customerName: true,
          status: true,
        },
      },
      watch: {
        select: {
          id: true,
          productId: true,
          saleStage: true,
          product: {
            select: {
              title: true,
              sku: true,
              primaryImageUrl: true,
            },
          },
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

  taskItems: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: TASK_ITEM_INCLUDE,
  },

  executions: {
    orderBy: { createdAt: "desc" },
    include: TASK_EXECUTION_INCLUDE,
  },
} satisfies Prisma.TaskInclude;

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: typeof TASK_INCLUDE;
}>;

export function toDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfTomorrow() {
  const d = startOfToday();
  d.setDate(d.getDate() + 1);
  return d;
}

export function endOfThisWeek() {
  const d = startOfToday();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + (7 - day) + 1);
  return d;
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(
    value,
  );
}

export function assignedTaskItemWhere(userId: string): Prisma.TaskWhereInput {
  return {
    taskItems: {
      some: { assignedToUserId: userId },
    },
  };
}

export function applyTaskRowAccess(
  task: any,
  currentUserId: string,
  canViewAll = false,
) {
  const isOwner =
    canViewAll ||
    task.assignedToUserId === currentUserId ||
    task.createdByUserId === currentUserId;

  if (isOwner) {
    return { ...task, rowAccess: "OWNER", visibleTaskItemIds: null };
  }

  const visibleTaskItems = (task.taskItems ?? []).filter(
    (item: any) => item.assignedToUserId === currentUserId,
  );

  return {
    ...task,
    rowAccess: "TASK_ITEM_ASSIGNEE",
    visibleTaskItemIds: visibleTaskItems.map((item: any) => item.id),
  };
}

export function buildAccessWhere(
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
            assignedTaskItemWhere(userId),
          ],
        },
      ],
    };
  }

  return {
    OR: [
      { createdByUserId: userId },
      { assignedToUserId: userId },
      assignedTaskItemWhere(userId),
    ],
  };
}

export function buildViewWhere(
  view: TaskViewKey,
  userId: string,
  canViewAll: boolean,
): Prisma.TaskWhereInput {
  const taskItemWhere = assignedTaskItemWhere(userId);

  if (view === "all") return buildAccessWhere(userId, canViewAll);

  if (view === "mine") {
    return {
      OR: [{ createdByUserId: userId }, { assignedToUserId: userId }, taskItemWhere],
    };
  }

  if (view === "assigned") {
    return { OR: [{ assignedToUserId: userId }, taskItemWhere] };
  }

  if (view === "delegated") return { createdByUserId: userId };

  return buildAccessWhere(userId, canViewAll);
}

export function buildDueWhere(due?: TaskDueKey): Prisma.TaskWhereInput {
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
  if (due === "THIS_WEEK") return { dueAt: { gte: today, lt: endOfThisWeek() } };
  if (due === "NO_DUE") return { dueAt: null };

  return {};
}

export function buildFilterWhere(filters: TaskListFilters): Prisma.TaskWhereInput {
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

export function createLinkData(
  input: Partial<CreateTaskInput | EnsureSystemTaskInput | CreateTaskItemInput>,
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

export function updateLinkData(input: Partial<UpdateTaskInput>) {
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
    if (key in input) data[key] = input[key] ?? null;
  }

  return data;
}

export function systemTaskIdentityWhere(
  input: EnsureSystemTaskInput,
): Prisma.TaskWhereInput {
  return {
    source: TaskSource.SYSTEM,
    title: input.title.trim(),
    ...createLinkData(input),
  };
}

export function hasAnyLink(
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

export function relatedTaskWhere(
  input: CompleteRelatedTasksInput | FindOpenRelatedTasksInput,
): Prisma.TaskWhereInput {
  return {
    ...(input.kind ? { kind: input.kind } : {}),
    ...(input.watchId ? { watchId: input.watchId } : {}),
    ...(input.orderId ? { orderId: input.orderId } : {}),
    ...(input.shipmentId ? { shipmentId: input.shipmentId } : {}),
    ...(input.acquisitionId ? { acquisitionId: input.acquisitionId } : {}),
    ...(input.serviceRequestId ? { serviceRequestId: input.serviceRequestId } : {}),
    ...(input.technicalIssueId ? { technicalIssueId: input.technicalIssueId } : {}),
    ...(input.paymentId ? { paymentId: input.paymentId } : {}),
    ...(input.workCaseId ? { workCaseId: input.workCaseId } : {}),
  };
}
