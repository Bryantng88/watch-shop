import { Prisma, TaskDomain, TaskSource, TaskStatus, type TaskPriority } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { CompleteRelatedTasksInput, CreateTaskInput, EnsureSystemTaskInput, EnsureSystemTaskResult, TaskDueKey, TaskListFilters, TaskViewKey, UpdateTaskInput } from "./task.types";
import type { FindOpenRelatedTasksInput } from "./task.types";

export const TASK_INCLUDE = {
  createdByUser: { select: { id: true, name: true, email: true } },
  assignedToUser: { select: { id: true, name: true, email: true } },
  completedByUser: { select: { id: true, name: true, email: true } },
  cancelledByUser: { select: { id: true, name: true, email: true } },
  watch: { select: { id: true, productId: true, product: { select: { title: true, primaryImageUrl: true, sku: true } } } },
  order: { select: { id: true, refNo: true, customerName: true, status: true, paymentStatus: true } },
  shipment: { select: { id: true, refNo: true, orderRefNo: true, status: true } },
  acquisition: { select: { id: true, refNo: true } },
  serviceRequest: { select: { id: true, refNo: true, status: true } },
  technicalIssue: { select: { id: true, area: true, executionStatus: true, serviceRequestId: true, priority: true } },
  payment: { select: { id: true, refNo: true, status: true, amount: true, currency: true, type: true, purpose: true } },
  workCase: { select: { id: true, refNo: true, title: true, status: true, watch: { select: { id: true, productId: true, product: { select: { title: true, sku: true, primaryImageUrl: true } } } } } },
  taskType: { select: { id: true, code: true, name: true, domain: true } },
  executions: {
    orderBy: { createdAt: "desc" },
    include: { createdByUser: { select: { id: true, name: true, email: true } } },
  },
} satisfies Prisma.TaskInclude;

export type TaskWithRelations = Prisma.TaskGetPayload<{ include: typeof TASK_INCLUDE }>;

function toDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

function inferTaskDomain(input: Partial<CreateTaskInput | UpdateTaskInput | EnsureSystemTaskInput>) {
  if (input.watchId) return TaskDomain.WATCH;
  if (input.orderId) return TaskDomain.ORDER;
  if (input.shipmentId) return TaskDomain.SHIPMENT;
  if (input.serviceRequestId) return TaskDomain.SERVICE;
  if (input.technicalIssueId) return TaskDomain.TECHNICAL_ISSUE;
  if (input.paymentId) return TaskDomain.PAYMENT;
  if (input.acquisitionId) return TaskDomain.ACQUISITION;
  if (input.workCaseId) return TaskDomain.WORK_CASE;
  return TaskDomain.GENERAL;
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

function buildAccessWhere(userId: string, canViewAll: boolean): Prisma.TaskWhereInput {
  if (canViewAll) return {};
  return { OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] };
}

function buildViewWhere(view: TaskViewKey, userId: string, canViewAll: boolean): Prisma.TaskWhereInput {
  if (view === "mine") return { assignedToUserId: userId };
  if (view === "assigned") return { assignedToUserId: userId, NOT: { createdByUserId: userId } };
  if (view === "delegated") return { createdByUserId: userId, NOT: { assignedToUserId: userId } };
  return buildAccessWhere(userId, canViewAll);
}

function buildDueWhere(due?: TaskDueKey): Prisma.TaskWhereInput {
  if (!due || due === "ALL") return {};
  const today = startOfToday();
  const tomorrow = startOfTomorrow();
  if (due === "OVERDUE") return { dueAt: { lt: today }, status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } };
  if (due === "TODAY") return { dueAt: { gte: today, lt: tomorrow } };
  if (due === "THIS_WEEK") return { dueAt: { gte: today, lt: endOfThisWeek() } };
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
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status === "OPEN" ? { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } : filters.status;
  }
  if (filters.priority && filters.priority !== "ALL") where.priority = filters.priority as TaskPriority;
  if (filters.domain && filters.domain !== "ALL") where.domain = filters.domain;
  if (filters.taskTypeId && filters.taskTypeId !== "ALL") where.taskTypeId = filters.taskTypeId;
  if (filters.mode && filters.mode !== "ALL") where.mode = filters.mode;

  const dueWhere = buildDueWhere(filters.due);
  return Object.keys(dueWhere).length ? { AND: [where, dueWhere] } : where;
}

function cleanLinks(input: Partial<CreateTaskInput | UpdateTaskInput | EnsureSystemTaskInput>) {
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

function systemTaskIdentityWhere(input: EnsureSystemTaskInput): Prisma.TaskWhereInput {
  return {
    source: TaskSource.SYSTEM,
    domain: input.domain,
    taskTypeId: input.taskTypeId ?? null,
    mode: input.mode ?? "NORMAL",
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
    AND: [buildViewWhere(view, input.userId, Boolean(input.canViewAll)), buildFilterWhere(input.filters)],
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

export async function countTaskDueBucketsRepo(db: DB, input: { userId: string; canViewAll?: boolean; view?: TaskViewKey }) {
  const client = dbOrTx(db);
  const base: Prisma.TaskWhereInput = {
    AND: [buildViewWhere(input.view || "mine", input.userId, Boolean(input.canViewAll)), { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } }],
  };
  const today = startOfToday();
  const tomorrow = startOfTomorrow();
  const weekEnd = endOfThisWeek();

  const [overdue, todayCount, thisWeek, noDue] = await Promise.all([
    client.task.count({ where: { AND: [base, { dueAt: { lt: today } }] } }),
    client.task.count({ where: { AND: [base, { dueAt: { gte: today, lt: tomorrow } }] } }),
    client.task.count({ where: { AND: [base, { dueAt: { gte: today, lt: weekEnd } }] } }),
    client.task.count({ where: { AND: [base, { dueAt: null }] } }),
  ]);

  return { overdue, today: todayCount, thisWeek, noDue };
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
      domain: input.domain ?? inferTaskDomain(input),
      taskTypeId: input.taskTypeId ?? null,
      mode: input.mode ?? "NORMAL",
      priority: input.priority ?? "MEDIUM",
      dueAt: toDate(input.dueAt),
      createdByUserId,
      assignedToUserId,
      ...cleanLinks(input),
    },
    include: TASK_INCLUDE,
  });
}

export async function ensureSystemTaskRepo(db: DB, input: EnsureSystemTaskInput): Promise<EnsureSystemTaskResult> {
  const client = dbOrTx(db);
  const existing = await client.task.findFirst({ where: systemTaskIdentityWhere(input), select: { id: true, status: true } });
  const dueAt = toDate(input.dueAt);

  if (!existing) {
    const created = await client.task.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        source: TaskSource.SYSTEM,
        domain: input.domain,
        taskTypeId: input.taskTypeId ?? null,
        mode: input.mode ?? "NORMAL",
        priority: input.priority ?? "MEDIUM",
        dueAt,
        createdByUserId: input.createdByUserId ?? null,
        assignedToUserId: input.assignedToUserId ?? input.createdByUserId ?? null,
        ...cleanLinks(input),
      },
      select: { id: true },
    });
    return { id: created.id, created: true, reopened: false };
  }

  const reopened = existing.status === TaskStatus.DONE || existing.status === TaskStatus.CANCELLED;
  await client.task.update({
    where: { id: existing.id },
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      priority: input.priority ?? "MEDIUM",
      dueAt,
      assignedToUserId: input.assignedToUserId ?? input.createdByUserId ?? null,
      ...(reopened ? { status: TaskStatus.TODO, completedAt: null, cancelledAt: null, completedByUserId: null, cancelledByUserId: null } : {}),
    },
  });

  return { id: existing.id, created: false, reopened };
}

export async function updateTaskRepo(db: DB, id: string, input: UpdateTaskInput) {
  const client = dbOrTx(db);
  return client.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.domain !== undefined ? { domain: input.domain } : {}),
      ...(input.taskTypeId !== undefined ? { taskTypeId: input.taskTypeId || null } : {}),
      ...(input.mode !== undefined ? { mode: input.mode } : {}),
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
    ...(input.domain ? { domain: input.domain } : {}),
    ...(input.taskTypeId ? { taskTypeId: input.taskTypeId } : {}),
    ...(input.mode ? { mode: input.mode } : {}),
    status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
    ...(input.watchId ? { watchId: input.watchId } : {}),
    ...(input.orderId ? { orderId: input.orderId } : {}),
    ...(input.shipmentId ? { shipmentId: input.shipmentId } : {}),
    ...(input.acquisitionId ? { acquisitionId: input.acquisitionId } : {}),
    ...(input.serviceRequestId ? { serviceRequestId: input.serviceRequestId } : {}),
    ...(input.technicalIssueId ? { technicalIssueId: input.technicalIssueId } : {}),
    ...(input.paymentId ? { paymentId: input.paymentId } : {}),
  };

  return client.task.updateMany({
    where,
    data: { status: TaskStatus.DONE, completedAt: new Date(), completedByUserId: input.completedByUserId ?? null },
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
export async function findOpenRelatedTasksRepo(
  db: DB,
  input: FindOpenRelatedTasksInput,
) {
  const client = dbOrTx(db);

  return client.task.findMany({
    where: {
      status: {
        in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
      },
      ...(input.domain ? { domain: input.domain } : {}),
      ...(input.taskTypeId ? { taskTypeId: input.taskTypeId } : {}),
      ...(input.watchId ? { watchId: input.watchId } : {}),
      ...(input.paymentId ? { paymentId: input.paymentId } : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      domain: true,
      taskTypeId: true,
      mode: true,
      status: true,
      priority: true,
      dueAt: true,
      assignedToUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: input.limit ?? 10,
  });
}