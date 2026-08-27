import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const parsed = new URL(databaseUrl);
if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error("Refusing to seed Seiko fixtures outside a local database");
}
if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed Seiko fixtures in production mode");
}

const prefix = "sf-local-seiko-";

async function main() {
  const { prisma } = await import("../src/server/db/client");
  try {
    const galleryImages = await prisma.productImage.findMany({
      where: {
        role: "GALLERY",
        fileKey: { not: "" },
        productId: { not: { startsWith: prefix } },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      select: { fileKey: true, width: true, height: true, mime: true },
      take: 4,
    });
    if (!galleryImages.length) {
      throw new Error("Local database needs at least one existing GALLERY image");
    }

    const brand = await prisma.brand.upsert({
      where: { slug: "seiko" },
      update: { name: "Seiko" },
      create: { slug: "seiko", name: "Seiko" },
      select: { id: true },
    });

    await prisma.product.deleteMany({ where: { id: { startsWith: prefix } } });

    const fixtures = [
      ["king-seiko-hi-beat", "King Seiko Hi-Beat 45", 42_000_000, "1974", "CLASSIC", "AUTOMATIC", 36],
      ["lord-matic-special", "Seiko Lord Matic Special", 29_000_000, "1973", "RETRO", "AUTOMATIC", 36],
      ["dolce-tank", "Seiko Dolce Tank", 18_000_000, "1988", "MINIMALIST", "QUARTZ", 30],
      ["presage-enamel", "Seiko Presage Enamel", 34_000_000, "2022", "DRESS", "AUTOMATIC", 40],
    ] as const;

    for (const [index, [slug, title, price, year, style, movement, size]] of fixtures.entries()) {
      const id = `${prefix}${slug}`;
      const image = galleryImages[index % galleryImages.length];
      await prisma.product.create({
        data: {
          id,
          slug: `${prefix}${slug}`,
          title,
          type: "WATCH",
          status: "AVAILABLE",
          contentStatus: "PUBLISHED",
          priceVisibility: "SHOW",
          publishedAt: new Date(),
          brandId: brand.id,
          tag: year === "2022" ? "PRE_OWNED" : "VINTAGE",
          productImage: { create: {
            fileKey: image.fileKey,
            role: "COVER",
            alt: title,
            width: image.width,
            height: image.height,
            mime: image.mime,
            isPrimary: true,
            isForStorefront: true,
          } },
          productVariant: { create: {
            availabilityStatus: "ACTIVE",
            stockQty: 1,
            salePrice: price,
            updatedAt: new Date(),
          } },
          watch: { create: {
            saleStage: "READY",
            stockStage: "IN_STOCK",
            serviceStage: "NOT_REQUIRED",
            siteChannel: "AFFORDABLE",
            audienceSegment: "MEN",
            style,
            yearText: year,
            conditionGrade: "Excellent",
            reviewStates: { create: [
              { productId: id, targetType: "CONTENT", status: "APPROVED" },
              { productId: id, targetType: "IMAGE", status: "APPROVED" },
            ] },
            watchContent: { create: {
              contentStatus: "PUBLISHED",
              publishedAt: new Date(),
              summary: `${title} — dữ liệu mẫu dành cho storefront local.`,
              bulletSpecs: ["Đã kiểm tra", "Sẵn sàng tư vấn"],
            } },
            watchPrice: { create: { salePrice: price, listPrice: price } },
            watchSpecV2: { create: {
              brand: "Seiko",
              model: title,
              caseSizeMM: size,
              movementType: movement,
            } },
          } },
        },
      });
    }

    console.log(JSON.stringify({ ok: true, brand: "Seiko", products: fixtures.length }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
