import { z } from "zod";
import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import {
  watchSelectionSchema,
  mediaPostProposalSchema,
  selectPriceGroup,
  type MediaPostDraft,
  type MediaPostWatch,
  type WatchSelection,
} from "../media-post-contract";
import type { Evidence } from "../live-contract";
import { AssistantError } from "./access";

export const mediaPostPermissions = [
  "PRODUCT_VIEW",
  "PRODUCT_UPDATE",
  "MEDIA_VIEW",
];
const LIMIT = 1000;
export function selectionWhere(p: WatchSelection): Prisma.WatchWhereInput {
  // Normalize older persisted reviews and older worker keyword-only queries too.
  p = watchSelectionSchema.parse(p);
  return {
    ...(p.caseShapes.length ? { watchSpecV2: { caseShape: { in: p.caseShapes } } } : {}),
    stockStage: "IN_STOCK",
    saleStage: { notIn: ["SOLD", "HOLD", "CONSIGNED_TO"] },
    product: {
      status: "AVAILABLE",
      brand: { name: { equals: p.brand, mode: "insensitive" } },
      productImage: { some: { role: "GALLERY" } },
    },
    watchPrice: {
      salePrice: {
        gt: 0,
        ...(p.priceMin !== null ? { gte: p.priceMin } : {}),
        ...(p.priceMax !== null ? { lte: p.priceMax } : {}),
      },
    },
    AND: p.keywords.map((term) => ({
      OR: [
        { product: { title: { contains: term, mode: "insensitive" } } },
        { watchSpecV2: { model: { contains: term, mode: "insensitive" } } },
        {
          watchSpecV2: {
            referenceNumber: { contains: term, mode: "insensitive" },
          },
        },
        { watchContent: { hashTags: { contains: term, mode: "insensitive" } } },
      ],
    })),
  };
}
const select = {
  id: true,
  productId: true,
  updatedAt: true,
  watchSpecV2: { select: { caseShape: true } },
  watchPrice: { select: { salePrice: true } },
  product: {
    select: {
      title: true,
      sku: true,
      productImage: {
        where: { role: "GALLERY" as const },
        orderBy: [{ sortOrder: "asc" as const }, { id: "asc" as const }],
        take: 1,
        select: { fileKey: true },
      },
    },
  },
} satisfies Prisma.WatchSelect;
type Row = Prisma.WatchGetPayload<{ select: typeof select }>;
function project(row: Row): MediaPostWatch {
  return {
    watchId: row.id,
    productId: row.productId,
    title: row.product.title.slice(0, 180),
    sku: row.product.sku,
    price: row.watchPrice!.salePrice!.toString(),
    sourceGalleryKey: row.product.productImage[0].fileKey,
    updatedAt: row.updatedAt.toISOString(),
    caseShape: row.watchSpecV2?.caseShape ?? null,
  };
}
export async function lookupMediaWatches(db: DB, query: string) {
  const selection = watchSelectionSchema.parse(JSON.parse(query));
  const where = selectionWhere(selection);
  const [total, rows] = await Promise.all([
    db.watch.count({ where }),
    db.watch.findMany({ where, select, orderBy: { id: "asc" }, take: LIMIT }),
  ]);
  const matches = selectPriceGroup(
    rows.map(project),
    selection.count,
    selection.similarPrices,
  );
  return {
    selection,
    matches,
    total,
    scanned: rows.length,
    truncated: total > rows.length,
    observedAt: new Date().toISOString(),
    priceRule: selection.similarPrices
      ? "Giá cao nhất không quá 125% giá thấp nhất; ưu tiên đủ số lượng rồi độ chênh nhỏ nhất."
      : "Giá bán tăng dần.",
    meaning:
      "Đồng hồ còn kho, chưa bán/giữ, có giá bán và ảnh Gallery. Form dáng lọc theo WatchSpecV2.caseShape đã lưu; chưa có form dáng thì không tính là khớp, không suy đoán qua ảnh hoặc caseType mặc định. Từ khóa khác đối chiếu tiêu đề/model/reference/tag; không suy đoán diver từ hình ảnh.",
  };
}
export async function prepareMediaPost(
  db: DB,
  query: string,
  revision: number,
  sourceMessageId: string | undefined,
  entries: Evidence[],
): Promise<MediaPostDraft> {
  const proposal = mediaPostProposalSchema.parse(JSON.parse(query));
  if (proposal.sourceMessageId !== sourceMessageId)
    throw new AssistantError(
      "Yêu cầu post không thuộc lượt chat hiện tại.",
      409,
    );
  const lookup = [...entries]
    .reverse()
    .find((e) => e.request.tool === "media.watches.select");
  if (
    !lookup ||
    lookup.result.truncated ||
    !Array.isArray(lookup.result.matches)
  )
    throw new AssistantError(
      "Cần tra đủ đồng hồ theo điều kiện trước khi chuẩn bị post.",
    );
  const selection = watchSelectionSchema.parse(lookup.result.selection);
  const matches = lookup.result.matches as MediaPostWatch[];
  if (
    proposal.watchIds.length > selection.count ||
    proposal.watchIds.some((id) => !matches.some((m) => m.watchId === id))
  )
    throw new AssistantError(
      "Chỉ chọn đồng hồ có trong kết quả tra cứu mới nhất.",
    );
  const watches = proposal.watchIds.map(
    (id) => matches.find((m) => m.watchId === id)!,
  );
  const draft = {
    revision,
    sourceMessageId: proposal.sourceMessageId,
    selection,
    caption: proposal.caption,
    brief: proposal.brief,
    watches,
  };
  await recheckMediaPost(db, draft);
  return draft;
}
export async function recheckMediaPost(db: DB, draft: MediaPostDraft) {
  const rows = await db.watch.findMany({
    where: {
      AND: [
        selectionWhere(draft.selection),
        { id: { in: draft.watches.map((w) => w.watchId) } },
      ],
    },
    select,
  });
  const fresh = rows.map(project);
  if (
    fresh.length !== draft.watches.length ||
    draft.watches.some(
      (old) =>
        !fresh.some(
          (w) =>
            w.watchId === old.watchId &&
            w.productId === old.productId &&
            w.price === old.price &&
            w.sourceGalleryKey === old.sourceGalleryKey &&
            w.updatedAt === old.updatedAt &&
            w.title === old.title &&
            w.sku === old.sku &&
            (old.caseShape === undefined || w.caseShape === old.caseShape),
        ),
    )
  )
    throw new AssistantError(
      "Giá, tồn kho hoặc ảnh đã thay đổi. Nhờ Ben chuẩn bị lại post trước khi duyệt.",
      409,
    );
}
export const receiptQuerySchema = z
  .object({
    brand: z.string().trim().min(1).max(80).nullable().default(null),
    count: z.number().int().min(1).max(20).default(10),
  })
  .strict();
export async function lookupStockReceipts(
  db: DB,
  query: string,
  allScopes: boolean,
) {
  const p = receiptQuerySchema.parse(JSON.parse(query));
  const watchItem: Prisma.AcquisitionItemWhereInput = {
    productType: "WATCH",
    product: {
      ...(p.brand
        ? { brand: { name: { equals: p.brand, mode: "insensitive" } } }
        : {}),
    },
  };
  const where: Prisma.AcquisitionWhereInput = {
    acquisitionItem: {
      some: watchItem,
      ...(!allScopes ? { every: { productType: "WATCH" } } : {}),
    },
  };
  const [total, items] = await Promise.all([
    db.acquisition.count({ where }),
    db.acquisition.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: p.count,
      select: {
        id: true,
        refNo: true,
        createdAt: true,
        acquisitionItem: {
          where: watchItem,
          take: 21,
          select: { product: { select: { id: true, title: true, sku: true } } },
        },
      },
    }),
  ]);
  return {
    dateField: "createdAt",
    meaning:
      "Theo quy ước của shop: tạo phiếu là nhập kho. Ngày nhập lấy từ ngày tạo phiếu, không lấy ngày tạo/cập nhật sản phẩm.",
    total,
    truncated: total > items.length,
    observedAt: new Date().toISOString(),
    items: items.map((r) => ({
      id: r.id,
      reference: r.refNo?.slice(0, 100) ?? null,
      importedAt: r.createdAt.toISOString(),
      href: "/admin/acquisitions/" + encodeURIComponent(r.id),
      watches: r.acquisitionItem
        .slice(0, 20)
        .map((i) =>
          i.product
            ? {
                ...i.product,
                title: i.product.title.slice(0, 180),
                sku: i.product.sku?.slice(0, 100) ?? null,
              }
            : null,
        ),
      watchesTruncated: r.acquisitionItem.length > 20,
    })),
  };
}

/** Keep price, stock, title and selected source stable until the approval commits. */
export async function lockMediaPostWatches(db: DB, draft: MediaPostDraft) {
  const ids = Prisma.join([...draft.watches.map((w) => w.watchId)].sort());
  const products = Prisma.join(
    [...draft.watches.map((w) => w.productId)].sort(),
  );
  await db.$queryRaw`SELECT "id" FROM "Watch" WHERE "id" IN (${ids}) ORDER BY "id" FOR UPDATE`;
  await db.$queryRaw`SELECT "id" FROM "WatchPrice" WHERE "watchId" IN (${ids}) ORDER BY "id" FOR UPDATE`;
  await db.$queryRaw`SELECT "id" FROM "WatchSpecV2" WHERE "watchId" IN (${ids}) ORDER BY "id" FOR UPDATE`;
  await db.$queryRaw`SELECT "id" FROM "Product" WHERE "id" IN (${products}) ORDER BY "id" FOR UPDATE`;
  await db.$queryRaw`SELECT "id" FROM "ProductImage" WHERE "productId" IN (${products}) AND "role" = 'GALLERY' ORDER BY "id" FOR UPDATE`;
}
