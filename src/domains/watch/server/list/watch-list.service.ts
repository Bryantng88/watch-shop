import type { WatchListFilters } from "../../ui/list/types";
import { queryWatchInventory } from "../inventory-query";

export async function getAdminWatchList(input: WatchListFilters) {
  return queryWatchInventory(input);
}

//export async function searchWatchService(q: string) {
////return searchWatches(prisma as any, q);
//}
