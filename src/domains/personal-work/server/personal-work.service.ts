import {
  AppTagOwnerType,
  AppTagTargetType,
  PersonalTaskShareAccess,
  TaskKind,
  TaskStatus,
  TaskProgressMode,
  type Prisma,
  type TaskPriority,
} from "@prisma/client";
import { prisma } from "@/server/db/client";
import { createTask, getAuthUserId } from "@/domains/task/server/core/task.service";
import { createTaskItemRepo, setTargetTagsRepo } from "@/domains/task/server/core/task.repo";
import { hydrateTaskItemsWithTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import { createBusinessBinding } from "@/domains/task/server/business-binding.repo";
import { isGoogleCalendarConfigured, listPersonalGoogleCalendarEvents } from "./google-calendar.service";
import { reconcilePersonalWorkBindings } from "./personal-work-bindings";
import { categoryFromRow, listPersonalCategories, resolvePersonalCategory, defaultPersonalCategories, mergePersonalCategories } from "./personal-work-categories.service";
import {
  PERSONAL_WORK_DOMAINS,
  PERSONAL_WORK_TYPES,
  type PersonalWorkDomain,
  type PersonalWorkPageData,
  type PersonalWorkTarget,
  type PersonalWorkTargetType,
} from "../shared/personal-work.types";

const domainKeys = new Set<string>(PERSONAL_WORK_DOMAINS.map((item) => item.key));
const workTypeKeys = new Set<string>(
  Object.values(PERSONAL_WORK_TYPES)
    .flat()
    .map((item) => item.key),
);

type PersonalWorkInput = {
  title: string;
  note?: string | null;
  dueAt?: string | null;
  estimatedDays?: number;
  priority?: TaskPriority;
  domain?: PersonalWorkDomain;
  categoryKey?: string;
  workType?: string | null;
  targets?: PersonalWorkTarget[];
  tags?: string[];
};

type ShareInput = { userId: string; accessLevel: PersonalTaskShareAccess };

const personalTaskAccessWhere = (userId: string): Prisma.TaskItemWhereInput => ({
  task: { kind: TaskKind.PERSONAL },
  OR: [
    { task: { createdByUserId: userId } },
    { task: { assignedToUserId: userId } },
    { personalShares: { some: { userId } } },
  ],
});

export async function assertPersonalWorkAccess(
  taskItemId: string,
  auth: unknown,
  required: "VIEW" | "EDIT" | "OWNER" = "VIEW",
) {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const item = await prisma.taskItem.findFirst({
    where: { id: taskItemId, task: { kind: TaskKind.PERSONAL } },
    select: {
      id: true,
      taskId: true,
      status: true,
      progressMode: true,
      checklistLockedAt: true,
      workTypeId: true,
      task: { select: { createdByUserId: true, assignedToUserId: true } },
      personalShares: { where: { userId }, select: { accessLevel: true }, take: 1 },
    },
  });
  if (!item) throw new Error("Không tìm thấy công việc cá nhân");
  const owned = item.task.createdByUserId === userId || item.task.assignedToUserId === userId;
  const sharedAccess = item.personalShares[0]?.accessLevel;
  if (required === "OWNER" && !owned) throw new Error("Chỉ chủ sở hữu mới có thể thực hiện thao tác này");
  if (required === "EDIT" && !owned && sharedAccess !== PersonalTaskShareAccess.EDITOR)
    throw new Error("Bạn chỉ có quyền xem công việc này");
  if (required === "VIEW" && !owned && !sharedAccess) throw new Error("Bạn không có quyền truy cập công việc này");
  return {
    ...item,
    userId,
    access: owned
      ? ("OWNER" as const)
      : sharedAccess === PersonalTaskShareAccess.EDITOR
        ? ("EDITOR" as const)
        : ("VIEWER" as const),
  };
}

function normalizeWorkType(value: unknown, domain: PersonalWorkDomain) {
  const key = String(value || "")
    .trim()
    .toUpperCase();
  const allowed = new Set<string>(PERSONAL_WORK_TYPES[domain].map((item) => item.key));
  return key && workTypeKeys.has(key) && allowed.has(key) ? key : null;
}

function bindingMetadata(target: PersonalWorkTarget): Prisma.InputJsonValue {
  return {
    source: "PERSONAL_WORK",
    targetLabel: target.label,
    targetSecondary: target.secondary,
    targetHref: target.href,
  };
}

function targetFromExecution(execution: {
  targetType: string;
  targetId: string;
  metadataJson: Prisma.JsonValue | null;
}): PersonalWorkTarget | null {
  const metadata =
    execution.metadataJson && typeof execution.metadataJson === "object" && !Array.isArray(execution.metadataJson)
      ? (execution.metadataJson as Prisma.JsonObject)
      : null;
  if (metadata?.source !== "PERSONAL_WORK") return null;
  return {
    type: execution.targetType as PersonalWorkTargetType,
    id: execution.targetId,
    label: String(metadata.targetLabel || execution.targetId),
    secondary: metadata.targetSecondary ? String(metadata.targetSecondary) : null,
    href: String(metadata.targetHref || "#"),
  };
}

const allowedTargets: Record<PersonalWorkDomain, PersonalWorkTargetType[]> = {
  GENERAL: [],
  WORK: [],
  MEDIA: ["WATCH"],
  TECHNICAL: ["WATCH", "SERVICE_REQUEST"],
  SALES: ["WATCH", "PURCHASE_REQUEST"],
  ORDER: ["ORDER"],
  ACQUISITION: ["ACQUISITION"],
};

async function resolvePersonalWorkTarget(
  domain: PersonalWorkDomain,
  target: PersonalWorkTarget | null | undefined,
): Promise<PersonalWorkTarget | null> {
  if (!target) return null;
  if (!allowedTargets[domain].includes(target.type)) throw new Error("Đối tượng liên kết không phù hợp với nghiệp vụ");
  const id = String(target.id || "").trim();
  if (!id) throw new Error("Thiếu đối tượng nghiệp vụ cần liên kết");

  if (target.type === "WATCH") {
    const row = await prisma.watch.findUnique({
      where: { id },
      select: { id: true, productId: true, product: { select: { title: true, sku: true } } },
    });
    if (!row) throw new Error("Không tìm thấy Watch đã chọn");
    return {
      type: "WATCH",
      id: row.id,
      label: row.product.title,
      secondary: row.product.sku,
      href: `/admin/watches/${row.productId}`,
    };
  }
  if (target.type === "ORDER") {
    const row = await prisma.order.findUnique({
      where: { id },
      select: { id: true, refNo: true, customerName: true, shipPhone: true },
    });
    if (!row) throw new Error("Không tìm thấy đơn hàng đã chọn");
    return {
      type: "ORDER",
      id: row.id,
      label: row.refNo || row.customerName || "Đơn hàng",
      secondary: row.customerName || row.shipPhone,
      href: `/admin/orders/${row.id}`,
    };
  }
  if (target.type === "PURCHASE_REQUEST") {
    const row = await prisma.purchaseRequest.findUnique({
      where: { id },
      select: { id: true, reference: true, customerName: true },
    });
    if (!row) throw new Error("Không tìm thấy yêu cầu mua hàng đã chọn");
    return {
      type: "PURCHASE_REQUEST",
      id: row.id,
      label: row.customerName,
      secondary: row.reference,
      href: "/admin/coordination/operation?view=purchase-request-operation-flow",
    };
  }
  if (target.type === "ACQUISITION") {
    const row = await prisma.acquisition.findUnique({
      where: { id },
      select: { id: true, refNo: true, vendor: { select: { name: true } } },
    });
    if (!row) throw new Error("Không tìm thấy phiếu nhập đã chọn");
    return {
      type: "ACQUISITION",
      id: row.id,
      label: row.refNo || row.vendor?.name || "Phiếu nhập",
      secondary: row.vendor?.name || null,
      href: `/admin/acquisitions/${row.id}/edit`,
    };
  }
  const row = await prisma.serviceRequest.findUnique({
    where: { id },
    select: { id: true, refNo: true, skuSnapshot: true, modelSnapshot: true },
  });
  if (!row) throw new Error("Không tìm thấy yêu cầu kỹ thuật đã chọn");
  return {
    type: "SERVICE_REQUEST",
    id: row.id,
    label: row.refNo || row.modelSnapshot || "Yêu cầu kỹ thuật",
    secondary: row.skuSnapshot,
    href: `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(row.id)}`,
  };
}

export function normalizePersonalDomain(value: unknown): PersonalWorkDomain {
  const domain = String(value || "GENERAL")
    .trim()
    .toUpperCase() as PersonalWorkDomain;
  return domainKeys.has(domain) ? domain : "GENERAL";
}

export async function getPersonalWorkPageData(auth: unknown): Promise<PersonalWorkPageData> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const [items, connection, availableUsers, categories] = await Promise.all([
    prisma.taskItem.findMany({
      where: {
        ...personalTaskAccessWhere(userId),
        status: { not: TaskStatus.CANCELLED },
      },
      include: {
        personalCategory: true,
        task: {
          select: {
            createdByUserId: true,
            assignedToUserId: true,
            createdByUser: { select: { id: true, name: true, email: true, avatarUrl: true } },
            assignedToUser: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        personalShares: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
          orderBy: { createdAt: "asc" },
        },
        calendarLinks: { where: { userId }, take: 1 },
        executions: {
          where: { actionType: { not: "CANCELLED" } },
          select: { targetType: true, targetId: true, metadataJson: true },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          include: { actorUser: { select: { id: true, name: true, email: true, avatarUrl: true } } },
          orderBy: { occurredAt: "desc" },
          take: 20,
        },
        checklists: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ isDone: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
    }),
    prisma.googleCalendarConnection.findUnique({ where: { userId } }),
    prisma.user.findMany({
      where: { isActive: true, id: { not: userId } },
      select: { id: true, name: true, email: true, avatarUrl: true },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
    listPersonalCategories(userId),
  ]);
  const tagged = await hydrateTaskItemsWithTagsRepo(prisma, items);
  const ownerIds = [...new Set(items.map(item => item.task.createdByUserId || item.task.assignedToUserId).filter((id): id is string => Boolean(id)))];
  const ownerCategoryRows = await prisma.personalWorkCategory.findMany({ where: { userId: { in: ownerIds } } });
  const ownerCategories = new Map(ownerIds.map(id => [id, mergePersonalCategories(ownerCategoryRows.filter(row => row.userId === id))]));
  let calendarEvents: Awaited<ReturnType<typeof listPersonalGoogleCalendarEvents>> = [];
  let calendarLoadError: string | null = null;
  if (connection) {
    try {
      calendarEvents = await listPersonalGoogleCalendarEvents(userId);
    } catch (error) {
      calendarLoadError = error instanceof Error ? error.message : "Không thể tải Google Calendar";
    }
  }
  return {
    categories,
    items: tagged.map((item) => {
      const names = item.tags.map((tag) => tag.name);
      const domain = item.personalCategory ? categoryFromRow(item.personalCategory).domain : normalizePersonalDomain(names.find((name) => domainKeys.has(name.toUpperCase())));
      const calendar = item.calendarLinks[0];
      const owned = item.task.createdByUserId === userId || item.task.assignedToUserId === userId;
      const share = item.personalShares.find((entry) => entry.userId === userId);
      const owner = item.task.createdByUser || item.task.assignedToUser;
      if (!owner) throw new Error("Công việc cá nhân chưa có chủ sở hữu");
      return {
        id: item.id,
        title: item.title,
        note: item.note,
        status: item.status,
        priority: item.priority,
        dueAt: item.dueAt?.toISOString() ?? null,
        estimatedDays: item.estimatedDays,
        completedAt: item.completedAt?.toISOString() ?? null,
        domain,
        category: item.personalCategory ? categoryFromRow(item.personalCategory) : (ownerCategories.get(owner.id)?.find(c => c.key === domain) ?? defaultPersonalCategories().find(c => c.key === domain)!),
        workType: item.workTypeId,
        targets: item.executions
          .map(targetFromExecution)
          .filter((target): target is PersonalWorkTarget => Boolean(target)),
        progressPercent: item.progressPercent,
        progressMode: item.progressMode,
        checklistLockedAt: item.checklistLockedAt?.toISOString() || null,
        activities: item.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          body: activity.body,
          occurredAt: activity.occurredAt.toISOString(),
          actor: activity.actorUser,
        })),
        checklist: item.checklists.map((entry) => ({ id: entry.id, title: entry.title, isDone: entry.isDone })),
        tags: names.filter((name) => !domainKeys.has(name.toUpperCase())),
        calendar: {
          synced: Boolean(calendar),
          htmlLink: calendar?.eventHtmlLink ?? null,
          lastSyncedAt: calendar?.lastSyncedAt.toISOString() ?? null,
        },
        access: owned
          ? ("OWNER" as const)
          : share?.accessLevel === PersonalTaskShareAccess.EDITOR
            ? ("EDITOR" as const)
            : ("VIEWER" as const),
        owner,
        sharedWith: item.personalShares.map((entry) => ({ user: entry.user, accessLevel: entry.accessLevel })),
      };
    }),
    currentUserId: userId,
    availableUsers,
    calendar: {
      configured: isGoogleCalendarConfigured(),
      connected: Boolean(connection),
      accountEmail: connection?.googleAccountEmail ?? null,
      lastSyncedAt: connection?.lastSyncedAt?.toISOString() ?? null,
      events: calendarEvents,
      loadError: calendarLoadError,
    },
  };
}

export async function createPersonalWorkItem(input: PersonalWorkInput, auth: unknown) {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const title = input.title.trim();
  if (!title) throw new Error("Vui lòng nhập nội dung công việc");
  const category = await resolvePersonalCategory(userId, input.categoryKey || normalizePersonalDomain(input.domain));
  const domain = category.domain;
  const workType = category.id ? null : normalizeWorkType(input.workType, domain);
  const resolvedTargets = await Promise.all(
    (input.targets || []).map((target) => resolvePersonalWorkTarget(domain, target)),
  );
  const targets = [
    ...new Map(
      resolvedTargets
        .filter((target): target is PersonalWorkTarget => Boolean(target))
        .map((target) => [`${target.type}:${target.id}`, target]),
    ).values(),
  ];
  return prisma.$transaction(async (tx) => {
    const taskResult = await createTask(tx, { kind: TaskKind.PERSONAL }, auth);
    const item = await createTaskItemRepo(tx, {
      taskId: taskResult.task.id,
      title,
      note: input.note?.trim() || null,
      ownerUserId: userId,
      assignedToUserId: userId,
      priority: input.priority || "MEDIUM",
      workTypeId: workType,
      dueAt: input.dueAt || null,
      estimatedDays: Math.max(1, Math.min(365, Math.round(input.estimatedDays ?? 1))),
    });
    if (category.id) await tx.taskItem.update({ where: { id: item.id }, data: { personalCategoryId: category.id } });
    await setTargetTagsRepo(tx, {
      ownerType: AppTagOwnerType.TASK,
      ownerId: taskResult.task.id,
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: item.id,
      names: [domain, ...(input.tags || [])],
    });
    for (const target of targets) {
      await createBusinessBinding(tx, {
        taskId: taskResult.task.id,
        taskItemId: item.id,
        targetType: target.type,
        targetId: target.id,
        metadataJson: bindingMetadata(target),
        createdByUserId: userId,
      });
    }
    return item;
  });
}

export async function searchPersonalWorkTargets(input: {
  type: PersonalWorkTargetType;
  query?: string | null;
}): Promise<PersonalWorkTarget[]> {
  const query = String(input.query || "").trim();
  const contains = query ? { contains: query, mode: "insensitive" as const } : undefined;

  if (input.type === "WATCH") {
    const rows = await prisma.watch.findMany({
      where: query ? { product: { OR: [{ title: contains }, { sku: contains }] } } : undefined,
      select: { id: true, productId: true, product: { select: { title: true, sku: true } } },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "WATCH",
      id: row.id,
      label: row.product.title,
      secondary: row.product.sku,
      href: `/admin/watches/${row.productId}`,
    }));
  }
  if (input.type === "ORDER") {
    const rows = await prisma.order.findMany({
      where: query ? { OR: [{ refNo: contains }, { customerName: contains }, { shipPhone: contains }] } : undefined,
      select: { id: true, refNo: true, customerName: true, shipPhone: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "ORDER",
      id: row.id,
      label: row.refNo || row.customerName || "Đơn hàng",
      secondary: row.customerName || row.shipPhone,
      href: `/admin/orders/${row.id}`,
    }));
  }
  if (input.type === "PURCHASE_REQUEST") {
    const rows = await prisma.purchaseRequest.findMany({
      where: query ? { OR: [{ reference: contains }, { customerName: contains }, { phone: contains }] } : undefined,
      select: { id: true, reference: true, customerName: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "PURCHASE_REQUEST",
      id: row.id,
      label: row.customerName,
      secondary: row.reference,
      href: "/admin/coordination/operation?view=purchase-request-operation-flow",
    }));
  }
  if (input.type === "ACQUISITION") {
    const rows = await prisma.acquisition.findMany({
      where: query ? { OR: [{ refNo: contains }, { vendor: { name: contains } }] } : undefined,
      select: { id: true, refNo: true, vendor: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 12,
    });
    return rows.map((row) => ({
      type: "ACQUISITION",
      id: row.id,
      label: row.refNo || row.vendor?.name || "Phiếu nhập",
      secondary: row.vendor?.name || null,
      href: `/admin/acquisitions/${row.id}/edit`,
    }));
  }
  const rows = await prisma.serviceRequest.findMany({
    where: query ? { OR: [{ refNo: contains }, { skuSnapshot: contains }, { modelSnapshot: contains }] } : undefined,
    select: { id: true, refNo: true, skuSnapshot: true, modelSnapshot: true },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });
  return rows.map((row) => ({
    type: "SERVICE_REQUEST",
    id: row.id,
    label: row.refNo || row.modelSnapshot || "Yêu cầu kỹ thuật",
    secondary: row.skuSnapshot,
    href: `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(row.id)}`,
  }));
}

export async function updatePersonalWorkItem(
  input: {
    id: string;
    title?: string;
    note?: string | null;
    dueAt?: string | null;
    estimatedDays?: number;
    priority?: TaskPriority;
    status?: TaskStatus;
    domain?: PersonalWorkDomain;
    categoryKey?: string;
    tags?: string[];
    targets?: PersonalWorkTarget[];
    progressPercent?: number;
    progressMode?: TaskProgressMode;
    updateBody?: string | null;
  },
  auth: unknown,
) {
  const current = await assertPersonalWorkAccess(input.id, auth, "EDIT");
  const ownerId = current.task.createdByUserId || current.task.assignedToUserId;
  const category = input.categoryKey !== undefined
    ? await resolvePersonalCategory(ownerId || current.userId, input.categoryKey)
    : input.domain !== undefined ? await resolvePersonalCategory(ownerId || current.userId, normalizePersonalDomain(input.domain)) : undefined;
  const status = input.status;
  if (status === TaskStatus.DONE && current.progressMode === TaskProgressMode.CHECKLIST && !current.checklistLockedAt) {
    throw new Error("Hãy hoàn thành toàn bộ đầu việc và xác nhận hoàn thành");
  }
  const estimatedDays = input.estimatedDays === undefined
    ? undefined
    : Math.max(1, Math.min(365, Math.round(input.estimatedDays)));
  const progressPercent = input.progressPercent === undefined
    ? undefined
    : Math.max(0, Math.min(100, Math.round(input.progressPercent)));
  const resolvedTargets = input.targets
    ? [
        ...new Map(
          (await Promise.all(
            input.targets.map((target) => resolvePersonalWorkTarget(category?.domain ?? normalizePersonalDomain(input.domain), target)),
          ))
            .filter((target): target is PersonalWorkTarget => Boolean(target))
            .map((target) => [`${target.type}:${target.id}`, target]),
        ).values(),
      ]
    : null;
  await prisma.$transaction(async (tx) => {
    await tx.taskItem.update({
      where: { id: input.id },
      data: {
      ...(category ? { personalCategoryId: category.id, workTypeId: category.id ? null : normalizeWorkType(current.workTypeId, category.domain) } : {}),
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(input.dueAt !== undefined ? { dueAt: input.dueAt ? new Date(input.dueAt) : null } : {}),
      ...(estimatedDays !== undefined ? { estimatedDays } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(progressPercent !== undefined ? { progressPercent } : {}),
      ...(input.progressMode ? { progressMode: input.progressMode } : {}),
      ...(status
        ? {
            status,
            isDone: status === TaskStatus.DONE,
            completedAt: status === TaskStatus.DONE ? new Date() : null,
            startedAt: status === TaskStatus.IN_PROGRESS ? new Date() : undefined,
          }
        : {}),
      },
    });
    if (input.updateBody?.trim() || status || progressPercent !== undefined) {
      await tx.taskItemActivity.create({
        data: {
          taskItemId: input.id,
          sourceType: "DISCUSSION",
          actorUserId: current.userId,
          title: input.updateBody?.trim() ? "Cập nhật tiến độ" : "Cập nhật công việc",
          body: input.updateBody?.trim() || null,
          metadataJson: {
            ...(status ? { status } : {}),
            ...(progressPercent !== undefined ? { progressPercent } : {}),
          },
        },
      });
    }
    if (resolvedTargets) {
      const existingBindings = await tx.taskExecution.findMany({
        where: {
          taskItemId: input.id,
          actionType: { not: "CANCELLED" },
          metadataJson: { path: ["source"], equals: "PERSONAL_WORK" },
        },
        select: { id: true, targetType: true, targetId: true },
      });
      const { added, removed } = reconcilePersonalWorkBindings(existingBindings, resolvedTargets);

      if (removed.length) {
        await tx.taskExecution.updateMany({
          where: { id: { in: removed.map((binding) => binding.id) } },
          data: { actionType: "CANCELLED" },
        });
      }
      for (const target of added) {
        await createBusinessBinding(tx, {
          taskId: current.taskId,
          taskItemId: current.id,
          targetType: target.type,
          targetId: target.id,
          metadataJson: bindingMetadata(target),
          createdByUserId: current.userId,
        });
      }
      if (added.length || removed.length) {
        await tx.taskItemActivity.create({
          data: {
            taskItemId: input.id,
            sourceType: "DISCUSSION",
            actorUserId: current.userId,
            title: "Cập nhật đối tượng liên kết",
            metadataJson: {
              added: added.map((target) => ({ targetType: target.type, targetId: target.id })),
              removed: removed.map((binding) => ({
                targetType: binding.targetType,
                targetId: binding.targetId,
              })),
            },
          },
        });
      }
    }
    if (input.domain || input.tags || category) {
      await setTargetTagsRepo(tx, {
        ownerType: AppTagOwnerType.TASK,
        ownerId: current.taskId,
        targetType: AppTagTargetType.TASK_ITEM,
        targetId: current.id,
        names: [category?.domain ?? normalizePersonalDomain(input.domain), ...(input.tags || [])],
      });
    }
  });
}

function checklistProgress(total: number, done: number) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

async function updateChecklistProgress(tx: Prisma.TransactionClient, taskItemId: string) {
  const [total, done, item] = await Promise.all([
    tx.taskItemChecklist.count({ where: { taskItemId } }),
    tx.taskItemChecklist.count({ where: { taskItemId, isDone: true } }),
    tx.taskItem.findUniqueOrThrow({ where: { id: taskItemId }, select: { status: true, startedAt: true } }),
  ]);
  const progressPercent = checklistProgress(total, done);
  await tx.taskItem.update({
    where: { id: taskItemId },
    data: {
      progressMode: TaskProgressMode.CHECKLIST,
      progressPercent,
      ...(progressPercent > 0 && item.status === TaskStatus.TODO
        ? { status: TaskStatus.IN_PROGRESS, startedAt: item.startedAt || new Date() }
        : {}),
    },
  });
  return { total, done, progressPercent };
}

function assertChecklistOpen(item: { status: TaskStatus; checklistLockedAt: Date | null }) {
  if (item.status === TaskStatus.DONE || item.checklistLockedAt) {
    throw new Error("Danh sách đầu việc đã được khóa sau khi hoàn thành");
  }
  if (item.status === TaskStatus.CANCELLED) throw new Error("Công việc đã bị hủy");
}

export async function addPersonalWorkChecklistItem(taskItemId: string, title: string, auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  assertChecklistOpen(current);
  const normalizedTitle = title.trim();
  if (!normalizedTitle) throw new Error("Vui lòng nhập tên đầu việc");
  if (normalizedTitle.length > 500) throw new Error("Tên đầu việc không được vượt quá 500 ký tự");
  return prisma.$transaction(async (tx) => {
    const last = await tx.taskItemChecklist.findFirst({
      where: { taskItemId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const checklist = await tx.taskItemChecklist.create({
      data: { taskItemId, title: normalizedTitle, sortOrder: (last?.sortOrder || 0) + 1 },
    });
    await updateChecklistProgress(tx, taskItemId);
    return checklist;
  });
}

export async function setPersonalWorkChecklistItemDone(
  taskItemId: string,
  checklistItemId: string,
  isDone: boolean,
  auth: unknown,
) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  assertChecklistOpen(current);
  return prisma.$transaction(async (tx) => {
    const result = await tx.taskItemChecklist.updateMany({
      where: { id: checklistItemId, taskItemId },
      data: { isDone, doneAt: isDone ? new Date() : null },
    });
    if (!result.count) throw new Error("Không tìm thấy đầu việc");
    return updateChecklistProgress(tx, taskItemId);
  });
}

export async function deletePersonalWorkChecklistItem(taskItemId: string, checklistItemId: string, auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  assertChecklistOpen(current);
  return prisma.$transaction(async (tx) => {
    const result = await tx.taskItemChecklist.deleteMany({ where: { id: checklistItemId, taskItemId } });
    if (!result.count) throw new Error("Không tìm thấy đầu việc");
    return updateChecklistProgress(tx, taskItemId);
  });
}

export async function finalizePersonalWorkChecklist(taskItemId: string, auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "EDIT");
  assertChecklistOpen(current);
  return prisma.$transaction(async (tx) => {
    const [total, done] = await Promise.all([
      tx.taskItemChecklist.count({ where: { taskItemId } }),
      tx.taskItemChecklist.count({ where: { taskItemId, isDone: true } }),
    ]);
    if (total === 0) throw new Error("Hãy thêm ít nhất một đầu việc trước khi hoàn thành");
    if (done !== total) throw new Error(`Còn ${total - done} đầu việc chưa hoàn thành`);
    const completedAt = new Date();
    await tx.taskItem.update({
      where: { id: taskItemId },
      data: {
        status: TaskStatus.DONE,
        isDone: true,
        progressMode: TaskProgressMode.CHECKLIST,
        progressPercent: 100,
        completedAt,
        checklistLockedAt: completedAt,
      },
    });
    await tx.taskItemActivity.create({
      data: {
        taskItemId,
        sourceType: "DISCUSSION",
        actorUserId: current.userId,
        title: "Xác nhận hoàn thành",
        body: `Đã hoàn thành ${total}/${total} đầu việc và khóa danh sách.`,
        metadataJson: { status: TaskStatus.DONE, progressPercent: 100, checklistLocked: true },
      },
    });
    return { total, done };
  });
}

export async function replacePersonalWorkShares(taskItemId: string, shares: ShareInput[], auth: unknown) {
  const current = await assertPersonalWorkAccess(taskItemId, auth, "OWNER");
  const unique = new Map(
    shares.filter((share) => share.userId !== current.userId).map((share) => [share.userId, share.accessLevel]),
  );
  const users = await prisma.user.findMany({
    where: { id: { in: [...unique.keys()] }, isActive: true },
    select: { id: true },
  });
  if (users.length !== unique.size) throw new Error("Có người nhận không còn hoạt động hoặc không tồn tại");
  await prisma.$transaction(async (tx) => {
    await tx.personalTaskShare.deleteMany({ where: { taskItemId } });
    if (unique.size) {
      await tx.personalTaskShare.createMany({
        data: [...unique].map(([userId, accessLevel]) => ({
          taskItemId,
          userId,
          accessLevel,
          sharedByUserId: current.userId,
        })),
      });
    }
  });
}
