import { prisma } from "@/server/db/client";
import { mapAdminWatchListItem } from "../shared";
import type { WatchListFilters } from "../../ui/list/types";
import { listAdminWatches } from "./watch-list.repo";

export async function getAdminWatchList(input: WatchListFilters) {
  return listAdminWatches(input);
}

//export async function searchWatchService(q: string) {
////return searchWatches(prisma as any, q);
//}