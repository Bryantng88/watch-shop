import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");
const backfillStartedAt = new Date("2026-08-12T17:03:00.000Z");
const backfillEndedAt = new Date("2026-08-12T17:05:00.000Z");

if (apply && process.env.ALLOW_UNBOUND_COVER_CLEANUP !== "1") {
  throw new Error("Set ALLOW_UNBOUND_COVER_CLEANUP=1 to apply changes");
}

async function main() {
  const covers = await prisma.productImage.findMany({
    where: {
      role: "COVER",
      isPrimary: true,
      isForStorefront: true,
      updatedAt: { gte: backfillStartedAt, lte: backfillEndedAt },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      productId: true,
      fileKey: true,
      updatedAt: true,
      product: { select: { title: true, storefrontImageKey: true } },
    },
  });
  const candidates = covers;

  if (apply) {
    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { id: { in: candidates.map((image) => image.id) } },
        data: { role: "INLINE" },
      }),
      prisma.product.updateMany({
        where: {
          OR: candidates.map((image) => ({
            id: image.productId,
            storefrontImageKey: image.fileKey,
          })),
        },
        data: { storefrontImageKey: null },
      }),
    ]);
  }

  console.log(JSON.stringify({
    ok: true,
    mode: apply ? "apply" : "dry-run",
    backfillWindow: [backfillStartedAt.toISOString(), backfillEndedAt.toISOString()],
    candidates: candidates.length,
    sample: candidates.slice(0, 10),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
