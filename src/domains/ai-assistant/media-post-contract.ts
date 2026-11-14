import { z } from "zod";
import { mediaCaseShapeSchema, mediaShapeKeyword, type MediaCaseShape } from "./media-case-shape";

export const watchSelectionSchema = z
  .object({
    brand: z.string().trim().min(1).max(80),
    keywords: z.array(z.string().trim().min(2).max(60)).max(5).default([]),
    caseShapes: z.array(mediaCaseShapeSchema).max(11).default([]),
    count: z.number().int().min(1).max(20),
    priceMin: z
      .number()
      .int()
      .positive()
      .max(9999999999)
      .nullable()
      .default(null),
    priceMax: z
      .number()
      .int()
      .positive()
      .max(9999999999)
      .nullable()
      .default(null),
    similarPrices: z.boolean().default(false),
  })
  .strict()
  .transform((p) => ({
    ...p,
    caseShapes: [...new Set([...p.caseShapes, ...p.keywords.flatMap(term => {
      const shape = mediaShapeKeyword(term);
      return shape ? [shape] : [];
    })])],
    keywords: p.keywords.filter(term => !mediaShapeKeyword(term)),
  }))
  .refine(
    (p) =>
      p.priceMin === null || p.priceMax === null || p.priceMin <= p.priceMax,
    "Khoảng giá không hợp lệ.",
  );
export const mediaPostProposalSchema = z
  .object({
    sourceMessageId: z.string().uuid(),
    watchIds: z.array(z.string().trim().min(1).max(100)).min(1).max(20),
    caption: z.string().trim().min(10).max(6000),
    brief: z.string().trim().min(5).max(1000),
  })
  .strict()
  .refine(
    (p) => new Set(p.watchIds).size === p.watchIds.length,
    "Không chọn trùng đồng hồ.",
  );
export type WatchSelection = z.infer<typeof watchSelectionSchema>;
export type MediaPostWatch = {
  watchId: string;
  productId: string;
  title: string;
  sku: string | null;
  price: string;
  sourceGalleryKey: string;
  updatedAt: string;
  caseShape?: MediaCaseShape | null;
};
export type MediaPostDraft = {
  requiredPermissions?: string[];
  requiredTaskIds?: string[];
  revision: number;
  sourceMessageId: string;
  selection: WatchSelection;
  caption: string;
  brief: string;
  watches: MediaPostWatch[];
};
export type CreatedMediaPost = {
  revision: number;
  id: string;
  reference: string;
  count: number;
};

/** Largest group within a 25% price spread, then narrowest spread; never pad. */
export function selectPriceGroup<T extends { watchId: string; price: string }>(
  rows: T[],
  count: number,
  similar: boolean,
): T[] {
  const sorted = rows
    .filter((r) => Number.isFinite(Number(r.price)) && Number(r.price) > 0)
    .sort(
      (a, b) =>
        Number(a.price) - Number(b.price) || a.watchId.localeCompare(b.watchId),
    );
  if (!similar) return sorted.slice(0, count);
  let best: T[] = [];
  let bestSpread = Infinity;
  for (let start = 0; start < sorted.length; start++) {
    const group: T[] = [];
    for (let i = start; i < sorted.length && group.length < count; i++) {
      if (Number(sorted[i].price) > Number(sorted[start].price) * 1.25) break;
      group.push(sorted[i]);
    }
    const spread = group.length
      ? Number(group[group.length - 1].price) / Number(group[0].price) - 1
      : Infinity;
    if (
      group.length > best.length ||
      (group.length === best.length && spread < bestSpread)
    ) {
      best = group;
      bestSpread = spread;
    }
  }
  return best;
}
