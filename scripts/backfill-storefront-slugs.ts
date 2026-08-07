import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const databaseUrl = process.env.DATABASE_URL?.trim();
const apply = process.argv.includes("--apply");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const databaseName = new URL(databaseUrl).pathname.replace(/^\//, "");
if (!databaseName.toLowerCase().includes("staging")) {
  throw new Error(`Refusing non-staging database: ${databaseName || "(unknown)"}`);
}

if (apply && process.env.ALLOW_STOREFRONT_SLUG_BACKFILL !== "1") {
  throw new Error("Set ALLOW_STOREFRONT_SLUG_BACKFILL=1 to apply changes");
}

const db = new PrismaClient();

function makeStorefrontSlug(title: string, productId: string) {
  const base =
    slugify(title || "watch", {
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    }).slice(0, 80) || "watch";
  const suffix = productId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toLowerCase();
  return `${base}-${suffix || "item"}`;
}

async function main() {
  const products = await db.product.findMany({
    where: {
      type: "WATCH",
      status: "AVAILABLE",
      AND: [
        { OR: [{ slug: null }, { slug: "" }] },
        {
          OR: [
            { priceVisibility: "HIDE" },
            { watch: { is: { watchPrice: { is: { salePrice: { gt: 0 } } } } } },
          ],
        },
      ],
      watch: {
        is: {
          saleStage: "READY",
          stockStage: "IN_STOCK",
          serviceStage: { in: ["NOT_REQUIRED", "DONE"] },
          AND: [
            {
              reviewStates: {
                some: { targetType: "CONTENT", status: "APPROVED" },
              },
            },
            {
              reviewStates: {
                some: { targetType: "IMAGE", status: "APPROVED" },
              },
            },
          ],
        },
      },
      productImage: {
        some: { isForStorefront: true, fileKey: { not: "" } },
      },
    },
    select: { id: true, title: true },
    orderBy: { id: "asc" },
  });

  const candidates = products.map((product) => ({
    id: product.id,
    slug: makeStorefrontSlug(product.title, product.id),
  }));
  const duplicateSlugs = candidates.filter(
    (candidate, index) =>
      candidates.findIndex((other) => other.slug === candidate.slug) !== index,
  );

  if (duplicateSlugs.length > 0) {
    throw new Error(`Generated ${duplicateSlugs.length} duplicate slugs`);
  }

  console.log(JSON.stringify({ database: databaseName, mode: apply ? "apply" : "dry-run", candidates: candidates.length }));
  if (!apply) return;

  let updated = 0;
  await db.$transaction(async (tx) => {
    for (const candidate of candidates) {
      const result = await tx.product.updateMany({
        where: { id: candidate.id, OR: [{ slug: null }, { slug: "" }] },
        data: { slug: candidate.slug },
      });
      updated += result.count;
    }
  });

  console.log(JSON.stringify({ database: databaseName, updated }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
