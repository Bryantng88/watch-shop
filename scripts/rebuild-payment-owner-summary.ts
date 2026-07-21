import { prisma } from "../src/server/db/client";
import {
  PAYMENT_OWNER_SUMMARY_PROJECTION_KEY,
  paymentOwnerSummaryProjectionBuilder,
} from "../src/domains/projection/server/payment-owner-summary.projection";

async function main() {
  const result = await paymentOwnerSummaryProjectionBuilder.rebuild?.(prisma, {
    projectionKey: PAYMENT_OWNER_SUMMARY_PROJECTION_KEY,
    projectionVersion: paymentOwnerSummaryProjectionBuilder.version,
    sourceKind: "SOURCE_REBUILD",
    sourceEvent: null,
    scope: {},
  });
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
