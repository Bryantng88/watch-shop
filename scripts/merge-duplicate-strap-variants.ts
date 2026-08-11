import { Prisma } from "@prisma/client";

import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { emitStrapBusinessEvent } from "@/domains/strap/server/events";
import { prisma } from "@/server/db/client";

function normalized(value: string | null | undefined) {
  return String(value ?? "").trim().toLocaleUpperCase("vi");
}

function identity(row: {
  material: unknown;
  lugWidthMM: number;
  buckleWidthMM: number | null;
  color: string | null;
  originType: unknown;
  brandName: string | null;
  leatherType: string | null;
  surface: unknown;
  quickRelease: boolean | null;
}) {
  return [
    row.material,
    row.lugWidthMM,
    row.buckleWidthMM ?? "",
    normalized(row.color),
    row.originType,
    normalized(row.brandName),
    normalized(row.leatherType),
    row.surface ?? "",
    row.quickRelease ? "1" : "0",
  ].join("|");
}

async function main() {
  const variants = await prisma.productVariant.findMany({
    where: {
      Product: { type: "WATCH_STRAP", status: "AVAILABLE", specStatus: { not: "MERGED" } },
      StrapVariantSpec: { inventoryPolicy: "STOCKED" },
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      productId: true,
      stockQty: true,
      costPrice: true,
      Product: { select: { title: true } },
      StrapVariantSpec: true,
      strapInstallations: { where: { removedAt: null }, select: { id: true }, take: 1 },
    },
  });

  const groups = new Map<string, typeof variants>();
  for (const variant of variants) {
    if (!variant.StrapVariantSpec) continue;
    const key = identity(variant.StrapVariantSpec);
    groups.set(key, [...(groups.get(key) ?? []), variant]);
  }

  const merged: Array<{ canonicalVariantId: string; mergedVariantIds: string[]; stockQty: number }> = [];
  for (const rows of groups.values()) {
    if (rows.length < 2) continue;
    if (rows.some((row) => row.strapInstallations.length)) {
      throw new Error(`Không thể merge nhóm ${rows[0].Product.title}: có dây đang gắn Watch.`);
    }
    const [canonical, ...duplicates] = rows;
    const totalStock = rows.reduce((sum, row) => sum + row.stockQty, 0);
    const totalValue = rows.reduce((sum, row) => sum + row.stockQty * Number(row.costPrice ?? 0), 0);
    const weightedCost = totalStock > 0 ? totalValue / totalStock : Number(canonical.costPrice ?? 0);

    await runBusinessEventTransaction(async (tx, delivery) => {
      await tx.productVariant.update({
        where: { id: canonical.id },
        data: { stockQty: totalStock, costPrice: new Prisma.Decimal(weightedCost), updatedAt: new Date() },
      });
      for (const duplicate of duplicates) {
        await tx.acquisitionItem.updateMany({
          where: { variantId: duplicate.id },
          data: { variantId: canonical.id, productId: canonical.productId },
        });
        if (duplicate.stockQty > 0) {
          await tx.strapInventoryMovement.createMany({
            data: [
              {
                strapVariantId: duplicate.id,
                movementType: "TRANSFER",
                quantity: -duplicate.stockQty,
                balanceAfter: 0,
                sourceType: "STRAP_VARIANT_MERGE",
                sourceId: canonical.id,
              },
              {
                strapVariantId: canonical.id,
                movementType: "TRANSFER",
                quantity: duplicate.stockQty,
                balanceAfter: totalStock,
                sourceType: "STRAP_VARIANT_MERGE",
                sourceId: duplicate.id,
              },
            ],
          });
        }
        await tx.productVariant.update({
          where: { id: duplicate.id },
          data: { stockQty: 0, updatedAt: new Date() },
        });
        await tx.product.update({ where: { id: duplicate.productId }, data: { specStatus: "MERGED" } });
      }
      delivery.track(await emitStrapBusinessEvent(tx, {
        eventKey: "strap.stock.adjusted",
        variantId: canonical.id,
        productId: canonical.productId,
        payload: {
          reason: "DUPLICATE_VARIANT_MERGE",
          mergedVariantIds: duplicates.map((row) => row.id),
          balanceAfter: totalStock,
        },
      }));
    });

    merged.push({
      canonicalVariantId: canonical.id,
      mergedVariantIds: duplicates.map((row) => row.id),
      stockQty: totalStock,
    });
  }

  console.log(JSON.stringify({ ok: true, merged }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
