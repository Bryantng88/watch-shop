import type { DB } from "@/server/db/client";
import { listAdminWatches } from "@/domains/watch/server/list/watch-list.repo";
import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import { listWatchListProjection } from "./watch-list";
import type { WatchListProjectionListResult } from "./watch-list";

function projectionReadEnabled() {
  return process.env.WATCH_LIST_PROJECTION_READ !== "0";
}

function sourceFallbackEnabled() {
  return process.env.WATCH_LIST_PROJECTION_FALLBACK === "1";
}

function isProjectionTableMissing(error: unknown) {
  const record = error && typeof error === "object"
    ? error as { code?: unknown; message?: unknown }
    : null;
  const message = String(record?.message ?? "");

  return record?.code === "P2021" ||
    message.includes("ProjectionRecord") && message.includes("does not exist");
}

async function listSourceFallback(
  input: WatchListFilters,
  fallbackReason: string,
): Promise<WatchListProjectionListResult> {
  return {
    ...(await listAdminWatches(input)),
    projection: {
      source: "source",
      fallbackReason,
    },
  };
}

export async function listWatchListProjectionWithFallback(
  db: DB,
  input: WatchListFilters,
): Promise<WatchListProjectionListResult> {
  if (input.duplicateScope === "DUPLICATE") {
    return listSourceFallback(input, "DUPLICATE_SCOPE_REQUIRES_SOURCE");
  }

  if (!projectionReadEnabled()) {
    return listSourceFallback(input, "PROJECTION_READ_FLAG_DISABLED");
  }

  try {
    const result = await listWatchListProjection(db, input);

    return {
      ...result,
      projection: {
        source: "projection",
        fallbackReason: result.items.length ? undefined : "EMPTY_PROJECTION",
      },
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "PROJECTION_READ_FAILED";
    if (isProjectionTableMissing(error)) {
      return listSourceFallback(input, "PROJECTION_TABLE_MISSING");
    }
    if (sourceFallbackEnabled()) return listSourceFallback(input, reason);
    throw error;
  }
}
