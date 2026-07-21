import { PaymentDirection, PaymentStatus } from "@prisma/client";

import { dbOrTx, type DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import type { PaymentOwnerType, PaymentSummary } from "@/domains/payment/shared";
import { listProjectionRecords, upsertProjectionRecord } from "./projection-record.repo";
import type { ProjectionBuildContext, ProjectionBuildResult, ProjectionBuilder, ProjectionScope } from "./projection.types";

export const PAYMENT_OWNER_SUMMARY_PROJECTION_KEY = "payment-owner-summary";
export const PAYMENT_OWNER_SUMMARY_PROJECTION_VERSION = 1;
export const PAYMENT_OWNER_SUMMARY_EVENTS = [
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
  "payment.exception_marked",
] as const;

export type PaymentOwnerSummaryProjection = PaymentSummary & {
  ownerType: PaymentOwnerType;
  ownerId: string;
  incomeTotal: number;
  expenseTotal: number;
  canceledTotal: number;
  paymentCount: number;
  settledCount: number;
  pendingCount: number;
  canceledCount: number;
  currency: string;
  latestPaymentAt: string | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function toNumber(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function ownerWhere(ownerType: PaymentOwnerType, ownerId: string) {
  if (ownerType === "ORDER") return { order_id: ownerId, type: "ORDER" as const };
  if (ownerType === "ACQUISITION") return { acquisition_id: ownerId, type: "ACQUISITION" as const };
  if (ownerType === "SHIPMENT") return { shipment_id: ownerId, type: "SHIPMENT" as const };
  if (ownerType === "SERVICE") return { service_request_id: ownerId, type: "SERVICE" as const };
  return { technical_issue_id: ownerId, type: "SERVICE" as const };
}

function ownerFromPayment(payment: {
  type?: string | null;
  order_id?: string | null;
  acquisition_id?: string | null;
  shipment_id?: string | null;
  service_request_id?: string | null;
  technical_issue_id?: string | null;
}) {
  if (payment.shipment_id) return { ownerType: "SHIPMENT" as const, ownerId: payment.shipment_id };
  if (payment.order_id) return { ownerType: "ORDER" as const, ownerId: payment.order_id };
  if (payment.acquisition_id) return { ownerType: "ACQUISITION" as const, ownerId: payment.acquisition_id };
  if (payment.technical_issue_id) return { ownerType: "TECHNICAL_ISSUE" as const, ownerId: payment.technical_issue_id };
  if (payment.service_request_id) return { ownerType: "SERVICE" as const, ownerId: payment.service_request_id };
  return null;
}

async function ownerFromPaymentId(db: DB, paymentId: string) {
  const payment = await dbOrTx(db).payment.findUnique({
    where: { id: paymentId },
    select: { type: true, order_id: true, acquisition_id: true, shipment_id: true, service_request_id: true, technical_issue_id: true },
  });
  return payment ? ownerFromPayment(payment) : null;
}

async function ownerTotalDue(db: DB, ownerType: PaymentOwnerType, ownerId: string) {
  const client = dbOrTx(db);
  if (ownerType === "ORDER") return toNumber((await client.order.findUnique({ where: { id: ownerId }, select: { subtotal: true } }))?.subtotal);
  if (ownerType === "ACQUISITION") return toNumber((await client.acquisition.findUnique({ where: { id: ownerId }, select: { totalAmount: true } }))?.totalAmount);
  if (ownerType === "SHIPMENT") return toNumber((await client.shipment.findUnique({ where: { id: ownerId }, select: { shippingAmount: true } }))?.shippingAmount);
  if (ownerType === "TECHNICAL_ISSUE") {
    const issue = await client.technicalIssue.findUnique({ where: { id: ownerId }, select: { actualCost: true, estimatedCost: true } });
    return toNumber(issue?.actualCost ?? issue?.estimatedCost);
  }
  return 0;
}

export async function buildPaymentOwnerSummary(db: DB, ownerType: PaymentOwnerType, ownerId: string) {
  const client = dbOrTx(db);
  const [totalDue, payments] = await Promise.all([
    ownerTotalDue(db, ownerType, ownerId),
    client.payment.findMany({
      where: ownerWhere(ownerType, ownerId),
      select: { amount: true, currency: true, direction: true, status: true, paidAt: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);
  const settled = new Set<PaymentStatus>([PaymentStatus.PAID, PaymentStatus.COLLECTED]);
  const paidTotal = payments.filter((row) => row.status === PaymentStatus.PAID).reduce((sum, row) => sum + toNumber(row.amount), 0);
  const collectedTotal = payments.filter((row) => row.status === PaymentStatus.COLLECTED).reduce((sum, row) => sum + toNumber(row.amount), 0);
  const unpaidTotal = payments.filter((row) => row.status === PaymentStatus.UNPAID).reduce((sum, row) => sum + toNumber(row.amount), 0);
  const incomeTotal = payments.filter((row) => settled.has(row.status) && row.direction === PaymentDirection.IN).reduce((sum, row) => sum + toNumber(row.amount), 0);
  const expenseTotal = payments.filter((row) => settled.has(row.status) && row.direction === PaymentDirection.OUT).reduce((sum, row) => sum + toNumber(row.amount), 0);
  const recognizedTotal = paidTotal + collectedTotal;
  const depositRequired = ownerType === "ORDER"
    ? toNumber((await client.order.findUnique({ where: { id: ownerId }, select: { depositRequired: true } }))?.depositRequired)
    : 0;
  const summary: PaymentOwnerSummaryProjection = {
    ownerType,
    ownerId,
    totalDue,
    paidTotal,
    collectedTotal,
    unpaidTotal,
    remaining: Math.max(0, totalDue - recognizedTotal),
    depositRequired,
    depositPaid: depositRequired > 0 ? Math.min(depositRequired, recognizedTotal) : 0,
    incomeTotal,
    expenseTotal,
    canceledTotal: payments.filter((row) => row.status === PaymentStatus.CANCELED).reduce((sum, row) => sum + toNumber(row.amount), 0),
    paymentCount: payments.length,
    settledCount: payments.filter((row) => settled.has(row.status)).length,
    pendingCount: payments.filter((row) => row.status === PaymentStatus.UNPAID).length,
    canceledCount: payments.filter((row) => row.status === PaymentStatus.CANCELED).length,
    currency: payments[0]?.currency ?? "VND",
    latestPaymentAt: payments[0] ? (payments[0].paidAt ?? payments[0].updatedAt ?? payments[0].createdAt).toISOString() : null,
  };

  await upsertProjectionRecord(db, {
    projectionKey: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY,
    projectionVersion: PAYMENT_OWNER_SUMMARY_PROJECTION_VERSION,
    rowKey: `${ownerType}:${ownerId}`,
    entityType: ownerType,
    entityId: ownerId,
    status: summary.remaining <= 0 && summary.totalDue > 0 ? "SETTLED" : summary.paidTotal + summary.collectedTotal > 0 ? "PARTIAL" : "UNPAID",
    sortAt: summary.latestPaymentAt,
    sourceUpdatedAt: summary.latestPaymentAt,
    dataJson: summary,
  });
  return summary;
}

function buildResult(context: ProjectionBuildContext, scope: ProjectionScope, applied: number, reason?: string): ProjectionBuildResult {
  return { ok: true, status: applied ? "applied" : "skipped", projectionKey: context.projectionKey, projectionVersion: context.projectionVersion, scope, applied, skipped: applied ? 0 : 1, failed: 0, reason };
}

async function buildFromEvent(db: DB, context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext }) {
  const eventLog = context.sourceEvent.eventLog && typeof context.sourceEvent.eventLog === "object"
    ? context.sourceEvent.eventLog as Record<string, unknown>
    : {};
  const payload = eventLog.metadataJson && typeof eventLog.metadataJson === "object"
    ? eventLog.metadataJson as Record<string, unknown>
    : {};
  const payloadOwnerType = clean(payload.ownerType).toUpperCase() as PaymentOwnerType;
  const payloadOwnerId = clean(payload.ownerId);
  const owner = payloadOwnerId ? { ownerType: payloadOwnerType, ownerId: payloadOwnerId } : await ownerFromPaymentId(db, context.sourceEvent.targetId);
  const scope = { targetType: owner?.ownerType ?? "PAYMENT", targetId: owner?.ownerId ?? context.sourceEvent.targetId };
  if (!owner?.ownerId) return buildResult(context, scope, 0, "PAYMENT_OWNER_NOT_FOUND");
  await buildPaymentOwnerSummary(db, owner.ownerType, owner.ownerId);
  return buildResult(context, scope, 1);
}

async function rebuild(db: DB, context: ProjectionBuildContext & { scope: ProjectionScope }) {
  const client = dbOrTx(db);
  const rawTargetType = clean(context.scope.targetType).toUpperCase();
  const targetType = rawTargetType as PaymentOwnerType;
  const targetId = clean(context.scope.targetId);
  if (targetId && rawTargetType && rawTargetType !== "PAYMENT") {
    await buildPaymentOwnerSummary(db, targetType, targetId);
    return buildResult(context, context.scope, 1);
  }
  const rows = await client.payment.findMany({
    select: { type: true, order_id: true, acquisition_id: true, shipment_id: true, service_request_id: true, technical_issue_id: true },
  });
  const owners = new Map<string, { ownerType: PaymentOwnerType; ownerId: string }>();
  for (const row of rows) {
    const owner = ownerFromPayment(row);
    if (owner) owners.set(`${owner.ownerType}:${owner.ownerId}`, owner);
  }
  for (const owner of owners.values()) await buildPaymentOwnerSummary(db, owner.ownerType, owner.ownerId);
  return buildResult(context, context.scope, owners.size, owners.size ? undefined : "NO_PAYMENT_OWNERS");
}

export async function getPaymentOwnerSummaryProjection(db: DB, ownerType: PaymentOwnerType, ownerId: string) {
  const rows = await listProjectionRecords(db, { projectionKey: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY, entityType: ownerType, entityId: ownerId, limit: 1 });
  const data = rows[0]?.dataJson as PaymentOwnerSummaryProjection | undefined;
  return data ?? buildPaymentOwnerSummary(db, ownerType, ownerId);
}

export async function getPaymentOwnerSummaryProjections(db: DB, ownerType: PaymentOwnerType, ownerIds: string[]) {
  const uniqueIds = [...new Set(ownerIds.filter(Boolean))];
  const rows = await listProjectionRecords(db, { projectionKey: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY, entityType: ownerType, limit: Math.max(100, uniqueIds.length) });
  const map = new Map(rows.map((row) => [row.entityId ?? "", row.dataJson as PaymentOwnerSummaryProjection]));
  for (const ownerId of uniqueIds) if (!map.has(ownerId)) map.set(ownerId, await buildPaymentOwnerSummary(db, ownerType, ownerId));
  return map;
}

export const paymentOwnerSummaryProjectionBuilder: ProjectionBuilder = {
  key: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY,
  version: PAYMENT_OWNER_SUMMARY_PROJECTION_VERSION,
  description: "Canonical Payment-owned settlement summary for Order, Acquisition, Shipment and Service owners.",
  sourceEvents: [...PAYMENT_OWNER_SUMMARY_EVENTS],
  targetTypes: ["PAYMENT"],
  buildFromEvent,
  rebuild,
};
