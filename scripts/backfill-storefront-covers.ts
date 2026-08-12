import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

if (apply && process.env.ALLOW_STOREFRONT_COVER_BACKFILL !== "1") {
  throw new Error("Set ALLOW_STOREFRONT_COVER_BACKFILL=1 to apply changes");
}

const eligibleWhere = {
  type: "WATCH",
  status: "AVAILABLE",
  slug: { not: null },
  watch: {
    is: {
      saleStage: "READY",
      stockStage: "IN_STOCK",
      serviceStage: { in: ["NOT_REQUIRED", "DONE"] },
      AND: [
        { reviewStates: { some: { targetType: "CONTENT", status: "APPROVED" } } },
        { reviewStates: { some: { targetType: "IMAGE", status: "APPROVED" } } },
      ],
    },
  },
  productImage: {
    some: {
      isPrimary: true,
      isForStorefront: true,
      fileKey: { not: "" },
    },
  },
} as const;

async function main() {
  const products = await prisma.product.findMany({
    where: eligibleWhere,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      productImage: {
        where: { isPrimary: true, isForStorefront: true, fileKey: { not: "" } },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }, { id: "asc" }],
        take: 1,
        select: { id: true, role: true, fileKey: true },
      },
    },
  });

  const candidates = products
    .map((product) => ({ product, image: product.productImage[0] }))
    .filter(({ image }) => image && image.role !== "COVER");

  if (apply) {
    await prisma.$transaction(
      candidates.map(({ image }) => prisma.productImage.update({
        where: { id: image.id },
        data: { role: "COVER" },
      })),
    );
  }

  console.log(JSON.stringify({
    ok: true,
    mode: apply ? "apply" : "dry-run",
    eligibleProducts: products.length,
    candidates: candidates.length,
    sample: candidates.slice(0, 5).map(({ product, image }) => ({
      productId: product.id,
      title: product.title,
      imageId: image.id,
      previousRole: image.role,
      fileKey: image.fileKey,
    })),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
