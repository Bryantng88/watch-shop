import { Prisma, ServiceRequestStatus } from "@prisma/client";

import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import * as repo from "@/domains/service/server/repository/service-request.repo";
import type {
  ServiceRequestListSort,
  ServiceRequestSearchInput,
  ServiceRequestViewKey,
} from "@/domains/service/server/list/service-request-search-params";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  deleteProjectionRecords,
  upsertProjectionRecord,
} from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const SERVICE_REQUEST_LIST_PROJECTION_KEY = "service-request-list";
export const SERVICE_REQUEST_LIST_PROJECTION_VERSION = 2;

const SOURCE_EVENTS = [
  "service_request.created",
  "service_request.status_changed",
  "service_request.completed",
  "technical_issue.created",
  "technical_issue.updated",
  "technical_issue.started",
  "technical_issue.completed",
  "technical_issue.canceled",
  "technical_issue.reopened",
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
] as const;

export type ServiceRequestListProjectionRow = {
  id: string;
  refNo: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceName: string | null;
  serviceCode: string | null;
  orderId: string | null;
  orderRefNo: string | null;
  scope: string | null;
  customerItemNote: string | null;
  vendorName: string | null;
  technicianName: string | null;
  maintenanceCount: number;
  issueCount: number;
  openIssueCount: number;
  actualCostTotal: number;
  estimatedCostTotal: number;
  paidAmount: number;
  collectedAmount: number;
  unpaidPaymentAmount: number;
  canceledPaymentAmount: number;
  remainingAmount: number;
  productId: string | null;
  source: string | null;
  productTitle: string | null;
  primaryImageUrl: string | null;
  skuSnapshot: string | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function buildResult(
  context: ProjectionBuildContext,
  scope: ProjectionScope,
  applied: number,
  reason?: string,
): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason,
  };
}

function toProjectionRow(row: Awaited<ReturnType<typeof repo.getServiceRequestList>>["rows"][number]) {
  return {
    id: row.id,
    refNo: row.refNo,
    status: String(row.status),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    serviceName: row.serviceCatalog?.name ?? "Kiểm tra kỹ thuật",
    serviceCode: row.serviceCatalog?.code ?? null,
    orderId: row.orderItem?.order?.id ?? null,
    orderRefNo: row.orderItem?.order?.refNo ?? null,
    scope: row.scope,
    customerItemNote: row.orderItem?.customerItemNote ?? null,
    vendorName: row.vendorName,
    technicianName: row.technicianName,
    maintenanceCount: row.maintenanceCount,
    issueCount: row.issueCount,
    openIssueCount: row.openIssueCount,
    actualCostTotal: row.actualCostTotal,
    estimatedCostTotal: row.estimatedCostTotal,
    paidAmount: row.paidAmount,
    collectedAmount: row.collectedAmount,
    unpaidPaymentAmount: row.unpaidPaymentAmount,
    canceledPaymentAmount: row.canceledPaymentAmount,
    remainingAmount: row.remainingAmount,
    productId: row.productId,
    source: row.orderItem?.order?.id ? "SERVICE_FROM_ORDER" : "QUICK_SERVICE_FROM_WATCH",
    productTitle: row.productTitle,
    primaryImageUrl: row.primaryImageUrl,
    skuSnapshot: row.skuSnapshot,
  } satisfies ServiceRequestListProjectionRow;
}

export async function buildServiceRequestListProjectionRow(db: DB, serviceRequestId: string) {
  const { rows } = await repo.getServiceRequestList(
    { id: serviceRequestId },
    { updatedAt: "desc" },
    0,
    1,
    db,
  );
  const source = rows[0];
  if (!source) {
    await deleteProjectionRecords(db, {
      projectionKey: SERVICE_REQUEST_LIST_PROJECTION_KEY,
      rowKeys: [serviceRequestId],
    });
    return null;
  }
  const searchSource = await dbOrTx(db).serviceRequest.findUnique({
    where: { id: serviceRequestId },
    select: { notes: true },
  });
  const data = toProjectionRow(source);
  await upsertProjectionRecord(db, {
    projectionKey: SERVICE_REQUEST_LIST_PROJECTION_KEY,
    projectionVersion: SERVICE_REQUEST_LIST_PROJECTION_VERSION,
    rowKey: data.id,
    entityType: "SERVICE_REQUEST",
    entityId: data.id,
    status: data.status,
    searchText: [
      data.id,
      data.refNo,
      searchSource?.notes,
      data.serviceName,
      data.serviceCode,
      data.orderRefNo,
      data.customerItemNote,
      data.vendorName,
      data.technicianName,
      data.productTitle,
      data.skuSnapshot,
    ].filter(Boolean).join(" ").toLocaleLowerCase("vi"),
    sortAt: source.updatedAt,
    sourceUpdatedAt: source.updatedAt,
    dataJson: data,
  });
  return data;
}

async function resolveServiceRequestId(db: DB, event: BusinessEventDispatchContext) {
  const targetType = clean(event.targetType).toUpperCase();
  if (targetType === "SERVICE_REQUEST") return event.targetId;
  if (targetType === "TECHNICAL_ISSUE") {
    const row = await dbOrTx(db).technicalIssue.findUnique({
      where: { id: event.targetId },
      select: { serviceRequestId: true },
    });
    return row?.serviceRequestId ?? null;
  }
  if (targetType === "PAYMENT") {
    const payment = await dbOrTx(db).payment.findUnique({
      where: { id: event.targetId },
      select: { service_request_id: true, technical_issue_id: true },
    });
    if (payment?.service_request_id) return payment.service_request_id;
    if (payment?.technical_issue_id) {
      const issue = await dbOrTx(db).technicalIssue.findUnique({
        where: { id: payment.technical_issue_id },
        select: { serviceRequestId: true },
      });
      return issue?.serviceRequestId ?? null;
    }
  }
  return null;
}

function viewStatuses(view?: ServiceRequestViewKey) {
  if (view === "draft") return [ServiceRequestStatus.DRAFT];
  if (view === "in_progress") {
    return [
      ServiceRequestStatus.DIAGNOSING,
      ServiceRequestStatus.WAIT_APPROVAL,
      ServiceRequestStatus.IN_PROGRESS,
    ];
  }
  if (view === "done") return [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.DELIVERED];
  if (view === "canceled") return [ServiceRequestStatus.CANCELED];
  return [];
}

function orderSql(sort?: ServiceRequestListSort) {
  if (sort === "createdAsc") return Prisma.sql`("dataJson"->>'createdAt')::timestamptz ASC`;
  if (sort === "createdDesc") return Prisma.sql`("dataJson"->>'createdAt')::timestamptz DESC`;
  if (sort === "updatedAsc") return Prisma.sql`("dataJson"->>'updatedAt')::timestamptz ASC`;
  return Prisma.sql`("dataJson"->>'updatedAt')::timestamptz DESC`;
}

export async function queryServiceRequestListProjection(
  db: DB,
  input: ServiceRequestSearchInput,
) {
  const q = clean(input.q).toLocaleLowerCase("vi");
  const statuses = viewStatuses(input.view).map(String);
  const page = Math.max(1, input.page);
  const pageSize = Math.max(1, Math.min(100, input.pageSize));
  const offset = (page - 1) * pageSize;
  const rows = await dbOrTx(db).$queryRaw<Array<{
    kind: "ROW" | "COUNT";
    key: string;
    dataJson: unknown;
    count: bigint;
  }>>(Prisma.sql`
    WITH base AS (
      SELECT "status", "dataJson"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${SERVICE_REQUEST_LIST_PROJECTION_KEY}
        AND "projectionVersion" = ${SERVICE_REQUEST_LIST_PROJECTION_VERSION}
        AND (${q} = '' OR COALESCE("searchText", '') ILIKE ${`%${q}%`})
    ),
    selected AS (
      SELECT "dataJson"
      FROM base
      WHERE (${statuses.length} = 0 OR "status" IN (${Prisma.join(statuses.length ? statuses : [""])}))
      ORDER BY ${orderSql(input.sort)}
      LIMIT ${pageSize} OFFSET ${offset}
    ),
    counts AS (
      SELECT 'all'::text AS "key", COUNT(*) AS "count" FROM base
      UNION ALL SELECT 'draft', COUNT(*) FROM base WHERE "status" = 'DRAFT'
      UNION ALL SELECT 'in_progress', COUNT(*) FROM base WHERE "status" IN ('DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS')
      UNION ALL SELECT 'done', COUNT(*) FROM base WHERE "status" IN ('COMPLETED', 'DELIVERED')
      UNION ALL SELECT 'canceled', COUNT(*) FROM base WHERE "status" = 'CANCELED'
      UNION ALL SELECT 'total', COUNT(*) FROM base
        WHERE (${statuses.length} = 0 OR "status" IN (${Prisma.join(statuses.length ? statuses : [""])}))
    )
    SELECT 'ROW'::text AS "kind", ''::text AS "key", "dataJson", 0::bigint AS "count" FROM selected
    UNION ALL
    SELECT 'COUNT'::text, "key", NULL::jsonb, "count" FROM counts
  `);
  const counts = new Map(
    rows.filter((row) => row.kind === "COUNT").map((row) => [row.key, Number(row.count)]),
  );
  return {
    items: rows
      .filter((row) => row.kind === "ROW")
      .map((row) => row.dataJson as ServiceRequestListProjectionRow),
    total: counts.get("total") ?? 0,
    page,
    pageSize,
    counts: {
      all: counts.get("all") ?? 0,
      draft: counts.get("draft") ?? 0,
      in_progress: counts.get("in_progress") ?? 0,
      done: counts.get("done") ?? 0,
      canceled: counts.get("canceled") ?? 0,
    },
  };
}

export async function hasServiceRequestListProjectionRows(db: DB) {
  const count = await dbOrTx(db).projectionRecord.count({
    where: {
      projectionKey: SERVICE_REQUEST_LIST_PROJECTION_KEY,
      projectionVersion: SERVICE_REQUEST_LIST_PROJECTION_VERSION,
    },
  });
  return count > 0;
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  const serviceRequestId = await resolveServiceRequestId(db, context.sourceEvent);
  if (!serviceRequestId) {
    return buildResult(context, {}, 0, "SERVICE_REQUEST_NOT_RESOLVED");
  }
  const row = await buildServiceRequestListProjectionRow(db, serviceRequestId);
  return buildResult(
    context,
    { targetType: "SERVICE_REQUEST", targetId: serviceRequestId },
    row ? 1 : 0,
    row ? undefined : "SERVICE_REQUEST_NOT_FOUND",
  );
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const targetId = clean(context.scope.targetId);
  if (!targetId) {
    await deleteProjectionRecords(db, { projectionKey: SERVICE_REQUEST_LIST_PROJECTION_KEY });
  }
  const rows = await dbOrTx(db).serviceRequest.findMany({
    where: targetId ? { id: targetId } : undefined,
    select: { id: true },
    orderBy: { updatedAt: "desc" },
    take: context.scope.limit
      ? Math.max(1, Math.min(10_000, context.scope.limit))
      : undefined,
  });
  for (let index = 0; index < rows.length; index += 10) {
    await Promise.all(
      rows.slice(index, index + 10).map((row) =>
        buildServiceRequestListProjectionRow(db, row.id),
      ),
    );
  }
  return buildResult(context, context.scope, rows.length, rows.length ? undefined : "NO_SERVICE_REQUESTS");
}

export const serviceRequestListProjectionBuilder: ProjectionBuilder = {
  key: SERVICE_REQUEST_LIST_PROJECTION_KEY,
  version: SERVICE_REQUEST_LIST_PROJECTION_VERSION,
  description: "Admin service-request list, search fields and status counters.",
  sourceEvents: [...SOURCE_EVENTS],
  targetTypes: ["SERVICE_REQUEST", "TECHNICAL_ISSUE", "PAYMENT"],
  dependsOnProjectionKeys: ["payment-owner-summary", "technical-issue-board"],
  buildFromEvent,
  rebuild,
};
