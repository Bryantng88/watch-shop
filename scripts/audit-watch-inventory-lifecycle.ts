import { prisma } from "@/server/db/client";

type Finding = { code: string; productId: string; detail: string };

async function main() {
  const findings: Finding[] = [];
  const watches = await prisma.watch.findMany({
    select: {
      productId: true,
      currentInventoryCycleId: true,
      saleStage: true,
      stockStage: true,
      product: { select: { status: true } },
      currentInventoryCycle: { select: { productId: true, closedAt: true } },
    },
  });

  for (const watch of watches) {
    if (!watch.currentInventoryCycleId || !watch.currentInventoryCycle) {
      findings.push({ code: "MISSING_CURRENT_CYCLE", productId: watch.productId, detail: "Watch has no current cycle" });
      continue;
    }
    if (watch.currentInventoryCycle.productId !== watch.productId || watch.currentInventoryCycle.closedAt) {
      findings.push({ code: "INVALID_CURRENT_CYCLE", productId: watch.productId, detail: "Current cycle is closed or belongs to another product" });
    }
    const triple = `${watch.product.status}/${watch.saleStage}/${watch.stockStage}`;
    const valid = new Set([
      "AVAILABLE/READY/IN_STOCK",
      "AVAILABLE/PROCESSING/IN_STOCK",
      "HOLD/HOLD/RESERVED",
      "SOLD/SOLD/OUT_OF_STOCK",
    ]);
    if (!["DRAFT", "PROCESSING"].includes(String(watch.saleStage)) && !valid.has(triple)) {
      findings.push({ code: "DIVERGENT_STATE_TRIPLE", productId: watch.productId, detail: triple });
    }
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
    findings.push({ code: "MULTIPLE_ACTIVE_ORDERS", productId: row.productId, detail: `${row.lockCount} active orders in ${row.inventoryCycleId}` });
  }

  console.log(JSON.stringify({ checkedWatches: watches.length, findingCount: findings.length, findings }, null, 2));
  if (findings.length) process.exitCode = 2;
}

main().finally(() => prisma.$disconnect());
