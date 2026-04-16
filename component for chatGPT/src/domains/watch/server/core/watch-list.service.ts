import { prisma } from "@/server/db/client";
import { buildProductListComputed } from "@/app/(admin)/admin/products/_server/core/product-list-computed";
import { listAdminWatches, searchWatches } from "./watch-list.repo";
import type { WatchListFilters } from "./watch.types";

export async function getAdminWatchList(input: WatchListFilters) {
  const result = await listAdminWatches(prisma as any, input);
  const items = Array.isArray((result as any)?.items) ? (result as any).items : [];
  const computed = buildProductListComputed(items as any);
  return {
    ...result,
    computed,
  };
}

export async function searchWatchService(q: string) {
  return searchWatches(prisma as any, q);
}
