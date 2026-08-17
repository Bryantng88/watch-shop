import { prisma, type DB } from "@/server/db/client";
import { normalizeWatchTitleTerminology } from "@/domains/watch/shared/watch-title-sku.helpers";
import {
  publicCatalogQuerySchema,
  publicWatchSlugSchema,
  type PublicCatalogPage,
  type PublicCatalogFacets,
  type PublicCatalogQuery,
  type PublicWatchCard,
  type PublicWatchDetail,
  type PublicWatchImage,
  type PublicWatchPrice,
  type PublicWatchSpec,
} from "../contracts";
import {
  findPublicWatchRowBySlug,
  listPublicCatalogFacetRows,
  listPublicWatchRows,
  listRelatedPublicWatchRows,
  type PublicWatchDetailRow,
  type PublicWatchListRow,
} from "./public-catalog.repo";
import { rankRelatedWatches, type RelatedWatchSignal } from "./related-watch-score";

type CursorPayload = { version: 1; sort: PublicCatalogQuery["sort"]; productId: string };

function encodeCursor(payload: CursorPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodeCursor(cursor: string | undefined, sort: PublicCatalogQuery["sort"]) {
  if (!cursor) return null;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as Partial<CursorPayload>;
    if (parsed.version !== 1 || parsed.sort !== sort || typeof parsed.productId !== "string" || !parsed.productId) {
      throw new Error("Invalid cursor payload");
    }
    return parsed.productId;
  } catch {
    throw new Error("INVALID_PUBLIC_CATALOG_CURSOR");
  }
}

function publicImageUrl(productId: string, imageId: string) {
  return `/api/public/catalog/watches/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`;
}

function mapImage(
  product: Pick<PublicWatchListRow, "id" | "title">,
  image: PublicWatchListRow["productImage"][number],
): PublicWatchImage {
  return {
    url: publicImageUrl(product.id, image.id),
    alt: image.alt?.trim() || product.title,
    width: image.width,
    height: image.height,
  };
}

function decimalAmount(value: { toNumber(): number } | null | undefined) {
  if (!value) return null;
  const amount = value.toNumber();
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function mapPrice(row: PublicWatchListRow): PublicWatchPrice {
  const productStatus = String(row.status ?? "").toUpperCase();
  const saleStage = String(row.watch?.saleStage ?? "").toUpperCase();
  if (row.priceVisibility === "HIDE" || productStatus === "HOLD" || productStatus === "SOLD" || saleStage === "HOLD" || saleStage === "SOLD") {
    return { mode: "CONTACT", amount: null, currency: "VND" };
  }
  const amount = decimalAmount(row.watch?.watchPrice?.salePrice);
  if (amount === null) {
    throw new Error("PUBLIC_WATCH_PRICE_INVARIANT_VIOLATION");
  }
  return { mode: "SHOW", amount, currency: "VND" };
}

export function mapPublicWatchCard(row: PublicWatchListRow): PublicWatchCard {
  const image = row.productImage.find((item) => item.role === "COVER") ?? row.productImage[0];
  const hoverImage = row.productImage.find((item) => item.role === "GALLERY") ?? null;
  if (!row.slug || !row.watch || !image) {
    throw new Error("PUBLIC_WATCH_ELIGIBILITY_INVARIANT_VIOLATION");
  }
  return {
    productId: row.id,
    slug: row.slug,
    title: normalizeWatchTitleTerminology(row.watch.watchContent?.titleOverride?.trim() || row.title),
    brand: row.brand?.name ?? null,
    image: mapImage(row, image),
    hoverImage: hoverImage ? mapImage(row, hoverImage) : null,
    price: mapPrice(row),
    audience: row.watch.audienceSegment,
    tag: row.tag ?? null,
    condition: row.watch.conditionGrade ?? null,
    availability: row.watch.saleStage === "SOLD" || row.status === "SOLD" ? "SOLD" : row.watch.saleStage === "HOLD" || row.status === "HOLD" ? "HOLD" : "AVAILABLE",
    updatedAt: row.updatedAt.toISOString(),
  };
}

function addSpec(items: PublicWatchSpec[], key: string, label: string, value: unknown) {
  const text = String(value ?? "").trim();
  if (text) items.push({ key, label, value: text });
}

function mapPublicSpecs(row: PublicWatchDetailRow): PublicWatchSpec[] {
  const spec = row.watch?.watchSpecV2;
  if (!spec) return [];
  const items: PublicWatchSpec[] = [];
  addSpec(items, "model", "Mẫu", spec.model);
  addSpec(items, "reference", "Mã tham chiếu", spec.referenceNumber);
  addSpec(items, "caseShape", "Kiểu vỏ", spec.caseShape);
  addSpec(items, "caseSize", "Kích thước vỏ", spec.caseSizeMM ? `${spec.caseSizeMM.toString()} mm` : null);
  addSpec(items, "caseMaterial", "Chất liệu vỏ", spec.primaryCaseMaterial);
  addSpec(items, "dialColor", "Màu mặt số", spec.dialColor);
  addSpec(items, "dialFinish", "Hoàn thiện mặt số", spec.dialFinish);
  addSpec(items, "crystal", "Kính", spec.crystal);
  addSpec(items, "movement", "Bộ máy", spec.movementType);
  addSpec(items, "calibre", "Calibre", spec.calibre);
  addSpec(items, "powerReserve", "Trữ cót", spec.powerReserve);
  addSpec(items, "waterResistance", "Chống nước", spec.waterResistance);
  addSpec(items, "bracelet", "Dây", spec.braceletType);
  addSpec(items, "strapMaterial", "Chất liệu dây", spec.strapMaterialText);
  addSpec(items, "buckle", "Khóa", spec.buckleType);
  return items;
}

export function mapPublicWatchDetail(row: PublicWatchDetailRow): PublicWatchDetail {
  const card = mapPublicWatchCard(row);
  const content = row.watch?.watchContent;
  const coverImage = row.productImage.find((image) => image.role === "COVER") ?? row.productImage[0];
  const galleryImages = row.productImage.filter(
    (image) => image.role === "GALLERY" && image.fileKey !== coverImage?.fileKey,
  );
  return {
    ...card,
    summary: content?.summary?.trim() || null,
    // Keep the catalog cover as the first detail image so the click-through is
    // visually continuous, then append the curated gallery in its stored order.
    // INLINE remains an internal Watch thumbnail and must never be exposed.
    gallery: [card.image, ...galleryImages.map((image) => mapImage(row, image))],
    specs: mapPublicSpecs(row),
    seo: {
      title: normalizeWatchTitleTerminology(content?.seoTitle?.trim() || card.title),
      description: content?.seoDescription?.trim() || content?.summary?.trim() || null,
    },
  };
}

export async function listPublicWatches(
  input: unknown,
  options?: { db?: DB },
): Promise<PublicCatalogPage> {
  const query = publicCatalogQuerySchema.parse(input);
  const cursorProductId = decodeCursor(query.cursor, query.sort);
  const rows = await listPublicWatchRows(options?.db ?? prisma, query, cursorProductId);
  const hasNextPage = rows.length > query.limit;
  const pageRows = hasNextPage ? rows.slice(0, query.limit) : rows;
  const last = pageRows.at(-1);
  return {
    items: pageRows.map(mapPublicWatchCard),
    pageInfo: {
      nextCursor: hasNextPage && last
        ? encodeCursor({ version: 1, sort: query.sort, productId: last.id })
        : null,
      hasNextPage,
      limit: query.limit,
    },
  };
}

export async function getPublicWatchBySlug(slugInput: unknown, options?: { db?: DB }) {
  const slug = publicWatchSlugSchema.parse(slugInput);
  const row = await findPublicWatchRowBySlug(options?.db ?? prisma, slug);
  return row ? mapPublicWatchDetail(row) : null;
}

function relatedSignal(row: PublicWatchListRow): RelatedWatchSignal {
  return {
    productId: row.id,
    siteChannel: row.watch?.siteChannel ?? null,
    price: decimalAmount(row.watch?.watchPrice?.salePrice),
    audience: row.watch?.audienceSegment ?? null,
    style: row.watch?.style ?? null,
    brandId: row.brand?.id ?? null,
    caseSizeMm: row.watch?.watchSpecV2?.caseSizeMM?.toNumber() ?? null,
    movement: row.watch?.watchSpecV2?.movementType ?? null,
    yearText: row.watch?.yearText ?? null,
    updatedAt: row.updatedAt,
  };
}

export async function listRelatedPublicWatches(
  selectedProductIds: string[],
  options?: { db?: DB; limit?: number },
): Promise<PublicWatchCard[]> {
  const ids = [...new Set(selectedProductIds.filter(Boolean))].slice(0, 20);
  if (!ids.length) return [];
  const rows = await listRelatedPublicWatchRows(options?.db ?? prisma, ids);
  const selected = rows.selected.filter((row) => row.watch).map(relatedSignal);
  const candidates = rows.candidates.map((row) => ({ ...relatedSignal(row), row }));
  return rankRelatedWatches(candidates, selected, Math.min(Math.max(options?.limit ?? 4, 0), 4))
    .map(({ item, score }) => ({
      ...mapPublicWatchCard(item.row),
      relatedScore: Math.round(score * 10) / 10,
    }));
}

export async function getPublicCatalogFacets(options?: { db?: DB }): Promise<PublicCatalogFacets> {
  const rows = await listPublicCatalogFacetRows(options?.db ?? prisma);
  const brandCounts = new Map<string, { slug: string; name: string; count: number }>();
  const styleCounts = new Map<NonNullable<PublicCatalogQuery["style"]>, number>();
  const sizeCounts = { SMALL: 0, MEDIUM: 0, LARGE: 0 };
  const movementCounts = new Map<string, number>();
  const materialCounts = new Map<string, number>();
  const strapTypeCounts = { BRACELET: 0, LEATHER: 0 };
  const prices: number[] = [];

  for (const row of rows) {
    if (row.brand) {
      const current = brandCounts.get(row.brand.slug);
      brandCounts.set(row.brand.slug, { ...row.brand, count: (current?.count ?? 0) + 1 });
    }
    if (row.watch?.style) styleCounts.set(row.watch.style, (styleCounts.get(row.watch.style) ?? 0) + 1);
    const size = row.watch?.watchSpecV2?.caseSizeMM?.toNumber();
    if (size) sizeCounts[size < 34 ? "SMALL" : size <= 38 ? "MEDIUM" : "LARGE"] += 1;
    const movement = row.watch?.watchSpecV2?.movementType?.trim();
    if (movement) movementCounts.set(movement, (movementCounts.get(movement) ?? 0) + 1);
    const material = row.watch?.watchSpecV2?.primaryCaseMaterial?.trim();
    if (material) materialCounts.set(material, (materialCounts.get(material) ?? 0) + 1);
    const strapType = row.watch?.watchSpecV2?.braceletType;
    if (strapType === "BRACELET" || strapType === "LEATHER") strapTypeCounts[strapType] += 1;
    if (row.priceVisibility === "SHOW" && row.status !== "HOLD" && row.status !== "SOLD" && row.watch?.saleStage !== "HOLD" && row.watch?.saleStage !== "SOLD") {
      const price = row.watch?.watchPrice?.salePrice?.toNumber();
      if (price && price > 0) prices.push(price);
    }
  }

  const rawMin = prices.length ? Math.min(...prices) : 0;
  const rawMax = prices.length ? Math.max(...prices) : 100_000_000;
  const step = 500_000;
  const min = Math.floor(rawMin / step) * step;
  return {
    brands: [...brandCounts.values()].sort((a, b) => a.name.localeCompare(b.name, "vi")),
    styles: [...styleCounts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value)),
    sizes: (["SMALL", "MEDIUM", "LARGE"] as const).map((value) => ({ value, count: sizeCounts[value] })),
    movements: [...movementCounts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value, "vi")),
    caseMaterials: [...materialCounts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value, "vi")),
    strapTypes: (["BRACELET", "LEATHER"] as const).map((value) => ({ value, count: strapTypeCounts[value] })),
    priceBounds: {
      min,
      max: Math.max(min + step, Math.ceil(rawMax / step) * step),
    },
  };
}
