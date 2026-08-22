import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";

import {
  publicCatalogQuerySchema,
  publicOrderRequestSchema,
  publicWatchSlugSchema,
} from "../src/domains/storefront/contracts";
import {
  publicWatchDetailSelect,
  publicWatchEligibilityWhere,
  publicWatchListSelect,
  storefrontCoverImageRequired,
  type PublicWatchDetailRow,
} from "../src/domains/storefront/server/public-catalog.repo";
import {
  mapPublicWatchCard,
  mapPublicWatchDetail,
} from "../src/domains/storefront/server/public-catalog.service";

const forbiddenPublicKeys = new Set([
  "acquisitionId",
  "costPrice",
  "landedCost",
  "minPrice",
  "notes",
  "pricingNote",
  "reviewStates",
  "serviceCost",
  "tasks",
  "vendor",
  "vendorId",
  "vendorName",
]);

function collectKeys(value: unknown, keys = new Set<string>()) {
  if (!value || typeof value !== "object") return keys;
  if (Array.isArray(value)) {
    value.forEach((item) => collectKeys(item, keys));
    return keys;
  }
  for (const [key, nested] of Object.entries(value)) {
    keys.add(key);
    collectKeys(nested, keys);
  }
  return keys;
}

function assertNoForbiddenKeys(value: unknown, label: string) {
  const keys = collectKeys(value);
  const leaked = [...forbiddenPublicKeys].filter((key) => keys.has(key));
  assert.deepEqual(leaked, [], `${label} leaked forbidden keys: ${leaked.join(", ")}`);
}

function fixture(priceVisibility: "SHOW" | "HIDE" = "SHOW") {
  return {
    id: "product-1",
    slug: "omega-seamaster-1",
    title: "Omega Seamaster",
    status: "AVAILABLE",
    priceVisibility,
    tag: "VINTAGE",
    updatedAt: new Date("2026-08-05T00:00:00.000Z"),
    brand: { name: "Omega" },
    productImage: [
      {
        id: "image-1",
        fileKey: "products/storefront/chosen/omega.jpg",
        role: "COVER",
        alt: null,
        width: 1200,
        height: 1600,
      },
      {
        id: "image-2",
        fileKey: "products/gallery/omega-detail.jpg",
        role: "GALLERY",
        alt: "Omega detail",
        width: 1200,
        height: 1600,
      },
      {
        id: "image-3",
        fileKey: "products/inline/omega-internal.jpg",
        role: "INLINE",
        alt: "Internal thumbnail",
        width: 400,
        height: 400,
      },
    ],
    watch: {
      saleStage: "READY",
      stockStage: "IN_STOCK",
      audienceSegment: "MEN",
      conditionGrade: "A",
      watchPrice: { salePrice: new Prisma.Decimal(12_500_000) },
      watchContent: {
        titleOverride: "Omega Seamaster Vintage",
        summary: "Đồng hồ cổ điển đã sẵn sàng.",
        bulletSpecs: [],
        seoTitle: "Omega Seamaster Vintage",
        seoDescription: "Thông tin Omega Seamaster.",
      },
      watchSpecV2: {
        model: "Seamaster",
        referenceNumber: "166.010",
        caseShape: "ROUND",
        caseSizeMM: new Prisma.Decimal(36),
        primaryCaseMaterial: "STAINLESS_STEEL",
        dialColor: "Silver",
        dialFinish: null,
        crystal: "ACRYLIC",
        movementType: "AUTOMATIC",
        calibre: "565",
        powerReserve: null,
        waterResistance: null,
        braceletType: "LEATHER",
        strapMaterialText: "Da",
        buckleType: null,
      },
    },
  } as unknown as PublicWatchDetailRow;
}

function main() {
  assertNoForbiddenKeys(publicWatchListSelect, "public list select");
  assertNoForbiddenKeys(publicWatchDetailSelect, "public detail select");

  const eligibility = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));
  for (const required of ["AVAILABLE", "HOLD", "SOLD", "isForStorefront", "COVER"]) {
    assert.ok(eligibility.includes(required), `eligibility is missing ${required}`);
  }
  assert.equal(eligibility.includes("publishedAt"), true, "storefront must require explicit publication");
  assert.equal(eligibility.includes("contentStatus"), false, "approved review pair is the media readiness source of truth");
  assert.equal(storefrontCoverImageRequired(undefined), true, "cover gate must fail closed");
  assert.equal(storefrontCoverImageRequired("0"), false, "staging bypass must be explicit");
  assert.equal(
    JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: false })).includes("COVER"),
    false,
    "cover bypass must retain the rest of the storefront eligibility gate",
  );
  assert.equal(eligibility.includes("PROCESSING"), false, "eligibility must not explicitly require processing");

  const card = mapPublicWatchCard(fixture());
  assert.equal(card.orderable, true);
  assert.equal(card.price.mode, "SHOW");
  assert.equal(card.price.amount, 12_500_000);
  assert.equal(card.image.url, "/api/public/catalog/watches/product-1/images/image-1");
  assert.equal(card.hoverImage?.url, "/api/public/catalog/watches/product-1/images/image-2");
  assertNoForbiddenKeys(card, "public card DTO");

  const contactCard = mapPublicWatchCard(fixture("HIDE"));
  assert.deepEqual(contactCard.price, { mode: "CONTACT", amount: null, currency: "VND" });
  assert.equal(contactCard.orderable, true, "contact-price watches may be requested when sale-ready");

  const processingCard = mapPublicWatchCard({
    ...fixture("HIDE"),
    watch: { ...fixture("HIDE").watch, saleStage: "PROCESSING" },
  } as PublicWatchDetailRow);
  assert.equal(processingCard.availability, "AVAILABLE");
  assert.equal(processingCard.orderable, true, "available processing watches may enter a purchase request");

  const detail = mapPublicWatchDetail(fixture());
  assert.equal(detail.gallery.length, 2);
  assert.equal(
    detail.gallery[0]?.url,
    "/api/public/catalog/watches/product-1/images/image-1",
  );
  assert.equal(
    detail.gallery[1]?.url,
    "/api/public/catalog/watches/product-1/images/image-2",
  );
  assert.equal(
    detail.gallery.some((image) => image.url.includes("image-3")),
    false,
    "public gallery must contain COVER and GALLERY images only",
  );
  assert.ok(detail.specs.some((item) => item.key === "reference"));
  assertNoForbiddenKeys(detail, "public detail DTO");

  assert.equal(publicCatalogQuerySchema.parse({}).limit, 24);
  assert.equal(publicCatalogQuerySchema.safeParse({ limit: 49 }).success, false);
  assert.equal(publicCatalogQuerySchema.safeParse({ priceMin: 2, priceMax: 1 }).success, false);
  assert.equal(publicWatchSlugSchema.safeParse("omega-seamaster-1").success, true);
  assert.equal(publicWatchSlugSchema.safeParse("../admin").success, false);

  const acceptedOrder = publicOrderRequestSchema.parse({
    customerName: "Khách hàng",
    phone: "0900000000",
    items: [{ productId: "product-1", quantity: 1 }],
  });
  assert.equal(acceptedOrder.contactPreference, "PHONE");
  assert.equal(
    publicOrderRequestSchema.safeParse({
      ...acceptedOrder,
      price: 1,
    }).success,
    false,
    "public order input must reject client price",
  );
  assert.equal(
    publicOrderRequestSchema.safeParse({
      ...acceptedOrder,
      source: "ADMIN",
    }).success,
    false,
    "public order input must reject client source",
  );

  console.log(JSON.stringify({
    ok: true,
    catalogDefaultLimit: 24,
    catalogMaxLimit: 48,
    forbiddenKeyCount: forbiddenPublicKeys.size,
    eligibilityAssertions: 9,
    dtoAssertions: 6,
    orderBoundaryAssertions: 3,
  }, null, 2));
}

main();
