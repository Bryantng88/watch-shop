import { prisma, type DB } from "@/server/db/client";
import {
  ProductStatus,
  ServiceRequestStatus,
  ServiceScope,
  ServiceType,
  TaskExecutionActionType,
  TaskExecutionTargetType,
} from "@prisma/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import * as repo from "../repository/service-request.repo";
import { canMoveProductToService } from "../shared/service-request.rules";

const ACTIVE_SERVICE_STATUSES: ServiceRequestStatus[] = [
  ServiceRequestStatus.DRAFT,
  ServiceRequestStatus.DIAGNOSING,
  ServiceRequestStatus.WAIT_APPROVAL,
  ServiceRequestStatus.IN_PROGRESS,
];

const CLOSED_SERVICE_STATUSES = [
  ServiceRequestStatus.COMPLETED,
  ServiceRequestStatus.DELIVERED,
  ServiceRequestStatus.CANCELED,
];

const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
type QuickIssuePriority = (typeof PRIORITIES)[number];

function cleanText(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function normalizePriority(value: unknown): QuickIssuePriority {
  const key = String(value ?? "NORMAL").trim().toUpperCase();
  return PRIORITIES.includes(key as QuickIssuePriority)
    ? (key as QuickIssuePriority)
    : "NORMAL";
}

function normalizeIssueType(value: unknown) {
  const key = String(value ?? "CHECK").trim().toUpperCase();
  return ["CHECK", "SERVICE", "REPAIR", "REPLACE", "OBSERVATION"].includes(key)
    ? key
    : "CHECK";
}

function normalizeArea(value: unknown) {
  const key = String(value ?? "GENERAL").trim().toUpperCase();
  return key || "GENERAL";
}

async function markProductInServiceIfNeeded(client: DB, productId: string) {
  const product = await client.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });

  if (!product) return;

  if (canMoveProductToService(product.status as ProductStatus)) {
    await client.product.update({
      where: { id: product.id },
      data: { status: ProductStatus.IN_SERVICE },
    });
  }
}

async function findActiveServiceRequest(client: DB, productId: string) {
  return client.serviceRequest.findFirst({
    where: {
      productId,
      status: { in: ACTIVE_SERVICE_STATUSES },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: { id: true },
  });
}

async function findActiveServiceRequestDetail(client: DB, productId: string) {
  return client.serviceRequest.findFirst({
    where: {
      productId,
      status: { in: ACTIVE_SERVICE_STATUSES },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      refNo: true,
      status: true,
      productId: true,
      updatedAt: true,
    },
  });
}

async function findServiceRequestWorkspaceBinding(client: DB, serviceRequestId: string) {
  return client.taskExecution.findFirst({
    where: {
      targetType: TaskExecutionTargetType.SERVICE_REQUEST,
      targetId: serviceRequestId,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    select: {
      id: true,
      taskItemId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function createQuickServiceRequest(client: DB, productId: string) {
  const product = await repo.findProductForService(client, productId);
  if (!product) throw new Error("Không tìm thấy watch/product để tạo phiếu service.");

  const technician = await repo.findDefaultTechnician(client);
  const variant = product.productVariant?.[0] ?? null;
  const primaryImageUrlSnapshot =
    product.primaryImageUrl ?? product.productImage?.[0]?.fileKey ?? null;

  const refNo = await genRefNo(client as any, {
    model: (client as any).serviceRequest,
    prefix: "SR",
    field: "refNo",
    padding: 6,
  });

  const request = await repo.createTechnicalCheckRequest(client, {
    refNo,
    productId,
    variantId: variant?.id ?? null,
    skuSnapshot: variant?.sku ?? null,
    primaryImageUrlSnapshot,
    notes: "Tạo nhanh từ Watch Service modal",
    billable: false,
    type: ServiceType.PAID,
    scope: ServiceScope.INTERNAL,
    status: ServiceRequestStatus.DRAFT,
    brandSnapshot: product.brand?.name ?? null,
    modelSnapshot: product.title ?? product.watchSpec?.model ?? null,
    refSnapshot: product.watchSpec?.ref ?? null,
    technicianId: technician?.id ?? null,
    technicianNameSnap: technician?.name?.trim() || technician?.email || null,
  });

  await markProductInServiceIfNeeded(client, productId);

  return request;
}

async function getOrCreateActiveServiceRequestId(productId: string) {
  const existing = await findActiveServiceRequest(prisma, productId);
  if (existing?.id) return existing.id;

  try {
    const created = await createQuickServiceRequest(prisma, productId);
    return created.id;
  } catch (error) {
    // Nếu 2 request cùng tạo SR active, partial unique index sẽ chặn.
    // Khi đó lấy lại SR active vừa được request khác tạo.
    const retry = await findActiveServiceRequest(prisma, productId);
    if (retry?.id) return retry.id;

    throw error;
  }
}

export async function getOrCreateServiceOperationWorkspaceForWatch(input: {
  productId: string;
  actorUserId?: string | null;
  openExisting?: boolean;
}) {
  const productId = cleanText(input.productId);
  if (!productId) throw new Error("Missing productId");

  const existing = await findActiveServiceRequestDetail(prisma, productId);

  if (existing?.id) {
    const existingWorkspace = await findServiceRequestWorkspaceBinding(prisma, existing.id);

    if (existingWorkspace?.taskItemId && !input.openExisting) {
      return {
        status: "EXISTING_WORKSPACE" as const,
        createdServiceRequest: false,
        createdWorkspace: false,
        serviceRequestId: existing.id,
        refNo: existing.refNo ?? null,
        taskItemId: existingWorkspace.taskItemId,
        workspaceHref: `/admin/task-items/${existingWorkspace.taskItemId}`,
      };
    }

    if (existingWorkspace?.taskItemId) {
      return {
        status: "OPEN_EXISTING_WORKSPACE" as const,
        createdServiceRequest: false,
        createdWorkspace: false,
        serviceRequestId: existing.id,
        refNo: existing.refNo ?? null,
        taskItemId: existingWorkspace.taskItemId,
        workspaceHref: `/admin/task-items/${existingWorkspace.taskItemId}`,
      };
    }

    const event = await recordBusinessEvent(prisma, {
      eventKey: "service_request.created",
      targetType: "SERVICE_REQUEST",
      targetId: existing.id,
      actorUserId: input.actorUserId ?? null,
      payload: {
        source: "watch-list-service-operation-intake",
        productId,
        serviceRequestId: existing.id,
        refNo: existing.refNo ?? null,
      },
      targetAliasIds: [productId],
    });

    const binding = await findServiceRequestWorkspaceBinding(prisma, existing.id);
    const taskItemId = binding?.taskItemId ?? event.consumers.coordination?.taskItemId ?? null;

    return {
      status: "BOUND_EXISTING_SERVICE_REQUEST" as const,
      createdServiceRequest: false,
      createdWorkspace: Boolean(taskItemId),
      serviceRequestId: existing.id,
      refNo: existing.refNo ?? null,
      taskItemId,
      workspaceHref: taskItemId ? `/admin/task-items/${taskItemId}` : null,
    };
  }

  const request = await createQuickServiceRequest(prisma, productId);
  await ensureAssessment(prisma, request.id);

  const event = await recordBusinessEvent(prisma, {
    eventKey: "service_request.created",
    targetType: "SERVICE_REQUEST",
    targetId: request.id,
    actorUserId: input.actorUserId ?? null,
    payload: {
      source: "watch-list-service-operation-intake",
      productId,
      serviceRequestId: request.id,
      refNo: request.refNo ?? null,
    },
    targetAliasIds: [productId],
  });

  const binding = await findServiceRequestWorkspaceBinding(prisma, request.id);
  const taskItemId = binding?.taskItemId ?? event.consumers.coordination?.taskItemId ?? null;

  return {
    status: "CREATED_WORKSPACE" as const,
    createdServiceRequest: true,
    createdWorkspace: Boolean(taskItemId),
    serviceRequestId: request.id,
    refNo: request.refNo ?? null,
    taskItemId,
    workspaceHref: taskItemId ? `/admin/task-items/${taskItemId}` : null,
  };
}

async function ensureAssessment(client: DB, serviceRequestId: string) {
  const existing = await client.technicalAssessment.findUnique({
    where: { serviceRequestId },
    select: { id: true },
  });

  if (existing?.id) return existing;

  return client.technicalAssessment.create({
    data: {
      serviceRequestId,
      status: "DRAFT" as any,
    } as any,
    select: { id: true },
  });
}

function mapQuickService(row: any) {
  const product = row.product ?? null;
  const issues = row.technicalIssue ?? [];

  return {
    serviceRequest: {
      id: row.id,
      refNo: row.refNo ?? null,
      status: row.status ?? null,
      scope: row.scope ?? null,
      priority: row.priority ?? "NORMAL",
      notes: row.notes ?? null,
      productId: row.productId ?? null,
      skuSnapshot: row.skuSnapshot ?? null,
      productTitle: row.modelSnapshot ?? product?.title ?? null,
      primaryImageUrl:
        row.primaryImageUrlSnapshot ??
        product?.primaryImageUrl ??
        product?.productImage?.[0]?.fileKey ??
        null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isActive: ACTIVE_SERVICE_STATUSES.includes(row.status),
      isClosed: CLOSED_SERVICE_STATUSES.includes(row.status),
    },
    issues: issues.map((issue: any) => ({
      id: issue.id,
      area: issue.area ?? null,
      summary: issue.summary ?? null,
      note: issue.note ?? null,
      issueType: issue.issueType ?? null,
      actionMode: issue.actionMode ?? null,
      executionStatus: issue.executionStatus ?? null,
      priority: issue.priority ?? "NORMAL",
      openedAt: issue.openedAt ?? null,
      createdAt: issue.createdAt ?? null,
      updatedAt: issue.updatedAt ?? null,
      isConfirmed: issue.isConfirmed ?? false,
      vendorNameSnap: issue.vendorNameSnap ?? issue.Vendor?.name ?? null,
      serviceCatalogName: issue.serviceCatalog?.name ?? null,
      supplyCatalogName: issue.SupplyCatalog?.name ?? null,
      partName: issue.MechanicalPartCatalog?.name ?? null,
    })),
  };
}

async function getQuickServiceById(serviceRequestId: string) {
  const row = await prisma.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          primaryImageUrl: true,
          productImage: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
            select: { fileKey: true, role: true },
          },
        },
      },
      technicalIssue: {
        where: { executionStatus: { not: "CANCELED" as any } },
        orderBy: [
          { priority: "desc" as any },
          { openedAt: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          Vendor: { select: { id: true, name: true } },
          serviceCatalog: { select: { id: true, name: true, code: true } },
          SupplyCatalog: { select: { id: true, name: true, code: true } },
          MechanicalPartCatalog: { select: { id: true, name: true, code: true } },
        },
      },
    } as any,
  });

  if (!row) return null;
  return mapQuickService(row);
}

export async function getOrCreateActiveWatchService(input: { productId: string }) {
  const productId = cleanText(input.productId);
  if (!productId) throw new Error("Missing productId");

  const serviceRequestId = await getOrCreateActiveServiceRequestId(productId);

  // Không gọi getQuickServiceById bên trong transaction.
  // Transaction cũ bị timeout vì vừa gen ref / create SR / query detail trong cùng interactive transaction.
  await ensureAssessment(prisma, serviceRequestId);

  return getQuickServiceById(serviceRequestId);
}

export async function getActiveWatchService(input: { productId: string }) {
  const productId = cleanText(input.productId);
  if (!productId) throw new Error("Missing productId");

  const existing = await findActiveServiceRequest(prisma, productId);
  if (!existing?.id) return null;

  return getQuickServiceById(existing.id);
}

export async function createQuickIssueForActiveWatchService(input: {
  productId: string;
  serviceRequestId?: string | null;
  area?: string | null;
  summary?: string | null;
  note?: string | null;
  issueType?: string | null;
  priority?: string | null;
}) {
  const productId = cleanText(input.productId);
  if (!productId) throw new Error("Missing productId");

  const summary = cleanText(input.summary);
  if (!summary) throw new Error("Vui lòng nhập nội dung issue.");

  const normalizedPriority = normalizePriority(input.priority);

  let serviceRequestId = cleanText(input.serviceRequestId);

  if (serviceRequestId) {
    const sr = await prisma.serviceRequest.findFirst({
      where: {
        id: serviceRequestId,
        productId,
        status: { in: ACTIVE_SERVICE_STATUSES },
      },
      select: { id: true },
    });

    serviceRequestId = sr?.id ?? null;
  }

  if (!serviceRequestId) {
    serviceRequestId = await getOrCreateActiveServiceRequestId(productId);
  }

  await prisma.$transaction(
    async (tx) => {
      const assessment = await ensureAssessment(tx, serviceRequestId!);
      const now = new Date();

      await tx.technicalIssue.create({
        data: {
          serviceRequestId,
          assessmentId: assessment.id,
          area: normalizeArea(input.area),
          summary,
          note: cleanText(input.note),
          issueType: normalizeIssueType(input.issueType) as any,
          actionMode: "INTERNAL" as any,
          executionStatus: "OPEN" as any,
          isConfirmed: false,
          priority: normalizedPriority as any,
          openedAt: now,
          updatedAt: now,
        } as any,
      });

      await tx.serviceRequest.update({
        where: { id: serviceRequestId! },
        data: {
          status: ServiceRequestStatus.IN_PROGRESS,
          priority: normalizedPriority as any,
          prioritySource: "WATCH_QUICK_ISSUE",
          priorityMarkedAt: now,
          updatedAt: now,
        } as any,
      });

      await markProductInServiceIfNeeded(tx, productId);
    },
    {
      maxWait: 5000,
      timeout: 15000,
    },
  );

  return getQuickServiceById(serviceRequestId);
}

export { ACTIVE_SERVICE_STATUSES };
