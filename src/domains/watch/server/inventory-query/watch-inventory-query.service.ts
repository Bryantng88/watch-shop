import { prisma } from "@/server/db/client";
import { listWatchListProjectionWithFallback } from "@/domains/projection/server/watch-list-projection.service";
import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import { toWatchInventoryQueryInput, toWatchListFilters } from "./watch-inventory-query.mapper";
import type { WatchInventoryQueryResult } from "./watch-inventory-query.types";

export async function queryWatchInventory(
  input: WatchListFilters,
): Promise<WatchInventoryQueryResult> {
  const queryInput = toWatchInventoryQueryInput(input);
  return listWatchListProjectionWithFallback(prisma, toWatchListFilters(queryInput));
}
