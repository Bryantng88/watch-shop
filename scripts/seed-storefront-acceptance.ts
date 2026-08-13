const testUrl = process.env.STOREFRONT_TEST_DATABASE_URL?.trim();
if (!testUrl) throw new Error("STOREFRONT_TEST_DATABASE_URL is required");

const parsed = new URL(testUrl);
const databaseName = parsed.pathname.replace(/^\//, "").toLowerCase();
if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error("Acceptance fixtures require a loopback database");
}
if (!/(test|storefront)/.test(databaseName)) {
  throw new Error("Test database name must contain 'test' or 'storefront'");
}
for (const protectedUrl of [process.env.DATABASE_URL, process.env.DIRECT_URL]) {
  if (protectedUrl?.trim() === testUrl) {
    throw new Error("Refusing to seed the configured application database");
  }
}

process.env.DATABASE_URL = testUrl;
process.env.DIRECT_URL = testUrl;

async function main() {
  const { prisma } = await import("../src/server/db/client");
  const prefix = "sf-acceptance-";

  try {
    const fixtureOrders = await prisma.orderItem.findMany({
      where: { productId: { startsWith: prefix } },
      select: { orderId: true },
      distinct: ["orderId"],
    });
    if (fixtureOrders.length) {
      await prisma.order.deleteMany({
        where: { id: { in: fixtureOrders.map(({ orderId }) => orderId) } },
      });
    }
    await prisma.product.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.brand.deleteMany({ where: { slug: { startsWith: prefix } } });
    await prisma.customer.deleteMany({
      where: { phone: { startsWith: "0900000" }, order: { none: {} } },
    });

    if (process.argv.includes("--cleanup")) {
      console.log(JSON.stringify({ ok: true, action: "cleanup", database: databaseName }));
      return;
    }

    const galleryImages = await prisma.productImage.findMany({
      where: {
        role: "GALLERY",
        fileKey: { not: "" },
        productId: { not: { startsWith: prefix } },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      select: { fileKey: true, width: true, height: true, mime: true },
      take: 24,
    });
    if (!galleryImages.length) {
      throw new Error("At least one existing GALLERY image is required for local storefront fixtures");
    }

    const brands = await Promise.all([
      ["omega", "Omega"], ["rolex", "Rolex"], ["seiko", "Seiko"],
      ["cartier", "Cartier"], ["longines", "Longines"], ["tudor", "Tudor"],
    ].map(([slug, name]) => prisma.brand.create({
      data: { id: `${prefix}brand-${slug}`, slug: `${prefix}${slug}`, name: `${name} Acceptance` },
    })));

    const fixtures = [
      ["omega-seamaster", "Omega Seamaster Automatic", 128_000_000, "MEN", "VINTAGE", 0, "SPORT", "AUTOMATIC", 38, "1968", "LUXURY"],
      ["omega-constellation", "Omega Constellation", 86_000_000, "WOMEN", "PRE_OWNED", 0, "DRESS", "AUTOMATIC", 32, "1972", "AFFORDABLE"],
      ["omega-de-ville", "Omega De Ville Classic", 74_000_000, "UNISEX", "VINTAGE", 0, "CLASSIC", "HAND_WOUND", 34, "1965", "AFFORDABLE"],
      ["omega-geneve", "Omega Genève Linen Dial", 58_000_000, "MEN", "VINTAGE", 0, "RETRO", "AUTOMATIC", 35, "1970", "AFFORDABLE"],
      ["rolex-datejust", "Rolex Datejust 36", 245_000_000, "UNISEX", "PRE_OWNED", 1, "CLASSIC", "AUTOMATIC", 36, "1996", "LUXURY"],
      ["rolex-oyster", "Rolex Oyster Perpetual", 198_000_000, "UNISEX", "PRE_OWNED", 1, "CASUAL", "AUTOMATIC", 36, "2004", "LUXURY"],
      ["rolex-air-king", "Rolex Air-King Precision", 152_000_000, "MEN", "VINTAGE", 1, "TOOL", "AUTOMATIC", 34, "1982", "LUXURY"],
      ["rolex-cellini", "Rolex Cellini Hand-Wound", 118_000_000, "MEN", "VINTAGE", 1, "DRESS", "HAND_WOUND", 33, "1978", "LUXURY"],
      ["seiko-king", "King Seiko Hi-Beat", 42_000_000, "MEN", "VINTAGE", 2, "CLASSIC", "AUTOMATIC", 36, "1974", "AFFORDABLE"],
      ["seiko-presage", "Seiko Presage Enamel", 34_000_000, "MEN", "NEW", 2, "DRESS", "AUTOMATIC", 40, "2022", "AFFORDABLE"],
      ["seiko-lord-matic", "Seiko Lord Matic Special", 29_000_000, "MEN", "VINTAGE", 2, "RETRO", "AUTOMATIC", 36, "1973", "AFFORDABLE"],
      ["seiko-dolce", "Seiko Dolce Tank", 18_000_000, "UNISEX", "VINTAGE", 2, "MINIMALIST", "QUARTZ", 30, "1988", "AFFORDABLE"],
      ["cartier-tank", "Cartier Tank Must", 112_000_000, "UNISEX", "PRE_OWNED", 3, "DRESS", "QUARTZ", 29, "2001", "LUXURY"],
      ["cartier-santos", "Cartier Santos Galbée", 168_000_000, "UNISEX", "PRE_OWNED", 3, "LUXURY", "AUTOMATIC", 32, "1998", "LUXURY"],
      ["cartier-panthere", "Cartier Panthère Small", 138_000_000, "WOMEN", "PRE_OWNED", 3, "LUXURY", "QUARTZ", 27, "1994", "LUXURY"],
      ["cartier-vermeil", "Cartier Tank Vermeil", 78_000_000, "WOMEN", "VINTAGE", 3, "DRESS", "HAND_WOUND", 24, "1985", "AFFORDABLE"],
      ["longines-flagship", "Longines Flagship Heritage", 48_000_000, "MEN", "VINTAGE", 4, "CLASSIC", "AUTOMATIC", 35, "1969", "AFFORDABLE"],
      ["longines-conquest", "Longines Conquest Automatic", 55_000_000, "MEN", "PRE_OWNED", 4, "SPORT", "AUTOMATIC", 39, "2015", "AFFORDABLE"],
      ["longines-dolcevita", "Longines DolceVita", 39_000_000, "WOMEN", "PRE_OWNED", 4, "DRESS", "QUARTZ", 27, "2012", "AFFORDABLE"],
      ["longines-admiral", "Longines Admiral Five Star", 44_000_000, "MEN", "VINTAGE", 4, "RETRO", "AUTOMATIC", 35, "1971", "AFFORDABLE"],
      ["tudor-prince", "Tudor Prince Date-Day", 92_000_000, "MEN", "PRE_OWNED", 5, "CLASSIC", "AUTOMATIC", 36, "1999", "LUXURY"],
      ["tudor-black-bay", "Tudor Black Bay 58", 108_000_000, "MEN", "PRE_OWNED", 5, "SPORT", "AUTOMATIC", 39, "2020", "LUXURY"],
      ["tudor-royal", "Tudor Royal 34", 82_000_000, "UNISEX", "PRE_OWNED", 5, "LUXURY", "AUTOMATIC", 34, "2021", "AFFORDABLE"],
      ["tudor-oyster", "Tudor Oyster Vintage", 66_000_000, "MEN", "VINTAGE", 5, "TOOL", "HAND_WOUND", 34, "1967", "AFFORDABLE"],
    ] as const;

    for (const [index, [slug, title, price, audience, tag, brandIndex, style, movement, size, year, siteChannel]] of fixtures.entries()) {
      const id = `${prefix}${slug}`;
      const gallery = galleryImages[index % galleryImages.length];
      await prisma.product.create({
        data: {
          id,
          slug,
          title,
          type: "WATCH",
          status: "AVAILABLE",
          contentStatus: "PUBLISHED",
          priceVisibility: price > 0 ? "SHOW" : "HIDE",
          publishedAt: new Date(),
          brandId: brands[brandIndex].id,
          tag,
          productImage: { create: {
            // Local DB reference only: reuse an existing gallery object as a
            // temporary storefront cover. This never uploads or overwrites media.
            fileKey: gallery.fileKey,
            role: "COVER",
            alt: title,
            width: gallery.width,
            height: gallery.height,
            mime: gallery.mime,
            isPrimary: true,
            isForStorefront: true,
          } },
          productVariant: { create: {
            availabilityStatus: "ACTIVE",
            stockQty: 1,
            salePrice: price || null,
            updatedAt: new Date(),
          } },
          watch: { create: {
            saleStage: "READY",
            stockStage: "IN_STOCK",
            serviceStage: "NOT_REQUIRED",
            siteChannel,
            audienceSegment: audience,
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
              summary: `${title} là dữ liệu mẫu dành riêng cho kiểm thử storefront local.`,
              bulletSpecs: ["Đã kiểm tra", "Sẵn sàng tư vấn"],
            } },
            watchPrice: { create: {
              salePrice: price || null,
              listPrice: price || null,
            } },
            watchSpecV2: { create: {
              brand: brands[brandIndex].name,
              model: title,
              caseSizeMM: size,
              movementType: movement,
            } },
          } },
        },
      });
    }

    console.log(JSON.stringify({ ok: true, action: "seed", database: databaseName, products: fixtures.length }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
