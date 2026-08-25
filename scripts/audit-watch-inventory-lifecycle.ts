import { prisma } from "@/server/db/client";
import { auditWatchInventoryState } from "@/domains/watch/server/inventory-lifecycle/watch-inventory-audit";

type Finding = { severity: "ERROR" | "WARNING"; code: string; productId: string; detail: string };

async function main() {
  const findings: Finding[] = [];
  const watches = await prisma.watch.findMany({
    select: {
      productId: true,
      currentInventoryCycleId: true,
      saleStage: true,
      stockStage: true,
      serviceStage: true,
      product: { select: { status: true } },
      currentInventoryCycle: { select: { productId: true, closedAt: true } },
    },
  });

  for (const watch of watches) {
    if (!watch.currentInventoryCycleId || !watch.currentInventoryCycle) {
      findings.push({ severity: "ERROR", code: "MISSING_CURRENT_CYCLE", productId: watch.productId, detail: "Watch has no current cycle" });
      continue;
    }
    if (watch.currentInventoryCycle.productId !== watch.productId || watch.currentInventoryCycle.closedAt) {
      findings.push({ severity: "ERROR", code: "INVALID_CURRENT_CYCLE", productId: watch.productId, detail: "Current cycle is closed or belongs to another product" });
    }
    const stateFinding = auditWatchInventoryState({
      productStatus: String(watch.product.status),
      saleStage: String(watch.saleStage),
      stockStage: String(watch.stockStage),
      serviceStage: String(watch.serviceStage),
    });
    if (stateFinding) findings.push({ ...stateFinding, productId: watch.productId });
  }

  const duplicateLocks = await prisma.$queryRaw<Array<{ productId: string; inventoryCycleId: string; lockCount: bigint }>>`
    SELECT oi."productId", oi."inventoryCycleId", COUNT(DISTINCT oi."orderId") AS "lockCount"
    FROM "OrderItem" oi JOIN "Order" o ON o."id" = oi."orderId"
    WHERE oi."inventoryCycleId" IS NOT NULL
      AND o."status" NOT IN ('CANCELLED', 'COMPLETED', 'RETURNED')
    GROUP BY oi."productId", oi."inventoryCycleId"
    HAVING COUNT(DISTINCT oi."orderId") > 1
  `;
  for (const row of duplicateLocks) {
    findings.push({ severity: "ERROR", code: "MULTIPLE_ACTIVE_ORDERS", productId: row.productId, detail: `${row.lockCount} active orders in ${row.inventoryCycleId}` });
  }

  const errors = findings.filter((finding) => finding.severity === "ERROR");
  const warnings = findings.filter((finding) => finding.severity === "WARNING");
  console.log(JSON.stringify({
    checkedWatches: watches.length,
    errorCount: errors.length,
    warningCount: warnings.length,
    findings,
  }, null, 2));
  if (errors.length) process.exitCode = 2;
}

main().finally(() => prisma.$disconnect());
