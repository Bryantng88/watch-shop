import { AppTagOwnerType, AppTagTargetType, TaskKind, TaskStatus, type Prisma, type TaskPriority } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { createTask, getAuthUserId } from "@/domains/task/server/core/task.service";
import { createTaskItemRepo, setTargetTagsRepo } from "@/domains/task/server/core/task.repo";
import { hydrateTaskItemsWithTagsRepo } from "@/domains/task/server/tag/task-tag.repo";
import { createBusinessBinding } from "@/domains/task/server/business-binding.repo";
import { isGoogleCalendarConfigured, listPersonalGoogleCalendarEvents } from "./google-calendar.service";
import { PERSONAL_WORK_DOMAINS, PERSONAL_WORK_TYPES, type PersonalWorkDomain, type PersonalWorkPageData, type PersonalWorkTarget, type PersonalWorkTargetType } from "../shared/personal-work.types";

const domainKeys = new Set<string>(PERSONAL_WORK_DOMAINS.map((item) => item.key));
const workTypeKeys = new Set<string>(Object.values(PERSONAL_WORK_TYPES).flat().map((item) => item.key));

type PersonalWorkInput = {
  title: string;
  note?: string | null;
  dueAt?: string | null;
  priority?: TaskPriority;
  domain?: PersonalWorkDomain;
  workType?: string | null;
  target?: PersonalWorkTarget | null;
  tags?: string[];
};

function normalizeWorkType(value: unknown, domain: PersonalWorkDomain) {
  const key = String(value || "").trim().toUpperCase();
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

function targetFromExecution(execution: { targetType: string; targetId: string; metadataJson: Prisma.JsonValue | null }): PersonalWorkTarget | null {
  const metadata = execution.metadataJson && typeof execution.metadataJson === "object" && !Array.isArray(execution.metadataJson)
    ? execution.metadataJson as Prisma.JsonObject
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
  GENERAL: [], MEDIA: ["WATCH"], TECHNICAL: ["WATCH", "SERVICE_REQUEST"],
  SALES: ["WATCH", "PURCHASE_REQUEST"], ORDER: ["ORDER"], ACQUISITION: ["ACQUISITION"],
};

async function resolvePersonalWorkTarget(domain: PersonalWorkDomain, target: PersonalWorkTarget | null | undefined): Promise<PersonalWorkTarget | null> {
  if (!target) return null;
  if (!allowedTargets[domain].includes(target.type)) throw new Error("Đối tượng liên kết không phù hợp với nghiệp vụ");
  const id = String(target.id || "").trim();
  if (!id) throw new Error("Thiếu đối tượng nghiệp vụ cần liên kết");

  if (target.type === "WATCH") {
    const row = await prisma.watch.findUnique({ where: { id }, select: { id: true, productId: true, product: { select: { title: true, sku: true } } } });
    if (!row) throw new Error("Không tìm thấy Watch đã chọn");
    return { type: "WATCH", id: row.id, label: row.product.title, secondary: row.product.sku, href: `/admin/watches/${row.productId}` };
  }
  if (target.type === "ORDER") {
    const row = await prisma.order.findUnique({ where: { id }, select: { id: true, refNo: true, customerName: true, shipPhone: true } });
    if (!row) throw new Error("Không tìm thấy đơn hàng đã chọn");
    return { type: "ORDER", id: row.id, label: row.refNo || row.customerName || "Đơn hàng", secondary: row.customerName || row.shipPhone, href: `/admin/orders/${row.id}` };
  }
  if (target.type === "PURCHASE_REQUEST") {
    const row = await prisma.purchaseRequest.findUnique({ where: { id }, select: { id: true, reference: true, customerName: true } });
    if (!row) throw new Error("Không tìm thấy yêu cầu mua hàng đã chọn");
    return { type: "PURCHASE_REQUEST", id: row.id, label: row.customerName, secondary: row.reference, href: "/admin/coordination/operation?view=purchase-request-operation-flow" };
  }
  if (target.type === "ACQUISITION") {
    const row = await prisma.acquisition.findUnique({ where: { id }, select: { id: true, refNo: true, vendor: { select: { name: true } } } });
    if (!row) throw new Error("Không tìm thấy phiếu nhập đã chọn");
    return { type: "ACQUISITION", id: row.id, label: row.refNo || row.vendor?.name || "Phiếu nhập", secondary: row.vendor?.name || null, href: `/admin/acquisitions/${row.id}/edit` };
  }
  const row = await prisma.serviceRequest.findUnique({ where: { id }, select: { id: true, refNo: true, skuSnapshot: true, modelSnapshot: true } });
  if (!row) throw new Error("Không tìm thấy yêu cầu kỹ thuật đã chọn");
  return { type: "SERVICE_REQUEST", id: row.id, label: row.refNo || row.modelSnapshot || "Yêu cầu kỹ thuật", secondary: row.skuSnapshot, href: `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(row.id)}` };
}

export function normalizePersonalDomain(value: unknown): PersonalWorkDomain {
  const domain = String(value || "GENERAL").trim().toUpperCase() as PersonalWorkDomain;
  return domainKeys.has(domain) ? domain : "GENERAL";
}

export async function getPersonalWorkPageData(auth: unknown): Promise<PersonalWorkPageData> {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const [items, connection] = await Promise.all([
    prisma.taskItem.findMany({
      where: {
        task: { kind: TaskKind.PERSONAL, OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] },
        status: { not: TaskStatus.CANCELLED },
      },
      include: {
        calendarLinks: { where: { userId }, take: 1 },
        executions: {
          where: { actionType: { not: "CANCELLED" } },
          select: { targetType: true, targetId: true, metadataJson: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [{ isDone: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
    }),
    prisma.googleCalendarConnection.findUnique({ where: { userId } }),
  ]);
  const tagged = await hydrateTaskItemsWithTagsRepo(prisma, items);
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
    items: tagged.map((item) => {
      const names = item.tags.map((tag) => tag.name);
      const domain = normalizePersonalDomain(names.find((name) => domainKeys.has(name.toUpperCase())));
      const calendar = item.calendarLinks[0];
      return {
        id: item.id,
        title: item.title,
        note: item.note,
        status: item.status,
        priority: item.priority,
        dueAt: item.dueAt?.toISOString() ?? null,
        completedAt: item.completedAt?.toISOString() ?? null,
        domain,
        workType: item.workTypeId,
        target: item.executions.map(targetFromExecution).find(Boolean) ?? null,
        tags: names.filter((name) => name.toUpperCase() !== domain),
        calendar: { synced: Boolean(calendar), htmlLink: calendar?.eventHtmlLink ?? null, lastSyncedAt: calendar?.lastSyncedAt.toISOString() ?? null },
      };
    }),
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
  const domain = normalizePersonalDomain(input.domain);
  const workType = normalizeWorkType(input.workType, domain);
  const target = await resolvePersonalWorkTarget(domain, input.target);
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
    });
    await setTargetTagsRepo(tx, {
      ownerType: AppTagOwnerType.TASK,
      ownerId: taskResult.task.id,
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: item.id,
      names: [domain, ...(input.tags || [])],
    });
    if (target) {
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

export async function searchPersonalWorkTargets(input: { type: PersonalWorkTargetType; query?: string | null }): Promise<PersonalWorkTarget[]> {
  const query = String(input.query || "").trim();
  const contains = query ? { contains: query, mode: "insensitive" as const } : undefined;

  if (input.type === "WATCH") {
    const rows = await prisma.watch.findMany({
      where: query ? { product: { OR: [{ title: contains }, { sku: contains }] } } : undefined,
      select: { id: true, productId: true, product: { select: { title: true, sku: true } } },
      orderBy: { updatedAt: "desc" }, take: 12,
    });
    return rows.map((row) => ({ type: "WATCH", id: row.id, label: row.product.title, secondary: row.product.sku, href: `/admin/watches/${row.productId}` }));
  }
  if (input.type === "ORDER") {
    const rows = await prisma.order.findMany({
      where: query ? { OR: [{ refNo: contains }, { customerName: contains }, { shipPhone: contains }] } : undefined,
      select: { id: true, refNo: true, customerName: true, shipPhone: true }, orderBy: { updatedAt: "desc" }, take: 12,
    });
    return rows.map((row) => ({ type: "ORDER", id: row.id, label: row.refNo || row.customerName || "Đơn hàng", secondary: row.customerName || row.shipPhone, href: `/admin/orders/${row.id}` }));
  }
  if (input.type === "PURCHASE_REQUEST") {
    const rows = await prisma.purchaseRequest.findMany({
      where: query ? { OR: [{ reference: contains }, { customerName: contains }, { phone: contains }] } : undefined,
      select: { id: true, reference: true, customerName: true }, orderBy: { updatedAt: "desc" }, take: 12,
    });
    return rows.map((row) => ({ type: "PURCHASE_REQUEST", id: row.id, label: row.customerName, secondary: row.reference, href: "/admin/coordination/operation?view=purchase-request-operation-flow" }));
  }
  if (input.type === "ACQUISITION") {
    const rows = await prisma.acquisition.findMany({
      where: query ? { OR: [{ refNo: contains }, { vendor: { name: contains } }] } : undefined,
      select: { id: true, refNo: true, vendor: { select: { name: true } } }, orderBy: { updatedAt: "desc" }, take: 12,
    });
    return rows.map((row) => ({ type: "ACQUISITION", id: row.id, label: row.refNo || row.vendor?.name || "Phiếu nhập", secondary: row.vendor?.name || null, href: `/admin/acquisitions/${row.id}/edit` }));
  }
  const rows = await prisma.serviceRequest.findMany({
    where: query ? { OR: [{ refNo: contains }, { skuSnapshot: contains }, { modelSnapshot: contains }] } : undefined,
    select: { id: true, refNo: true, skuSnapshot: true, modelSnapshot: true }, orderBy: { updatedAt: "desc" }, take: 12,
  });
  return rows.map((row) => ({ type: "SERVICE_REQUEST", id: row.id, label: row.refNo || row.modelSnapshot || "Yêu cầu kỹ thuật", secondary: row.skuSnapshot, href: `/admin/services/issues-board?serviceRequestId=${encodeURIComponent(row.id)}` }));
}

export async function updatePersonalWorkItem(input: { id: string; title?: string; note?: string | null; dueAt?: string | null; priority?: TaskPriority; status?: TaskStatus; domain?: PersonalWorkDomain; tags?: string[] }, auth: unknown) {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được người dùng");
  const current = await prisma.taskItem.findFirst({ where: { id: input.id, task: { kind: TaskKind.PERSONAL, OR: [{ createdByUserId: userId }, { assignedToUserId: userId }] } }, select: { id: true, taskId: true } });
  if (!current) throw new Error("Không tìm thấy công việc cá nhân");
  const status = input.status;
  await prisma.taskItem.update({
    where: { id: input.id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
      ...(input.dueAt !== undefined ? { dueAt: input.dueAt ? new Date(input.dueAt) : null } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(status ? { status, isDone: status === TaskStatus.DONE, completedAt: status === TaskStatus.DONE ? new Date() : null, startedAt: status === TaskStatus.IN_PROGRESS ? new Date() : undefined } : {}),
    },
  });
  if (input.domain || input.tags) {
    await setTargetTagsRepo(prisma, {
      ownerType: AppTagOwnerType.TASK,
      ownerId: current.taskId,
      targetType: AppTagTargetType.TASK_ITEM,
      targetId: current.id,
      names: [normalizePersonalDomain(input.domain), ...(input.tags || [])],
    });
  }
}
