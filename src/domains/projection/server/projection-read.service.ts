import { dbOrTx, type DB } from "@/server/db/client";
import { getProjectionBuilder } from "./projection.registry";
import { rebuildProjection } from "./projection.runner";

export type ProjectionReadPolicy =
  | "REBUILD_ON_EMPTY"
  | "SOURCE_FALLBACK"
  | "LIVE_OVERLAY"
  | "INVALIDATE_ON_WRITE";

const PROJECTION_HEALTH_CACHE_TTL_MS = 30_000;
const projectionHealthCache = new Map<string, {
  expiresAt: number;
  rowCount: number;
}>();

export async function ensureProjectionReady(
  db: DB,
  projectionKey: string,
) {
  const builder = getProjectionBuilder(projectionKey);
  if (!builder) {
    return { ready: false, rebuilt: false, reason: "PROJECTION_BUILDER_NOT_FOUND" };
  }
  const cacheKey = `${builder.key}:${builder.version}`;
  const cached = projectionHealthCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      ready: true,
      rebuilt: false,
      rowCount: cached.rowCount,
      cached: true,
    };
  }
  const client = dbOrTx(db);
  const count = await client.projectionRecord.count({
    where: {
      projectionKey: builder.key,
      projectionVersion: builder.version,
    },
  });
  if (count > 0) {
    projectionHealthCache.set(cacheKey, {
      expiresAt: Date.now() + PROJECTION_HEALTH_CACHE_TTL_MS,
      rowCount: count,
    });
    return {
      ready: true,
      rebuilt: false,
      rowCount: count,
    };
  }

  // A projection read must never delete/rebuild a populated read model.
  // Full rebuilds replace rows in batches, so doing that from a request can
  // expose an empty or partially rebuilt board to concurrent readers. Runtime
  // event delivery keeps populated projections current; explicit repair jobs
  // handle drift outside the request path. Only an entirely absent projection
  // is bootstrapped here for a fresh environment.
  const build = await rebuildProjection(db, { projectionKey: builder.key });
  if (!build.ok) {
    return {
      ready: false,
      rebuilt: true,
      rowCount: 0,
      reason: build.error ?? build.reason ?? "PROJECTION_REBUILD_FAILED",
    };
  }
  const rebuiltCount = await client.projectionRecord.count({
    where: {
      projectionKey: builder.key,
      projectionVersion: builder.version,
    },
  });
  if (rebuiltCount > 0 || build.applied === 0) {
    projectionHealthCache.set(cacheKey, {
      expiresAt: Date.now() + PROJECTION_HEALTH_CACHE_TTL_MS,
      rowCount: rebuiltCount,
    });
  }
  return {
    ready: rebuiltCount > 0 || build.applied === 0,
    rebuilt: true,
    rowCount: rebuiltCount,
  };
}
