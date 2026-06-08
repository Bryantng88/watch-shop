import { Prisma, TaskKind, TaskStatus, type TaskPriority } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { CompleteRelatedTasksInput, CreateTaskInput, FindOpenRelatedTasksInput, RelatedTaskSuggestion, TaskListFilters, TaskViewKey, UpdateTaskInput } from "./task.types";

export const TASK_INCLUDE = {
  createdByUser: { select: { id: true, name: true, email: true } },
  assignedToUser: { select: { id: true, name: true, email: true } },
  completedByUser: { select: { id: true, name: true, email: true } },
  cancelledByUser: { select: { id: true, name: true, email: true } },
  watch: { select: { id: true, productId: true, product: { select: { title: true, primaryImageUrl: true } } } },
  order: { select: { id: true, refNo: true, customerName: true } },
  shipment: { select: { id: true, refNo: true, orderRefNo: true, status: true } },
  acquisition: { select: { id: true, refNo: true } },
  serviceRequest: { select: { id: true, refNo: true, status: true } },
  technicalIssue: { select: { id: true, area: true, executionStatus: true, serviceRequestId: true } },
  payment: { select: { id: true, refNo: true, status: true, amount: true, currency: true } },
  taskType: { select: { id: true, code: true, name: true, domain: true, legacyKind: true, defaultPriority: true, completionMode: true, completionRuleKey: true, isActive: true } },
} satisfies Prisma.TaskInclude;

export type TaskWithRelations = Prisma.TaskGetPayload<{ include: typeof TASK_INCLUDE }>;

function toDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

function buildAccessWhere(userId: string, canViewAll: boolean): Prisma.TaskWhereInput {
  if (canViewAll) return {};
  return {
    OR: [{ createdByUserId: userId }, { assignedToUserId: userId }],
  };
}

function buildViewWhere(view: TaskViewKey, userId: string, canViewAll: boolean): Prisma.TaskWhereInput {
  if (view === "mine") {
    return { createdByUserId: userId, assignedToUserId: userId };
  }

  if (view === "assigned") {
    return { assignedToUserId: userId, NOT: { createdByUserId: userId } };
  }

  if (view === "delegated") {
    return { createdByUserId: userId, NOT: { assignedToUserId: userId } };
  }

  return buildAccessWhere(userId, canViewAll);
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
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status === "OPEN" ? { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } : filters.status;
  }

  if (filters.priority && filters.priority !== "ALL") where.priority = filters.priority as TaskPriority;
  if (filters.kind && filters.kind !== "ALL") where.kind = filters.kind as TaskKind;
  if (filters.taskTypeId && filters.taskTypeId !== "ALL") where.taskTypeId = filters.taskTypeId;

  return where;
}


function buildLinkWhere(input: Partial<FindOpenRelatedTasksInput | CompleteRelatedTasksInput>): Prisma.TaskWhereInput {
  return {
    ...(input.watchId ? { watchId: input.watchId } : {}),
    ...(input.orderId ? { orderId: input.orderId } : {}),
    ...(input.shipmentId ? { shipmentId: input.shipmentId } : {}),
    ...(input.acquisitionId ? { acquisitionId: input.acquisitionId } : {}),
    ...(input.serviceRequestId ? { serviceRequestId: input.serviceRequestId } : {}),
    ...(input.technicalIssueId ? { technicalIssueId: input.technicalIssueId } : {}),
    ...(input.paymentId ? { paymentId: input.paymentId } : {}),
  };
}

function normalizeTaskTypeCode(code?: string | null) {
  return String(code ?? "").trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

function toRelatedTaskSuggestion(task: TaskWithRelations): RelatedTaskSuggestion {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueAt: task.dueAt,
    priority: task.priority,
    status: task.status,
    taskType: task.taskType
      ? { id: task.taskType.id, code: task.taskType.code, name: task.taskType.name }
      : null,
    assignedToUser: task.assignedToUser
      ? {
          id: task.assignedToUser.id,
          name: task.assignedToUser.name,
          email: task.assignedToUser.email,
        }
      : null,
  };
}

function cleanLinks(input: Partial<CreateTaskInput | UpdateTaskInput>) {
  return {
    watchId: input.watchId ?? null,
    orderId: input.orderId ?? null,
    shipmentId: input.shipmentId ?? null,
    acquisitionId: input.acquisitionId ?? null,
    serviceRequestId: input.serviceRequestId ?? null,
    technicalIssueId: input.technicalIssueId ?? null,
    paymentId: input.paymentId ?? null,
  };
}

export async function listTasksRepo(db: DB, input: { userId: string; canViewAll?: boolean; filters: TaskListFilters }) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.filters.pageSize || 25)));
  const view = input.filters.view || "mine";

  const where: Prisma.TaskWhereInput = {
    AND: [
      buildViewWhere(view, input.userId, Boolean(input.canViewAll)),
      buildFilterWhere(input.filters),
    ],
  };

  const [items, total] = await Promise.all([
    client.task.findMany({
      where,
      include: TASK_INCLUDE,
      orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    client.task.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function countTaskViewsRepo(db: DB, input: { userId: string; canViewAll?: boolean }) {
  const client = dbOrTx(db);
  const openWhere: Prisma.TaskWhereInput = { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } };
  const canViewAll = Boolean(input.canViewAll);
  const userId = input.userId;

  const [mine, assigned, delegated, all] = await Promise.all([
    client.task.count({ where: { AND: [buildViewWhere("mine", userId, canViewAll), openWhere] } }),
    client.task.count({ where: { AND: [buildViewWhere("assigned", userId, canViewAll), openWhere] } }),
    client.task.count({ where: { AND: [buildViewWhere("delegated", userId, canViewAll), openWhere] } }),
    client.task.count({ where: { AND: [buildViewWhere("all", userId, canViewAll), openWhere] } }),
  ]);

  return { mine, assigned, delegated, all };
}

export async function createTaskRepo(db: DB, input: CreateTaskInput & { createdByUserId?: string | null }) {
  const client = dbOrTx(db);
  const createdByUserId = input.createdByUserId ?? null;
  const assignedToUserId = input.assignedToUserId ?? createdByUserId;

  return client.task.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      source: input.source ?? "MANUAL",
      kind: input.kind ?? TaskKind.PERSONAL,
      taskTypeId: input.taskTypeId || null,
      priority: input.priority ?? "MEDIUM",
      dueAt: toDate(input.dueAt),
      createdByUserId,
      assignedToUserId,
      ...cleanLinks(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function updateTaskRepo(db: DB, id: string, input: UpdateTaskInput) {
  const client = dbOrTx(db);
  return client.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.kind !== undefined ? { kind: input.kind } : {}),
      ...(input.taskTypeId !== undefined ? { taskTypeId: input.taskTypeId || null } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueAt !== undefined ? { dueAt: toDate(input.dueAt) } : {}),
      ...(input.assignedToUserId !== undefined ? { assignedToUserId: input.assignedToUserId || null } : {}),
      ...cleanLinks(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function getTaskByIdRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  return client.task.findUnique({ where: { id }, include: TASK_INCLUDE });
}

export async function setTaskStatusRepo(db: DB, input: { id: string; status: TaskStatus; actorUserId?: string | null }) {
  const client = dbOrTx(db);
  const now = new Date();
  const data: Prisma.TaskUpdateInput = { status: input.status };

  if (input.status === TaskStatus.IN_PROGRESS) data.startedAt = now;
  if (input.status === TaskStatus.DONE) {
    data.completedAt = now;
    data.cancelledAt = null;
    if (input.actorUserId) data.completedByUser = { connect: { id: input.actorUserId } };
  }
  if (input.status === TaskStatus.CANCELLED) {
    data.cancelledAt = now;
    if (input.actorUserId) data.cancelledByUser = { connect: { id: input.actorUserId } };
  }
  if (input.status === TaskStatus.TODO) {
    data.startedAt = null;
    data.completedAt = null;
    data.cancelledAt = null;
    data.completedByUser = { disconnect: true };
    data.cancelledByUser = { disconnect: true };
  }

  return client.task.update({ where: { id: input.id }, data, include: TASK_INCLUDE });
}

export async function completeRelatedTasksRepo(db: DB, input: CompleteRelatedTasksInput) {
  const client = dbOrTx(db);
  const where: Prisma.TaskWhereInput = {
    kind: input.kind,
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    ...buildLinkWhere(input),
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


export async function findOpenRelatedTasksRepo(db: DB, input: FindOpenRelatedTasksInput) {
  const client = dbOrTx(db);
  const taskTypeCode = normalizeTaskTypeCode(input.taskTypeCode);
  const where: Prisma.TaskWhereInput = {
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    ...buildLinkWhere(input),
    ...(input.taskTypeId ? { taskTypeId: input.taskTypeId } : {}),
    ...(taskTypeCode ? { taskType: { code: taskTypeCode } } : {}),
    ...(!input.taskTypeId && !taskTypeCode && input.kind ? { kind: input.kind } : {}),
  };

  const items = await client.task.findMany({
    where,
    include: TASK_INCLUDE,
    orderBy: [{ dueAt: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
    take: Math.min(50, Math.max(1, input.limit ?? 10)),
  });

  return items.map(toRelatedTaskSuggestion);
}

export async function completeTasksByIdsRepo(db: DB, input: { ids: string[]; completedByUserId?: string | null }) {
  const client = dbOrTx(db);
  const ids = Array.from(new Set(input.ids.map((id) => String(id).trim()).filter(Boolean)));
  if (!ids.length) return { count: 0 };

  return client.task.updateMany({
    where: {
      id: { in: ids },
      status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    },
    data: {
      status: TaskStatus.DONE,
      completedAt: new Date(),
      cancelledAt: null,
      completedByUserId: input.completedByUserId ?? null,
    },
  });
}

export async function listAssignableUsersRepo(db: DB) {
  const client = dbOrTx(db);
  return client.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}
