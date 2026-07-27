import { dbOrTx, type DB } from "@/server/db/client";
import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
} from "@prisma/client";
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

async function projectionSourceHealth(db: DB, projectionKey: string) {
  const client = dbOrTx(db);
  if (projectionKey === "technical-issue-board") {
    const bindings = await client.taskExecution.findMany({
      where: {
        targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
        actionType: { not: TaskExecutionActionType.CANCELLED },
      },
      distinct: ["targetId"],
      select: { targetId: true },
    });
    const targetIds = bindings.map((row) => row.targetId);
    const source = targetIds.length
      ? await client.technicalIssue.aggregate({
          where: { id: { in: targetIds } },
          _count: { _all: true },
          _max: { updatedAt: true },
        })
      : null;
    return {
      count: source?._count._all ?? 0,
      updatedAt: source?._max.updatedAt ?? null,
    };
  }
  if (projectionKey === "media-operation-board") {
    const bindings = await client.taskExecution.findMany({
      where: {
        targetType: TaskExecutionTargetType.WATCH,
        actionType: { not: TaskExecutionActionType.CANCELLED },
        taskItem: {
          is: {
            OR: [
              { note: { contains: "workTypeKey: photography", mode: "insensitive" } },
              { note: { contains: "workTypeKey: media-processing", mode: "insensitive" } },
              { note: { contains: "workTypeKey: publish", mode: "insensitive" } },
            ],
          },
        },
      },
      distinct: ["targetId"],
      select: { targetId: true },
    });
    const targetIds = bindings.map((row) => row.targetId);
    const source = targetIds.length
      ? await client.watch.aggregate({
          where: { id: { in: targetIds } },
          _count: { _all: true },
          _max: { updatedAt: true },
        })
      : null;
    return {
      count: source?._count._all ?? 0,
      updatedAt: source?._max.updatedAt ?? null,
    };
  }
  if (projectionKey === "shipment-operation-queue") {
    const source = await client.shipment.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    });
    return { count: source._count._all, updatedAt: source._max.updatedAt };
  }
  if (projectionKey === "payment-list") {
    const source = await client.payment.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    });
    return { count: source._count._all, updatedAt: source._max.updatedAt };
  }
  return null;
}

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
  const [count, projectedEntities, projectionFreshness, sourceHealth] = await Promise.all([
    client.projectionRecord.count({
    where: {
      projectionKey: builder.key,
      projectionVersion: builder.version,
    },
    }),
    client.projectionRecord.findMany({
      where: {
        projectionKey: builder.key,
        projectionVersion: builder.version,
        entityId: { not: null },
      },
      distinct: ["entityId"],
      select: { entityId: true },
    }),
    client.projectionRecord.aggregate({
      where: {
        projectionKey: builder.key,
        projectionVersion: builder.version,
      },
      _max: { sourceUpdatedAt: true },
    }),
    projectionSourceHealth(db, builder.key),
  ]);
  const entityCount = projectedEntities.length;
  const complete = !sourceHealth || entityCount === sourceHealth.count;
  const fresh = !sourceHealth?.updatedAt ||
    Boolean(
      projectionFreshness._max.sourceUpdatedAt &&
      projectionFreshness._max.sourceUpdatedAt >= sourceHealth.updatedAt,
    );
  if (count > 0 && complete && fresh) {
    projectionHealthCache.set(cacheKey, {
      expiresAt: Date.now() + PROJECTION_HEALTH_CACHE_TTL_MS,
      rowCount: count,
    });
    return {
      ready: true,
      rebuilt: false,
      rowCount: count,
      entityCount,
      sourceCount: sourceHealth?.count,
    };
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
