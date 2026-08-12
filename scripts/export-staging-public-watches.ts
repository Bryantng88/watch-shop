import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const limit = Math.min(12, Math.max(1, Number(process.env.EXPORT_WATCH_LIMIT || 8)));

async function main() {
  const products = await db.product.findMany({
    where: {
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
      productImage: { some: { role: "COVER", isForStorefront: true, fileKey: { not: "" } } },
      AND: [{
        OR: [
          { priceVisibility: "HIDE" },
          { watch: { is: { watchPrice: { is: { salePrice: { gt: 0 } } } } } },
        ],
      }],
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      type: true,
      priceVisibility: true,
      status: true,
      tag: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      brand: { select: { id: true, name: true, slug: true, country: true, foundedYear: true } },
      productImage: {
        where: { role: "COVER", isForStorefront: true, fileKey: { not: "" } },
        orderBy: [{ role: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        take: 5,
        select: {
          id: true, fileKey: true, role: true, alt: true, width: true, height: true,
          mime: true, sizeBytes: true, sortOrder: true, dominantHex: true,
          isPrimary: true, isForAdmin: true, isForStorefront: true,
        },
      },
      watch: {
        select: {
          id: true,
          saleStage: true,
          serviceStage: true,
          stockStage: true,
          siteChannel: true,
          gender: true,
          audienceSegment: true,
          mediaPipelineKey: true,
          conditionGrade: true,
          movementType: true,
          yearText: true,
          specStatus: true,
          createdAt: true,
          updatedAt: true,
          watchPrice: { select: { listPrice: true, salePrice: true, pricingNote: true } },
          watchContent: {
            select: {
              titleOverride: true, summary: true, body: true, bulletSpecs: true,
              seoTitle: true, seoDescription: true, contentStatus: true,
              publishedAt: true, createdAt: true, updatedAt: true,
            },
          },
          watchSpecV2: {
            select: {
              id: true, brand: true, model: true, referenceNumber: true, nickname: true,
              caseShape: true, caseSizeMM: true, lugToLugMM: true, lugWidthMM: true,
              thicknessMM: true, materialProfile: true, primaryCaseMaterial: true,
              secondaryCaseMaterial: true, goldTreatment: true, goldColors: true,
              goldKarat: true, materialNote: true, dialColor: true, dialFinish: true,
              crystal: true, movementType: true, calibre: true, powerReserve: true,
              waterResistance: true, braceletType: true, strapMaterialText: true,
              buckleType: true, bookletIncluded: true, cardIncluded: true,
              boxIncluded: true, strapSetType: true, strapComponentSource: true,
              featuresJson: true, createdAt: true, updatedAt: true,
            },
          },
          reviewStates: {
            where: { targetType: { in: ["CONTENT", "IMAGE"] } },
            select: { id: true, targetType: true, status: true, submittedAt: true, reviewedAt: true, createdAt: true, updatedAt: true },
          },
        },
      },
    },
  });

  console.log(JSON.stringify({ version: 1, source: "staging-public-watch", products }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => db.$disconnect());
