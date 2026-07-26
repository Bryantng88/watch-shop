import { dbOrTx, type DB } from "@/server/db/client";
import { getProjectionBuilder } from "./projection.registry";
import { rebuildProjection } from "./projection.runner";

export type ProjectionReadPolicy =
  | "REBUILD_ON_EMPTY"
  | "SOURCE_FALLBACK"
  | "LIVE_OVERLAY"
  | "INVALIDATE_ON_WRITE";

export async function ensureProjectionReady(
  db: DB,
  projectionKey: string,
) {
  const builder = getProjectionBuilder(projectionKey);
  if (!builder) {
    return { ready: false, rebuilt: false, reason: "PROJECTION_BUILDER_NOT_FOUND" };
  }
  const count = await dbOrTx(db).projectionRecord.count({
    where: {
      projectionKey: builder.key,
      projectionVersion: builder.version,
    },
  });
  if (count > 0) {
    return { ready: true, rebuilt: false, rowCount: count };
  }

  const build = await rebuildProjection(db, { projectionKey: builder.key });
  if (!build.ok) {
    return {
      ready: false,
      rebuilt: true,
      rowCount: 0,
      reason: build.error ?? build.reason ?? "PROJECTION_REBUILD_FAILED",
    };
  }
  const rebuiltCount = await dbOrTx(db).projectionRecord.count({
    where: {
      projectionKey: builder.key,
      projectionVersion: builder.version,
    },
  });
  return {
    ready: rebuiltCount > 0 || build.applied === 0,
    rebuilt: true,
    rowCount: rebuiltCount,
  };
}
