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

    const brands = await Promise.all([
      ["omega", "Omega"],
      ["rolex", "Rolex"],
      ["seiko", "Seiko"],
    ].map(([slug, name]) => prisma.brand.create({
      data: { id: `${prefix}brand-${slug}`, slug: `${prefix}${slug}`, name: `${name} Acceptance` },
    })));

    const fixtures = [
      ["omega-seamaster", "Omega Seamaster Automatic", 128_000_000, "MEN", "VINTAGE", brands[0].id],
      ["rolex-datejust", "Rolex Datejust 36", 245_000_000, "UNISEX", "PRE_OWNED", brands[1].id],
      ["seiko-king", "King Seiko Hi-Beat", 42_000_000, "MEN", "VINTAGE", brands[2].id],
      ["omega-constellation", "Omega Constellation", 86_000_000, "WOMEN", "PRE_OWNED", brands[0].id],
      ["rolex-oyster", "Rolex Oyster Perpetual", 198_000_000, "UNISEX", "PRE_OWNED", brands[1].id],
      ["seiko-presage", "Seiko Presage Enamel", 0, "MEN", "NEW", brands[2].id],
    ] as const;

    for (const [slug, title, price, audience, tag, brandId] of fixtures) {
      const id = `${prefix}${slug}`;
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
          brandId,
          tag,
          productImage: { create: {
            fileKey: `storefront-acceptance/${slug}.png`,
            role: "COVER",
            alt: title,
            width: 600,
            height: 800,
            mime: "image/png",
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
            audienceSegment: audience,
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
