import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

if (apply && process.env.ALLOW_UNBOUND_COVER_CLEANUP !== "1") {
  throw new Error("Set ALLOW_UNBOUND_COVER_CLEANUP=1 to apply changes");
}

async function main() {
  const covers = await prisma.productImage.findMany({
    where: {
      role: "COVER",
      isPrimary: true,
      isForStorefront: true,
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
  const candidates = covers.filter(
    (image) => image.product.storefrontImageKey !== image.fileKey,
  );

  if (apply) {
    await prisma.$transaction(
      candidates.map((image) => prisma.productImage.update({
        where: { id: image.id },
        data: { role: "INLINE" },
      })),
    );
  }

  console.log(JSON.stringify({
    ok: true,
    mode: apply ? "apply" : "dry-run",
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
