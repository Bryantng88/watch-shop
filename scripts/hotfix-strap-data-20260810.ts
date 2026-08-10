import { prisma } from "@/server/db/client";
import { rebuildProjection } from "@/domains/projection/server/projection.runner";

const obsoleteProducts = [
  { id: "cmmq4vwgo0006vkiccqcyz44n", variantId: "cmmq4vwgo0007vkicefmjkjev" },
  { id: "cmmq4vwy10008vkicee4hb8op", variantId: "cmmq4vwy20009vkic3d7ur7mw" },
] as const;

const repairedStraps = [
  { variantId: "d1da19b5-3c0b-47af-969a-603e11e5bd60", lugWidthMM: 12, buckleWidthMM: 10, color: "Đen", surface: "SMOOTH" },
  { variantId: "7f922675-b79a-4d7c-8bc6-23f5aa0147f3", lugWidthMM: 10, buckleWidthMM: 8, color: "Đen", surface: "SMOOTH" },
  { variantId: "43ffc2ea-e7b4-4002-9d19-ae01c74b690f", lugWidthMM: 10, buckleWidthMM: 8, color: "Đen", surface: "SMOOTH" },
  { variantId: "46cc82e7-412b-4ca7-ad9a-f08de3776815", lugWidthMM: 12, buckleWidthMM: 10, color: "Nâu đậm", surface: "SMOOTH" },
  { variantId: "d1504efe-3bfc-4afc-822d-4898b5fd4ca5", lugWidthMM: 12, buckleWidthMM: 10, color: "Nâu", surface: "GRAINED" },
  { variantId: "19cf7bb6-e567-4ec7-b57c-75e64986d880", lugWidthMM: 19, buckleWidthMM: 12, color: "Đen", surface: "SMOOTH" },
] as const;

async function main() {
  const result = await prisma.$transaction(async (tx) => {
    const obsolete = await tx.product.findMany({
      where: { id: { in: obsoleteProducts.map((row) => row.id) } },
      select: {
        id: true,
        title: true,
        productVariant: {
          select: {
            id: true,
            strapInstallations: { select: { id: true }, take: 1 },
            strapMovements: { select: { id: true }, take: 1 },
          },
        },
      },
    });
    if (obsolete.length !== obsoleteProducts.length) {
      throw new Error(`Expected ${obsoleteProducts.length} obsolete products, found ${obsolete.length}.`);
    }
    for (const product of obsolete) {
      const expected = obsoleteProducts.find((row) => row.id === product.id);
      if (product.title !== "Bò trơn" || product.productVariant.length !== 1 || product.productVariant[0]?.id !== expected?.variantId) {
        throw new Error(`Obsolete product guard failed for ${product.id}.`);
      }
      if (product.productVariant[0].strapInstallations.length || product.productVariant[0].strapMovements.length) {
        throw new Error(`Cannot delete ${product.id}: it has strap history.`);
      }
    }

    for (const strap of repairedStraps) {
      await tx.strapVariantSpec.update({
        where: { variantId: strap.variantId },
        data: {
          lugWidthMM: strap.lugWidthMM,
          buckleWidthMM: strap.buckleWidthMM,
          color: strap.color,
          leatherType: "COW",
          surface: strap.surface,
          updatedAt: new Date(),
        },
      });
      await tx.productVariant.update({
        where: { id: strap.variantId },
        data: { updatedAt: new Date() },
      });
    }

    const deleted = await tx.product.deleteMany({
      where: { id: { in: obsoleteProducts.map((row) => row.id) }, title: "Bò trơn" },
    });
    if (deleted.count !== obsoleteProducts.length) {
      throw new Error(`Expected to delete ${obsoleteProducts.length} products, deleted ${deleted.count}.`);
    }
    return { repaired: repairedStraps.length, deleted: deleted.count };
  });

  const projection = await rebuildProjection(prisma, { projectionKey: "strap-list" });
  console.log(JSON.stringify({ ...result, projection }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
