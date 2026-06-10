import { Prisma, WorkCaseStatus, type TaskPriority } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type {
  CreateWorkCaseCategoryInput,
  CreateWorkCaseInput,
  UpdateWorkCaseCategoryInput,
  UpdateWorkCaseInput,
  WorkCaseListFilters,
  WorkCaseViewKey,
} from "./work-case.types";

export const WORK_CASE_INCLUDE = {
  category: true,
  raisedByUser: { select: { id: true, name: true, email: true } },
  assignedToUser: { select: { id: true, name: true, email: true } },
  watch: {
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          primaryImageUrl: true,
          productImage: {
            where: { role: "INLINE" as any },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: { id: true, fileKey: true },
          },
        },
      },
    },
  },
  tasks: {
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true, priority: true, assignedToUser: { select: { id: true, name: true, email: true } } },
  },
  serviceRequests: {
    orderBy: { createdAt: "desc" },
    select: { id: true, refNo: true, status: true, productId: true },
  },
  activities: {
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { actor: { select: { id: true, name: true, email: true } } },
  },
} satisfies Prisma.WorkCaseInclude;

export type WorkCaseWithRelations = Prisma.WorkCaseGetPayload<{ include: typeof WORK_CASE_INCLUDE }>;

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function buildAccessWhere(userId: string, canViewAll: boolean): Prisma.WorkCaseWhereInput {
  if (canViewAll) return {};
  return {
    OR: [{ raisedByUserId: userId }, { assignedToUserId: userId }],
  };
}

function buildViewWhere(view: WorkCaseViewKey, userId: string, canViewAll: boolean): Prisma.WorkCaseWhereInput {
  if (view === "raised") return { raisedByUserId: userId };
  if (view === "assigned") return { assignedToUserId: userId };
  if (view === "mine") return { OR: [{ raisedByUserId: userId }, { assignedToUserId: userId }] };
  return buildAccessWhere(userId, canViewAll);
}

function buildFilterWhere(filters: WorkCaseListFilters): Prisma.WorkCaseWhereInput {
  const where: Prisma.WorkCaseWhereInput = {};
  const q = normalizeText(filters.q);

  if (q) {
    where.OR = [
      { refNo: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { watch: { product: { title: { contains: q, mode: "insensitive" } } } },
      { watch: { product: { sku: { contains: q, mode: "insensitive" } } } },
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status === "OPEN"
      ? { in: [WorkCaseStatus.NEW, WorkCaseStatus.TRIAGED, WorkCaseStatus.IN_PROGRESS] }
      : filters.status;
  }

  if (filters.scope && filters.scope !== "ALL") where.scope = filters.scope;
  if (filters.priority && filters.priority !== "ALL") where.priority = filters.priority as TaskPriority;

  return where;
}

export async function listWorkCasesRepo(db: DB, input: { userId: string; canViewAll?: boolean; filters: WorkCaseListFilters }) {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.filters.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.filters.pageSize || 25)));
  const view = input.filters.view || "mine";

  const where: Prisma.WorkCaseWhereInput = {
    AND: [
      buildViewWhere(view, input.userId, Boolean(input.canViewAll)),
      buildFilterWhere(input.filters),
    ],
  };

  const [items, total] = await Promise.all([
    client.workCase.findMany({
      where,
      include: WORK_CASE_INCLUDE,
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    client.workCase.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function countWorkCaseViewsRepo(db: DB, input: { userId: string; canViewAll?: boolean }) {
  const client = dbOrTx(db);
  const userId = input.userId;
  const canViewAll = Boolean(input.canViewAll);
  const openWhere: Prisma.WorkCaseWhereInput = { status: { in: [WorkCaseStatus.NEW, WorkCaseStatus.TRIAGED, WorkCaseStatus.IN_PROGRESS] } };

  const [mine, raised, assigned, all] = await Promise.all([
    client.workCase.count({ where: { AND: [buildViewWhere("mine", userId, canViewAll), openWhere] } }),
    client.workCase.count({ where: { AND: [buildViewWhere("raised", userId, canViewAll), openWhere] } }),
    client.workCase.count({ where: { AND: [buildViewWhere("assigned", userId, canViewAll), openWhere] } }),
    client.workCase.count({ where: { AND: [buildViewWhere("all", userId, canViewAll), openWhere] } }),
  ]);

  return { mine, raised, assigned, all };
}

function buildRefNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `WC-${y}${m}${d}-${suffix}`;
}

export async function createWorkCaseRepo(db: DB, input: CreateWorkCaseInput & { raisedByUserId?: string | null }) {
  const client = dbOrTx(db);
  return client.workCase.create({
    data: {
      refNo: buildRefNo(),
      title: input.title.trim(),
      description: input.description?.trim() || null,
      scope: input.scope,
      priority: input.priority ?? "MEDIUM",
      watchId: input.watchId,
      categoryId: input.categoryId || null,
      raisedByUserId: input.raisedByUserId ?? null,
      assignedToUserId: input.assignedToUserId || null,
      activities: {
        create: {
          actorId: input.raisedByUserId ?? null,
          action: "RAISED",
          note: "Phiếu xử lý được tạo.",
        },
      },
    },
    include: WORK_CASE_INCLUDE,
  });
}

export async function updateWorkCaseRepo(db: DB, id: string, input: UpdateWorkCaseInput & { actorUserId?: string | null }) {
  const client = dbOrTx(db);
  const now = new Date();
  const status = input.status;

  return client.workCase.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.scope !== undefined ? { scope: input.scope } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId || null } : {}),
      ...(input.assignedToUserId !== undefined ? { assignedToUserId: input.assignedToUserId || null } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(status === WorkCaseStatus.TRIAGED ? { triagedAt: now } : {}),
      ...(status === WorkCaseStatus.RESOLVED ? { resolvedAt: now, cancelledAt: null } : {}),
      ...(status === WorkCaseStatus.CANCELLED ? { cancelledAt: now } : {}),
      activities: {
        create: {
          actorId: input.actorUserId ?? null,
          action: status ? `STATUS_${status}` : "UPDATED",
          note: status ? `Cập nhật trạng thái: ${status}` : "Cập nhật phiếu xử lý.",
        },
      },
    },
    include: WORK_CASE_INCLUDE,
  });
}

export async function getWorkCaseByIdRepo(db: DB, id: string) {
  const client = dbOrTx(db);
  return client.workCase.findUnique({ where: { id }, include: WORK_CASE_INCLUDE });
}

export async function listAssignableUsersRepo(db: DB) {
  const client = dbOrTx(db);
  return client.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}

export async function listWorkCaseCategoriesRepo(db: DB, onlyActive = true) {
  const client = dbOrTx(db);
  return client.workCaseCategory.findMany({
    where: onlyActive ? { isActive: true } : {},
    orderBy: [{ scope: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function createWorkCaseCategoryRepo(db: DB, input: CreateWorkCaseCategoryInput) {
  const client = dbOrTx(db);
  return client.workCaseCategory.create({
    data: {
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      scope: input.scope,
      isActive: input.isActive ?? true,
      sortOrder: Number(input.sortOrder ?? 0),
    },
  });
}

export async function updateWorkCaseCategoryRepo(db: DB, id: string, input: UpdateWorkCaseCategoryInput) {
  const client = dbOrTx(db);
  return client.workCaseCategory.update({
    where: { id },
    data: {
      ...(input.code !== undefined ? { code: input.code.trim().toUpperCase() } : {}),
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.scope !== undefined ? { scope: input.scope } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: Number(input.sortOrder) } : {}),
    },
  });
}
