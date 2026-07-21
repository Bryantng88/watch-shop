import {
  Prisma,
  ServiceRequestStatus,
  TaskStatus,
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TechnicalIssueExecutionStatus,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { getPaymentOwnerSummaryProjections } from "@/domains/projection/server/payment-owner-summary.projection";
import { resolveCurrentCoordinationCycle } from "@/domains/coordination/server/coordination-cycle.service";
import {
  getTechnicalIssueOperationStage,
  isTechnicalIssueCanceled,
  isTechnicalIssueDone,
} from "@/domains/service/server/shared/service-request.rules";
import type {
  ServiceOperationAttention,
  ServiceOperationCounters,
  ServiceOperationListInput,
  ServiceOperationOwnerKind,
  ServiceOperationRange,
  ServiceOperationScope,
  ServiceOperationTechnicalWorkspace,
  ServiceOperationTechnicalWorkspaceRole,
  ServiceOperationSrCaseRow,
  ServiceOperationTiListInput,
  ServiceOperationTiStageItem,
} from "./service-operation.types";

function toNumber(value: unknown): number {
  if (value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toNullableNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function cleanText(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
}

function asValidDate(value: unknown) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  const text = cleanText(value);
  if (!text) return new Date();
  const parsed = new Date(text);
  return Number.isFinite(parsed.getTime()) ? parsed : new Date();
}

function normalizeRange(value: unknown): ServiceOperationRange {
  const text = String(value ?? "").trim().toUpperCase();
  return text === "CURRENT_WEEK" ? "CURRENT_WEEK" : "ALL_ACTIVE";
}

function startOfDay(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfIsoWeek(value: Date) {
  const day = value.getDay() || 7;
  return addDays(startOfDay(value), 1 - day);
}

export function resolveServiceOperationScope(
  input: Pick<ServiceOperationListInput, "anchorDate" | "range"> = {},
): ServiceOperationScope {
  const anchorDate = asValidDate(input.anchorDate);
  const range = normalizeRange(input.range);

  if (range === "CURRENT_WEEK") {
    const from = startOfIsoWeek(anchorDate);
    const to = addDays(from, 7);
    return {
      range,
      anchorDate,
      from,
      to,
      label: "Current week",
    };
  }

  return {
    range: "ALL_ACTIVE",
    anchorDate,
    from: null,
    to: null,
    label: "All active",
  };
}

function scopedDateWhere(scope: ServiceOperationScope) {
  if (!scope.from || !scope.to) return null;
  return { gte: scope.from, lt: scope.to };
}

function pageInput(input: ServiceOperationListInput) {
  const page = Math.max(1, Math.floor(Number(input.page ?? 1)));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(input.pageSize ?? 30))));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

function buildSrSearchWhere(input: {
  q?: string | null;
  scope: ServiceOperationScope;
}): Prisma.ServiceRequestWhereInput {
  const dateWhere = scopedDateWhere(input.scope);
  const keyword = cleanText(input.q);
  const searchWhere: Prisma.ServiceRequestWhereInput = keyword
    ? {
      OR: [
        { id: { contains: keyword, mode: "insensitive" } },
        { refNo: { contains: keyword, mode: "insensitive" } },
        { skuSnapshot: { contains: keyword, mode: "insensitive" } },
        { product: { is: { title: { contains: keyword, mode: "insensitive" } } } },
        { technicalIssue: { some: { summary: { contains: keyword, mode: "insensitive" } } } },
      ],
    }
    : {};

  if (!dateWhere) return searchWhere;

  return {
    AND: [
      searchWhere,
      {
        OR: [
          { createdAt: dateWhere },
          { updatedAt: dateWhere },
          { technicalIssue: { some: { openedAt: dateWhere } } },
          { technicalIssue: { some: { updatedAt: dateWhere } } },
        ],
      },
    ],
  };
}

function buildSrCounterWhere(scope: ServiceOperationScope): Prisma.ServiceRequestWhereInput {
  const dateWhere = scopedDateWhere(scope);
  const base: Prisma.ServiceRequestWhereInput = {
    status: { not: ServiceRequestStatus.CANCELED },
  };

  if (!dateWhere) return base;

  return {
    AND: [
      base,
      {
        OR: [
          { createdAt: dateWhere },
          { updatedAt: dateWhere },
          { technicalIssue: { some: { openedAt: dateWhere } } },
          { technicalIssue: { some: { updatedAt: dateWhere } } },
        ],
      },
    ],
  };
}

function buildTiScopeWhere(scope: ServiceOperationScope): Prisma.TechnicalIssueWhereInput {
  const dateWhere = scopedDateWhere(scope);
  if (!dateWhere) return {};

  return {
    OR: [
      { openedAt: dateWhere },
      { updatedAt: dateWhere },
      { serviceRequest: { is: { createdAt: dateWhere } } },
      { serviceRequest: { is: { updatedAt: dateWhere } } },
    ],
  };
}

function buildTiSearchWhere(input: ServiceOperationTiListInput): Prisma.TechnicalIssueWhereInput {
  const keyword = cleanText(input.q);
  const stage = input.stage && input.stage !== "ALL" ? input.stage : null;
  const scope = resolveServiceOperationScope(input);

  return {
    AND: [
      buildTiScopeWhere(scope),
      ...(stage ? [stageWhere(stage)] : []),
    ],
    ...(input.serviceRequestId ? { serviceRequestId: input.serviceRequestId } : {}),
    executionStatus: { not: TechnicalIssueExecutionStatus.CANCELED },
    ...(keyword
      ? {
        OR: [
          { id: { contains: keyword, mode: "insensitive" } },
          { summary: { contains: keyword, mode: "insensitive" } },
          { note: { contains: keyword, mode: "insensitive" } },
          { area: { contains: keyword, mode: "insensitive" } },
          { serviceRequest: { is: { refNo: { contains: keyword, mode: "insensitive" } } } },
          { serviceRequest: { is: { product: { is: { title: { contains: keyword, mode: "insensitive" } } } } } },
        ],
      }
      : {}),
  };
}

function stageWhere(
  stage: NonNullable<ServiceOperationTiListInput["stage"]>,
): Prisma.TechnicalIssueWhereInput {
  if (stage === "INSPECT") {
    return {
      OR: [
        {
          executionStatus: TechnicalIssueExecutionStatus.OPEN,
          isConfirmed: false,
        },
      ],
    };
  }

  if (stage === "READY") {
    return {
      OR: [
        { executionStatus: TechnicalIssueExecutionStatus.CONFIRMED },
        {
          executionStatus: TechnicalIssueExecutionStatus.OPEN,
          isConfirmed: true,
        },
      ],
    };
  }

  if (stage === "IN_PROGRESS") {
    return { executionStatus: TechnicalIssueExecutionStatus.IN_PROGRESS };
  }

  if (stage === "DONE") {
    return { executionStatus: TechnicalIssueExecutionStatus.DONE };
  }

  return {};
}

const TECHNICAL_WORKSPACES: ServiceOperationTechnicalWorkspace[] = [
  { role: "INSPECT", title: "Service Operation - Inspect", taskItemId: null },
  { role: "PROCESSING", title: "Service Operation - Processing", taskItemId: null },
  { role: "DONE", title: "Service Operation - Done / Follow-up", taskItemId: null },
];

function serviceOperationWorkspaceRoleFromNote(note: string | null | undefined): ServiceOperationTechnicalWorkspaceRole | null {
  const value = String(note ?? "")
    .match(/^serviceOperationWorkspaceRole:\s*(INSPECT|PROCESSING|DONE)\s*$/im)?.[1]
    ?.toUpperCase();

  return value === "INSPECT" || value === "PROCESSING" || value === "DONE"
    ? value
    : null;
}

function ownerKind(issue: {
  actionMode?: string | null;
  vendorId?: string | null;
  supplyCatalogId?: string | null;
  mechanicalPartCatalogId?: string | null;
}): ServiceOperationOwnerKind {
  const actionMode = String(issue.actionMode ?? "").toUpperCase();
  if (actionMode === "VENDOR" || issue.vendorId) return "VENDOR";
  if (issue.supplyCatalogId || issue.mechanicalPartCatalogId) return "PARTS";
  if (actionMode === "INTERNAL") return "INTERNAL";
  return "UNKNOWN";
}

function creator(row: { technicianNameSnap?: string | null; user?: { name?: string | null; email?: string | null } | null }) {
  const name = row.technicianNameSnap ?? row.user?.name ?? row.user?.email ?? null;
  if (name) return { kind: "USER" as const, name };
  return { kind: "SYSTEM" as const, name: "System" };
}

function attention(input: {
  completed: boolean;
  unpaid: number;
  hasVendorInProgress: boolean;
  hasUnconfirmedCost: boolean;
  priority?: string | null;
}): ServiceOperationAttention {
  if (String(input.priority ?? "").toUpperCase() === "URGENT") return "OVERDUE";
  if (input.hasUnconfirmedCost) return "COST_APPROVAL";
  if (input.completed && input.unpaid > 0) return "PAYMENT";
  if (input.hasVendorInProgress) return "VENDOR_HOLDING";
  return "NONE";
}

export async function listServiceOperationSrCases(input: ServiceOperationListInput = {}) {
  const { page, pageSize, skip } = pageInput(input);
  const scope = resolveServiceOperationScope(input);
  const where = buildSrSearchWhere({ q: input.q, scope });

  const [rows, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        refNo: true,
        status: true,
        updatedAt: true,
        technicianNameSnap: true,
        priority: true,
        skuSnapshot: true,
        primaryImageUrlSnapshot: true,
        user: { select: { name: true, email: true } },
        product: { select: { id: true, title: true, sku: true, primaryImageUrl: true } },
        technicalIssue: {
          select: {
            id: true,
            executionStatus: true,
            isConfirmed: true,
            actionMode: true,
            vendorId: true,
            actualCost: true,
            estimatedCost: true,
          },
        },
      },
    }),
    prisma.serviceRequest.count({ where }),
  ]);

  const srIds = rows.map((row) => row.id);
  const srBindings = srIds.length
    ? await prisma.taskExecution.findMany({
        where: {
          targetType: TaskExecutionTargetType.SERVICE_REQUEST,
          targetId: { in: srIds },
          actionType: { not: TaskExecutionActionType.CANCELLED },
          taskItemId: { not: null },
        },
        select: {
          id: true,
          targetId: true,
          taskItemId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const srBindingBySrId = new Map(
    srBindings.map((binding) => [binding.targetId, binding]),
  );

  const issueToSr = new Map<string, string>();
  for (const row of rows) {
    for (const issue of row.technicalIssue ?? []) {
      issueToSr.set(issue.id, row.id);
    }
  }

  const issueIds = Array.from(issueToSr.keys());
  const issuePaymentSummaries = await getPaymentOwnerSummaryProjections(prisma, "TECHNICAL_ISSUE", issueIds);
  const paymentsBySr = new Map<string, { paid: number; unpaid: number }>();
  for (const [issueId, summary] of issuePaymentSummaries) {
    const srId = issueToSr.get(issueId);
    if (!srId) continue;
    const current = paymentsBySr.get(srId) ?? { paid: 0, unpaid: 0 };
    current.paid += summary.paidTotal + summary.collectedTotal;
    current.unpaid += summary.unpaidTotal;
    paymentsBySr.set(srId, current);
  }

  const items: ServiceOperationSrCaseRow[] = rows.map((row) => {
    const binding = srBindingBySrId.get(row.id);
    const activeIssues = (row.technicalIssue ?? []).filter(
      (issue) => !isTechnicalIssueCanceled(issue.executionStatus),
    );
    const doneIssues = activeIssues.filter((issue) =>
      isTechnicalIssueDone(issue.executionStatus),
    );
    const inProgressIssues = activeIssues.filter(
      (issue) => String(issue.executionStatus ?? "").toUpperCase() === "IN_PROGRESS",
    );
    const completed = activeIssues.length > 0 && doneIssues.length === activeIssues.length;
    const actualTotal = activeIssues.reduce((sum, issue) => sum + toNumber(issue.actualCost), 0);
    const estimatedTotal = activeIssues.reduce((sum, issue) => sum + toNumber(issue.estimatedCost), 0);
    const payment = paymentsBySr.get(row.id) ?? { paid: 0, unpaid: 0 };
    const payableTotal = actualTotal > 0 ? actualTotal : estimatedTotal;

    return {
      id: row.id,
      refNo: row.refNo ?? null,
      workspaceBinding: binding
        ? {
            bindingId: binding.id,
            taskItemId: binding.taskItemId ?? null,
          }
        : null,
      status: row.status,
      attention: attention({
        completed,
        unpaid: payment.unpaid,
        priority: row.priority,
        hasVendorInProgress: inProgressIssues.some(
          (issue) => issue.actionMode === "VENDOR" || issue.vendorId,
        ),
        hasUnconfirmedCost: activeIssues.some(
          (issue) => !issue.isConfirmed && toNumber(issue.estimatedCost) > 0,
        ),
      }),
      watch: {
        productId: row.product?.id ?? null,
        title: row.product?.title ?? null,
        sku: row.skuSnapshot ?? row.product?.sku ?? null,
        imageUrl: row.primaryImageUrlSnapshot ?? row.product?.primaryImageUrl ?? null,
      },
      technicalProgress: {
        total: activeIssues.length,
        open: activeIssues.length - doneIssues.length,
        inProgress: inProgressIssues.length,
        done: doneIssues.length,
        completed,
      },
      commercial: {
        estimatedTotal,
        actualTotal,
        paid: payment.paid,
        unpaid: payment.unpaid,
        remaining: Math.max(0, payableTotal - payment.paid),
      },
      creator: creator(row),
      updatedAt: row.updatedAt,
    };
  });

  return { items, total, page, pageSize, scope };
}

export async function listServiceOperationTiStageItems(input: ServiceOperationTiListInput = {}) {
  const { page, pageSize, skip } = pageInput(input);
  const scope = resolveServiceOperationScope(input);
  const where = buildTiSearchWhere(input);

  const [rows, total] = await Promise.all([
    prisma.technicalIssue.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ openedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        serviceRequestId: true,
        executionStatus: true,
        isConfirmed: true,
        summary: true,
        note: true,
        area: true,
        actionMode: true,
        vendorId: true,
        vendorNameSnap: true,
        estimatedCost: true,
        actualCost: true,
        priority: true,
        updatedAt: true,
        supplyCatalogId: true,
        mechanicalPartCatalogId: true,
        serviceRequest: {
          select: {
            refNo: true,
            status: true,
            skuSnapshot: true,
            primaryImageUrlSnapshot: true,
            product: {
              select: {
                title: true,
                sku: true,
                primaryImageUrl: true,
              },
            },
          },
        },
      },
    }),
    prisma.technicalIssue.count({ where }),
  ]);

  const issueIds = rows.map((row) => row.id);
  const bindings = issueIds.length
    ? await prisma.taskExecution.findMany({
        where: {
          targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
          targetId: { in: issueIds },
          actionType: { not: TaskExecutionActionType.CANCELLED },
          taskItemId: { not: null },
        },
        select: {
          id: true,
          targetId: true,
          taskItemId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const bindingByIssueId = new Map(
    bindings.map((binding) => [binding.targetId, binding]),
  );

  const items: ServiceOperationTiStageItem[] = rows.map((row) => {
    const binding = bindingByIssueId.get(row.id);
    return {
      id: row.id,
      serviceRequestId: row.serviceRequestId,
      stage: getTechnicalIssueOperationStage(row),
      summary: row.summary ?? row.note ?? "Technical issue",
      area: row.area ?? null,
      ownerKind: ownerKind(row),
      vendorName: row.vendorNameSnap ?? null,
      estimatedCost: toNullableNumber(row.estimatedCost),
      actualCost: toNullableNumber(row.actualCost),
      priority: row.priority ?? null,
      updatedAt: row.updatedAt,
      workspaceBinding: binding
        ? {
            bindingId: binding.id,
            taskItemId: binding.taskItemId ?? null,
          }
        : null,
      serviceRequest: {
        refNo: row.serviceRequest?.refNo ?? null,
        status: row.serviceRequest?.status ?? null,
        productTitle: row.serviceRequest?.product?.title ?? null,
        sku: row.serviceRequest?.skuSnapshot ?? row.serviceRequest?.product?.sku ?? null,
        imageUrl:
          row.serviceRequest?.primaryImageUrlSnapshot ??
          row.serviceRequest?.product?.primaryImageUrl ??
          null,
      },
    };
  });

  return { items, total, page, pageSize, scope };
}

export async function listServiceOperationTechnicalWorkspaces() {
  const cycle = await resolveCurrentCoordinationCycle(prisma, {
    context: "TECHNICAL",
    createIfMissing: false,
  });

  if (!cycle?.task.id) return TECHNICAL_WORKSPACES;

  const rows = await prisma.taskItem.findMany({
    where: {
      taskId: cycle.task.id,
      status: { not: TaskStatus.CANCELLED },
    },
    select: {
      id: true,
      title: true,
      note: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const byRole = new Map(
    rows
      .map((row) => ({
        row,
        role: serviceOperationWorkspaceRoleFromNote(row.note),
      }))
      .filter((item): item is {
        row: { id: string; title: string; note: string | null };
        role: ServiceOperationTechnicalWorkspace["role"];
      } => Boolean(item.role))
      .map((item) => [item.role, item.row]),
  );

  return TECHNICAL_WORKSPACES.map((workspace) => {
    const row = byRole.get(workspace.role);
    return {
      ...workspace,
      title: row?.title ?? workspace.title,
      taskItemId: row?.id ?? null,
    };
  });
}

export async function getServiceOperationCounters(
  input: Pick<ServiceOperationListInput, "anchorDate" | "range"> = {},
): Promise<ServiceOperationCounters> {
  const scope = resolveServiceOperationScope(input);
  const tiScopeWhere = buildTiScopeWhere(scope);

  const [srRows, tiRows] = await Promise.all([
    prisma.serviceRequest.findMany({
      where: buildSrCounterWhere(scope),
      select: {
        id: true,
        status: true,
        technicalIssue: {
          select: {
            id: true,
            executionStatus: true,
          },
        },
      },
    }),
    prisma.technicalIssue.findMany({
      where: {
        AND: [
          tiScopeWhere,
          { executionStatus: { not: TechnicalIssueExecutionStatus.CANCELED } },
        ],
      },
      select: {
        id: true,
        executionStatus: true,
        isConfirmed: true,
      },
    }),
  ]);
  const counterIssueIds = [...new Set([
    ...tiRows.map((issue) => issue.id),
    ...srRows.flatMap((sr) => (sr.technicalIssue ?? []).map((issue) => issue.id)),
  ])];
  const counterPaymentSummaries = await getPaymentOwnerSummaryProjections(prisma, "TECHNICAL_ISSUE", counterIssueIds);
  const unpaidIssueIds = new Set(
    [...counterPaymentSummaries].filter(([, summary]) => summary.pendingCount > 0).map(([issueId]) => issueId),
  );
  const srIdsWaitingPayment = new Set<string>();

  for (const sr of srRows) {
    if ((sr.technicalIssue ?? []).some((issue) => unpaidIssueIds.has(issue.id))) {
      srIdsWaitingPayment.add(sr.id);
    }
  }

  const srWithOpenTi = srRows.filter((sr) =>
    (sr.technicalIssue ?? []).some((issue) => {
      const status = String(issue.executionStatus ?? "").toUpperCase();
      return status === "OPEN" || status === "CONFIRMED" || status === "IN_PROGRESS";
    }),
  );

  return {
    activeSr: srRows.filter(
      (sr) => sr.status !== ServiceRequestStatus.COMPLETED && sr.status !== ServiceRequestStatus.DELIVERED,
    ).length,
    waitingApproval: tiRows.filter(
      (issue) => getTechnicalIssueOperationStage(issue) === "INSPECT",
    ).length,
    hasOpenTi: srWithOpenTi.length,
    completedSr: srRows.filter((sr) => sr.status === ServiceRequestStatus.COMPLETED).length,
    waitingPayment: srIdsWaitingPayment.size,
    openTi: tiRows.length,
    inspect: tiRows.filter((issue) => getTechnicalIssueOperationStage(issue) === "INSPECT").length,
    ready: tiRows.filter((issue) => getTechnicalIssueOperationStage(issue) === "READY").length,
    inProgress: tiRows.filter((issue) => getTechnicalIssueOperationStage(issue) === "IN_PROGRESS").length,
    done: tiRows.filter((issue) => getTechnicalIssueOperationStage(issue) === "DONE").length,
  };
}
