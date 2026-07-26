import { Prisma } from "@prisma/client";

import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { dbOrTx, type DB } from "@/server/db/client";
import { deleteProjectionRecords, upsertProjectionRecord } from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const PAYMENT_LIST_PROJECTION_KEY = "payment-list";
export const PAYMENT_LIST_PROJECTION_VERSION = 1;
const PAYMENT_LIST_EVENTS = [
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
  "payment.exception_marked",
] as const;

export type PaymentListProjectionRow = {
  id: string;
  refNo: string | null;
  method: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  reference: string | null;
  note: string | null;
  direction: string;
  status: string;
  purpose: string;
  type: string;
  order_id: string | null;
  service_request_id: string | null;
  technical_issue_id: string | null;
  vendor_id: string | null;
  acquisition_id: string | null;
  shipment_id: string | null;
};

type PaymentListProjectionInput = {
  q?: string;
  purpose?: string;
  status?: string;
  type?: string;
  direction?: string;
  method?: string;
  currency?: string;
  paidFrom?: string;
  paidTo?: string;
  createdFrom?: string;
  createdTo?: string;
  sort?: "createdDesc" | "createdAsc" | "paidDesc" | "paidAsc" | "amountDesc" | "amountAsc";
  page: number;
  pageSize: number;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function dateOrNull(value: unknown) {
  const text = clean(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
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

export async function buildPaymentListProjectionRow(db: DB, paymentId: string) {
  const payment = await dbOrTx(db).payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      refNo: true,
      method: true,
      amount: true,
      currency: true,
      paidAt: true,
      createdAt: true,
      updatedAt: true,
      reference: true,
      note: true,
      direction: true,
      status: true,
      purpose: true,
      type: true,
      order_id: true,
      service_request_id: true,
      technical_issue_id: true,
      vendor_id: true,
      acquisition_id: true,
      shipment_id: true,
    },
  });
  if (!payment) return null;
  const data: PaymentListProjectionRow = {
    ...payment,
    method: String(payment.method),
    amount: Number(payment.amount),
    direction: String(payment.direction),
    status: String(payment.status),
    purpose: String(payment.purpose),
    type: String(payment.type),
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  };
  await upsertProjectionRecord(db, {
    projectionKey: PAYMENT_LIST_PROJECTION_KEY,
    projectionVersion: PAYMENT_LIST_PROJECTION_VERSION,
    rowKey: payment.id,
    entityType: "PAYMENT",
    entityId: payment.id,
    status: data.status,
    searchText: [
      data.id,
      data.refNo,
      data.reference,
      data.note,
      data.order_id,
      data.service_request_id,
      data.technical_issue_id,
      data.vendor_id,
      data.acquisition_id,
      data.shipment_id,
    ].filter(Boolean).join(" ").toLowerCase(),
    sortAt: payment.createdAt,
    sourceUpdatedAt: payment.updatedAt,
    dataJson: data,
  });
  return data;
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  const row = await buildPaymentListProjectionRow(db, context.sourceEvent.targetId);
  return buildResult(
    context,
    { targetType: "PAYMENT", targetId: context.sourceEvent.targetId },
    row ? 1 : 0,
    row ? undefined : "PAYMENT_NOT_FOUND",
  );
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const targetId = clean(context.scope.targetId);
  if (!targetId) {
    await deleteProjectionRecords(db, { projectionKey: PAYMENT_LIST_PROJECTION_KEY });
  }
  const rows = await dbOrTx(db).payment.findMany({
    where: targetId ? { id: targetId } : undefined,
    select: { id: true },
    orderBy: { updatedAt: "desc" },
    take: context.scope.limit ? Math.max(1, Math.min(10000, context.scope.limit)) : undefined,
  });
  for (let index = 0; index < rows.length; index += 10) {
    await Promise.all(
      rows.slice(index, index + 10).map((row) => buildPaymentListProjectionRow(db, row.id)),
    );
  }
  return buildResult(context, context.scope, rows.length, rows.length ? undefined : "NO_PAYMENTS");
}

function baseConditions(input: PaymentListProjectionInput) {
  const conditions: Prisma.Sql[] = [
    Prisma.sql`"projectionKey" = ${PAYMENT_LIST_PROJECTION_KEY}`,
    Prisma.sql`"projectionVersion" = ${PAYMENT_LIST_PROJECTION_VERSION}`,
  ];
  if (clean(input.q)) {
    conditions.push(Prisma.sql`COALESCE("searchText", '') ILIKE ${`%${clean(input.q)}%`}`);
  }
  const jsonFilters: Array<[string, unknown]> = [
    ["purpose", input.purpose],
    ["type", input.type],
    ["direction", input.direction],
    ["method", input.method],
    ["currency", input.currency],
  ];
  for (const [field, value] of jsonFilters) {
    if (clean(value)) conditions.push(
      Prisma.sql`"dataJson"->>${Prisma.raw(`'${field}'`)} = ${clean(value).toUpperCase()}`,
    );
  }
  const paidFrom = dateOrNull(input.paidFrom);
  const paidTo = dateOrNull(input.paidTo);
  const createdFrom = dateOrNull(input.createdFrom);
  const createdTo = dateOrNull(input.createdTo);
  if (paidFrom) conditions.push(Prisma.sql`("dataJson"->>'paidAt')::timestamptz >= ${paidFrom}`);
  if (paidTo) conditions.push(Prisma.sql`("dataJson"->>'paidAt')::timestamptz <= ${paidTo}`);
  if (createdFrom) conditions.push(Prisma.sql`("dataJson"->>'createdAt')::timestamptz >= ${createdFrom}`);
  if (createdTo) conditions.push(Prisma.sql`("dataJson"->>'createdAt')::timestamptz <= ${createdTo}`);
  return conditions;
}

function projectionOrder(sort: PaymentListProjectionInput["sort"]) {
  if (sort === "createdAsc") return Prisma.sql`"sortAt" ASC`;
  if (sort === "paidDesc") return Prisma.sql`("dataJson"->>'paidAt')::timestamptz DESC NULLS LAST`;
  if (sort === "paidAsc") return Prisma.sql`("dataJson"->>'paidAt')::timestamptz ASC NULLS LAST`;
  if (sort === "amountDesc") return Prisma.sql`("dataJson"->>'amount')::numeric DESC`;
  if (sort === "amountAsc") return Prisma.sql`("dataJson"->>'amount')::numeric ASC`;
  return Prisma.sql`"sortAt" DESC`;
}

export async function queryPaymentListProjection(db: DB, input: PaymentListProjectionInput) {
  const offset = (input.page - 1) * input.pageSize;
  const baseWhere = Prisma.join(baseConditions(input), " AND ");
  const status = clean(input.status).toUpperCase() || null;
  const rows = await dbOrTx(db).$queryRaw<Array<{
    kind: "ROW" | "COUNT";
    key: string;
    dataJson: unknown;
    count: bigint;
  }>>(Prisma.sql`
    WITH base AS (
      SELECT "status", "sortAt", "dataJson"
      FROM "ProjectionRecord"
      WHERE ${baseWhere}
    ),
    selected AS (
      SELECT "dataJson"
      FROM base
      WHERE (${status}::text IS NULL OR "status" = ${status})
      ORDER BY ${projectionOrder(input.sort)}
      LIMIT ${input.pageSize}
      OFFSET ${offset}
    ),
    counts AS (
      SELECT 'all'::text AS "key", COUNT(*) AS "count" FROM base
      UNION ALL SELECT 'paid', COUNT(*) FROM base WHERE "status" = 'PAID'
      UNION ALL SELECT 'unpaid', COUNT(*) FROM base WHERE "status" = 'UNPAID'
      UNION ALL SELECT 'canceled', COUNT(*) FROM base WHERE "status" = 'CANCELED'
      UNION ALL SELECT 'total', COUNT(*) FROM base WHERE (${status}::text IS NULL OR "status" = ${status})
    )
    SELECT 'ROW'::text AS "kind", ''::text AS "key", "dataJson", 0::bigint AS "count"
    FROM selected
    UNION ALL
    SELECT 'COUNT'::text AS "kind", "key", NULL::jsonb AS "dataJson", "count"
    FROM counts
  `);
  const counts = new Map(rows.filter((row) => row.kind === "COUNT").map((row) => [row.key, Number(row.count)]));
  return {
    items: rows
      .filter((row) => row.kind === "ROW")
      .map((row) => row.dataJson as PaymentListProjectionRow),
    total: counts.get("total") ?? 0,
    counts: {
      all: counts.get("all") ?? 0,
      paid: counts.get("paid") ?? 0,
      unpaid: counts.get("unpaid") ?? 0,
      canceled: counts.get("canceled") ?? 0,
    },
  };
}

export async function hasPaymentListProjectionRows(db: DB) {
  const rows = await dbOrTx(db).$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
    SELECT EXISTS (
      SELECT 1
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${PAYMENT_LIST_PROJECTION_KEY}
        AND "projectionVersion" = ${PAYMENT_LIST_PROJECTION_VERSION}
    ) AS "exists"
  `);
  return Boolean(rows[0]?.exists);
}

export async function listSettledPaymentCashFlowProjection(db: DB) {
  const rows = await dbOrTx(db).$queryRaw<Array<{ dataJson: unknown }>>(Prisma.sql`
    SELECT "dataJson"
    FROM "ProjectionRecord"
    WHERE "projectionKey" = ${PAYMENT_LIST_PROJECTION_KEY}
      AND "projectionVersion" = ${PAYMENT_LIST_PROJECTION_VERSION}
      AND "status" IN ('PAID', 'COLLECTED')
  `);
  return rows.map((row) => row.dataJson as PaymentListProjectionRow);
}

export async function comparePaymentListProjection(db: DB) {
  const client = dbOrTx(db);
  const [sourceTotal, sourceGroups, projection] = await Promise.all([
    client.payment.count(),
    client.payment.groupBy({ by: ["status"], _count: { _all: true } }),
    queryPaymentListProjection(db, { page: 1, pageSize: 1, sort: "createdDesc" }),
  ]);
  const sourceCounts = new Map(
    sourceGroups.map((row) => [String(row.status), row._count._all]),
  );
  const differences = [
    sourceTotal !== projection.counts.all ? "all" : null,
    (sourceCounts.get("PAID") ?? 0) !== projection.counts.paid ? "paid" : null,
    (sourceCounts.get("UNPAID") ?? 0) !== projection.counts.unpaid ? "unpaid" : null,
    (sourceCounts.get("CANCELED") ?? 0) !== projection.counts.canceled ? "canceled" : null,
  ].filter((value): value is string => Boolean(value));
  return {
    ok: differences.length === 0,
    sourceTotal,
    projectionTotal: projection.counts.all,
    differences,
  };
}

export const paymentListProjectionBuilder: ProjectionBuilder = {
  key: PAYMENT_LIST_PROJECTION_KEY,
  version: PAYMENT_LIST_PROJECTION_VERSION,
  description: "Canonical Payment Workspace list, filters, counters and cash-flow read model.",
  sourceEvents: [...PAYMENT_LIST_EVENTS],
  targetTypes: ["PAYMENT"],
  buildFromEvent,
  rebuild,
};
