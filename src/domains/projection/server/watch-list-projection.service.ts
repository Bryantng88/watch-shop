import type { DB } from "@/server/db/client";
import { listAdminWatches } from "@/domains/watch/server/list/watch-list.repo";
import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import {
  listWatchListProjection,
  rebuildWatchListProjectionRows,
} from "./watch-list";
import type { WatchListProjectionListResult } from "./watch-list";

function projectionReadEnabled() {
  return process.env.WATCH_LIST_PROJECTION_READ === "1";
}

export async function listWatchListProjectionWithFallback(
  db: DB,
  input: WatchListFilters,
): Promise<WatchListProjectionListResult> {
  if (!projectionReadEnabled()) {
    return {
      ...(await listAdminWatches(input)),
      projection: {
        source: "source",
        fallbackReason: "PROJECTION_READ_FLAG_DISABLED",
      },
    };
  }

  try {
    let result = await listWatchListProjection(db, input);

    if (!result.items.length && Number(input.page ?? 1) <= 1) {
      await rebuildWatchListProjectionRows(db, {
        limit: Math.max(Number(input.pageSize ?? 20) * 5, 100),
      });
      result = await listWatchListProjection(db, input);
    }

    if (result.items.length) {
      return {
        ...result,
        projection: {
          source: "projection",
        },
      };
    }

    return {
      ...(await listAdminWatches(input)),
      projection: {
        source: "source",
        fallbackReason: "EMPTY_PROJECTION",
      },
    };
  } catch (error) {
    return {
      ...(await listAdminWatches(input)),
      projection: {
        source: "source",
        fallbackReason: error instanceof Error ? error.message : "PROJECTION_READ_FAILED",
      },
    };
  }
}
