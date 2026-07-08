import { prisma } from "@/server/db/client";
import { listWatchListProjectionWithFallback } from "@/domains/projection/server/watch-list-projection.service";
import type { WatchListFilters } from "../../ui/list/types";

export async function getAdminWatchList(input: WatchListFilters) {
  return listWatchListProjectionWithFallback(prisma, input);
}

//export async function searchWatchService(q: string) {
////return searchWatches(prisma as any, q);
//}
