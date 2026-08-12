import { prisma, type DB } from "@/server/db/client";
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
  type PublicWatchDetailRow,
  type PublicWatchListRow,
} from "./public-catalog.repo";

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
  if (row.priceVisibility === "HIDE") {
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
  if (!row.slug || !row.watch || !image) {
    throw new Error("PUBLIC_WATCH_ELIGIBILITY_INVARIANT_VIOLATION");
  }
  return {
    productId: row.id,
    slug: row.slug,
    title: row.watch.watchContent?.titleOverride?.trim() || row.title,
    brand: row.brand?.name ?? null,
    image: mapImage(row, image),
    price: mapPrice(row),
    audience: row.watch.audienceSegment,
    tag: row.tag ?? null,
    condition: row.watch.conditionGrade ?? null,
    availability: row.watch.saleStage === "SOLD" ? "SOLD" : row.watch.saleStage === "HOLD" ? "HOLD" : "AVAILABLE",
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
  return {
    ...card,
    summary: content?.summary?.trim() || null,
    gallery: row.productImage.map((image) => mapImage(row, image)),
    specs: mapPublicSpecs(row),
    seo: {
      title: content?.seoTitle?.trim() || card.title,
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
    if (row.priceVisibility === "SHOW") {
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
