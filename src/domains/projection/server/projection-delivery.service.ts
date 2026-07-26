import { prisma, type DB } from "@/server/db/client";
import {
  claimProjectionDeliveries,
  markProjectionDeliveryFailed,
  markProjectionDeliverySucceeded,
  projectionDeliveryContext,
  type ProjectionEventDeliveryRow,
} from "./projection-delivery.repo";
import { runProjectionBuildersForEvent } from "./projection.runner";

async function processClaimedDelivery(db: DB, row: ProjectionEventDeliveryRow) {
  try {
    const result = await runProjectionBuildersForEvent(
      db,
      projectionDeliveryContext(row),
    );
    if (!result.ok) {
      throw new Error(
        result.builders.find((builder) => !builder.ok)?.error ??
        "PROJECTION_BUILDERS_FAILED",
      );
    }
    await markProjectionDeliverySucceeded(db, row.idempotencyKey);
    return { ok: true, id: row.id, eventKey: row.eventKey };
  } catch (error) {
    await markProjectionDeliveryFailed(db, row.idempotencyKey, error);
    return {
      ok: false,
      id: row.id,
      eventKey: row.eventKey,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function processPendingProjectionDeliveries(input?: {
  db?: DB;
  limit?: number;
  concurrency?: number;
}) {
  const db = input?.db ?? prisma;
  const rows = await claimProjectionDeliveries(db, { limit: input?.limit ?? 20 });
  const concurrency = Math.max(1, Math.min(8, Math.trunc(input?.concurrency ?? 4)));
  const results: Array<Awaited<ReturnType<typeof processClaimedDelivery>>> = [];

  for (let index = 0; index < rows.length; index += concurrency) {
    results.push(
      ...await Promise.all(
        rows.slice(index, index + concurrency).map((row) =>
          processClaimedDelivery(db, row),
        ),
      ),
    );
  }

  return {
    claimed: rows.length,
    succeeded: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  };
}
