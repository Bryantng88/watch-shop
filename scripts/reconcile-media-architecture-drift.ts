import { prisma } from "../src/server/db/client";

const apply = process.argv.includes("--apply");
const sourcePattern = /^(media\/(men|women|unisex)\/(edit|inline|cover)|products\/(edit|inline|cover)\/active)\//;

async function main() {
  const products = await prisma.product.findMany({
    where: { productImage: { some: {} } },
    select: {
      id: true,
      primaryImageUrl: true,
      storefrontImageKey: true,
      productImage: {
        select: { fileKey: true, role: true, isPrimary: true, sortOrder: true },
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
  let coverPointerRepairs = 0;
  let sourcePointerRepairs = 0;
  let ambiguous = 0;
  for (const product of products) {
    const cover = product.productImage.find((image) => image.role === "COVER");
    const fallback = product.productImage.find((image) => image.role === "INLINE") ?? product.productImage[0];
    const desiredPrimary = cover?.fileKey ?? fallback?.fileKey ?? null;
    const desiredStorefront = cover?.fileKey ?? fallback?.fileKey ?? null;
    const coverMismatch = Boolean(cover) && (
      product.primaryImageUrl !== cover!.fileKey || product.storefrontImageKey !== cover!.fileKey
    );
    const sourceMismatch = sourcePattern.test(product.primaryImageUrl ?? "") || sourcePattern.test(product.storefrontImageKey ?? "");
    if (!coverMismatch && !sourceMismatch) continue;
    if (!desiredPrimary || !desiredStorefront) {
      ambiguous += 1;
      continue;
    }
    if (coverMismatch) coverPointerRepairs += 1;
    else sourcePointerRepairs += 1;
    if (apply) {
      await prisma.product.update({
        where: { id: product.id },
        data: { primaryImageUrl: desiredPrimary, storefrontImageKey: desiredStorefront },
      });
    }
  }
  console.log(JSON.stringify({ mode: apply ? "APPLY" : "DRY_RUN", coverPointerRepairs, sourcePointerRepairs, ambiguous }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
