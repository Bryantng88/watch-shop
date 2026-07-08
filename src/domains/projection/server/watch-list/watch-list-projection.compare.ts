import type { DB } from "@/server/db/client";
import { listAdminWatches } from "@/domains/watch/server/list/watch-list.repo";
import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import { listWatchListProjection } from "./watch-list-projection.query";
import type { WatchListProjectionCompareResult } from "./watch-list-projection.types";

function rowKey(row: { id: string; productId: string }) {
  return row.id || row.productId;
}

export async function compareWatchListProjection(
  db: DB,
  input: WatchListFilters,
): Promise<WatchListProjectionCompareResult> {
  const [source, projection] = await Promise.all([
    listAdminWatches(input),
    listWatchListProjection(db, input),
  ]);
  const sourceMap = new Map(source.items.map((item) => [rowKey(item), item]));
  const projectionMap = new Map(projection.items.map((item) => [rowKey(item), item]));
  const missingInProjection = source.items
    .map(rowKey)
    .filter((id) => !projectionMap.has(id));
  const extraInProjection = projection.items
    .map(rowKey)
    .filter((id) => !sourceMap.has(id));
  const changedRows: WatchListProjectionCompareResult["changedRows"] = [];

  for (const [id, sourceRow] of sourceMap) {
    const projected = projectionMap.get(id);
    if (!projected) continue;

    const fields = [
      sourceRow.sku !== projected.sku ? "sku" : null,
      sourceRow.title !== projected.title ? "title" : null,
      sourceRow.saleState !== projected.saleState ? "saleState" : null,
      sourceRow.updatedAt !== projected.updatedAt ? "updatedAt" : null,
      sourceRow.imageUrl !== projected.imageUrl ? "imageUrl" : null,
      sourceRow.hasContent !== projected.hasContent ? "hasContent" : null,
      sourceRow.hasImages !== projected.hasImages ? "hasImages" : null,
      sourceRow.reviewStatus !== projected.reviewStatus ? "reviewStatus" : null,
    ].filter((field): field is string => Boolean(field));

    if (fields.length) changedRows.push({ id, fields });
  }

  return {
    ok: !missingInProjection.length && !extraInProjection.length && !changedRows.length,
    sourceCount: source.items.length,
    projectionCount: projection.items.length,
    missingInProjection,
    extraInProjection,
    changedRows,
  };
}
