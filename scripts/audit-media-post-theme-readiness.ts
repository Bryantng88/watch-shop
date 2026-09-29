import { prisma } from "../src/server/db/client";

async function main() {
  const report = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe("SET TRANSACTION READ ONLY");
    const galleryScope = { product: { productImage: { some: { role: "GALLERY" as const } } } };
    const [
      galleryWatches,
      missingMovementType,
      missingStyle,
      missingCaseShape,
      missingEffectivePrice,
      movementTypes,
      styles,
      caseShapes,
    ] = await Promise.all([
      tx.watch.count({ where: galleryScope }),
      tx.watch.count({ where: { ...galleryScope, movementType: null } }),
      tx.watch.count({ where: { ...galleryScope, style: null } }),
      tx.watch.count({ where: { ...galleryScope, OR: [
        { watchSpecV2: { is: null } },
        { watchSpecV2: { is: { caseShape: null } } },
      ] } }),
      tx.watch.count({ where: { ...galleryScope, OR: [
        { watchPrice: { is: null } },
        { watchPrice: { is: { salePrice: null, listPrice: null } } },
      ] } }),
      tx.watch.groupBy({ by: ["movementType"], _count: { _all: true } }),
      tx.watch.groupBy({ by: ["style"], _count: { _all: true } }),
      tx.watchSpecV2.groupBy({ by: ["caseShape"], _count: { _all: true } }),
    ]);
    return {
      auditedAt: new Date().toISOString(),
      galleryWatches,
      missing: { movementType: missingMovementType, style: missingStyle, caseShape: missingCaseShape, effectivePrice: missingEffectivePrice },
      enumCounts: { movementTypes, styles, caseShapes },
    };
  });
  console.log(JSON.stringify(report, null, 2));
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
