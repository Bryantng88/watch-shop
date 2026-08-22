import type { Prisma } from "@prisma/client";

import { rebuildWatchListProjectionRows } from "../src/domains/projection/server/watch-list";
import { publicWatchEligibilityWhere } from "../src/domains/storefront/server/public-catalog.repo";
import { prisma } from "../src/server/db/client";

function legacyVisibleWithoutPublicationWhere(): Prisma.ProductWhereInput {
  const canonical = structuredClone(publicWatchEligibilityWhere()) as Prisma.ProductWhereInput;
  const gates = Array.isArray(canonical.AND) ? canonical.AND : [canonical.AND];
  const productGate = gates[0] as Prisma.ProductWhereInput;

  // Preserve every current storefront gate except the newly explicit publication
  // flag. These are the rows that were public immediately before that contract.
  delete productGate.publishedAt;
  return { AND: [canonical, { publishedAt: null }] };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const candidates = await prisma.product.findMany({
    where: legacyVisibleWithoutPublicationWhere(),
    orderBy: { updatedAt: "asc" },
    select: { id: true, title: true, slug: true, updatedAt: true },
  });

  if (!apply || candidates.length === 0) {
    console.log(JSON.stringify({ apply, count: candidates.length, candidates }, null, 2));
    return;
  }

  const ids = candidates.map((candidate) => candidate.id);
  await prisma.$transaction(async (tx) => {
    await tx.product.updateMany({
      where: { id: { in: ids }, publishedAt: null },
      data: { publishedAt: new Date() },
    });
    await rebuildWatchListProjectionRows(tx, { productIds: ids, limit: ids.length });
  }, { timeout: 60_000 });

  console.log(JSON.stringify({ apply, restored: ids.length, candidates }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
