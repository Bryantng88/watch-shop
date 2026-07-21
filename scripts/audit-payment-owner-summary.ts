import { prisma } from "../src/server/db/client";
import {
  PAYMENT_OWNER_SUMMARY_PROJECTION_KEY,
  paymentOwnerSummaryProjectionBuilder,
} from "../src/domains/projection/server/payment-owner-summary.projection";

async function main() {
  const [payments, projections, sample] = await Promise.all([
    prisma.payment.findMany({ select: { order_id: true, acquisition_id: true, shipment_id: true, service_request_id: true, technical_issue_id: true } }),
    prisma.projectionRecord.findMany({ where: { projectionKey: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY }, select: { rowKey: true } }),
    prisma.payment.findFirst({
      where: { OR: [{ order_id: { not: null } }, { acquisition_id: { not: null } }, { shipment_id: { not: null } }, { service_request_id: { not: null } }, { technical_issue_id: { not: null } }] },
      orderBy: { updatedAt: "desc" },
      select: { id: true, order_id: true, acquisition_id: true, shipment_id: true, service_request_id: true, technical_issue_id: true },
    }),
  ]);
  const eventResult = sample && paymentOwnerSummaryProjectionBuilder.buildFromEvent
    ? await paymentOwnerSummaryProjectionBuilder.buildFromEvent(prisma, {
        projectionKey: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY,
        projectionVersion: paymentOwnerSummaryProjectionBuilder.version,
        sourceKind: "BUSINESS_EVENT",
        scope: { targetType: "PAYMENT", targetId: sample.id },
        sourceEvent: {
          eventLog: { metadataJson: {} },
          eventKey: "payment.status_updated",
          targetType: "PAYMENT",
          targetId: sample.id,
          effect: "ASSERT",
        },
      })
    : null;
  const sourceOwnerKeys = new Set(payments.flatMap((payment) => {
    if (payment.order_id) return [`ORDER:${payment.order_id}`];
    if (payment.acquisition_id) return [`ACQUISITION:${payment.acquisition_id}`];
    if (payment.shipment_id) return [`SHIPMENT:${payment.shipment_id}`];
    if (payment.technical_issue_id) return [`TECHNICAL_ISSUE:${payment.technical_issue_id}`];
    if (payment.service_request_id) return [`SERVICE:${payment.service_request_id}`];
    return [];
  }));
  const projectionKeys = new Set(projections.map((row) => row.rowKey));
  console.log(JSON.stringify({
    paymentCount: payments.length,
    sourceOwnerCount: sourceOwnerKeys.size,
    projectionCount: projectionKeys.size,
    missingProjectionOwners: [...sourceOwnerKeys].filter((key) => !projectionKeys.has(key)),
    extraProjectionOwners: [...projectionKeys].filter((key) => !sourceOwnerKeys.has(key)),
    sample,
    eventResult,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
