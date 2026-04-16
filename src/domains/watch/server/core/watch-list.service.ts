import { prisma } from "@/server/db/client";
import { mapAdminWatchListItem } from "../shared";
import type { WatchListFilters } from "../shared";
import { listAdminWatches, searchWatches } from "./watch-list.repo";

export async function getAdminWatchList(input: WatchListFilters) {
  const result = await listAdminWatches(prisma as any, input);

  return {
    ...result,
    items: result.items.map(mapAdminWatchListItem),
  };
}

export async function searchWatchService(q: string) {
  return searchWatches(prisma as any, q);
}